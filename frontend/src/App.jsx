import { useState, useEffect, Fragment } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { margin: 0; padding: 0; width: 100%; height: 100%; }
  :root {
    --bg-void: #00060f; --bg-deep: #010c18; --bg-panel: #020f1f; --bg-card: #041526;
    --accent-primary: #00d4ff; --accent-secondary: #ff6b00; --accent-warn: #ffcc00; --accent-ok: #00ff88;
    --border-glow: rgba(0,212,255,0.25); --border-dim: rgba(0,212,255,0.08);
    --text-bright: #e8f4ff; --text-mid: #6b9ab8; --text-dim: #2a4a60;
    --font-display: 'Orbitron', monospace; --font-ui: 'Rajdhani', sans-serif; --font-mono: 'Share Tech Mono', monospace;
  }
  body { background: #00060f; }

  @keyframes scan        { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes flicker     { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.4} 94%{opacity:1} 96%{opacity:0.6} 97%{opacity:1} }
  @keyframes pulse-ring  { 0%{box-shadow:0 0 0 0 rgba(0,212,255,0.4)} 100%{box-shadow:0 0 0 20px rgba(0,212,255,0)} }
  @keyframes slide-in-left { from{transform:translateX(-40px);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes slide-in-up   { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes glow-pulse  { 0%,100%{text-shadow:0 0 10px rgba(0,212,255,0.5)} 50%{text-shadow:0 0 30px rgba(0,212,255,1),0 0 60px rgba(0,212,255,0.4)} }
  @keyframes number-count{ from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
  @keyframes grid-fade   { from{opacity:0} to{opacity:0.03} }
  @keyframes spin-slow   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes blink       { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes progress-fill { from{width:0%} to{width:var(--target-width)} }

  .app-root {
    display:flex; min-height:100vh; width:100vw; background:var(--bg-void);
    font-family:var(--font-ui); position:relative; overflow:hidden; animation:flicker 8s infinite;
  }
  .app-root::before {
    content:''; position:fixed; inset:0;
    background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,212,255,0.015) 2px,rgba(0,212,255,0.015) 4px);
    pointer-events:none; z-index:100;
  }
  .scanline { position:fixed; top:0; left:0; right:0; height:4px; background:linear-gradient(transparent,rgba(0,212,255,0.15),transparent); animation:scan 6s linear infinite; pointer-events:none; z-index:101; }
  .grid-bg  { position:fixed; inset:0; background-image:linear-gradient(rgba(0,212,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,1) 1px,transparent 1px); background-size:60px 60px; animation:grid-fade 2s forwards; pointer-events:none; z-index:0; }

  .sidebar { width:220px; background:linear-gradient(180deg,#010e1f 0%,#00060f 100%); border-right:1px solid var(--border-glow); display:flex; flex-direction:column; position:relative; z-index:10; animation:slide-in-left 0.6s ease both; flex-shrink:0; }
  .sidebar::after { content:''; position:absolute; right:0; top:0; bottom:0; width:1px; background:linear-gradient(180deg,transparent,var(--accent-primary),transparent); opacity:0.6; }
  .logo-block { padding:32px 24px 28px; border-bottom:1px solid var(--border-dim); }
  .logo-eyebrow { font-family:var(--font-mono); font-size:9px; color:var(--accent-primary); letter-spacing:4px; text-transform:uppercase; margin-bottom:8px; opacity:0.7; }
  .logo-main { font-family:var(--font-display); font-size:22px; font-weight:900; color:var(--text-bright); letter-spacing:3px; animation:glow-pulse 3s ease-in-out infinite; }
  .logo-main span { color:var(--accent-primary); }
  .sys-status { font-family:var(--font-mono); font-size:10px; color:var(--accent-ok); padding:12px 24px; border-bottom:1px solid var(--border-dim); display:flex; align-items:center; }
  .status-dot { display:inline-block; width:6px; height:6px; background:var(--accent-ok); border-radius:50%; margin-right:8px; animation:pulse-ring 1.5s ease-out infinite; }
  .nav-section { flex:1; padding:20px 0; }
  .nav-label   { font-family:var(--font-mono); font-size:9px; color:var(--text-dim); letter-spacing:3px; text-transform:uppercase; padding:0 24px 10px; }
  .nav-item    { display:flex; align-items:center; gap:12px; padding:12px 24px; color:var(--text-mid); font-size:13px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; border-left:2px solid transparent; transition:all 0.2s; }
  .nav-item:hover { color:var(--accent-primary); background:rgba(0,212,255,0.04); border-left-color:var(--accent-primary); }
  .nav-item.active { color:var(--accent-primary); background:rgba(0,212,255,0.07); border-left-color:var(--accent-primary); }
  .sidebar-footer { padding:20px 24px; border-top:1px solid var(--border-dim); font-family:var(--font-mono); font-size:9px; color:var(--text-dim); letter-spacing:1px; line-height:1.8; }
  .sidebar-footer .ver { color:var(--accent-primary); opacity:0.5; }

  .main   { flex:1; display:flex; flex-direction:column; overflow:auto; position:relative; z-index:10; }
  .topbar { display:flex; align-items:center; justify-content:space-between; padding:20px 40px; border-bottom:1px solid var(--border-dim); background:rgba(1,12,24,0.8); backdrop-filter:blur(10px); position:sticky; top:0; z-index:50; animation:slide-in-up 0.5s ease both; }
  .page-eyebrow { font-family:var(--font-mono); font-size:10px; color:var(--accent-primary); letter-spacing:4px; text-transform:uppercase; margin-bottom:4px; opacity:0.7; }
  .page-title   { font-family:var(--font-display); font-size:20px; font-weight:700; color:var(--text-bright); letter-spacing:2px; text-transform:uppercase; }
  .topbar-right { display:flex; align-items:center; gap:16px; }
  .timestamp    { font-family:var(--font-mono); font-size:11px; color:var(--text-dim); letter-spacing:1px; }
  .file-drop-zone  { display:flex; align-items:center; border:1px solid var(--border-glow); border-radius:4px; overflow:hidden; background:var(--bg-card); }
  .file-input-label{ padding:9px 16px; font-family:var(--font-mono); font-size:11px; color:var(--text-mid); cursor:pointer; border-right:1px solid var(--border-glow); white-space:nowrap; transition:all 0.2s; display:flex; align-items:center; gap:8px; }
  .file-input-label:hover { background:rgba(0,212,255,0.06); color:var(--accent-primary); }
  .file-input-label input { display:none; }
  .upload-btn { padding:9px 20px; background:var(--accent-primary); border:none; color:var(--bg-void); font-family:var(--font-display); font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:all 0.2s; position:relative; overflow:hidden; }
  .upload-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent); transform:translateX(-100%); transition:transform 0.4s; }
  .upload-btn:hover::after { transform:translateX(100%); }
  .upload-btn:hover { background:#33ddff; }
  .upload-btn:disabled { background:var(--text-dim); cursor:not-allowed; }

  .content { padding:32px 40px; flex:1; }

  .loader-block { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:80px; gap:24px; }
  .loader-ring  { width:60px; height:60px; border:2px solid var(--border-dim); border-top-color:var(--accent-primary); border-right-color:var(--accent-primary); border-radius:50%; animation:spin-slow 1s linear infinite; }
  .loader-text  { font-family:var(--font-mono); font-size:12px; color:var(--accent-primary); letter-spacing:4px; animation:blink 1.2s ease-in-out infinite; }

  .section-header { display:flex; align-items:center; gap:12px; margin-bottom:20px; }
  .section-line   { flex:1; height:1px; background:linear-gradient(90deg,var(--border-glow),transparent); }
  .section-label  { font-family:var(--font-mono); font-size:10px; color:var(--text-dim); letter-spacing:4px; text-transform:uppercase; white-space:nowrap; }

  .cards-row { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:28px; animation:slide-in-up 0.5s ease both; }
  .metric-card { background:var(--bg-card); border:1px solid var(--border-dim); border-radius:2px; padding:24px; position:relative; overflow:hidden; transition:border-color 0.3s,box-shadow 0.3s; cursor:default; }
  .metric-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--card-accent,var(--accent-primary)); }
  .metric-card::after  { content:''; position:absolute; bottom:-30px; right:-30px; width:100px; height:100px; background:radial-gradient(circle,var(--card-accent,var(--accent-primary)) 0%,transparent 70%); opacity:0.05; transition:opacity 0.3s; }
  .metric-card:hover { box-shadow:0 0 20px rgba(0,212,255,0.06),inset 0 0 30px rgba(0,212,255,0.02); }
  .metric-card:hover::after { opacity:0.12; }
  .card-id    { font-family:var(--font-mono); font-size:9px; color:var(--text-dim); letter-spacing:2px; margin-bottom:14px; display:flex; align-items:center; gap:8px; }
  .card-id::before { content:''; display:inline-block; width:4px; height:4px; background:var(--card-accent,var(--accent-primary)); border-radius:50%; }
  .card-label { font-family:var(--font-mono); font-size:10px; color:var(--text-mid); letter-spacing:3px; text-transform:uppercase; margin-bottom:8px; }
  .card-value { font-family:var(--font-display); font-size:42px; font-weight:900; line-height:1; letter-spacing:-1px; animation:number-count 0.6s ease both; }
  .card-unit  { font-family:var(--font-mono); font-size:12px; color:var(--text-mid); margin-top:6px; letter-spacing:2px; }

  .panel { background:var(--bg-card); border:1px solid var(--border-dim); border-radius:2px; margin-bottom:20px; overflow:hidden; animation:slide-in-up 0.6s ease both; position:relative; }
  .panel::before { content:''; position:absolute; left:0; top:0; bottom:0; width:2px; background:linear-gradient(180deg,var(--accent-primary),transparent); opacity:0.6; }
  .panel-header  { display:flex; align-items:center; justify-content:space-between; padding:16px 24px; border-bottom:1px solid var(--border-dim); }
  .panel-title   { font-family:var(--font-display); font-size:11px; font-weight:700; color:var(--text-bright); letter-spacing:3px; text-transform:uppercase; display:flex; align-items:center; gap:10px; }
  .panel-title::before { content:'//'; color:var(--accent-primary); font-family:var(--font-mono); opacity:0.6; }
  .panel-badge   { font-family:var(--font-mono); font-size:9px; padding:3px 8px; border:1px solid var(--border-glow); color:var(--accent-primary); letter-spacing:2px; text-transform:uppercase; }
  .panel-body    { padding:24px; }

  .insight-grid  { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  .insight-text  { color:var(--text-mid); font-family:var(--font-ui); font-size:15px; font-weight:400; line-height:1.7; }
  .insight-text strong { color:var(--accent-primary); font-weight:600; }

  .stat-bar-label { display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:10px; color:var(--text-dim); letter-spacing:2px; margin-bottom:6px; }
  .stat-bar-track { height:3px; background:rgba(0,212,255,0.08); border-radius:2px; margin-bottom:14px; overflow:hidden; }
  .stat-bar-fill  { height:100%; border-radius:2px; animation:progress-fill 1.2s ease both; }

  .graph-img { width:100%; max-height:280px; object-fit:contain; border-radius:4px; display:block; border:1px solid var(--border-dim); }
  .corner-tag { position:absolute; bottom:12px; right:16px; font-family:var(--font-mono); font-size:9px; color:var(--text-dim); letter-spacing:2px; }

  .insight-flex { display:flex; gap:24px; align-items:flex-start; }
  .insight-graph { flex:1.2; }
  .insight-text-block { flex:1; font-family:var(--font-ui); font-size:14px; line-height:1.7; color:#cfefff; }
  .insight-text-block strong { color:var(--accent-primary); }
  .insight-stats p { margin:6px 0; font-size:13px; }

  .analysis-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:24px; }
  .analysis-card  { background:var(--bg-card); border:1px solid var(--border-dim); border-radius:2px; padding:20px; position:relative; overflow:hidden; }
  .analysis-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--card-accent,var(--accent-primary)); }
  .analysis-card-label { font-family:var(--font-mono); font-size:9px; color:var(--text-dim); letter-spacing:3px; text-transform:uppercase; margin-bottom:10px; }
  .analysis-card-value { font-family:var(--font-display); font-size:32px; font-weight:900; color:var(--card-accent,var(--accent-primary)); letter-spacing:-1px; margin-bottom:6px; }
  .analysis-card-desc  { font-family:var(--font-mono); font-size:10px; color:var(--text-mid); letter-spacing:1px; line-height:1.6; }

  .recommendation-box { background:rgba(0,212,255,0.04); border:1px solid var(--border-glow); border-radius:2px; padding:20px 24px; font-family:var(--font-ui); font-size:15px; color:var(--text-mid); line-height:1.7; margin-bottom:20px; }
  .recommendation-box strong { color:var(--accent-primary); }

  .wastage-box  { display:flex; gap:20px; align-items:stretch; }
  .wastage-item { flex:1; background:var(--bg-card); border:1px solid var(--border-dim); border-radius:2px; padding:20px; font-family:var(--font-mono); }
  .wastage-item-label { font-size:9px; color:var(--text-dim); letter-spacing:3px; text-transform:uppercase; margin-bottom:10px; }
  .wastage-item-value { font-family:var(--font-display); font-size:24px; font-weight:700; color:var(--accent-warn); margin-bottom:6px; }
  .wastage-item-desc  { font-size:10px; color:var(--text-mid); letter-spacing:1px; line-height:1.6; }

  .hourly-bar-grid { display:flex; flex-direction:column; gap:5px; }
  .hourly-bar-row  { display:flex; align-items:center; gap:12px; }
  .hourly-bar-hour { font-family:var(--font-mono); font-size:10px; color:var(--text-dim); letter-spacing:1px; width:44px; flex-shrink:0; text-align:right; }
  .hourly-bar-track{ flex:1; height:6px; background:rgba(0,212,255,0.06); border-radius:2px; overflow:hidden; }
  .hourly-bar-fill { height:100%; border-radius:2px; animation:progress-fill 0.9s ease both; }
  .hourly-bar-val  { font-family:var(--font-mono); font-size:10px; color:var(--text-mid); width:62px; flex-shrink:0; letter-spacing:1px; }

  /* SUBMETERING */
  .sub-zone-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:24px; }
  .sub-zone-card  { background:var(--bg-card); border:1px solid var(--border-dim); border-radius:2px; padding:20px; position:relative; overflow:hidden; }
  .sub-zone-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--zone-accent,var(--accent-primary)); }
  .sub-zone-label { font-family:var(--font-mono); font-size:9px; color:var(--text-dim); letter-spacing:3px; text-transform:uppercase; margin-bottom:10px; }
  .sub-zone-value { font-family:var(--font-display); font-size:28px; font-weight:900; letter-spacing:-1px; margin-bottom:6px; }
  .sub-zone-desc  { font-family:var(--font-mono); font-size:10px; color:var(--text-mid); letter-spacing:1px; line-height:1.6; }

  /* ZONE SELECTOR TABS */
  .zone-tabs { display:flex; gap:8px; margin-bottom:18px; flex-wrap:wrap; }
  .zone-tab  { padding:5px 16px; border:1px solid var(--border-dim); background:transparent; color:var(--text-dim); font-family:var(--font-mono); font-size:10px; letter-spacing:2px; cursor:pointer; border-radius:2px; text-transform:uppercase; transition:all 0.2s; }
  .zone-tab:hover { border-color:var(--border-glow); color:var(--text-mid); }
  .zone-tab.kitchen.active { background:rgba(0,212,255,0.1);  color:#00d4ff; border-color:#00d4ff; }
  .zone-tab.laundry.active { background:rgba(255,204,0,0.1);  color:#ffcc00; border-color:#ffcc00; }
  .zone-tab.heating.active { background:rgba(255,107,0,0.1);  color:#ff6b00; border-color:#ff6b00; }

  /* HEATMAP */
  .heatmap-wrap { overflow-x:auto; }
  .heatmap-grid { display:grid; grid-template-columns:36px repeat(7,1fr); gap:2px; min-width:360px; }
  .heatmap-cell { height:18px; border-radius:2px; cursor:default; }
  .heatmap-day-hdr { font-family:var(--font-mono); font-size:9px; color:var(--text-dim); text-align:center; padding-bottom:4px; letter-spacing:1px; }
  .heatmap-hour    { font-family:var(--font-mono); font-size:9px; color:var(--text-dim); text-align:right; padding-right:6px; line-height:18px; }
  .heatmap-legend  { display:flex; align-items:center; gap:10px; margin-top:12px; font-family:var(--font-mono); font-size:9px; color:var(--text-dim); letter-spacing:1px; }
  .heatmap-legend-bar { flex:1; height:6px; border-radius:2px; max-width:160px; }

  /* EMPTY STATE */
  .empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:50vh; gap:20px; text-align:center; }
  .empty-icon  { width:80px; height:80px; border:1px solid var(--border-glow); border-radius:50%; display:flex; align-items:center; justify-content:center; animation:pulse-ring 2s ease-out infinite; }
  .empty-title { font-family:var(--font-display); font-size:16px; font-weight:700; color:var(--text-bright); letter-spacing:4px; text-transform:uppercase; }
  .empty-sub   { font-family:var(--font-mono); font-size:11px; color:var(--text-dim); letter-spacing:2px; line-height:1.8; }

  @media (max-width:900px) {
    .insight-flex{flex-direction:column} .cards-row{grid-template-columns:1fr}
    .analysis-cards{grid-template-columns:1fr} .sub-zone-cards{grid-template-columns:1fr}
  }
  ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#00060f}
  ::-webkit-scrollbar-thumb{background:rgba(0,212,255,0.25);border-radius:2px}
`;

/* ── CLOCK ───────────────────────────────────────────────────────────────── */
function Clock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return <span className="timestamp">{t.toLocaleDateString("en-GB").replace(/\//g, ".")} · {t.toLocaleTimeString("en-GB")}</span>;
}

/* ── METRIC CARD ─────────────────────────────────────────────────────────── */
function MetricCard({ id, label, value, unit, accent, delay = 0 }) {
  return (
    <div className="metric-card" style={{ "--card-accent": accent, animationDelay: `${delay}s` }}>
      <div className="card-id">SYS-{String(id).padStart(3, "0")}</div>
      <div className="card-label">{label}</div>
      <div className="card-value" style={{ color: accent, textShadow: `0 0 20px ${accent}55` }}>{value}</div>
      {unit && <div className="card-unit">{unit}</div>}
    </div>
  );
}

/* ── STAT BAR ────────────────────────────────────────────────────────────── */
function StatBar({ label, value, max, color }) {
  const realPct    = (value / max) * 100;
  const displayPct = Math.max(Math.min(realPct, 100), 2);
  return (
    <div>
      <div className="stat-bar-label">
        <span>{label}</span>
        <span style={{ color }}>{realPct < 1 ? realPct.toFixed(2) : realPct.toFixed(1)}%</span>
      </div>
      <div className="stat-bar-track">
        <div className="stat-bar-fill"
          style={{ "--target-width": `${displayPct}%`, width: `${displayPct}%`, background: color, boxShadow: `0 0 8px ${color}` }} />
      </div>
    </div>
  );
}

/* ── HOURLY BAR CHART ────────────────────────────────────────────────────── */
function HourlyBarChart({ hourlyData }) {
  if (!hourlyData || Object.keys(hourlyData).length === 0) return null;
  const entries = Object.entries(hourlyData).map(([h, v]) => ({ hour: Number(h), value: Number(v) })).sort((a, b) => a.hour - b.hour);
  const maxVal  = Math.max(...entries.map(e => e.value));
  return (
    <div className="hourly-bar-grid">
      {entries.map(({ hour, value }) => {
        const pct   = maxVal > 0 ? (value / maxVal) * 100 : 0;
        const color = pct > 85 ? "#ff6b00" : pct > 60 ? "#ffcc00" : "#00d4ff";
        return (
          <div className="hourly-bar-row" key={hour}>
            <div className="hourly-bar-hour">{String(hour).padStart(2, "0")}:00</div>
            <div className="hourly-bar-track">
              <div className="hourly-bar-fill"
                style={{ "--target-width": `${Math.max(pct, 1)}%`, width: `${Math.max(pct, 1)}%`, background: color, boxShadow: `0 0 5px ${color}66`, animationDelay: `${hour * 0.025}s` }} />
            </div>
            <div className="hourly-bar-val">{value.toFixed(3)} kW</div>
          </div>
        );
      })}
    </div>
  );
}

/* ── ZONE HEATMAP (24 × 7) ───────────────────────────────────────────────── */
function ZoneHeatmap({ heatmapData }) {
  const [activeZone, setActiveZone] = useState("kitchen");
  if (!heatmapData) return <p style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: 11 }}>No heatmap data available.</p>;

  const days    = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const data    = heatmapData[activeZone] || [];
  const allVals = data.flat();
  const maxVal  = Math.max(...allVals, 0.001);

  const zoneColors = { kitchen: "0,212,255", laundry: "255,204,0", heating: "255,107,0" };
  const rgb        = zoneColors[activeZone];

  const getColor = (val) => {
    const intensity = val / maxVal;
    return intensity < 0.05
      ? "rgba(4,21,38,0.9)"
      : `rgba(${rgb},${(0.12 + intensity * 0.88).toFixed(2)})`;
  };

  const zoneAccent = { kitchen: "#00d4ff", laundry: "#ffcc00", heating: "#ff6b00" };

  return (
    <div>
      {/* Zone selector tabs */}
      <div className="zone-tabs">
        {["kitchen", "laundry", "heating"].map(z => (
          <button key={z}
            className={`zone-tab ${z}${activeZone === z ? " active" : ""}`}
            onClick={() => setActiveZone(z)}>
            {z === "heating" ? "Heating / AC" : z.charAt(0).toUpperCase() + z.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid — FIX: use Fragment with key instead of bare <> inside map */}
      <div className="heatmap-wrap">
        <div className="heatmap-grid">
          {/* Header row */}
          <div />
          {days.map(d => <div key={d} className="heatmap-day-hdr">{d}</div>)}

          {/* Data rows — one Fragment per hour */}
          {data.map((row, hour) => (
            <Fragment key={hour}>
              <div className="heatmap-hour">{String(hour).padStart(2, "0")}</div>
              {row.map((val, day) => (
                <div key={day} className="heatmap-cell"
                  style={{ background: getColor(val) }}
                  title={`${String(hour).padStart(2, "0")}:00 ${days[day]} — ${val.toFixed(3)} W avg`}
                />
              ))}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="heatmap-legend">
        <span>LOW</span>
        <div className="heatmap-legend-bar"
          style={{ background: `linear-gradient(90deg, rgba(4,21,38,0.9), rgba(${rgb},1))` }} />
        <span>HIGH</span>
        <span style={{ marginLeft: "auto", color: zoneAccent[activeZone] }}>
          Peak: {maxVal.toFixed(3)} W avg
        </span>
      </div>
    </div>
  );
}

/* ── ZONE RATIO CHART (SVG) ──────────────────────────────────────────────── */
function ZoneRatioChart({ series }) {
  if (!series || series.length < 2) return (
    <p style={{ color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontSize: 11 }}>Not enough data points.</p>
  );

  const W = 680, H = 200, pL = 42, pR = 16, pT = 12, pB = 32;
  const w = W - pL - pR;
  const h = H - pT - pB;
  const n = series.length;

  const xOf  = (i) => pL + (i / (n - 1)) * w;
  const yOf  = (v) => pT + h - (Math.min(v, 100) / 100) * h;

  const lines = [
    { key: "kitchen", color: "#00d4ff", label: "Kitchen" },
    { key: "laundry", color: "#ffcc00", label: "Laundry" },
    { key: "heating", color: "#ff6b00", label: "Heating / AC" },
  ];

  const pathFor = (key) =>
    series.map((d, i) => `${i === 0 ? "M" : "L"}${xOf(i).toFixed(1)},${yOf(d[key]).toFixed(1)}`).join(" ");

  const yTicks  = [0, 25, 50, 75, 100];
  const xTicks  = Array.from({ length: 6 }, (_, i) => Math.round(i * (n - 1) / 5));

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block", overflow: "visible" }}>
        {/* Y grid + labels */}
        {yTicks.map(v => (
          <g key={v}>
            <line x1={pL} y1={yOf(v)} x2={pL + w} y2={yOf(v)}
              stroke="rgba(0,212,255,0.07)" strokeWidth="1" />
            <text x={pL - 6} y={yOf(v) + 4} textAnchor="end"
              fill="rgba(107,154,184,0.55)" fontSize="9" fontFamily="monospace">{v}%</text>
          </g>
        ))}

        {/* Lines */}
        {lines.map(l => (
          <path key={l.key} d={pathFor(l.key)} fill="none"
            stroke={l.color} strokeWidth="1.8" opacity="0.9" strokeLinejoin="round" />
        ))}

        {/* X tick labels */}
        {xTicks.map(i => (
          <text key={i} x={xOf(i)} y={H - 6} textAnchor="middle"
            fill="rgba(107,154,184,0.5)" fontSize="9" fontFamily="monospace">
            {series[i]?.date?.slice(0, 7) ?? ""}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
        {lines.map(l => (
          <div key={l.key} style={{ display: "flex", alignItems: "center", gap: 7,
            fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-mid)", letterSpacing: 1 }}>
            <div style={{ width: 22, height: 2, background: l.color, borderRadius: 1 }} />
            {l.label.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD TAB
═══════════════════════════════════════════════════════════════════════════ */
function DashboardTab({ result }) {
  return (
    <>
      <div className="section-header">
        <div className="section-label">Metrics Overview</div>
        <div className="section-line" />
      </div>
      <div className="cards-row">
        <MetricCard id={1} label="Raw Records Loaded"
          value={(result.raw_record_count ?? result.total_data_points).toLocaleString()}
          unit="TOTAL ROWS FROM CSV" accent="#00d4ff" delay={0} />
        <MetricCard id={2} label="Total Anomalies"
          value={result.total_anomalies} unit="DETECTED EVENTS" accent="#ff6b00" delay={0.1} />
        <MetricCard id={3} label="Anomaly Rate"
          value={result.anomaly_percentage + "%"} unit="OF TOTAL STREAM"
          accent={parseFloat(result.anomaly_percentage) > 10 ? "#ff6b00" : "#00ff88"} delay={0.2} />
      </div>

      <div className="panel" style={{ animationDelay: "0.3s" }}>
        <div className="panel-header">
          <div className="panel-title">System Insight</div>
          <div className="panel-badge">AUTO-ANALYSIS</div>
        </div>
        <div className="panel-body">
          <div className="insight-grid">
            <div className="insight-text">
              System loaded <strong>{(result.raw_record_count ?? result.total_data_points).toLocaleString()}</strong> raw
              records, resampled to <strong>{result.total_data_points.toLocaleString()}</strong> hourly points for ML
              analysis. <strong>{result.total_anomalies}</strong> anomalies flagged ({result.anomaly_percentage}%).{" "}
              {parseFloat(result.anomaly_percentage) < 5
                ? "Usage appears generally stable."
                : "Elevated anomaly rate — review device activity."}
            </div>
            <div>
              <StatBar label="NORMAL READINGS" value={100 - parseFloat(result.anomaly_percentage)} max={100} color="#00ff88" />
              <StatBar label="ANOMALY EVENTS"  value={parseFloat(result.anomaly_percentage)}       max={100} color="#ff6b00" />
              <StatBar label="DATA INTEGRITY"  value={100 - parseFloat(result.anomaly_percentage)} max={100} color="#00d4ff" />
            </div>
          </div>
        </div>
      </div>

      <div className="panel" style={{ animationDelay: "0.45s" }}>
        <div className="panel-header">
          <div className="panel-title">Usage Pattern</div>
          <div className="panel-badge">LIVE RENDER</div>
        </div>
        <div className="panel-body">
          <img src={result.anomaly_plot} className="graph-img" alt="Anomaly Detection Graph" />
        </div>
        <div className="corner-tag">ANOMAX · VISUAL ENGINE</div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   INSIGHTS TAB
═══════════════════════════════════════════════════════════════════════════ */
function InsightsTab({ result }) {
  return (
    <>
      <div className="section-header"><div className="section-label">Insights Overview</div><div className="section-line" /></div>

      <div className="panel">
        <div className="panel-header"><div className="panel-title">Peak Usage Analysis</div><div className="panel-badge">SMART INSIGHT</div></div>
        <div className="panel-body insight-flex">
          <div className="insight-graph"><img src={result.hourly_plot} className="graph-img" alt="Hourly Usage" /></div>
          <div className="insight-text-block">
            <p style={{ marginBottom: 10 }}>{result.smart_summary}</p>
            <div className="insight-stats">
              <p>Peak Hour: <strong>{result.peak_hour}:00</strong></p>
              <p>Lowest Hour: <strong>{result.low_hour}:00</strong></p>
              <p>Peak-to-Low Gap: <strong>{result.usage_gap} kW</strong></p>
            </div>
            <div style={{ marginTop: 12, opacity: 0.8, fontSize: 13 }}>{result.peak_reason}</div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><div className="panel-title">Hourly Breakdown — All 24 Hours</div><div className="panel-badge">ACTUAL KW VALUES</div></div>
        <div className="panel-body"><HourlyBarChart hourlyData={result.hourly_avg} /></div>
      </div>

      <div className="panel">
        <div className="panel-header"><div className="panel-title">Daily Trend</div><div className="panel-badge">TIME SERIES</div></div>
        <div className="panel-body insight-flex">
          <div className="insight-graph"><img src={result.daily_plot} className="graph-img" alt="Daily Trend" /></div>
          <div className="insight-text-block"><p>{result.daily_explanation}</p></div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><div className="panel-title">Monthly Trend</div><div className="panel-badge">SEASONAL</div></div>
        <div className="panel-body insight-flex">
          <div className="insight-graph"><img src={result.monthly_plot} className="graph-img" alt="Monthly Trend" /></div>
          <div className="insight-text-block"><p>{result.monthly_explanation}</p></div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><div className="panel-title">Night vs Day Usage</div><div className="panel-badge">WASTE ANALYSIS</div></div>
        <div className="panel-body">
          <div className="insight-text-block" style={{ maxWidth: "100%" }}>
            <p>Night usage is <strong>{result.waste_score}%</strong> of daytime usage.</p>
            <p style={{ marginTop: 12 }}>
              {result.waste_score > 50
                ? "High energy usage during night hours — possible wastage from idle appliances or AC."
                : "Energy usage is well balanced between day and night."}
            </p>
            <div style={{ marginTop: 16 }}>
              <StatBar label="NIGHT VS DAY" value={Math.min(result.waste_score, 100)} max={100}
                color={result.waste_score > 50 ? "#ff6b00" : "#00ff88"} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANALYSIS TAB
═══════════════════════════════════════════════════════════════════════════ */
function AnalysisTab({ result }) {
  const effColor = result.efficiency_score > 70 ? "#00ff88" : result.efficiency_score > 40 ? "#ffcc00" : "#ff6b00";
  return (
    <>
      <div className="section-header"><div className="section-label">Deep Analysis</div><div className="section-line" /></div>

      <div className="analysis-cards">
        <div className="analysis-card" style={{ "--card-accent": effColor }}>
          <div className="analysis-card-label">Efficiency Score</div>
          <div className="analysis-card-value" style={{ color: effColor }}>{result.efficiency_score}%</div>
          <div className="analysis-card-desc">{result.efficiency_msg}</div>
        </div>
        <div className="analysis-card" style={{ "--card-accent": "#ffcc00" }}>
          <div className="analysis-card-label">High Usage Events</div>
          <div className="analysis-card-value" style={{ color: "#ffcc00" }}>{result.high_usage_count}</div>
          <div className="analysis-card-desc">Readings above mean + 1 std deviation threshold</div>
        </div>
        <div className="analysis-card" style={{ "--card-accent": result.waste_score > 50 ? "#ff6b00" : "#00ff88" }}>
          <div className="analysis-card-label">Night Waste Score</div>
          <div className="analysis-card-value" style={{ color: result.waste_score > 50 ? "#ff6b00" : "#00ff88" }}>{result.waste_score}%</div>
          <div className="analysis-card-desc">Night usage as % of daytime usage</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><div className="panel-title">Efficiency Breakdown</div><div className="panel-badge">SCORING</div></div>
        <div className="panel-body">
          <StatBar label="ENERGY EFFICIENCY" value={result.efficiency_score} max={100} color={effColor} />
          <StatBar label="WASTE SCORE" value={Math.min(result.waste_score, 100)} max={100} color={result.waste_score > 50 ? "#ff6b00" : "#00ff88"} />
          <StatBar label="ANOMALY RATE" value={parseFloat(result.anomaly_percentage)} max={100} color="#ff6b00" />
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><div className="panel-title">Smart Recommendation</div><div className="panel-badge">AI ENGINE</div></div>
        <div className="panel-body">
          <div className="recommendation-box"><strong>Recommendation: </strong>{result.recommendation}</div>
        </div>
      </div>

      {result.wastage && (
        <div className="panel">
          <div className="panel-header"><div className="panel-title">Wastage Analysis</div><div className="panel-badge">ZONE DETAIL</div></div>
          <div className="panel-body">
            <div className="wastage-box">
              <div className="wastage-item">
                <div className="wastage-item-label">Peak Waste Hour</div>
                <div className="wastage-item-value">{result.wastage.peak_waste_hour}:00</div>
                <div className="wastage-item-desc">Hour with highest abnormal load</div>
              </div>
              <div className="wastage-item">
                <div className="wastage-item-label">Main Source</div>
                <div className="wastage-item-value">{result.wastage.main_source}</div>
                <div className="wastage-item-desc">Zone contributing most to high-usage events</div>
              </div>
              <div className="wastage-item" style={{ flex: 2 }}>
                <div className="wastage-item-label">Summary</div>
                <div className="wastage-item-desc" style={{ fontSize: 13, marginTop: 8 }}>{result.wastage.message}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {result.anomaly_hour_distribution && Object.keys(result.anomaly_hour_distribution).length > 0 && (
        <div className="panel">
          <div className="panel-header"><div className="panel-title">Anomaly Hour Distribution</div><div className="panel-badge">PATTERN</div></div>
          <div className="panel-body">
            {Object.entries(result.anomaly_hour_distribution)
              .sort((a, b) => Number(a[0]) - Number(b[0]))
              .map(([hour, count]) => (
                <StatBar key={hour} label={`HOUR ${String(hour).padStart(2, "0")}:00`}
                  value={count} max={Math.max(...Object.values(result.anomaly_hour_distribution))} color="#ff6b00" />
              ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUBMETERING TAB
═══════════════════════════════════════════════════════════════════════════ */
function SubmeteringTab({ result }) {
  const zones = [
    { label: "Kitchen",    totKey: "sub_kitchen", pctKey: "kitchen", accent: "#00d4ff" },
    { label: "Laundry",    totKey: "sub_laundry", pctKey: "laundry", accent: "#ffcc00" },
    { label: "Heating/AC", totKey: "sub_heating", pctKey: "heating", accent: "#ff6b00" },
  ];

  return (
    <>
      <div className="section-header"><div className="section-label">Submetering Analysis</div><div className="section-line" /></div>

      {/* ── ZONE TOTALS (3 cards, no unmetered) ─────────────────────────── */}
      <div className="sub-zone-cards">
        {zones.map(z => (
          <div key={z.label} className="sub-zone-card" style={{ "--zone-accent": z.accent }}>
            <div className="sub-zone-label">{z.label}</div>
            <div className="sub-zone-value" style={{ color: z.accent }}>
              {result[z.totKey] !== undefined
                ? Number(result[z.totKey]).toLocaleString(undefined, { maximumFractionDigits: 1 })
                : "—"}
            </div>
            <div className="sub-zone-desc">Total energy units recorded</div>
          </div>
        ))}
      </div>

      {/* ── USAGE SHARE ──────────────────────────────────────────────────── */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">Zone Usage Share</div>
          <div className="panel-badge">DISTRIBUTION</div>
        </div>
        <div className="panel-body insight-flex">
          <div className="insight-graph">
            <img src={result.pie_chart} className="graph-img" alt="Zone Pie Chart" />
          </div>
          <div className="insight-text-block">
            {result.sub_pct && zones.map(z => (
              <StatBar key={z.label} label={z.label.toUpperCase()}
                value={result.sub_pct[z.pctKey] || 0} max={100} color={z.accent} />
            ))}
            {result.sub_insight && (
              <p style={{ marginTop: 16, fontSize: 13, opacity: 0.75 }}>{result.sub_insight}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── CORRELATION ──────────────────────────────────────────────────── */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">Sub Meter Correlation</div>
          <div className="panel-badge">HEATMAP</div>
        </div>
        <div className="panel-body insight-flex">
          <div className="insight-graph">
            <img src={result.correlation_plot} className="graph-img" alt="Correlation Heatmap" />
          </div>
          <div className="insight-text-block">
            <p>The correlation heatmap shows how usage patterns between zones relate. A high value means two zones tend to be active at the same times.</p>
            {result.correlation_insight && (
              <p style={{ marginTop: 12, opacity: 0.8, fontSize: 13 }}>{result.correlation_insight}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════════════════ */
function App() {
  const [file, setFile]           = useState(null);
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");

  const handleUpload = async () => {
    if (!file) return alert("Select a file");
    setLoading(true); setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res  = await fetch("http://127.0.0.1:8000/upload", { method: "POST", body: formData });
      const data = await res.json();
      setResult(data);
    } catch {
      alert("Upload failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const navItems   = [{ label: "Dashboard", icon: "▦" }, { label: "Insights", icon: "◈" }, { label: "Analysis", icon: "◉" }, { label: "Submetering", icon: "◫" }];
  const pageTitles = { Dashboard: "Energy Dashboard", Insights: "Usage Insights", Analysis: "Deep Analysis", Submetering: "Submetering" };

  return (
    <>
      <style>{CSS}</style>
      <div className="app-root">
        <div className="scanline" />
        <div className="grid-bg" />

        <aside className="sidebar">
          <div className="logo-block">
            <div className="logo-eyebrow">ENERGY SYSTEM</div>
            <div className="logo-main">AN<span>OM</span>AX</div>
          </div>
          <div className="sys-status"><span className="status-dot" /> SYSTEMS NOMINAL</div>
          <nav className="nav-section">
            <div className="nav-label">Navigation</div>
            {navItems.map(item => (
              <div key={item.label} className={`nav-item${activeNav === item.label ? " active" : ""}`}
                onClick={() => setActiveNav(item.label)}>
                <span style={{ fontFamily: "monospace", fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">ANOMAX CORE ENGINE<br /><span className="ver">v4.4.0 · BUILD 2025</span></div>
        </aside>

        <main className="main">
          <div className="topbar">
            <div>
              <div className="page-eyebrow">MONITORING · ACTIVE</div>
              <div className="page-title">{pageTitles[activeNav]}</div>
            </div>
            <div className="topbar-right">
              <Clock />
              <div className="file-drop-zone">
                <label className="file-input-label">
                  <span>⬡</span>
                  <span>{file ? (file.name.length > 20 ? file.name.slice(0, 20) + "…" : file.name) : "SELECT FILE"}</span>
                  <input type="file" onChange={e => setFile(e.target.files[0])} />
                </label>
                <button onClick={handleUpload} disabled={loading} className="upload-btn">
                  {loading ? "···" : "UPLOAD"}
                </button>
              </div>
            </div>
          </div>

          <div className="content">
            {loading && (
              <div className="loader-block">
                <div className="loader-ring" />
                <div className="loader-text">PROCESSING DATA STREAM</div>
              </div>
            )}

            {!result && !loading && (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 4 L28 10 L28 22 L16 28 L4 22 L4 10 Z" stroke="var(--accent-primary)" strokeWidth="1" fill="none" opacity="0.5" />
                    <path d="M16 10 L22 13 L22 19 L16 22 L10 19 L10 13 Z" stroke="var(--accent-primary)" strokeWidth="1" fill="none" />
                    <circle cx="16" cy="16" r="2" fill="var(--accent-primary)" />
                  </svg>
                </div>
                <div className="empty-title">Awaiting Data Input</div>
                <div className="empty-sub">UPLOAD A DATASET TO BEGIN<br />ANOMALY DETECTION ANALYSIS</div>
              </div>
            )}

            {result && !loading && activeNav === "Dashboard"   && <DashboardTab   result={result} />}
            {result && !loading && activeNav === "Insights"    && <InsightsTab    result={result} />}
            {result && !loading && activeNav === "Analysis"    && <AnalysisTab    result={result} />}
            {result && !loading && activeNav === "Submetering" && <SubmeteringTab result={result} />}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;