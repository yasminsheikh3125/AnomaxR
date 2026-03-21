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


def detect_anomalies(file_path: str) -> dict:
    global _cached_df, _cached_filename

    # ── 1. LOAD & CLEAN ──────────────────────────────────────────────────────
    df = pd.read_csv(file_path, sep=None, engine="python", na_values=["?"])
    df.dropna(inplace=True)
    df["Datetime"] = pd.to_datetime(df["Date"] + " " + df["Time"], dayfirst=True)
    df.set_index("Datetime", inplace=True)
    df.drop(columns=["Date", "Time"], inplace=True)
    df["Global_active_power"] = pd.to_numeric(df["Global_active_power"], errors="coerce")
    df[["Sub_metering_1", "Sub_metering_2", "Sub_metering_3"]] = df[
        ["Sub_metering_1", "Sub_metering_2", "Sub_metering_3"]
    ].apply(pd.to_numeric, errors="coerce")
    df.dropna(inplace=True)
    df.sort_index(inplace=True)

    if len(df) < 100:
        raise ValueError("Dataset too small — need at least 100 rows after cleaning.")

    _cached_df       = df.copy()
    _cached_filename = os.path.basename(file_path)
    raw_record_count = len(df)

    # ── 2. ANOMALY DETECTION ─────────────────────────────────────────────────
    power_hourly = df["Global_active_power"].resample("h").mean().dropna()
    if len(power_hourly) < 10:
        raise ValueError("Not enough hourly data points — check your CSV format.")

    scaler    = StandardScaler()
    scaled    = scaler.fit_transform(power_hourly.values.reshape(-1, 1))
    scaled_df = pd.DataFrame(scaled, index=power_hourly.index, columns=["scaled_power"])

    split = int(len(scaled_df) * 0.8)
    train = scaled_df.iloc[:split].copy()
    test  = scaled_df.iloc[split:].copy()
    if len(train) < 5:
        raise ValueError("Training split too small. Upload a larger dataset.")

    model = IsolationForest(contamination=0.01, random_state=42)
    model.fit(train)
    train["anomaly"] = model.predict(train)
    test["anomaly"]  = model.predict(test)
    result_df = pd.concat([train, test])
    anomalies = result_df[result_df["anomaly"] == -1]

    total_anomalies    = len(anomalies)
    total_data_points  = len(power_hourly)
    anomaly_percentage = round((total_anomalies / total_data_points) * 100, 2)
    anomaly_hour_counts = anomalies.index.hour.value_counts().sort_index().to_dict()
    raw_display_series  = downsample_for_display(df["Global_active_power"], max_points=5000)

    plt.figure(figsize=(15, 5))
    plt.plot(result_df.index, result_df["scaled_power"], label="Power")
    plt.scatter(anomalies.index, anomalies["scaled_power"], color="red", label="Anomaly")
    plt.title("Electricity Consumption Anomaly Detection")
    plt.legend()
    anomaly_plot_path = "uploads/anomaly_plot.png"
    plt.savefig(anomaly_plot_path, bbox_inches="tight")
    plt.close()

    # ── 3. HOURLY ────────────────────────────────────────────────────────────
    hourly_usage = df.groupby(df.index.hour)["Global_active_power"].mean()
    peak_hour    = int(hourly_usage.idxmax())
    low_hour     = int(hourly_usage.idxmin())
    usage_gap    = round(float(hourly_usage.max() - hourly_usage.min()), 3)
    hourly_avg   = {int(h): round(float(v), 4) for h, v in hourly_usage.items()}

    plt.figure(figsize=(10, 4))
    hourly_usage.plot()
    plt.title("Average Hourly Usage")
    plt.xlabel("Hour of Day")
    plt.ylabel("Global Active Power (kW)")
    hourly_plot_path = "uploads/hourly.png"
    plt.savefig(hourly_plot_path, bbox_inches="tight")
    plt.close()

    # ── 4. DAILY ─────────────────────────────────────────────────────────────
    daily_usage = df["Global_active_power"].resample("D").mean()
    plt.figure(figsize=(12, 5))
    daily_usage.plot()
    plt.title("Daily Average Power Usage")
    plt.xlabel("Date")
    plt.ylabel("Global Active Power (kW)")
    daily_plot_path = "uploads/daily.png"
    plt.savefig(daily_plot_path, bbox_inches="tight")
    plt.close()

    # ── 5. MONTHLY (clean x-axis) ─────────────────────────────────────────────
    monthly_usage = df["Global_active_power"].resample("ME").mean()
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
    monthly_plot_path = "uploads/monthly.png"
    plt.savefig(monthly_plot_path, bbox_inches="tight", dpi=120)
    plt.close()

    # ── 6. SUBMETERING — existing ─────────────────────────────────────────────
    sub_cols   = ["Sub_metering_1", "Sub_metering_2", "Sub_metering_3"]
    zone_names = {
        "Sub_metering_1": "Kitchen",
        "Sub_metering_2": "Laundry",
        "Sub_metering_3": "Heating/AC",
    }

    corr = df[sub_cols].corr()
    plt.figure(figsize=(6, 5))
    sns.heatmap(corr, annot=True, cmap="coolwarm", fmt=".2f")
    plt.title("Sub Metering Correlation")
    corr_plot_path = "uploads/corr.png"
    plt.savefig(corr_plot_path, bbox_inches="tight")
    plt.close()

    area_usage = df[sub_cols].sum()
    area_usage.index = ["Kitchen", "Laundry", "Heating/AC"]
    plt.figure()
    area_usage.plot(kind="pie", autopct="%1.1f%%")
    plt.title("Zone Usage Share")
    plt.ylabel("")
    pie_plot_path = "uploads/pie.png"
    plt.savefig(pie_plot_path, bbox_inches="tight")
    plt.close()

    sub_totals    = df[sub_cols].sum()
    sub_total_sum = sub_totals.sum()
    sub_kitchen   = round(float(sub_totals["Sub_metering_1"]), 1)
    sub_laundry   = round(float(sub_totals["Sub_metering_2"]), 1)
    sub_heating   = round(float(sub_totals["Sub_metering_3"]), 1)

    sub_pct = (
        {
            "kitchen": round(float(sub_totals["Sub_metering_1"] / sub_total_sum * 100), 1),
            "laundry": round(float(sub_totals["Sub_metering_2"] / sub_total_sum * 100), 1),
            "heating": round(float(sub_totals["Sub_metering_3"] / sub_total_sum * 100), 1),
        }
        if sub_total_sum > 0
        else {"kitchen": 0.0, "laundry": 0.0, "heating": 0.0}
    )

    dominant_zone = zone_names[sub_totals.idxmax()]
    sub_insight = (
        f"{dominant_zone} accounts for the largest share of sub-metered energy. "
        f"Kitchen: {sub_pct['kitchen']}%, Laundry: {sub_pct['laundry']}%, "
        f"Heating/AC: {sub_pct['heating']}%."
    )

    high_corr_pairs = [
        f"{zone_names[c1]} & {zone_names[c2]}"
        for i, c1 in enumerate(sub_cols)
        for j, c2 in enumerate(sub_cols)
        if i < j and abs(corr.loc[c1, c2]) > 0.5
    ]
    correlation_insight = (
        f"Strong correlation detected between: {', '.join(high_corr_pairs)}. "
        "These zones are often active at the same time."
        if high_corr_pairs
        else "No strong correlations found between zones — each area has independent usage patterns."
    )

    # ── NEW A: TIME-OF-DAY HEATMAP (24 hours × 7 weekdays, per zone) ─────────
    zone_col_map = {
        "kitchen": "Sub_metering_1",
        "laundry": "Sub_metering_2",
        "heating": "Sub_metering_3",
    }
    heatmap_data = {}
    for zone_key, col in zone_col_map.items():
        pivot = (
            df.groupby([df.index.hour, df.index.dayofweek])[col]
            .mean()
            .unstack(fill_value=0)
        )
        for d in range(7):
            if d not in pivot.columns:
                pivot[d] = 0.0
        pivot = pivot[sorted(pivot.columns)]
        heatmap_data[zone_key] = [
            [round(float(v), 4) for v in row]
            for row in pivot.values.tolist()
        ]

    # ── NEW B: ZONE VS TOTAL RATIO OVER TIME (daily, ≤ 365 points) ───────────
    daily_sub    = df[sub_cols].resample("D").mean()
    daily_global = df["Global_active_power"].resample("D").mean()
    global_wm    = daily_global * 1000 / 60   # kW → watt-minutes (per-minute readings)

    ratio_df = pd.DataFrame({
        "kitchen": (daily_sub["Sub_metering_1"] / global_wm * 100).clip(0, 100),
        "laundry": (daily_sub["Sub_metering_2"] / global_wm * 100).clip(0, 100),
        "heating": (daily_sub["Sub_metering_3"] / global_wm * 100).clip(0, 100),
    }).dropna()

    ratio_step        = max(1, math.ceil(len(ratio_df) / 365))
    ratio_sampled     = ratio_df.iloc[::ratio_step]
    zone_ratio_series = [
        {
            "date":    str(ts.date()),
            "kitchen": round(float(r["kitchen"]), 2),
            "laundry": round(float(r["laundry"]), 2),
            "heating": round(float(r["heating"]), 2),
        }
        for ts, r in ratio_sampled.iterrows()
    ]

    # ── NEW C: UNMETERED POWER ────────────────────────────────────────────────
    df["unmetered"] = (
        df["Global_active_power"] * 1000 / 60
    ) - (
        df["Sub_metering_1"] + df["Sub_metering_2"] + df["Sub_metering_3"]
    )
    unmetered_clipped = df["unmetered"].clip(lower=0)
    global_wm_mean    = df["Global_active_power"].mean() * 1000 / 60

    unmetered_avg   = round(float(unmetered_clipped.mean()), 2)
    unmetered_total = round(float(unmetered_clipped.sum()), 0)
    unmetered_pct   = round(
        float(unmetered_avg / global_wm_mean * 100) if global_wm_mean > 0 else 0.0, 1
    )

    # ── 7. ANALYSIS ───────────────────────────────────────────────────────────
    normal_usage = power_hourly.mean()
    max_usage    = power_hourly.max()
    efficiency   = round(float((normal_usage / max_usage) * 100), 2)
    threshold    = power_hourly.mean() + power_hourly.std()
    high_usage   = power_hourly[power_hourly > threshold]

    night_usage = df[(df.index.hour >= 0) & (df.index.hour <= 5)]["Global_active_power"].mean()
    day_usage   = df[(df.index.hour >= 9) & (df.index.hour <= 18)]["Global_active_power"].mean()
    waste_score = round(float((night_usage / day_usage) * 100) if day_usage != 0 else 0.0, 2)

    if   18 <= peak_hour <= 22: peak_reason = "Evening peak likely due to household activity (cooking, AC, lighting)."
    elif 6  <= peak_hour <= 10: peak_reason = "Morning peak likely due to appliances like heaters, kettles, and cooking."
    else:                       peak_reason = "Peak usage occurs at unusual hours, indicating irregular consumption."

    efficiency_msg  = "System is energy efficient with balanced usage." if efficiency > 70 else "Energy usage is inefficient — high peaks compared to average."
    recommendation  = (
        "Reduce nighttime appliance usage. Consider turning off idle devices and optimizing AC usage." if waste_score > 50
        else "Shift heavy appliance usage to daytime to reduce peak load." if peak_hour >= 18
        else "Frequent anomalies detected. Check your electrical devices for faults." if total_anomalies > 100
        else "Energy usage is stable and efficient. Maintain current habits."
    )
    smart_summary     = f"Peak usage occurs at {peak_hour}:00. {peak_reason} Night usage is {waste_score}% of daytime usage. {efficiency_msg}"
    hourly_explanation= f"Electricity usage peaks at {peak_hour}:00 and is lowest at {low_hour}:00. The usage difference between peak and off-peak is {usage_gap} kW, showing how much consumption fluctuates across the day."
    daily_explanation = "Daily electricity consumption shows how usage changes day by day. Stable patterns indicate consistent usage, while spikes may indicate heavy appliance usage or unusual activity."
    monthly_explanation = "Monthly consumption helps identify long-term trends. Higher months may indicate seasonal usage such as heating or cooling."

    if len(high_usage) > 0:
        waste_hour  = int(high_usage.index.hour.value_counts().idxmax())
        sub_means   = df[df.index.hour == waste_hour][sub_cols].mean()
        main_source = sub_means.idxmax()
    else:
        waste_hour, main_source = 0, "Sub_metering_1"

    # ── 15. RETURN ────────────────────────────────────────────────────────────
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
        "hourly_explanation": hourly_explanation, "daily_explanation": daily_explanation,
        "monthly_explanation": monthly_explanation, "waste_score": waste_score,
        "peak_reason": peak_reason, "smart_summary": smart_summary,

        "efficiency_score": efficiency, "efficiency_msg": efficiency_msg,
        "recommendation": recommendation, "high_usage_count": int(len(high_usage)),
        "anomaly_hour_distribution": anomaly_hour_counts,

        "wastage": {
            "peak_waste_hour": waste_hour,
            "main_source":     zone_names.get(main_source, "Unknown"),
            "message": f"Maximum electricity wastage occurs around {waste_hour}:00 from {zone_names.get(main_source, 'Unknown')}",
        },

        # Submetering — existing
        "sub_kitchen": sub_kitchen, "sub_laundry": sub_laundry, "sub_heating": sub_heating,
        "sub_pct": sub_pct, "sub_insight": sub_insight, "correlation_insight": correlation_insight,
        "correlation_plot": "/uploads/corr.png", "pie_chart": "/uploads/pie.png",

        # Submetering — NEW
        "heatmap_data":      heatmap_data,       # { kitchen/laundry/heating: [[24×7]] }
        "zone_ratio_series": zone_ratio_series,  # [ {date, kitchen%, laundry%, heating%} ]
        "unmetered_avg":     unmetered_avg,       # avg watt-min per reading
        "unmetered_total":   unmetered_total,     # total watt-minutes
        "unmetered_pct":     unmetered_pct,       # % of total energy unmetered
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
    page: int      = Query(default=1,   ge=1,        description="Page number (1-based)"),
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
    return {"total": total, "page": page, "page_size": page_size,
            "total_pages": total_pages, "records": records}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)