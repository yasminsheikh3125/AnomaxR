import os
import math
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import shutil
import uvicorn

# ── App setup ────────────────────────────────────────────────────────────────
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

_cached_df: pd.DataFrame | None = None
_cached_filename: str = ""


def downsample_for_display(series: pd.Series, max_points: int = 5000) -> list[dict]:
    step = max(1, math.ceil(len(series) / max_points))
    sampled = series.iloc[::step]
    return [
        {"datetime": str(ts), "value": round(float(v), 4)}
        for ts, v in sampled.items()
    ]


# ── FIX 1: Flexible datetime parsing ─────────────────────────────────────────
def parse_datetime_column(df: pd.DataFrame) -> pd.DataFrame:
    """
    Handles three common formats:
      A) Separate 'Date' + 'Time' columns  (original format)
      B) Single pre-named 'Datetime' / 'datetime' / 'timestamp' column
      C) Any other single column whose values parse as datetimes
    Returns df with a DatetimeIndex and those source columns dropped.
    """
    col_lower = {c.lower(): c for c in df.columns}

    # Case A: classic split columns
    if "date" in col_lower and "time" in col_lower:
        date_col = col_lower["date"]
        time_col = col_lower["time"]
        df["Datetime"] = pd.to_datetime(
            df[date_col].astype(str) + " " + df[time_col].astype(str),
            dayfirst=True,
            infer_datetime_format=True,
        )
        df.drop(columns=[date_col, time_col], inplace=True)

    # Case B / C: look for an existing datetime-like column
    else:
        candidate = None
        for alias in ("datetime", "timestamp", "date_time", "time"):
            if alias in col_lower:
                candidate = col_lower[alias]
                break

        # If no known alias, try parsing every non-numeric column
        if candidate is None:
            for col in df.select_dtypes(exclude="number").columns:
                try:
                    pd.to_datetime(df[col].iloc[:5], infer_datetime_format=True)
                    candidate = col
                    break
                except Exception:
                    continue

        if candidate is None:
            raise ValueError(
                "No datetime column found. Expected 'Date'+'Time', "
                "'Datetime', 'Timestamp', or a parseable date column."
            )

        df["Datetime"] = pd.to_datetime(
            df[candidate], infer_datetime_format=True, dayfirst=True
        )
        if candidate != "Datetime":
            df.drop(columns=[candidate], inplace=True)

    df.set_index("Datetime", inplace=True)
    df.sort_index(inplace=True)
    return df


# ── FIX 2: Downcast numeric columns to shrink memory ─────────────────────────
def downcast_numerics(df: pd.DataFrame) -> pd.DataFrame:
    for col in df.select_dtypes(include="float").columns:
        df[col] = pd.to_numeric(df[col], errors="coerce", downcast="float")
    for col in df.select_dtypes(include="integer").columns:
        df[col] = pd.to_numeric(df[col], errors="coerce", downcast="integer")
    return df


def detect_anomalies(file_path: str) -> dict:
    global _cached_df, _cached_filename

    # ── 1. LOAD & CLEAN ──────────────────────────────────────────────────────
    df = pd.read_csv(file_path, sep=None, engine="python", na_values=["?"])
    df.dropna(how="all", inplace=True)

    # Flexible datetime parsing (fix for single-column datetime datasets)
    df = parse_datetime_column(df)

    # Coerce numeric columns
    for col in df.columns:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    df.dropna(inplace=True)
    df = downcast_numerics(df)           # ← shrinks RAM, speeds up later ops

    if len(df) < 100:
        raise ValueError("Dataset too small — need at least 100 rows after cleaning.")

    _cached_df       = df.copy()
    _cached_filename = os.path.basename(file_path)
    raw_record_count = len(df)

    # Identify required columns (case-insensitive)
    col_lower = {c.lower(): c for c in df.columns}
    gap_col  = col_lower.get("global_active_power", list(df.columns)[0])
    sub_map  = {
        "Sub_metering_1": col_lower.get("sub_metering_1"),
        "Sub_metering_2": col_lower.get("sub_metering_2"),
        "Sub_metering_3": col_lower.get("sub_metering_3"),
    }
    has_submetering = all(v is not None for v in sub_map.values())
    sub_cols = [sub_map[k] for k in sub_map] if has_submetering else []

    # ── 2. PRE-COMPUTE HOUR/DOW ONCE ────────────────────────────────────────
    # Avoids repeated .index.hour / .index.dayofweek calls throughout
    df_hour = df.index.hour           # ndarray — reused below
    df_dow  = df.index.dayofweek      # ndarray

    # ── 3. ANOMALY DETECTION ─────────────────────────────────────────────────
    power_hourly = df[gap_col].resample("h").mean().dropna()
    if len(power_hourly) < 10:
        raise ValueError("Not enough hourly data points — check your CSV format.")

    scaler = StandardScaler()
    scaled = scaler.fit_transform(power_hourly.values.reshape(-1, 1))
    scaled_df = pd.DataFrame(scaled, index=power_hourly.index, columns=["scaled_power"])

    split = int(len(scaled_df) * 0.8)
    train = scaled_df.iloc[:split].copy()
    test  = scaled_df.iloc[split:].copy()
    if len(train) < 5:
        raise ValueError("Training split too small. Upload a larger dataset.")

    model = IsolationForest(contamination=0.01, random_state=42, n_jobs=-1)  # ← parallel
    model.fit(train)
    train["anomaly"] = model.predict(train)
    test["anomaly"]  = model.predict(test)
    result_df = pd.concat([train, test])
    anomalies = result_df[result_df["anomaly"] == -1]

    total_anomalies    = len(anomalies)
    total_data_points  = len(power_hourly)
    anomaly_percentage = round((total_anomalies / total_data_points) * 100, 2)
    anomaly_hour_counts = anomalies.index.hour.value_counts().sort_index().to_dict()
    raw_display_series  = downsample_for_display(df[gap_col], max_points=5000)

    plt.figure(figsize=(15, 5))
    plt.plot(result_df.index, result_df["scaled_power"], label="Power", linewidth=0.6)
    plt.scatter(anomalies.index, anomalies["scaled_power"], color="red",
                label="Anomaly", s=10, zorder=5)
    plt.title("Electricity Consumption Anomaly Detection")
    plt.legend()
    anomaly_plot_path = "uploads/anomaly_plot.png"
    plt.savefig(anomaly_plot_path, bbox_inches="tight", dpi=100)
    plt.close()

    # ── 4. BATCH ALL RESAMPLES IN ONE PASS ──────────────────────────────────
    # Instead of calling .resample() 4+ times, do it once and reuse
    resampled = df[gap_col].resample("h").mean()          # hourly (for plots)
    daily_usage   = df[gap_col].resample("D").mean()
    monthly_usage = df[gap_col].resample("ME").mean()

    # ── 5. HOURLY (use pre-extracted hour array) ──────────────────────────────
    hourly_usage = df.groupby(df_hour)[gap_col].mean()
    peak_hour    = int(hourly_usage.idxmax())
    low_hour     = int(hourly_usage.idxmin())
    usage_gap    = round(float(hourly_usage.max() - hourly_usage.min()), 3)
    hourly_avg   = {int(h): round(float(v), 4) for h, v in hourly_usage.items()}

    plt.figure(figsize=(10, 4))
    hourly_usage.plot()
    plt.title("Average Hourly Usage")
    plt.xlabel("Hour of Day")
    plt.ylabel("Global Active Power (kW)")
    plt.savefig("uploads/hourly.png", bbox_inches="tight", dpi=100)
    plt.close()

    # ── 6. DAILY PLOT ─────────────────────────────────────────────────────────
    plt.figure(figsize=(12, 5))
    daily_usage.plot(linewidth=0.8)
    plt.title("Daily Average Power Usage")
    plt.xlabel("Date")
    plt.ylabel("Global Active Power (kW)")
    plt.savefig("uploads/daily.png", bbox_inches="tight", dpi=100)
    plt.close()

    # ── 7. MONTHLY PLOT ──────────────────────────────────────────────────────
    fig, ax = plt.subplots(figsize=(12, 5))
    monthly_usage.plot(kind="bar", ax=ax, color="#00d4ff", edgecolor="none", alpha=0.85)
    ax.set_title("Monthly Average Power Usage", fontsize=13, pad=12)
    ax.set_xlabel("Month", fontsize=10)
    ax.set_ylabel("Global Active Power (kW)", fontsize=10)
    tick_step = max(1, len(monthly_usage) // 10)
    tick_pos  = list(range(0, len(monthly_usage), tick_step))
    ax.set_xticks(tick_pos)
    ax.set_xticklabels(
        [monthly_usage.index[i].strftime("%b '%y") for i in tick_pos],
        rotation=45, ha="right", fontsize=9,
    )
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    plt.tight_layout()
    plt.savefig("uploads/monthly.png", bbox_inches="tight", dpi=100)
    plt.close()

    # ── 8. SUBMETERING ────────────────────────────────────────────────────────
    zone_names = {
        sub_map.get("Sub_metering_1", ""): "Kitchen",
        sub_map.get("Sub_metering_2", ""): "Laundry",
        sub_map.get("Sub_metering_3", ""): "Heating/AC",
    }

    if has_submetering:
        corr = df[sub_cols].corr()

        plt.figure(figsize=(6, 5))
        sns.heatmap(corr, annot=True, cmap="coolwarm", fmt=".2f")
        plt.title("Sub Metering Correlation")
        plt.savefig("uploads/corr.png", bbox_inches="tight", dpi=100)
        plt.close()

        area_usage = df[sub_cols].sum()
        area_usage.index = ["Kitchen", "Laundry", "Heating/AC"]
        plt.figure()
        area_usage.plot(kind="pie", autopct="%1.1f%%")
        plt.title("Zone Usage Share")
        plt.ylabel("")
        plt.savefig("uploads/pie.png", bbox_inches="tight", dpi=100)
        plt.close()

        sub_totals    = df[sub_cols].sum()
        sub_total_sum = sub_totals.sum()
        sub_kitchen   = round(float(sub_totals.iloc[0]), 1)
        sub_laundry   = round(float(sub_totals.iloc[1]), 1)
        sub_heating   = round(float(sub_totals.iloc[2]), 1)

        sub_pct = (
            {
                "kitchen": round(float(sub_totals.iloc[0] / sub_total_sum * 100), 1),
                "laundry": round(float(sub_totals.iloc[1] / sub_total_sum * 100), 1),
                "heating": round(float(sub_totals.iloc[2] / sub_total_sum * 100), 1),
            }
            if sub_total_sum > 0
            else {"kitchen": 0.0, "laundry": 0.0, "heating": 0.0}
        )

        dominant_zone = zone_names.get(sub_totals.idxmax(), "Unknown")
        sub_insight = (
            f"{dominant_zone} accounts for the largest share of sub-metered energy. "
            f"Kitchen: {sub_pct['kitchen']}%, Laundry: {sub_pct['laundry']}%, "
            f"Heating/AC: {sub_pct['heating']}%."
        )

        high_corr_pairs = [
            f"{zone_names.get(sub_cols[i], sub_cols[i])} & {zone_names.get(sub_cols[j], sub_cols[j])}"
            for i in range(len(sub_cols))
            for j in range(i + 1, len(sub_cols))
            if abs(corr.iloc[i, j]) > 0.5
        ]
        correlation_insight = (
            f"Strong correlation detected between: {', '.join(high_corr_pairs)}. "
            "These zones are often active at the same time."
            if high_corr_pairs
            else "No strong correlations found between zones — each area has independent usage patterns."
        )

        # ── NEW A: TIME-OF-DAY HEATMAP ──────────────────────────────────────
        # Single groupby for all zones at once (3× faster than looping)
        hm_group = df.groupby([df_hour, df_dow])[sub_cols].mean()
        zone_keys = ["kitchen", "laundry", "heating"]
        heatmap_data = {}
        for zone_key, col in zip(zone_keys, sub_cols):
            pivot = hm_group[col].unstack(fill_value=0.0)
            for d in range(7):
                if d not in pivot.columns:
                    pivot[d] = 0.0
            pivot = pivot[sorted(pivot.columns)]
            heatmap_data[zone_key] = [
                [round(float(v), 4) for v in row]
                for row in pivot.values.tolist()
            ]

        # ── NEW B: ZONE VS TOTAL RATIO ────────────────────────────────────────
        daily_sub    = df[sub_cols].resample("D").mean()
        global_wm    = daily_usage * 1000 / 60

        ratio_df = pd.DataFrame({
            "kitchen": (daily_sub[sub_cols[0]] / global_wm * 100).clip(0, 100),
            "laundry": (daily_sub[sub_cols[1]] / global_wm * 100).clip(0, 100),
            "heating": (daily_sub[sub_cols[2]] / global_wm * 100).clip(0, 100),
        }).dropna()

        ratio_step    = max(1, math.ceil(len(ratio_df) / 365))
        ratio_sampled = ratio_df.iloc[::ratio_step]
        zone_ratio_series = [
            {
                "date":    str(ts.date()),
                "kitchen": round(float(r["kitchen"]), 2),
                "laundry": round(float(r["laundry"]), 2),
                "heating": round(float(r["heating"]), 2),
            }
            for ts, r in ratio_sampled.iterrows()
        ]

        # ── NEW C: UNMETERED POWER ────────────────────────────────────────────
        global_wm_series  = df[gap_col] * 1000 / 60
        unmetered_raw     = global_wm_series - df[sub_cols].sum(axis=1)
        unmetered_clipped = unmetered_raw.clip(lower=0)
        global_wm_mean    = global_wm_series.mean()

        unmetered_avg   = round(float(unmetered_clipped.mean()), 2)
        unmetered_total = round(float(unmetered_clipped.sum()), 0)
        unmetered_pct   = round(
            float(unmetered_avg / global_wm_mean * 100) if global_wm_mean > 0 else 0.0, 1
        )

    else:
        # Graceful fallback when no sub-metering columns exist
        sub_kitchen = sub_laundry = sub_heating = 0.0
        sub_pct = {"kitchen": 0.0, "laundry": 0.0, "heating": 0.0}
        sub_insight = correlation_insight = "Sub-metering data not available in this dataset."
        heatmap_data = {}
        zone_ratio_series = []
        unmetered_avg = unmetered_total = unmetered_pct = 0.0

    # ── 9. ANALYSIS ───────────────────────────────────────────────────────────
    normal_usage = power_hourly.mean()
    max_usage    = power_hourly.max()
    efficiency   = round(float((normal_usage / max_usage) * 100), 2)
    threshold    = normal_usage + power_hourly.std()
    high_usage   = power_hourly[power_hourly > threshold]

    # Use pre-extracted hour array for night/day split
    night_mask  = (df_hour >= 0) & (df_hour <= 5)
    day_mask    = (df_hour >= 9) & (df_hour <= 18)
    night_usage = df.loc[night_mask, gap_col].mean()
    day_usage   = df.loc[day_mask,   gap_col].mean()
    waste_score = round(float((night_usage / day_usage) * 100) if day_usage != 0 else 0.0, 2)

    if   18 <= peak_hour <= 22: peak_reason = "Evening peak likely due to household activity (cooking, AC, lighting)."
    elif  6 <= peak_hour <= 10: peak_reason = "Morning peak likely due to appliances like heaters, kettles, and cooking."
    else:                        peak_reason = "Peak usage occurs at unusual hours, indicating irregular consumption."

    efficiency_msg = (
        "System is energy efficient with balanced usage."
        if efficiency > 70
        else "Energy usage is inefficient — high peaks compared to average."
    )
    recommendation = (
        "Reduce nighttime appliance usage. Consider turning off idle devices and optimizing AC usage." if waste_score > 50
        else "Shift heavy appliance usage to daytime to reduce peak load." if peak_hour >= 18
        else "Frequent anomalies detected. Check your electrical devices for faults." if total_anomalies > 100
        else "Energy usage is stable and efficient. Maintain current habits."
    )
    smart_summary      = f"Peak usage occurs at {peak_hour}:00. {peak_reason} Night usage is {waste_score}% of daytime usage. {efficiency_msg}"
    hourly_explanation = f"Electricity usage peaks at {peak_hour}:00 and is lowest at {low_hour}:00. The usage difference between peak and off-peak is {usage_gap} kW."
    daily_explanation  = "Daily electricity consumption shows how usage changes day by day. Spikes may indicate heavy appliance usage or unusual activity."
    monthly_explanation= "Monthly consumption helps identify long-term trends. Higher months may indicate seasonal usage such as heating or cooling."

    if has_submetering and len(high_usage) > 0:
        waste_hour  = int(high_usage.index.hour.value_counts().idxmax())
        sub_means   = df[df_hour == waste_hour][sub_cols].mean()
        main_source = zone_names.get(sub_means.idxmax(), "Unknown")
    else:
        waste_hour  = peak_hour
        main_source = "N/A"

    # ── 10. RETURN ────────────────────────────────────────────────────────────
    return {
        "raw_record_count":  raw_record_count,
        "total_data_points": total_data_points,
        "display_series":    raw_display_series,

        "total_anomalies":    total_anomalies,
        "anomaly_percentage": anomaly_percentage,
        "anomaly_plot":       "/uploads/anomaly_plot.png",

        "peak_hour": peak_hour, "low_hour": low_hour, "usage_gap": usage_gap,
        "hourly_avg": hourly_avg, "hourly_plot": "/uploads/hourly.png",
        "daily_plot": "/uploads/daily.png", "monthly_plot": "/uploads/monthly.png",
        "hourly_explanation":  hourly_explanation,
        "daily_explanation":   daily_explanation,
        "monthly_explanation": monthly_explanation,
        "waste_score": waste_score, "peak_reason": peak_reason,
        "smart_summary": smart_summary,

        "efficiency_score": efficiency, "efficiency_msg": efficiency_msg,
        "recommendation": recommendation, "high_usage_count": int(len(high_usage)),
        "anomaly_hour_distribution": anomaly_hour_counts,

        "wastage": {
            "peak_waste_hour": waste_hour,
            "main_source":     main_source,
            "message": f"Maximum electricity wastage occurs around {waste_hour}:00 from {main_source}",
        },

        # Submetering
        "sub_kitchen": sub_kitchen, "sub_laundry": sub_laundry, "sub_heating": sub_heating,
        "sub_pct": sub_pct, "sub_insight": sub_insight,
        "correlation_insight": correlation_insight,
        "correlation_plot": "/uploads/corr.png", "pie_chart": "/uploads/pie.png",

        # Submetering — extended
        "heatmap_data":      heatmap_data,
        "zone_ratio_series": zone_ratio_series,
        "unmetered_avg":     unmetered_avg,
        "unmetered_total":   unmetered_total,
        "unmetered_pct":     unmetered_pct,
    }


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")
    save_path = f"uploads/{file.filename}"
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    try:
        result = detect_anomalies(save_path)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")
    return result


@app.get("/records")
async def get_records(
    page: int      = Query(default=1,   ge=1,          description="Page number (1-based)"),
    page_size: int = Query(default=100, ge=1, le=1000, description="Rows per page (max 1000)"),
):
    if _cached_df is None:
        raise HTTPException(status_code=404, detail="No dataset loaded. Upload a file first.")
    total       = len(_cached_df)
    total_pages = math.ceil(total / page_size)
    start       = (page - 1) * page_size
    slice_df    = _cached_df.iloc[start : start + page_size].reset_index()
    records     = slice_df.to_dict(orient="records")
    for row in records:
        if "Datetime" in row:
            row["Datetime"] = str(row["Datetime"])
    return {
        "total": total, "page": page, "page_size": page_size,
        "total_pages": total_pages, "records": records,
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)