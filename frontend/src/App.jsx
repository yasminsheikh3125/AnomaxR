import { useState, useEffect, useRef, Fragment } from "react";

/* ─── GOOGLE CLIENT ID  ─────────────────────────────── */
const GOOGLE_CLIENT_ID = "756646026903-3ojj3rscc89a2201hq36njlmql0ls9a8.apps.googleusercontent.com";


const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { margin: 0; padding: 0; width: 100%; height: 100%; }

  :root {
    --bg:         #0d1117;
    --bg-2:       #161b22;
    --bg-3:       #1c2128;
    --bg-4:       #21262d;
    --border:     rgba(255,255,255,0.08);
    --border-med: rgba(255,255,255,0.12);
    --border-hi:  rgba(255,255,255,0.2);

    --cyan:       #38bdf8;
    --cyan-dim:   rgba(56,189,248,0.12);
    --cyan-glow:  rgba(56,189,248,0.25);
    --green:      #4ade80;
    --green-dim:  rgba(74,222,128,0.12);
    --amber:      #fbbf24;
    --amber-dim:  rgba(251,191,36,0.12);
    --red:        #f87171;
    --red-dim:    rgba(248,113,113,0.12);

    --text-1: #f0f6fc;
    --text-2: #8b949e;
    --text-3: #484f58;

    --font-body:    'DM Sans', sans-serif;
    --font-mono:    'DM Mono', monospace;
    --font-display: 'Syne', sans-serif;

    --radius-sm: 6px;
    --radius:    10px;
    --radius-lg: 16px;

    --shadow-sm: 0 1px 3px rgba(0,0,0,0.4);
    --shadow:    0 4px 16px rgba(0,0,0,0.5);
    --shadow-lg: 0 8px 32px rgba(0,0,0,0.6);
  }

  body { background: var(--bg); font-family: var(--font-body); color: var(--text-1); }

  /* ── KEYFRAMES ─────────────────────────────────────────────────── */
  @keyframes fade-up   { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
  @keyframes fade-in   { from { opacity:0 } to { opacity:1 } }
  @keyframes slide-right { from { opacity:0; transform:translateX(-20px) } to { opacity:1; transform:translateX(0) } }
  @keyframes count-up  { from { opacity:0; transform:scale(0.85) } to { opacity:1; transform:scale(1) } }
  @keyframes spin      { to { transform:rotate(360deg) } }
  @keyframes shimmer   { from { background-position:-200% 0 } to { background-position:200% 0 } }
  @keyframes ping      { 75%,100% { transform:scale(2); opacity:0 } }
  @keyframes tab-slide { from { opacity:0; transform:translateX(12px) } to { opacity:1; transform:translateX(0) } }
  @keyframes bar-grow  { from { width:0 } to { width:var(--w) } }
  @keyframes num-roll  { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }

  /* ── LOGIN SCREEN ───────────────────────────────────────────────── */
  .login-root {
    min-height: 100vh; display:flex; align-items:center; justify-content:center;
    background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(56,189,248,0.08) 0%, transparent 70%), var(--bg);
    animation: fade-in 0.5s ease;
  }
  .login-card {
    width: 400px; max-width: calc(100vw - 32px);
    background: var(--bg-2); border: 1px solid var(--border-med);
    border-radius: var(--radius-lg); padding: 48px 40px;
    box-shadow: var(--shadow-lg);
    display: flex; flex-direction: column; align-items: center; gap: 32px;
    animation: fade-up 0.5s ease both;
  }
  .login-logo { font-family:var(--font-display); font-size:28px; font-weight:800; color:var(--text-1); letter-spacing:-0.5px; }
  .login-logo span { color:var(--cyan); }
  .login-tagline { text-align:center; color:var(--text-2); font-size:14px; line-height:1.6; }
  .login-divider { width:100%; height:1px; background:var(--border); }
  .google-btn {
    width:100%; display:flex; align-items:center; justify-content:center; gap:12px;
    padding:13px 20px; background:var(--bg-3); border:1px solid var(--border-med);
    border-radius: var(--radius); color:var(--text-1); font-family:var(--font-body);
    font-size:15px; font-weight:500; cursor:pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.15s, box-shadow 0.2s;
  }
  .google-btn:hover { background:var(--bg-4); border-color:var(--border-hi); transform:translateY(-1px); box-shadow:var(--shadow); }
  .google-btn:active { transform:translateY(0); }
  .google-btn svg { flex-shrink:0; }
  .login-terms { font-size:12px; color:var(--text-3); text-align:center; line-height:1.6; }

  /* ── APP SHELL ──────────────────────────────────────────────────── */
  .app-root { display:flex; min-height:100vh; width:100vw; background:var(--bg); animation:fade-in 0.3s ease; }

  /* ── SIDEBAR ────────────────────────────────────────────────────── */
  .sidebar {
    width:240px; flex-shrink:0;
    background:var(--bg-2); border-right:1px solid var(--border);
    display:flex; flex-direction:column;
    position:sticky; top:0; height:100vh; overflow-y:auto;
    animation:slide-right 0.4s ease both;
  }
  .sidebar-top { padding:24px 20px; border-bottom:1px solid var(--border); }
  .sidebar-logo { font-family:var(--font-display); font-size:22px; font-weight:800; color:var(--text-1); letter-spacing:-0.5px; }
  .sidebar-logo span { color:var(--cyan); }
  .sidebar-sub { font-size:11px; color:var(--text-3); font-family:var(--font-mono); letter-spacing:0.5px; margin-top:2px; }

  .sidebar-user {
    margin:16px 12px; padding:12px; background:var(--bg-3);
    border:1px solid var(--border); border-radius:var(--radius);
    display:flex; align-items:center; gap:10px; cursor:pointer;
    transition:background 0.2s, border-color 0.2s;
  }
  .sidebar-user:hover { background:var(--bg-4); border-color:var(--border-med); }
  .user-avatar {
    width:34px; height:34px; border-radius:50%; overflow:hidden; flex-shrink:0;
    background:linear-gradient(135deg,var(--cyan),#818cf8);
    display:flex; align-items:center; justify-content:center;
    font-weight:600; font-size:13px; color:#fff;
  }
  .user-avatar img { width:100%; height:100%; object-fit:cover; }
  .user-info { flex:1; min-width:0; }
  .user-name { font-size:13px; font-weight:600; color:var(--text-1); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .user-email { font-size:11px; color:var(--text-3); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .user-chevron { color:var(--text-3); flex-shrink:0; }

  .nav-section { flex:1; padding:8px 12px; }
  .nav-label { font-size:11px; font-weight:600; color:var(--text-3); letter-spacing:0.5px; text-transform:uppercase; padding:8px 8px 6px; }
  .nav-item {
    display:flex; align-items:center; gap:10px; padding:9px 10px;
    border-radius:var(--radius-sm); color:var(--text-2); font-size:14px; font-weight:500;
    cursor:pointer; transition:background 0.15s, color 0.15s; margin-bottom:2px;
    position:relative;
  }
  .nav-item:hover { background:var(--bg-3); color:var(--text-1); }
  .nav-item.active { background:var(--cyan-dim); color:var(--cyan); }
  .nav-item.active::before { content:''; position:absolute; left:0; top:25%; bottom:25%; width:2px; background:var(--cyan); border-radius:0 2px 2px 0; margin-left:-1px; }
  .nav-icon { width:16px; height:16px; flex-shrink:0; opacity:0.7; }
  .nav-item.active .nav-icon { opacity:1; }

  .sidebar-footer { padding:16px 12px; border-top:1px solid var(--border); }
  .signout-btn {
    width:100%; padding:9px 12px; background:transparent; border:1px solid var(--border);
    border-radius:var(--radius-sm); color:var(--text-2); font-family:var(--font-body);
    font-size:13px; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; gap:8px; justify-content:center;
  }
  .signout-btn:hover { background:var(--red-dim); border-color:var(--red); color:var(--red); }

  /* ── MAIN ───────────────────────────────────────────────────────── */
  .main { flex:1; display:flex; flex-direction:column; overflow:auto; min-width:0; }

  .topbar {
    display:flex; align-items:center; justify-content:space-between;
    padding:16px 32px; border-bottom:1px solid var(--border);
    background:rgba(13,17,23,0.8); backdrop-filter:blur(12px);
    position:sticky; top:0; z-index:40;
  }
  .topbar-left { display:flex; flex-direction:column; gap:2px; }
  .page-label { font-size:12px; color:var(--text-3); font-weight:500; }
  .page-title { font-family:var(--font-display); font-size:18px; font-weight:700; color:var(--text-1); letter-spacing:-0.3px; }

  .topbar-right { display:flex; align-items:center; gap:12px; }
  .file-zone { display:flex; align-items:center; border:1px solid var(--border-med); border-radius:var(--radius); overflow:hidden; background:var(--bg-2); }
  .file-label {
    padding:8px 14px; font-size:13px; color:var(--text-2); cursor:pointer;
    border-right:1px solid var(--border); white-space:nowrap; transition:all 0.2s;
    display:flex; align-items:center; gap:6px; font-family:var(--font-mono);
  }
  .file-label:hover { background:var(--bg-3); color:var(--text-1); }
  .file-label input { display:none; }
  .upload-btn {
    padding:8px 18px; background:var(--cyan); border:none; color:#0d1117;
    font-family:var(--font-body); font-size:13px; font-weight:600; cursor:pointer;
    transition:all 0.2s; letter-spacing:0.2px;
  }
  .upload-btn:hover { background:#7dd3fc; }
  .upload-btn:disabled { background:var(--bg-4); color:var(--text-3); cursor:not-allowed; }

  .content { padding:28px 32px; flex:1; }

  /* ── CARDS ──────────────────────────────────────────────────────── */
  .cards-row { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:24px; }
  .metric-card {
    background:var(--bg-2); border:1px solid var(--border); border-radius:var(--radius);
    padding:22px; position:relative; overflow:hidden; cursor:default;
    transition:border-color 0.2s, transform 0.2s, box-shadow 0.2s;
    animation:fade-up 0.4s ease both;
  }
  .metric-card:hover { border-color:var(--border-hi); transform:translateY(-2px); box-shadow:var(--shadow); }
  .metric-card-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
  .metric-card-label { font-size:12px; font-weight:500; color:var(--text-2); letter-spacing:0.3px; }
  .metric-card-icon { width:32px; height:32px; border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:center; }
  .metric-card-value { font-family:var(--font-display); font-size:36px; font-weight:800; line-height:1; letter-spacing:-1px; animation:count-up 0.5s ease both; }
  .metric-card-sub { font-size:12px; color:var(--text-3); margin-top:6px; font-family:var(--font-mono); }

  /* ── PANELS ─────────────────────────────────────────────────────── */
  .panel {
    background:var(--bg-2); border:1px solid var(--border); border-radius:var(--radius);
    margin-bottom:16px; overflow:hidden; animation:fade-up 0.45s ease both;
  }
  .panel-header { display:flex; align-items:center; justify-content:space-between; padding:14px 20px; border-bottom:1px solid var(--border); }
  .panel-title { font-size:14px; font-weight:600; color:var(--text-1); }
  .panel-badge { font-size:11px; font-family:var(--font-mono); color:var(--text-3); background:var(--bg-3); padding:3px 8px; border-radius:4px; border:1px solid var(--border); }
  .panel-body  { padding:20px; }

  /* ── STAT BARS ──────────────────────────────────────────────────── */
  .stat-row { margin-bottom:12px; }
  .stat-header { display:flex; justify-content:space-between; font-size:12px; color:var(--text-2); margin-bottom:6px; }
  .stat-track { height:4px; background:var(--bg-4); border-radius:2px; overflow:hidden; }
  .stat-fill { height:100%; border-radius:2px; animation:bar-grow 0.9s ease both; }

  /* ── INSIGHT LAYOUT ─────────────────────────────────────────────── */
  .insight-flex { display:flex; gap:20px; align-items:flex-start; }
  .insight-graph { flex:1.2; }
  .insight-text-col { flex:1; font-size:14px; line-height:1.7; color:var(--text-2); }
  .insight-text-col strong { color:var(--text-1); }
  .graph-img { width:100%; max-height:260px; object-fit:contain; border-radius:var(--radius-sm); border:1px solid var(--border); display:block; background:var(--bg-3); }

  /* ── SECTION HEADER ─────────────────────────────────────────────── */
  .section-head { display:flex; align-items:center; gap:12px; margin-bottom:18px; }
  .section-head-label { font-size:12px; font-weight:600; color:var(--text-3); letter-spacing:0.5px; text-transform:uppercase; white-space:nowrap; }
  .section-head-line { flex:1; height:1px; background:var(--border); }

  /* ── TAB TRANSITION ─────────────────────────────────────────────── */
  .tab-content { animation:tab-slide 0.25s ease both; }

  /* ── LOADER ─────────────────────────────────────────────────────── */
  .loader-wrap { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:80px; gap:16px; }
  .loader-ring { width:36px; height:36px; border:2px solid var(--border); border-top-color:var(--cyan); border-radius:50%; animation:spin 0.8s linear infinite; }
  .loader-text { font-size:13px; color:var(--text-3); font-family:var(--font-mono); }

  /* ── EMPTY STATE ─────────────────────────────────────────────────── */
  .empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:50vh; gap:16px; text-align:center; }
  .empty-icon { width:64px; height:64px; background:var(--bg-3); border:1px solid var(--border); border-radius:50%; display:flex; align-items:center; justify-content:center; }
  .empty-title { font-family:var(--font-display); font-size:18px; font-weight:700; color:var(--text-1); }
  .empty-sub { font-size:13px; color:var(--text-3); line-height:1.7; }

  /* ── HOURLY BARS ────────────────────────────────────────────────── */
  .hourly-row { display:flex; align-items:center; gap:12px; margin-bottom:6px; }
  .hourly-hour { font-family:var(--font-mono); font-size:11px; color:var(--text-3); width:40px; flex-shrink:0; text-align:right; }
  .hourly-track { flex:1; height:5px; background:var(--bg-4); border-radius:3px; overflow:hidden; }
  .hourly-fill { height:100%; border-radius:3px; animation:bar-grow 0.6s ease both; }
  .hourly-val { font-family:var(--font-mono); font-size:11px; color:var(--text-2); width:64px; flex-shrink:0; }

  /* ── HEATMAP ────────────────────────────────────────────────────── */
  .zone-tabs { display:flex; gap:6px; margin-bottom:16px; }
  .zone-tab { padding:5px 14px; border:1px solid var(--border); border-radius:var(--radius-sm); background:transparent; color:var(--text-3); font-size:12px; font-family:var(--font-mono); cursor:pointer; transition:all 0.2s; }
  .zone-tab:hover { border-color:var(--border-med); color:var(--text-2); }
  .zone-tab.active-cyan   { background:var(--cyan-dim);  border-color:var(--cyan);  color:var(--cyan); }
  .zone-tab.active-amber  { background:var(--amber-dim); border-color:var(--amber); color:var(--amber); }
  .zone-tab.active-red    { background:var(--red-dim);   border-color:var(--red);   color:var(--red); }

  .heatmap-grid { display:grid; grid-template-columns:36px repeat(7,1fr); gap:2px; }
  .heatmap-cell { height:16px; border-radius:2px; }
  .hm-day-hdr { font-family:var(--font-mono); font-size:9px; color:var(--text-3); text-align:center; padding-bottom:4px; }
  .hm-hour { font-family:var(--font-mono); font-size:9px; color:var(--text-3); text-align:right; padding-right:6px; line-height:16px; }
  .heatmap-legend { display:flex; align-items:center; gap:8px; margin-top:10px; font-family:var(--font-mono); font-size:10px; color:var(--text-3); }
  .heatmap-legend-bar { flex:1; height:5px; border-radius:3px; max-width:140px; }

  /* ── ANALYSIS CARDS ─────────────────────────────────────────────── */
  .analysis-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:20px; }
  .analysis-card { background:var(--bg-2); border:1px solid var(--border); border-radius:var(--radius); padding:18px; position:relative; overflow:hidden; }
  .analysis-card::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--card-top,var(--cyan)); }
  .analysis-card-label { font-size:12px; color:var(--text-3); margin-bottom:8px; }
  .analysis-card-value { font-family:var(--font-display); font-size:28px; font-weight:800; margin-bottom:4px; }
  .analysis-card-desc { font-size:12px; color:var(--text-3); line-height:1.5; }

  /* ── SUBMETERING ZONE CARDS ─────────────────────────────────────── */
  .zone-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:20px; }
  .zone-card { background:var(--bg-2); border:1px solid var(--border); border-radius:var(--radius); padding:18px; position:relative; overflow:hidden; }
  .zone-card::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--zone-top,var(--cyan)); }
  .zone-card-label { font-size:12px; color:var(--text-3); margin-bottom:8px; }
  .zone-card-value { font-family:var(--font-display); font-size:26px; font-weight:800; }
  .zone-card-sub { font-size:12px; color:var(--text-3); margin-top:4px; }

  /* ── WASTAGE BOX ─────────────────────────────────────────────────── */
  .wastage-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
  .wastage-item { background:var(--bg-3); border:1px solid var(--border); border-radius:var(--radius-sm); padding:16px; }
  .wastage-label { font-size:11px; color:var(--text-3); margin-bottom:6px; font-family:var(--font-mono); text-transform:uppercase; letter-spacing:0.5px; }
  .wastage-value { font-family:var(--font-display); font-size:22px; font-weight:700; color:var(--amber); margin-bottom:4px; }
  .wastage-desc { font-size:12px; color:var(--text-3); line-height:1.5; }

  /* ── RECOMMENDATION ─────────────────────────────────────────────── */
  .rec-box { background:var(--cyan-dim); border:1px solid var(--cyan-glow); border-radius:var(--radius); padding:16px 20px; font-size:14px; color:var(--text-2); line-height:1.7; }
  .rec-box strong { color:var(--cyan); }

  /* ── HOME/PROFILE TAB ───────────────────────────────────────────── */
  .home-grid { display:grid; grid-template-columns:320px 1fr; gap:20px; align-items:start; }
  .profile-card { background:var(--bg-2); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; }
  .profile-banner { height:80px; background:linear-gradient(135deg,rgba(56,189,248,0.3),rgba(129,140,248,0.2)); }
  .profile-body { padding:0 20px 20px; }
  .profile-avatar-wrap { margin-top:-28px; margin-bottom:12px; }
  .profile-avatar {
    width:56px; height:56px; border-radius:50%; border:3px solid var(--bg-2);
    background:linear-gradient(135deg,var(--cyan),#818cf8);
    display:flex; align-items:center; justify-content:center;
    font-weight:700; font-size:20px; color:#fff; overflow:hidden;
  }
  .profile-avatar img { width:100%; height:100%; object-fit:cover; }
  .profile-name { font-family:var(--font-display); font-size:18px; font-weight:700; color:var(--text-1); margin-bottom:2px; }
  .profile-email { font-size:13px; color:var(--text-3); margin-bottom:16px; font-family:var(--font-mono); }
  .profile-stats { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .profile-stat { background:var(--bg-3); border-radius:var(--radius-sm); padding:12px; text-align:center; }
  .profile-stat-val { font-family:var(--font-display); font-size:20px; font-weight:700; color:var(--cyan); }
  .profile-stat-label { font-size:11px; color:var(--text-3); margin-top:2px; }

  .settings-card { background:var(--bg-2); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; }
  .settings-row { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid var(--border); }
  .settings-row:last-child { border-bottom:none; }
  .settings-label { font-size:14px; color:var(--text-1); font-weight:500; }
  .settings-desc  { font-size:12px; color:var(--text-3); margin-top:2px; }
  .settings-input {
    background:var(--bg-3); border:1px solid var(--border); border-radius:var(--radius-sm);
    padding:7px 12px; color:var(--text-1); font-family:var(--font-body); font-size:13px;
    outline:none; width:180px; transition:border-color 0.2s;
  }
  .settings-input:focus { border-color:var(--cyan); }
  .settings-save {
    margin:16px 20px; padding:9px 20px; background:var(--cyan); border:none; border-radius:var(--radius-sm);
    color:#0d1117; font-family:var(--font-body); font-size:13px; font-weight:600; cursor:pointer; transition:background 0.2s;
  }
  .settings-save:hover { background:#7dd3fc; }
  .toggle { position:relative; width:40px; height:22px; flex-shrink:0; }
  .toggle input { opacity:0; width:0; height:0; }
  .toggle-slider {
    position:absolute; inset:0; background:var(--bg-4); border:1px solid var(--border-med);
    border-radius:11px; cursor:pointer; transition:background 0.2s;
  }
  .toggle-slider::before {
    content:''; position:absolute; width:16px; height:16px; border-radius:50%;
    background:#fff; left:2px; top:2px; transition:transform 0.2s;
  }
  .toggle input:checked + .toggle-slider { background:var(--cyan); border-color:var(--cyan); }
  .toggle input:checked + .toggle-slider::before { transform:translateX(18px); }

  .uploads-list { background:var(--bg-2); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; }
  .upload-row { display:flex; align-items:center; gap:14px; padding:14px 20px; border-bottom:1px solid var(--border); transition:background 0.15s; }
  .upload-row:last-child { border-bottom:none; }
  .upload-row:hover { background:var(--bg-3); }
  .upload-icon { width:36px; height:36px; background:var(--cyan-dim); border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .upload-info { flex:1; min-width:0; }
  .upload-name { font-size:13px; font-weight:500; color:var(--text-1); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .upload-meta { font-size:11px; color:var(--text-3); font-family:var(--font-mono); margin-top:2px; }
  .upload-badge { font-size:11px; font-family:var(--font-mono); padding:3px 8px; border-radius:4px; }
  .badge-ok  { background:var(--green-dim); color:var(--green); }
  .badge-warn{ background:var(--amber-dim); color:var(--amber); }
  .badge-bad { background:var(--red-dim);   color:var(--red); }

  .empty-uploads { padding:32px; text-align:center; color:var(--text-3); font-size:13px; }

  /* ── SCROLL ANIMATION ───────────────────────────────────────────── */
  .scroll-reveal { opacity:0; transform:translateY(20px); transition:opacity 0.45s ease, transform 0.45s ease; }
  .scroll-reveal.visible { opacity:1; transform:translateY(0); }

  /* ── RESPONSIVE ─────────────────────────────────────────────────── */
  @media (max-width:900px) {
    .cards-row { grid-template-columns:1fr; }
    .analysis-grid { grid-template-columns:1fr; }
    .zone-cards { grid-template-columns:1fr; }
    .insight-flex { flex-direction:column; }
    .home-grid { grid-template-columns:1fr; }
    .wastage-grid { grid-template-columns:1fr; }
    .sidebar { display:none; }
    .topbar { padding:12px 16px; }
    .content { padding:16px; }
  }

  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:var(--bg); }
  ::-webkit-scrollbar-thumb { background:var(--border-med); border-radius:2px; }
`;

/* ── USE SCROLL REVEAL ───────────────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".scroll-reveal");
    const io  = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

/* ── ANIMATED NUMBER ─────────────────────────────────────────────────────── */
function AnimNum({ target, duration = 900 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const num = parseFloat(String(target).replace(/[^0-9.]/g, "")) || 0;
    const isFloat = String(target).includes(".");
    const step = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - prog, 3);
      setVal(isFloat ? (eased * num).toFixed(1) : Math.round(eased * num));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  const suffix = String(target).replace(/[0-9.]/g, "");
  return <>{val}{suffix}</>;
}

/* ── CLOCK ───────────────────────────────────────────────────────────────── */
function Clock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return (
    <span style={{ fontFamily:"var(--font-mono)", fontSize:12, color:"var(--text-3)" }}>
      {t.toLocaleDateString("en-GB")} · {t.toLocaleTimeString("en-GB")}
    </span>
  );
}

/* ── STAT BAR ────────────────────────────────────────────────────────────── */
function StatBar({ label, value, max = 100, color }) {
  const pct = Math.max(Math.min((value / max) * 100, 100), 0);
  return (
    <div className="stat-row">
      <div className="stat-header">
        <span>{label}</span>
        <span style={{ color, fontFamily:"var(--font-mono)" }}>{pct < 1 ? pct.toFixed(2) : pct.toFixed(1)}%</span>
      </div>
      <div className="stat-track">
        <div className="stat-fill" style={{ "--w":`${Math.max(pct,1)}%`, width:`${Math.max(pct,1)}%`, background:color }} />
      </div>
    </div>
  );
}

/* ── METRIC CARD ─────────────────────────────────────────────────────────── */
function MetricCard({ label, value, sub, color, iconBg, icon, delay = 0 }) {
  return (
    <div className="metric-card scroll-reveal" style={{ animationDelay:`${delay}s` }}>
      <div className="metric-card-top">
        <span className="metric-card-label">{label}</span>
        <div className="metric-card-icon" style={{ background:iconBg }}>{icon}</div>
      </div>
      <div className="metric-card-value" style={{ color }}>
        <AnimNum target={value} />
      </div>
      <div className="metric-card-sub">{sub}</div>
    </div>
  );
}

/* ── HOURLY BAR CHART ────────────────────────────────────────────────────── */
function HourlyBarChart({ hourlyData }) {
  if (!hourlyData || Object.keys(hourlyData).length === 0) return null;
  const entries = Object.entries(hourlyData).map(([h, v]) => ({ hour:Number(h), value:Number(v) })).sort((a, b) => a.hour - b.hour);
  const maxVal  = Math.max(...entries.map(e => e.value));
  return (
    <div>
      {entries.map(({ hour, value }) => {
        const pct   = maxVal > 0 ? (value / maxVal) * 100 : 0;
        const color = pct > 85 ? "var(--red)" : pct > 60 ? "var(--amber)" : "var(--cyan)";
        return (
          <div className="hourly-row" key={hour}>
            <div className="hourly-hour">{String(hour).padStart(2,"0")}:00</div>
            <div className="hourly-track">
              <div className="hourly-fill" style={{ "--w":`${Math.max(pct,1)}%`, width:`${Math.max(pct,1)}%`, background:color }} />
            </div>
            <div className="hourly-val">{value.toFixed(3)} kW</div>
          </div>
        );
      })}
    </div>
  );
}

/* ── ZONE HEATMAP ────────────────────────────────────────────────────────── */
function ZoneHeatmap({ heatmapData }) {
  const [zone, setZone] = useState("kitchen");
  if (!heatmapData) return <p style={{ color:"var(--text-3)", fontSize:12 }}>No heatmap data.</p>;
  const days   = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const data   = heatmapData[zone] || [];
  const maxVal = Math.max(...data.flat(), 0.001);
  const configs = {
    kitchen:{ rgb:"56,189,248", activeClass:"active-cyan",  label:"Kitchen" },
    laundry:{ rgb:"251,191,36", activeClass:"active-amber", label:"Laundry" },
    heating:{ rgb:"248,113,113",activeClass:"active-red",   label:"Heating / AC" },
  };
  const cfg = configs[zone];
  const getColor = (val) => {
    const i = val / maxVal;
    return i < 0.05 ? "rgba(33,38,45,0.9)" : `rgba(${cfg.rgb},${(0.12 + i * 0.88).toFixed(2)})`;
  };
  return (
    <div>
      <div className="zone-tabs">
        {Object.entries(configs).map(([k, c]) => (
          <button key={k} className={`zone-tab${zone === k ? " "+c.activeClass : ""}`} onClick={() => setZone(k)}>{c.label}</button>
        ))}
      </div>
      <div className="heatmap-grid">
        <div />
        {days.map(d => <div key={d} className="hm-day-hdr">{d}</div>)}
        {data.map((row, hour) => (
          <Fragment key={hour}>
            <div className="hm-hour">{String(hour).padStart(2,"0")}</div>
            {row.map((val, day) => (
              <div key={day} className="heatmap-cell" style={{ background:getColor(val) }}
                title={`${String(hour).padStart(2,"0")}:00 ${days[day]} — ${val.toFixed(3)} W`} />
            ))}
          </Fragment>
        ))}
      </div>
      <div className="heatmap-legend">
        <span>Low</span>
        <div className="heatmap-legend-bar" style={{ background:`linear-gradient(90deg,rgba(33,38,45,0.9),rgba(${cfg.rgb},1))` }} />
        <span>High · Peak: {maxVal.toFixed(3)} W</span>
      </div>
    </div>
  );
}

/* ── ZONE RATIO CHART (SVG) ──────────────────────────────────────────────── */
function ZoneRatioChart({ series }) {
  if (!series || series.length < 2) return <p style={{ color:"var(--text-3)", fontSize:12 }}>Not enough data.</p>;
  const W=680,H=200,pL=42,pR=16,pT=12,pB=32;
  const w=W-pL-pR, h=H-pT-pB, n=series.length;
  const xOf=(i)=>pL+(i/(n-1))*w;
  const yOf=(v)=>pT+h-(Math.min(v,100)/100)*h;
  const lines=[{ key:"kitchen",color:"var(--cyan)" },{ key:"laundry",color:"var(--amber)" },{ key:"heating",color:"var(--red)" }];
  const pathFor=(key)=>series.map((d,i)=>`${i===0?"M":"L"}${xOf(i).toFixed(1)},${yOf(d[key]).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", display:"block" }}>
      {[0,25,50,75,100].map(v=>(
        <g key={v}>
          <line x1={pL} y1={yOf(v)} x2={pL+w} y2={yOf(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <text x={pL-6} y={yOf(v)+4} textAnchor="end" fill="var(--text-3)" fontSize="9" fontFamily="monospace">{v}%</text>
        </g>
      ))}
      {lines.map(l=><path key={l.key} d={pathFor(l.key)} fill="none" stroke={l.color} strokeWidth="1.5" opacity="0.85" strokeLinejoin="round" />)}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOGIN SCREEN
═══════════════════════════════════════════════════════════════════════════ */
function LoginScreen({ onLogin }) {
  const handleGoogle = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (resp) => {
          const payload = JSON.parse(atob(resp.credential.split(".")[1]));
          onLogin({ name:payload.name, email:payload.email, picture:payload.picture });
        },
      });
      window.google.accounts.id.prompt();
    } else {
      // Dev fallback — mock user
      onLogin({ name:"Demo User", email:"demo@anomax.io", picture:null });
    }
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <div style={{ textAlign:"center" }}>
          <div className="login-logo">AN<span>OM</span>AX</div>
          <div style={{ fontSize:11, color:"var(--text-3)", fontFamily:"var(--font-mono)", marginTop:4 }}>Electricity Anomaly Detection System</div>
        </div>
        <div className="login-tagline">
          Upload electricity datasets, detect anomalies,<br />and get smart usage insights — all in one place.
        </div>
        <div className="login-divider" />
        <button className="google-btn" onClick={handleGoogle}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>
        <p className="login-terms">By continuing, you agree to our Terms of Service.<br />Your data stays on your device.</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOME TAB
═══════════════════════════════════════════════════════════════════════════ */
function HomeTab({ user, uploads, onSettingsSave }) {
  const [displayName, setDisplayName] = useState(user.name);
  const [defaultTab,  setDefaultTab]  = useState("Dashboard");
  const [notifs,      setNotifs]      = useState(true);
  const [saved,       setSaved]       = useState(false);

  useScrollReveal();

  const save = () => {
    onSettingsSave({ displayName, defaultTab, notifs });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="tab-content">
      <div className="section-head scroll-reveal">
        <span className="section-head-label">Home</span>
        <div className="section-head-line" />
      </div>

      <div className="home-grid">
        {/* Left col */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Profile card */}
          <div className="profile-card scroll-reveal">
            <div className="profile-banner" />
            <div className="profile-body">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar">
                  {user.picture ? <img src={user.picture} alt={user.name} /> : user.name[0]}
                </div>
              </div>
              <div className="profile-name">{displayName}</div>
              <div className="profile-email">{user.email}</div>
              <div className="profile-stats">
                <div className="profile-stat">
                  <div className="profile-stat-val">{uploads.length}</div>
                  <div className="profile-stat-label">Uploads</div>
                </div>
                <div className="profile-stat">
                  <div className="profile-stat-val">
                    {uploads.length > 0
                      ? (uploads.reduce((a,u) => a + parseFloat(u.anomalyPct||0), 0) / uploads.length).toFixed(1) + "%"
                      : "—"}
                  </div>
                  <div className="profile-stat-label">Avg anomaly</div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="settings-card scroll-reveal">
            <div className="panel-header">
              <span className="panel-title">Preferences</span>
              <span className="panel-badge">Editable</span>
            </div>
            <div className="settings-row">
              <div>
                <div className="settings-label">Display name</div>
                <div className="settings-desc">Shown in the sidebar</div>
              </div>
              <input className="settings-input" value={displayName} onChange={e => setDisplayName(e.target.value)} />
            </div>
            <div className="settings-row">
              <div>
                <div className="settings-label">Default tab</div>
                <div className="settings-desc">Opens on login</div>
              </div>
              <select className="settings-input" value={defaultTab} onChange={e => setDefaultTab(e.target.value)}
                style={{ appearance:"none", cursor:"pointer" }}>
                {["Dashboard","Insights","Analysis","Submetering"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="settings-row">
              <div>
                <div className="settings-label">Notifications</div>
                <div className="settings-desc">High anomaly alerts</div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={notifs} onChange={e => setNotifs(e.target.checked)} />
                <span className="toggle-slider" />
              </label>
            </div>
            <button className="settings-save" onClick={save}>
              {saved ? "✓ Saved" : "Save changes"}
            </button>
          </div>
        </div>

        {/* Right col — recent uploads */}
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <span style={{ fontSize:14, fontWeight:600, color:"var(--text-1)" }}>Recent uploads</span>
            <span style={{ fontSize:12, color:"var(--text-3)", fontFamily:"var(--font-mono)" }}>{uploads.length} files</span>
          </div>
          <div className="uploads-list scroll-reveal">
            {uploads.length === 0
              ? <div className="empty-uploads">No uploads yet — use the Upload button above to get started.</div>
              : [...uploads].reverse().map((u, i) => {
                  const pct   = parseFloat(u.anomalyPct||0);
                  const cls   = pct > 10 ? "badge-bad" : pct > 5 ? "badge-warn" : "badge-ok";
                  const label = pct > 10 ? "High" : pct > 5 ? "Elevated" : "Normal";
                  return (
                    <div className="upload-row" key={i}>
                      <div className="upload-icon">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--cyan)" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <div className="upload-info">
                        <div className="upload-name">{u.name}</div>
                        <div className="upload-meta">{u.date} · {u.records} records</div>
                      </div>
                      <span className={`upload-badge ${cls}`}>{label} · {u.anomalyPct}%</span>
                    </div>
                  );
                })
            }
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD TAB
═══════════════════════════════════════════════════════════════════════════ */
function DashboardTab({ result }) {
  useScrollReveal();
  const pct = parseFloat(result.anomaly_percentage);
  return (
    <div className="tab-content">
      <div className="section-head scroll-reveal">
        <span className="section-head-label">Overview</span>
        <div className="section-head-line" />
      </div>

      <div className="cards-row">
        <MetricCard
          label="Raw Records" value={(result.raw_record_count ?? result.total_data_points).toLocaleString()}
          sub="Total rows from CSV" color="var(--cyan)"
          iconBg="var(--cyan-dim)" delay={0}
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2"><path d="M9 17H7A5 5 0 017 7h2M15 7h2a5 5 0 010 10h-2M8 12h8"/></svg>}
        />
        <MetricCard
          label="Total Anomalies" value={result.total_anomalies}
          sub="Detected events" color="var(--red)"
          iconBg="var(--red-dim)" delay={0.08}
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
        />
        <MetricCard
          label="Anomaly Rate" value={result.anomaly_percentage + "%"}
          sub="Of total data stream" color={pct > 10 ? "var(--red)" : pct > 5 ? "var(--amber)" : "var(--green)"}
          iconBg={pct > 10 ? "var(--red-dim)" : pct > 5 ? "var(--amber-dim)" : "var(--green-dim)"} delay={0.16}
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={pct > 10 ? "var(--red)" : pct > 5 ? "var(--amber)" : "var(--green)"} strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
        />
      </div>

      <div className="panel scroll-reveal">
        <div className="panel-header">
          <span className="panel-title">System Insight</span>
          <span className="panel-badge">Auto-analysis</span>
        </div>
        <div className="panel-body">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
            <div style={{ fontSize:14, lineHeight:1.7, color:"var(--text-2)" }}>
              System loaded <strong style={{ color:"var(--text-1)" }}>{(result.raw_record_count ?? result.total_data_points).toLocaleString()}</strong> raw
              records, resampled to <strong style={{ color:"var(--text-1)" }}>{result.total_data_points.toLocaleString()}</strong> hourly
              points. <strong style={{ color:"var(--text-1)" }}>{result.total_anomalies}</strong> anomalies
              flagged ({result.anomaly_percentage}%).{" "}
              {pct < 5 ? "Usage appears generally stable." : "Elevated anomaly rate — review device activity."}
            </div>
            <div>
              <StatBar label="Normal readings" value={100 - pct} max={100} color="var(--green)" />
              <StatBar label="Anomaly events"  value={pct}       max={100} color="var(--red)" />
              <StatBar label="Data integrity"  value={100 - pct} max={100} color="var(--cyan)" />
            </div>
          </div>
        </div>
      </div>

      <div className="panel scroll-reveal">
        <div className="panel-header">
          <span className="panel-title">Usage Pattern</span>
          <span className="panel-badge">Visual</span>
        </div>
        <div className="panel-body">
          <img src={result.anomaly_plot} className="graph-img" alt="Anomaly graph" />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   INSIGHTS TAB
═══════════════════════════════════════════════════════════════════════════ */
function InsightsTab({ result }) {
  useScrollReveal();
  return (
    <div className="tab-content">
      <div className="section-head scroll-reveal"><span className="section-head-label">Insights</span><div className="section-head-line" /></div>

      <div className="panel scroll-reveal">
        <div className="panel-header"><span className="panel-title">Peak Usage Analysis</span><span className="panel-badge">Smart insight</span></div>
        <div className="panel-body insight-flex">
          <div className="insight-graph"><img src={result.hourly_plot} className="graph-img" alt="Hourly usage" /></div>
          <div className="insight-text-col">
            <p style={{ marginBottom:12 }}>{result.smart_summary}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:6, fontFamily:"var(--font-mono)", fontSize:12, color:"var(--text-3)" }}>
              <span>Peak hour: <strong style={{ color:"var(--text-1)" }}>{result.peak_hour}:00</strong></span>
              <span>Lowest hour: <strong style={{ color:"var(--text-1)" }}>{result.low_hour}:00</strong></span>
              <span>Gap: <strong style={{ color:"var(--text-1)" }}>{result.usage_gap} kW</strong></span>
            </div>
            <p style={{ marginTop:12, fontSize:13, opacity:0.7 }}>{result.peak_reason}</p>
          </div>
        </div>
      </div>

      <div className="panel scroll-reveal">
        <div className="panel-header"><span className="panel-title">All 24-Hour Breakdown</span><span className="panel-badge">kW values</span></div>
        <div className="panel-body"><HourlyBarChart hourlyData={result.hourly_avg} /></div>
      </div>

      <div className="panel scroll-reveal">
        <div className="panel-header"><span className="panel-title">Daily Trend</span><span className="panel-badge">Time series</span></div>
        <div className="panel-body insight-flex">
          <div className="insight-graph"><img src={result.daily_plot} className="graph-img" alt="Daily trend" /></div>
          <div className="insight-text-col"><p>{result.daily_explanation}</p></div>
        </div>
      </div>

      <div className="panel scroll-reveal">
        <div className="panel-header"><span className="panel-title">Monthly Trend</span><span className="panel-badge">Seasonal</span></div>
        <div className="panel-body insight-flex">
          <div className="insight-graph"><img src={result.monthly_plot} className="graph-img" alt="Monthly trend" /></div>
          <div className="insight-text-col"><p>{result.monthly_explanation}</p></div>
        </div>
      </div>

      <div className="panel scroll-reveal">
        <div className="panel-header"><span className="panel-title">Night vs Day Usage</span><span className="panel-badge">Waste analysis</span></div>
        <div className="panel-body">
          <p style={{ fontSize:14, color:"var(--text-2)", marginBottom:16 }}>
            Night usage is <strong style={{ color:"var(--text-1)" }}>{result.waste_score}%</strong> of daytime.{" "}
            {result.waste_score > 50 ? "High night consumption — possible idle appliance waste." : "Well-balanced day/night usage."}
          </p>
          <StatBar label="Night vs Day" value={Math.min(result.waste_score, 100)} max={100} color={result.waste_score > 50 ? "var(--red)" : "var(--green)"} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANALYSIS TAB
═══════════════════════════════════════════════════════════════════════════ */
function AnalysisTab({ result }) {
  useScrollReveal();
  const effColor = result.efficiency_score > 70 ? "var(--green)" : result.efficiency_score > 40 ? "var(--amber)" : "var(--red)";
  return (
    <div className="tab-content">
      <div className="section-head scroll-reveal"><span className="section-head-label">Deep Analysis</span><div className="section-head-line" /></div>

      <div className="analysis-grid">
        <div className="analysis-card scroll-reveal" style={{ "--card-top":effColor }}>
          <div className="analysis-card-label">Efficiency Score</div>
          <div className="analysis-card-value" style={{ color:effColor }}><AnimNum target={result.efficiency_score} />%</div>
          <div className="analysis-card-desc">{result.efficiency_msg}</div>
        </div>
        <div className="analysis-card scroll-reveal" style={{ "--card-top":"var(--amber)" }}>
          <div className="analysis-card-label">High Usage Events</div>
          <div className="analysis-card-value" style={{ color:"var(--amber)" }}><AnimNum target={result.high_usage_count} /></div>
          <div className="analysis-card-desc">Readings above mean + 1 std deviation</div>
        </div>
        <div className="analysis-card scroll-reveal" style={{ "--card-top":result.waste_score > 50 ? "var(--red)" : "var(--green)" }}>
          <div className="analysis-card-label">Night Waste Score</div>
          <div className="analysis-card-value" style={{ color:result.waste_score > 50 ? "var(--red)" : "var(--green)" }}><AnimNum target={result.waste_score} />%</div>
          <div className="analysis-card-desc">Night usage as % of daytime</div>
        </div>
      </div>

      <div className="panel scroll-reveal">
        <div className="panel-header"><span className="panel-title">Efficiency Breakdown</span><span className="panel-badge">Scoring</span></div>
        <div className="panel-body">
          <StatBar label="Energy efficiency" value={result.efficiency_score} max={100} color={effColor} />
          <StatBar label="Waste score"        value={Math.min(result.waste_score,100)} max={100} color={result.waste_score > 50 ? "var(--red)" : "var(--green)"} />
          <StatBar label="Anomaly rate"       value={parseFloat(result.anomaly_percentage)} max={100} color="var(--red)" />
        </div>
      </div>

      <div className="panel scroll-reveal">
        <div className="panel-header"><span className="panel-title">Smart Recommendation</span><span className="panel-badge">AI engine</span></div>
        <div className="panel-body">
          <div className="rec-box"><strong>Recommendation: </strong>{result.recommendation}</div>
        </div>
      </div>

      {result.wastage && (
        <div className="panel scroll-reveal">
          <div className="panel-header"><span className="panel-title">Wastage Analysis</span><span className="panel-badge">Zone detail</span></div>
          <div className="panel-body">
            <div className="wastage-grid">
              <div className="wastage-item">
                <div className="wastage-label">Peak waste hour</div>
                <div className="wastage-value">{result.wastage.peak_waste_hour}:00</div>
                <div className="wastage-desc">Hour with highest abnormal load</div>
              </div>
              <div className="wastage-item">
                <div className="wastage-label">Main source</div>
                <div className="wastage-value" style={{ fontSize:18 }}>{result.wastage.main_source}</div>
                <div className="wastage-desc">Zone contributing most to high-usage events</div>
              </div>
              <div className="wastage-item">
                <div className="wastage-label">Summary</div>
                <div className="wastage-desc" style={{ marginTop:6, fontSize:13 }}>{result.wastage.message}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {result.anomaly_hour_distribution && Object.keys(result.anomaly_hour_distribution).length > 0 && (
        <div className="panel scroll-reveal">
          <div className="panel-header"><span className="panel-title">Anomaly Hour Distribution</span><span className="panel-badge">Pattern</span></div>
          <div className="panel-body">
            {Object.entries(result.anomaly_hour_distribution).sort((a,b) => Number(a[0])-Number(b[0])).map(([h,c]) => (
              <StatBar key={h} label={`${String(h).padStart(2,"0")}:00`} value={c}
                max={Math.max(...Object.values(result.anomaly_hour_distribution))} color="var(--red)" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUBMETERING TAB
═══════════════════════════════════════════════════════════════════════════ */
function SubmeteringTab({ result }) {
  useScrollReveal();
  const zones = [
    { label:"Kitchen",    totKey:"sub_kitchen", pctKey:"kitchen", color:"var(--cyan)",  top:"var(--cyan)" },
    { label:"Laundry",    totKey:"sub_laundry", pctKey:"laundry", color:"var(--amber)", top:"var(--amber)" },
    { label:"Heating/AC", totKey:"sub_heating", pctKey:"heating", color:"var(--red)",   top:"var(--red)" },
  ];
  return (
    <div className="tab-content">
      <div className="section-head scroll-reveal"><span className="section-head-label">Submetering</span><div className="section-head-line" /></div>

      <div className="zone-cards">
        {zones.map(z => (
          <div key={z.label} className="zone-card scroll-reveal" style={{ "--zone-top":z.top }}>
            <div className="zone-card-label">{z.label}</div>
            <div className="zone-card-value" style={{ color:z.color }}>
              {result[z.totKey] !== undefined ? Number(result[z.totKey]).toLocaleString(undefined,{ maximumFractionDigits:1 }) : "—"}
            </div>
            <div className="zone-card-sub">Total energy units</div>
          </div>
        ))}
      </div>

      <div className="panel scroll-reveal">
        <div className="panel-header"><span className="panel-title">Zone Usage Share</span><span className="panel-badge">Distribution</span></div>
        <div className="panel-body insight-flex">
          <div className="insight-graph"><img src={result.pie_chart} className="graph-img" alt="Pie chart" /></div>
          <div className="insight-text-col">
            {result.sub_pct && zones.map(z => (
              <StatBar key={z.label} label={z.label} value={result.sub_pct[z.pctKey]||0} max={100} color={z.color} />
            ))}
            {result.sub_insight && <p style={{ marginTop:14, fontSize:13, opacity:0.7 }}>{result.sub_insight}</p>}
          </div>
        </div>
      </div>

      <div className="panel scroll-reveal">
        <div className="panel-header"><span className="panel-title">Sub Meter Correlation</span><span className="panel-badge">Heatmap</span></div>
        <div className="panel-body insight-flex">
          <div className="insight-graph"><img src={result.correlation_plot} className="graph-img" alt="Correlation" /></div>
          <div className="insight-text-col">
            <p>The correlation heatmap shows how zones relate in timing. High values mean two zones tend to be active simultaneously.</p>
            {result.correlation_insight && <p style={{ marginTop:12, fontSize:13, opacity:0.7 }}>{result.correlation_insight}</p>}
          </div>
        </div>
      </div>

      {result.zone_ratio_series && (
        <div className="panel scroll-reveal">
          <div className="panel-header"><span className="panel-title">Zone Ratio Over Time</span><span className="panel-badge">Trend</span></div>
          <div className="panel-body"><ZoneRatioChart series={result.zone_ratio_series} /></div>
        </div>
      )}

      {result.heatmap_data && (
        <div className="panel scroll-reveal">
          <div className="panel-header"><span className="panel-title">Zone Activity Heatmap</span><span className="panel-badge">24 × 7</span></div>
          <div className="panel-body"><ZoneHeatmap heatmapData={result.heatmap_data} /></div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════════════════ */

const NAV = [
  { label:"Home",        icon:<svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg> },
  { label:"Dashboard",   icon:<svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { label:"Insights",    icon:<svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { label:"Analysis",    icon:<svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
  { label:"Submetering", icon:<svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5"/></svg> },
];

const PAGE_LABELS = {
  Home:"Home", Dashboard:"Energy Dashboard", Insights:"Usage Insights", Analysis:"Deep Analysis", Submetering:"Submetering"
};

export default function App() {
  const [user,      setUser]      = useState(() => { try { return JSON.parse(localStorage.getItem("anomax_user")||"null"); } catch { return null; } });
  const [file,      setFile]      = useState(null);
  const [result,    setResult]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [activeNav, setActiveNav] = useState("Home");
  const [uploads,   setUploads]   = useState(() => { try { return JSON.parse(localStorage.getItem("anomax_uploads")||"[]"); } catch { return []; } });

  // Load Google Identity script
  useEffect(() => {
    if (!document.getElementById("google-gsi")) {
      const s = document.createElement("script");
      s.id = "google-gsi"; s.src = "https://accounts.google.com/gsi/client"; s.async = true;
      document.head.appendChild(s);
    }
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem("anomax_user", JSON.stringify(u));
  };

  const handleSignOut = () => {
    setUser(null); setResult(null); setActiveNav("Home");
    localStorage.removeItem("anomax_user");
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");
    setLoading(true); setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res  = await fetch("http://127.0.0.1:8000/upload", { method:"POST", body:formData });
      const data = await res.json();
      setResult(data);
      // Save to history
      const entry = {
        name:       file.name,
        date:       new Date().toLocaleDateString("en-GB"),
        records:    (data.raw_record_count ?? data.total_data_points ?? 0).toLocaleString(),
        anomalyPct: data.anomaly_percentage,
      };
      const updated = [...uploads, entry];
      setUploads(updated);
      localStorage.setItem("anomax_uploads", JSON.stringify(updated));
      setActiveNav("Dashboard");
    } catch {
      alert("Upload failed. Is the backend running on port 8000?");
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSave = ({ displayName }) => {
    const updated = { ...user, name:displayName };
    setUser(updated);
    localStorage.setItem("anomax_user", JSON.stringify(updated));
  };

  if (!user) return (
    <>
      <style>{CSS}</style>
      <LoginScreen onLogin={handleLogin} />
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="app-root">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="sidebar-logo">AN<span>OM</span>AX</div>
            <div className="sidebar-sub">Energy Intelligence</div>
          </div>

          <div className="sidebar-user" onClick={() => setActiveNav("Home")}>
            <div className="user-avatar">
              {user.picture ? <img src={user.picture} alt={user.name} /> : user.name?.[0] ?? "U"}
            </div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
            </div>
            <svg className="user-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>

          <nav className="nav-section">
            <div className="nav-label">Navigation</div>
            {NAV.map(item => (
              <div key={item.label}
                className={`nav-item${activeNav === item.label ? " active" : ""}`}
                onClick={() => setActiveNav(item.label)}>
                {item.icon}
                {item.label}
              </div>
            ))}
          </nav>

          <div className="sidebar-footer">
            <button className="signout-btn" onClick={handleSignOut}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign out
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* TOPBAR */}
          <div className="topbar">
            <div className="topbar-left">
              <div className="page-label">ANOMAX · MONITORING</div>
              <div className="page-title">{PAGE_LABELS[activeNav]}</div>
            </div>
            <div className="topbar-right">
              <Clock />
              <div className="file-zone">
                <label className="file-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  {file ? (file.name.length > 22 ? file.name.slice(0,22)+"…" : file.name) : "Select file"}
                  <input type="file" onChange={e => setFile(e.target.files[0])} />
                </label>
                <button onClick={handleUpload} disabled={loading} className="upload-btn">
                  {loading ? "···" : "Upload"}
                </button>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="content">
            {loading && (
              <div className="loader-wrap">
                <div className="loader-ring" />
                <div className="loader-text">Processing data stream…</div>
              </div>
            )}

            {!loading && activeNav === "Home" && (
              <HomeTab user={user} uploads={uploads} onSettingsSave={handleSettingsSave} />
            )}
            {!loading && result && activeNav === "Dashboard"   && <DashboardTab   result={result} />}
            {!loading && result && activeNav === "Insights"    && <InsightsTab    result={result} />}
            {!loading && result && activeNav === "Analysis"    && <AnalysisTab    result={result} />}
            {!loading && result && activeNav === "Submetering" && <SubmeteringTab result={result} />}

            {!loading && !result && activeNav !== "Home" && (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                  </svg>
                </div>
                <div className="empty-title">No data loaded</div>
                <div className="empty-sub">Upload a CSV dataset using the button above<br />to begin anomaly detection analysis.</div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}