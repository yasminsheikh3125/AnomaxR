import { useState, useEffect, useRef, useCallback, Fragment } from "react";

const GOOGLE_CLIENT_ID = "756646026903-3ojj3rscc89a2201hq36njlmql0ls9a8.apps.googleusercontent.com";

/* ═══════════════════════════════════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Bebas+Neue&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{width:100%;height:100%;margin:0;padding:0}

/* ── DARK THEME (default) ──────────────────────────── */
:root {
  --void:       #100b04;
  --base:       #1a1208;
  --surface:    #231a0e;
  --surface2:   #2c2010;
  --surface3:   #362814;
  --border:     rgba(247,197,140,0.08);
  --border2:    rgba(247,197,140,0.14);
  --border3:    rgba(247,197,140,0.22);

  --orange:     #f97316;
  --orange2:    #fb923c;
  --orange-dim: rgba(249,115,22,0.12);
  --orange-glow:rgba(249,115,22,0.32);
  --orange-mid: rgba(249,115,22,0.18);

  --cream:      #fdf6e3;
  --cream2:     #f5e6c8;
  --cream3:     #e8d0a0;

  --blue:       #38bdf8;
  --blue-dim:   rgba(56,189,248,0.1);
  --blue-glow:  rgba(56,189,248,0.25);

  --green:      #10b981;
  --green-dim:  rgba(16,185,129,0.1);
  --red:        #ef4444;
  --red-dim:    rgba(239,68,68,0.1);
  --violet:     #a78bfa;
  --violet-dim: rgba(167,139,250,0.1);

  --t1: #fdf6e3;
  --t2: #d4b896;
  --t3: #8a6e52;
  --t4: #3d2a18;

  --font:    'Outfit', sans-serif;
  --mono:    'JetBrains Mono', monospace;
  --display: 'Bebas Neue', sans-serif;

  --r: 12px;
  --r2: 8px;
  --r3: 6px;

  --sidebar-w: 280px;
}

/* ── LIGHT THEME ───────────────────────────────────── */
[data-theme="light"] {
  --void:       #f0e8d8;
  --base:       #fef9f0;
  --surface:    #fff8ed;
  --surface2:   #fff3e0;
  --surface3:   #fde8c8;
  --border:     rgba(160,100,40,0.12);
  --border2:    rgba(160,100,40,0.18);
  --border3:    rgba(160,100,40,0.28);

  --orange-dim: rgba(249,115,22,0.1);
  --orange-glow:rgba(249,115,22,0.28);
  --orange-mid: rgba(249,115,22,0.16);

  --blue-dim:   rgba(56,189,248,0.1);
  --blue-glow:  rgba(56,189,248,0.2);
  --green-dim:  rgba(16,185,129,0.1);
  --red-dim:    rgba(239,68,68,0.08);
  --violet-dim: rgba(167,139,250,0.1);

  --t1: #2c1a08;
  --t2: #5a3a1c;
  --t3: #9a6c44;
  --t4: #e8d4b4;
}

body { background:var(--base); font-family:var(--font); color:var(--t1); overflow-x:hidden; transition:background 0.35s, color 0.35s; }

::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--surface3);border-radius:2px}

@keyframes fadeUp    {from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn    {from{opacity:0}to{opacity:1}}
@keyframes slideLeft {from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn   {from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
@keyframes spin      {to{transform:rotate(360deg)}}
@keyframes pulse     {0%,100%{opacity:1}50%{opacity:0.4}}
@keyframes glow      {0%,100%{box-shadow:0 0 20px var(--orange-glow)}50%{box-shadow:0 0 40px var(--orange-glow),0 0 80px rgba(249,115,22,0.15)}}
@keyframes meshMove  {0%{transform:translate(0,0) rotate(0deg)}33%{transform:translate(-30px,20px) rotate(120deg)}66%{transform:translate(20px,-15px) rotate(240deg)}100%{transform:translate(0,0) rotate(360deg)}}
@keyframes meshMove2 {0%{transform:translate(0,0) rotate(0deg)}33%{transform:translate(40px,-20px) rotate(-120deg)}66%{transform:translate(-15px,30px) rotate(-240deg)}100%{transform:translate(0,0) rotate(-360deg)}}
@keyframes float     {0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes barGrow   {from{width:0}to{width:var(--w)}}
@keyframes dash      {to{stroke-dashoffset:0}}
@keyframes dropBounce{0%{transform:translateY(-20px);opacity:0}60%{transform:translateY(4px)}100%{transform:translateY(0);opacity:1}}
@keyframes tabIn     {from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
@keyframes boltFlash {0%,90%,100%{opacity:0}95%{opacity:1}}
@keyframes themeFlip {0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(180deg) scale(0.6)}100%{transform:rotate(360deg) scale(1)}}

/* ══ MESH BG ══════════════════════════════════════════ */
.mesh-bg {
  position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;
  background: radial-gradient(ellipse 120% 80% at 15% 20%, rgba(249,115,22,0.05) 0%, transparent 60%),
              radial-gradient(ellipse 80% 100% at 85% 80%, rgba(253,246,227,0.02) 0%, transparent 60%),
              var(--base);
  transition: background 0.35s;
}
[data-theme="light"] .mesh-bg {
  background: radial-gradient(ellipse 120% 80% at 15% 20%, rgba(249,115,22,0.07) 0%, transparent 60%),
              radial-gradient(ellipse 80% 100% at 85% 80%, rgba(56,189,248,0.04) 0%, transparent 60%),
              var(--base);
}
.mesh-orb { position:absolute;border-radius:50%;filter:blur(80px);opacity:0.6; }
.mesh-orb-1{width:600px;height:600px;background:radial-gradient(circle,rgba(249,115,22,0.1),transparent 70%);top:-200px;left:-100px;animation:meshMove 20s ease-in-out infinite;}
.mesh-orb-2{width:500px;height:500px;background:radial-gradient(circle,rgba(253,186,116,0.07),transparent 70%);bottom:-150px;right:-100px;animation:meshMove2 25s ease-in-out infinite;}
.mesh-orb-3{width:300px;height:300px;background:radial-gradient(circle,rgba(167,139,250,0.05),transparent 70%);top:40%;left:50%;animation:meshMove 18s ease-in-out infinite reverse;}
.mesh-grid {
  position:absolute;inset:0;
  background-image:linear-gradient(rgba(249,115,22,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.025) 1px,transparent 1px);
  background-size:48px 48px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent);
}
[data-theme="light"] .mesh-grid {
  background-image:linear-gradient(rgba(160,100,40,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(160,100,40,0.06) 1px,transparent 1px);
}

/* ══ APP SHELL ════════════════════════════════════════ */
.app {display:flex;min-height:100vh;position:relative;z-index:1}

/* ══ SIDEBAR ══════════════════════════════════════════ */
.sidebar {
  width:var(--sidebar-w);flex-shrink:0;
  background:rgba(26,18,8,0.96);
  border-right:1px solid var(--border);
  display:flex;flex-direction:column;
  position:sticky;top:0;height:100vh;
  backdrop-filter:blur(24px);
  animation:slideLeft 0.5s cubic-bezier(0.22,1,0.36,1) both;
  z-index:50;
  transition:background 0.35s,border-color 0.35s;
}
[data-theme="light"] .sidebar {
  background:rgba(255,248,237,0.97);
}
.sidebar::after{content:'';position:absolute;right:0;top:20%;bottom:20%;width:1px;background:linear-gradient(180deg,transparent,var(--orange-glow),transparent);opacity:0.4;}

.sb-logo {padding:28px 24px 20px;border-bottom:1px solid var(--border);}
.sb-logo-mark {font-family:var(--display);font-size:34px;letter-spacing:2px;color:var(--t1);display:flex;align-items:center;gap:2px;line-height:1;}
.sb-logo-mark .hi{color:var(--orange);text-shadow:0 0 20px var(--orange-glow);}
.sb-tagline{font-size:10px;color:var(--t3);font-family:var(--mono);letter-spacing:1.5px;margin-top:4px;text-transform:uppercase;}

.sb-user {
  margin:12px 16px;padding:12px 14px;
  background:var(--surface);border:1px solid var(--border2);border-radius:var(--r2);
  display:flex;align-items:center;gap:10px;cursor:pointer;
  transition:all 0.2s;position:relative;overflow:hidden;
}
.sb-user::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--orange-dim),transparent);opacity:0;transition:opacity 0.2s;}
.sb-user:hover::before{opacity:1;}
.sb-user:hover{border-color:var(--orange-glow);}
.sb-avatar {
  width:38px;height:38px;border-radius:50%;flex-shrink:0;
  background:linear-gradient(135deg,var(--orange),#fbbf24);
  display:flex;align-items:center;justify-content:center;
  font-weight:700;font-size:15px;color:#fff;overflow:hidden;
  box-shadow:0 0 12px var(--orange-glow);
}
.sb-avatar img{width:100%;height:100%;object-fit:cover;}
.sb-uname{font-size:13px;font-weight:600;color:var(--t1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.sb-uemail{font-size:10px;color:var(--t3);font-family:var(--mono);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px;}

.sb-nav {flex:1;padding:8px 12px;overflow-y:auto;}
.sb-nav-label{font-size:9px;font-weight:700;color:var(--t3);letter-spacing:2px;text-transform:uppercase;padding:10px 10px 6px;}
.sb-item {
  display:flex;align-items:center;gap:10px;padding:10px 12px;
  border-radius:var(--r2);color:var(--t3);font-size:13px;font-weight:500;
  cursor:pointer;transition:all 0.2s;margin-bottom:1px;position:relative;overflow:hidden;
}
.sb-item svg{width:16px;height:16px;flex-shrink:0;transition:all 0.2s;}
.sb-item:hover{background:var(--surface2);color:var(--t1);}
.sb-item.active{background:var(--orange-dim);color:var(--orange);border:1px solid rgba(249,115,22,0.22);}
.sb-item.active svg{filter:drop-shadow(0 0 4px var(--orange));}
.sb-item.active::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:2px;background:var(--orange);border-radius:0 2px 2px 0;box-shadow:0 0 8px var(--orange);}

.sb-footer{padding:14px 12px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:8px;}
.sb-footer-row{display:flex;gap:8px;}
.sb-signout{
  flex:1;padding:9px 14px;background:transparent;border:1px solid var(--border2);
  border-radius:var(--r2);color:var(--t3);font-family:var(--font);font-size:12px;
  cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:8px;justify-content:center;
}
.sb-signout:hover{background:var(--red-dim);border-color:var(--red);color:var(--red);}

.theme-toggle {
  width:40px;height:40px;border-radius:var(--r2);
  background:transparent;border:1px solid var(--border2);
  color:var(--t3);cursor:pointer;transition:all 0.2s;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
}
.theme-toggle:hover{background:var(--orange-dim);border-color:var(--orange-glow);color:var(--orange);}
.theme-toggle svg{transition:transform 0.5s cubic-bezier(0.22,1,0.36,1);}
.theme-toggle:hover svg{transform:rotate(20deg);}

/* ══ MAIN ═════════════════════════════════════════════ */
.main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:auto;}

/* ══ TOPBAR ═══════════════════════════════════════════ */
.topbar {
  display:flex;align-items:center;justify-content:space-between;
  padding:0 36px;height:60px;border-bottom:1px solid var(--border);
  background:rgba(26,18,8,0.85);backdrop-filter:blur(20px);
  position:sticky;top:0;z-index:40;transition:background 0.35s;
}
[data-theme="light"] .topbar{background:rgba(254,249,240,0.9);}
.topbar-left{display:flex;flex-direction:column;gap:1px;}
.topbar-eyebrow{font-size:9px;font-family:var(--mono);color:var(--t3);letter-spacing:2px;text-transform:uppercase;}
.topbar-title{font-family:var(--display);font-size:20px;letter-spacing:1.5px;color:var(--t1);}
.topbar-right{display:flex;align-items:center;gap:12px;}
.topbar-pill{
  padding:6px 14px;background:var(--surface);border:1px solid var(--border2);
  border-radius:20px;font-size:11px;font-family:var(--mono);color:var(--t3);
  display:flex;align-items:center;gap:6px;
}
.topbar-dot{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);animation:pulse 2s ease infinite;}

/* ══ CONTENT ══════════════════════════════════════════ */
.content{padding:32px 36px;flex:1;min-height:0;}
.tab-page{animation:tabIn 0.3s cubic-bezier(0.22,1,0.36,1) both;}

/* ══ SECTION HEADER ═══════════════════════════════════ */
.sec-head{display:flex;align-items:center;gap:14px;margin-bottom:24px;}
.sec-head-title{font-family:var(--display);font-size:22px;letter-spacing:1px;color:var(--t1);white-space:nowrap;}
.sec-head-line{flex:1;height:1px;background:linear-gradient(90deg,var(--border2),transparent);}
.sec-head-badge{font-size:9px;font-family:var(--mono);color:var(--orange);background:var(--orange-dim);border:1px solid rgba(249,115,22,0.2);padding:3px 8px;border-radius:4px;white-space:nowrap;}

/* ══ CARDS ROW ════════════════════════════════════════ */
.cards-row{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:24px;}

/* ══ METRIC CARD ══════════════════════════════════════ */
.metric-card {
  background:var(--surface);border:1px solid var(--border);border-radius:var(--r);
  padding:24px;position:relative;overflow:hidden;cursor:default;
  transition:transform 0.3s cubic-bezier(0.22,1,0.36,1),border-color 0.3s,box-shadow 0.3s,background 0.35s;
  animation:fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
}
.metric-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--c-dim,var(--orange-dim)),transparent 60%);pointer-events:none;}
.metric-card:hover{transform:translateY(-4px) scale(1.01);border-color:var(--c,var(--orange));box-shadow:0 16px 40px rgba(0,0,0,0.2),0 0 30px var(--c-glow,var(--orange-glow));}
.mc-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
.mc-label{font-size:11px;font-weight:600;color:var(--t3);letter-spacing:0.5px;text-transform:uppercase;}
.mc-icon{width:36px;height:36px;border-radius:var(--r2);display:flex;align-items:center;justify-content:center;background:var(--c-dim,var(--orange-dim));border:1px solid var(--c-glow,var(--orange-glow));}
.mc-value{font-family:var(--display);font-size:52px;line-height:1;color:var(--c,var(--orange));letter-spacing:1px;text-shadow:0 0 30px var(--c-glow,var(--orange-glow));}
.mc-sub{font-size:11px;color:var(--t3);font-family:var(--mono);margin-top:8px;letter-spacing:0.5px;}
.mc-bar{height:2px;background:var(--surface3);border-radius:1px;margin-top:16px;overflow:hidden;}
.mc-bar-fill{height:100%;border-radius:1px;background:linear-gradient(90deg,var(--c,var(--orange)),var(--c2,#fbbf24));animation:barGrow 1.2s cubic-bezier(0.22,1,0.36,1) both;}

/* ══ PANEL ════════════════════════════════════════════ */
.panel {
  background:var(--surface);border:1px solid var(--border);border-radius:var(--r);
  margin-bottom:16px;overflow:hidden;
  animation:fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
  transition:background 0.35s,border-color 0.35s;
}
.panel-head {
  display:flex;align-items:center;justify-content:space-between;
  padding:14px 20px;border-bottom:1px solid var(--border);
  background:linear-gradient(90deg,rgba(249,115,22,0.04),transparent);
}
.panel-title{font-size:13px;font-weight:600;color:var(--t1);display:flex;align-items:center;gap:8px;}
.panel-title-dot{width:6px;height:6px;border-radius:50%;background:var(--orange);box-shadow:0 0 8px var(--orange);}
.panel-badge{font-size:9px;font-family:var(--mono);color:var(--t3);background:var(--surface3);padding:3px 8px;border-radius:4px;border:1px solid var(--border);}
.panel-body{padding:20px;}

/* ══ STAT BAR ═════════════════════════════════════════ */
.stat-row{margin-bottom:14px;}
.stat-header{display:flex;justify-content:space-between;font-size:11px;margin-bottom:6px;}
.stat-header-label{color:var(--t2);font-weight:500;}
.stat-header-val{color:var(--c,var(--orange));font-family:var(--mono);}
.stat-track{height:4px;background:var(--surface3);border-radius:2px;overflow:hidden;position:relative;}
.stat-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--c,var(--orange)),var(--c2,#fb923c));animation:barGrow 1s cubic-bezier(0.22,1,0.36,1) both;box-shadow:0 0 8px var(--c-glow,var(--orange-glow));}

/* ══ GRAPH IMG ════════════════════════════════════════ */
.graph-img{width:100%;max-height:260px;object-fit:contain;border-radius:var(--r2);display:block;background:transparent;}

/* ══ INSIGHT FLEX ═════════════════════════════════════ */
.insight-flex{display:flex;gap:20px;align-items:flex-start;}
.insight-graph{flex:1.4;}
.insight-text{flex:1;font-size:13px;line-height:1.8;color:var(--t2);}
.insight-text strong{color:var(--t1);}
.insight-kv{display:flex;flex-direction:column;gap:6px;margin-top:12px;}
.insight-kv-row{display:flex;justify-content:space-between;font-family:var(--mono);font-size:11px;padding:6px 10px;background:var(--surface2);border-radius:var(--r3);}
.insight-kv-key{color:var(--t3);}
.insight-kv-val{color:var(--t1);font-weight:500;}

/* ══ HOURLY BARS ══════════════════════════════════════ */
.hourly-row{display:flex;align-items:center;gap:10px;margin-bottom:5px;}
.hourly-h{font-family:var(--mono);font-size:10px;color:var(--t3);width:38px;text-align:right;flex-shrink:0;}
.hourly-track{flex:1;height:5px;background:var(--surface3);border-radius:3px;overflow:hidden;}
.hourly-fill{height:100%;border-radius:3px;animation:barGrow 0.6s cubic-bezier(0.22,1,0.36,1) both;}
.hourly-val{font-family:var(--mono);font-size:10px;color:var(--t2);width:68px;flex-shrink:0;}

/* ══ HEATMAP ══════════════════════════════════════════ */
.zone-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;}
.zone-tab{padding:5px 14px;border:1px solid var(--border);border-radius:20px;background:transparent;color:var(--t3);font-size:11px;font-family:var(--mono);cursor:pointer;transition:all 0.2s;text-transform:capitalize;}
.zone-tab:hover{border-color:var(--border2);color:var(--t2);}
.zone-tab.zt-orange{background:var(--orange-dim);border-color:rgba(249,115,22,0.3);color:var(--orange);}
.zone-tab.zt-blue  {background:var(--blue-dim);  border-color:rgba(56,189,248,0.3); color:var(--blue);}
.zone-tab.zt-red   {background:var(--red-dim);   border-color:rgba(239,68,68,0.3);  color:var(--red);}
.zone-tab.zt-green {background:var(--green-dim); border-color:rgba(16,185,129,0.3); color:var(--green);}
.zone-tab.zt-violet{background:var(--violet-dim);border-color:rgba(167,139,250,0.3);color:var(--violet);}

.hm-wrap{overflow-x:auto;}
.hm-grid{display:grid;grid-template-columns:32px repeat(7,1fr);gap:2px;min-width:320px;}
.hm-cell{height:15px;border-radius:2px;cursor:default;transition:transform 0.1s;}
.hm-cell:hover{transform:scale(1.2);z-index:1;}
.hm-day{font-family:var(--mono);font-size:8px;color:var(--t3);text-align:center;padding-bottom:4px;}
.hm-hour{font-family:var(--mono);font-size:8px;color:var(--t3);text-align:right;padding-right:4px;line-height:15px;}
.hm-legend{display:flex;align-items:center;gap:8px;margin-top:10px;font-family:var(--mono);font-size:9px;color:var(--t3);}
.hm-legend-bar{flex:1;height:4px;border-radius:2px;max-width:120px;}

/* ══ ANALYSIS CARDS ═══════════════════════════════════ */
.ac-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px;}
.ac-card{
  background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:20px;
  position:relative;overflow:hidden;
  transition:transform 0.3s,border-color 0.3s,background 0.35s;
  animation:fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both;
}
.ac-card::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--c,var(--orange)),transparent);}
.ac-card:hover{transform:translateY(-3px);border-color:var(--c,var(--orange));}
.ac-label{font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;}
.ac-value{font-family:var(--display);font-size:40px;color:var(--c,var(--orange));letter-spacing:1px;text-shadow:0 0 20px var(--c-glow,var(--orange-glow));line-height:1;}
.ac-desc{font-size:11px;color:var(--t3);margin-top:6px;line-height:1.5;}

/* ══ ZONE CARDS ═══════════════════════════════════════ */
.zone-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;margin-bottom:20px;}
.zone-card{
  background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:18px;
  position:relative;overflow:hidden;
  transition:transform 0.3s,border-color 0.3s,box-shadow 0.3s,background 0.35s;
  animation:fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both;
}
.zone-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--c,var(--orange)),transparent);}
.zone-card:hover{transform:translateY(-3px);border-color:var(--c,var(--orange));box-shadow:0 8px 24px rgba(0,0,0,0.2);}
.zone-card-name{font-size:11px;color:var(--t3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;font-family:var(--mono);}
.zone-card-val{font-family:var(--display);font-size:32px;color:var(--c,var(--orange));letter-spacing:1px;line-height:1;}
.zone-card-sub{font-size:10px;color:var(--t3);margin-top:4px;}
.zone-anom-badge{
  display:inline-flex;align-items:center;gap:4px;margin-top:8px;
  font-size:10px;font-family:var(--mono);padding:3px 8px;border-radius:4px;
  background:var(--bc,var(--red-dim));color:var(--bcc,var(--red));border:1px solid var(--bcb,rgba(239,68,68,0.2));
}

/* ══ REC BOX ══════════════════════════════════════════ */
.rec-box{
  background:linear-gradient(135deg,rgba(249,115,22,0.07),rgba(249,115,22,0.02));
  border:1px solid rgba(249,115,22,0.22);border-radius:var(--r);
  padding:18px 20px;font-size:13px;color:var(--t2);line-height:1.8;
  position:relative;overflow:hidden;
}
.rec-box::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,var(--orange),transparent);}
.rec-box strong{color:var(--orange);}

/* ══ WASTAGE GRID ═════════════════════════════════════ */
.wastage-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.wastage-item{background:var(--surface2);border:1px solid var(--border);border-radius:var(--r2);padding:16px;}
.wastage-label{font-size:9px;text-transform:uppercase;letter-spacing:1px;color:var(--t3);font-family:var(--mono);margin-bottom:8px;}
.wastage-val{font-family:var(--display);font-size:28px;color:var(--orange);letter-spacing:1px;line-height:1;}
.wastage-desc{font-size:11px;color:var(--t3);margin-top:6px;line-height:1.5;}

/* ══ LOGIN ════════════════════════════════════════════ */
.login-root{
  min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:radial-gradient(ellipse 100% 80% at 50% 0%,rgba(249,115,22,0.08) 0%,transparent 70%),var(--base);
  animation:fadeIn 0.4s ease;position:relative;overflow:hidden;
}
.login-bolt{
  position:absolute;font-size:400px;font-family:var(--display);color:rgba(249,115,22,0.025);
  user-select:none;pointer-events:none;top:50%;left:50%;transform:translate(-50%,-50%);
  animation:boltFlash 8s ease infinite;
}
.login-card{
  width:420px;max-width:calc(100vw - 32px);
  background:rgba(35,26,14,0.97);border:1px solid var(--border2);
  border-radius:20px;padding:52px 44px;
  box-shadow:0 32px 80px rgba(0,0,0,0.5),0 0 60px rgba(249,115,22,0.06);
  display:flex;flex-direction:column;align-items:center;gap:28px;
  backdrop-filter:blur(20px);animation:scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
  position:relative;
}
[data-theme="light"] .login-card{background:rgba(255,248,237,0.97);}
.login-card::before{
  content:'';position:absolute;inset:-1px;border-radius:21px;
  background:linear-gradient(135deg,rgba(249,115,22,0.3),transparent 40%,transparent 60%,rgba(253,186,116,0.2));
  z-index:-1;opacity:0.5;
}
.login-logo{font-family:var(--display);font-size:44px;letter-spacing:3px;color:var(--t1);line-height:1;}
.login-logo .hi{color:var(--orange);text-shadow:0 0 30px var(--orange-glow);}
.login-sub{font-size:13px;color:var(--t3);text-align:center;line-height:1.7;font-family:var(--mono);letter-spacing:0.5px;}
.login-div{width:100%;height:1px;background:linear-gradient(90deg,transparent,var(--border2),transparent);}
.g-btn{
  width:100%;display:flex;align-items:center;justify-content:center;gap:12px;
  padding:14px 20px;background:var(--surface2);
  border:1px solid var(--border2);border-radius:var(--r2);
  color:var(--t1);font-family:var(--font);font-size:14px;font-weight:500;
  cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden;
}
.g-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(249,115,22,0.06),transparent);transform:translateX(-100%);transition:transform 0.5s;}
.g-btn:hover::before{transform:translateX(100%);}
.g-btn:hover{background:var(--surface3);border-color:var(--orange-glow);box-shadow:0 0 20px rgba(249,115,22,0.1);}
.login-terms{font-size:11px;color:var(--t3);text-align:center;line-height:1.7;}

/* ══ HOME TAB ═════════════════════════════════════════ */
.home-hero{
  background:linear-gradient(135deg,rgba(249,115,22,0.07),rgba(253,186,116,0.03),transparent);
  border:1px solid var(--border);border-radius:var(--r);padding:32px 36px;
  margin-bottom:24px;position:relative;overflow:hidden;
  animation:fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both;
}
.home-hero::after{content:'⚡';position:absolute;right:36px;top:50%;transform:translateY(-50%);font-size:80px;opacity:0.04;font-family:var(--display);animation:float 4s ease-in-out infinite;}
.home-hero-greet{font-size:12px;font-family:var(--mono);color:var(--orange);letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;}
.home-hero-name{font-family:var(--display);font-size:40px;letter-spacing:1px;color:var(--t1);line-height:1;}
.home-hero-sub{font-size:13px;color:var(--t3);margin-top:8px;line-height:1.6;}

.home-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;}
.home-stat{
  background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:20px;
  position:relative;overflow:hidden;
  animation:fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both;
  transition:transform 0.3s,border-color 0.3s,background 0.35s;
}
.home-stat:hover{transform:translateY(-3px);border-color:var(--border2);}
.home-stat-label{font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;font-family:var(--mono);}
.home-stat-val{font-family:var(--display);font-size:36px;color:var(--sv,var(--orange));letter-spacing:1px;text-shadow:0 0 20px var(--sg,var(--orange-glow));line-height:1;}
.home-stat-sub{font-size:10px;color:var(--t3);margin-top:4px;}

.home-grid{display:grid;grid-template-columns:300px 1fr;gap:20px;align-items:start;}

/* ── SETTINGS ───────────────────────────────────────── */
.settings-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;animation:fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both;transition:background 0.35s;}
.settings-row{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border);}
.settings-row:last-of-type{border-bottom:none;}
.settings-label{font-size:13px;color:var(--t1);font-weight:500;}
.settings-desc{font-size:11px;color:var(--t3);margin-top:2px;}
.settings-input{
  background:var(--surface2);border:1px solid var(--border2);border-radius:var(--r3);
  padding:7px 12px;color:var(--t1);font-family:var(--font);font-size:12px;
  outline:none;width:160px;transition:border-color 0.2s;
}
.settings-input:focus{border-color:var(--orange);}
.save-btn{
  margin:12px 20px;padding:9px 20px;background:linear-gradient(135deg,var(--orange),#fbbf24);
  border:none;border-radius:var(--r3);color:#fff;font-family:var(--font);font-size:13px;
  font-weight:700;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 16px var(--orange-glow);
  display:flex;align-items:center;gap:6px;
}
.save-btn:hover{box-shadow:0 6px 24px var(--orange-glow);transform:translateY(-1px);}
.toggle{position:relative;width:40px;height:22px;flex-shrink:0;}
.toggle input{opacity:0;width:0;height:0;}
.toggle-sl{position:absolute;inset:0;background:var(--surface3);border:1px solid var(--border2);border-radius:11px;cursor:pointer;transition:all 0.25s;}
.toggle-sl::before{content:'';position:absolute;width:16px;height:16px;border-radius:50%;background:#fff;left:2px;top:2px;transition:transform 0.25s;}
.toggle input:checked + .toggle-sl{background:var(--orange);border-color:var(--orange);box-shadow:0 0 10px var(--orange-glow);}
.toggle input:checked + .toggle-sl::before{transform:translateX(18px);}

/* ── HISTORY TABLE ──────────────────────────────────── */
.history-wrap{animation:fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;}
.history-table{width:100%;border-collapse:collapse;font-size:12px;}
.history-table th{padding:10px 14px;text-align:left;font-size:9px;font-family:var(--mono);color:var(--t3);letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid var(--border);background:var(--surface2);}
.history-table td{padding:12px 14px;border-bottom:1px solid var(--border);color:var(--t2);transition:background 0.15s;}
.history-table tr:hover td{background:rgba(249,115,22,0.03);}
.history-table tr:last-child td{border-bottom:none;}
.history-table .fname{color:var(--t1);font-weight:500;font-family:var(--mono);font-size:11px;}
.severity-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:4px;font-size:10px;font-family:var(--mono);}
.sv-ok  {background:var(--green-dim); color:var(--green); border:1px solid rgba(16,185,129,0.2);}
.sv-warn{background:var(--orange-dim);color:var(--orange);border:1px solid rgba(249,115,22,0.2);}
.sv-bad {background:var(--red-dim);   color:var(--red);   border:1px solid rgba(239,68,68,0.2);}
.del-btn{
  padding:5px 10px;background:transparent;border:1px solid var(--border);border-radius:var(--r3);
  color:var(--t3);font-size:10px;cursor:pointer;transition:all 0.2s;font-family:var(--mono);
}
.del-btn:hover{background:var(--red-dim);border-color:var(--red);color:var(--red);}

/* ── ACTIVITY TIMELINE ──────────────────────────────── */
.timeline{display:flex;flex-direction:column;gap:0;}
.tl-item{display:flex;gap:14px;padding:12px 0;position:relative;}
.tl-item:not(:last-child)::after{content:'';position:absolute;left:15px;top:36px;bottom:0;width:1px;background:var(--border);}
.tl-dot{width:30px;height:30px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:12px;border:1px solid var(--border2);}
.tl-body{flex:1;}
.tl-title{font-size:12px;font-weight:600;color:var(--t1);margin-bottom:2px;}
.tl-sub{font-size:11px;color:var(--t3);font-family:var(--mono);}

/* ══ UPLOAD TAB ═══════════════════════════════════════ */
.upload-hero{text-align:center;margin-bottom:36px;animation:fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both;}
.upload-hero-title{font-family:var(--display);font-size:48px;letter-spacing:2px;color:var(--t1);line-height:1;}
.upload-hero-title .hi{color:var(--orange);text-shadow:0 0 30px var(--orange-glow);}
.upload-hero-sub{font-size:13px;color:var(--t3);margin-top:8px;line-height:1.7;}

.drop-zone {
  border:2px dashed var(--border2);border-radius:20px;padding:64px 40px;text-align:center;
  cursor:pointer;transition:all 0.3s cubic-bezier(0.22,1,0.36,1);position:relative;overflow:hidden;
  background:var(--surface);margin-bottom:20px;
  animation:fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
}
.drop-zone::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 80% 60% at 50% 50%,rgba(249,115,22,0.04),transparent);
  opacity:0;transition:opacity 0.3s;
}
.drop-zone:hover::before,.drop-zone.dragging::before{opacity:1;}
.drop-zone:hover,.drop-zone.dragging{
  border-color:var(--orange);
  box-shadow:0 0 40px rgba(249,115,22,0.1),inset 0 0 40px rgba(249,115,22,0.03);
}
.drop-zone.dragging{transform:scale(1.01);animation:glow 1.5s ease infinite;}
.dz-icon{
  width:80px;height:80px;border-radius:50%;
  background:linear-gradient(135deg,var(--orange-dim),var(--surface3));
  border:1px solid var(--orange-glow);
  display:flex;align-items:center;justify-content:center;
  margin:0 auto 20px;transition:all 0.3s;
  box-shadow:0 0 20px var(--orange-glow);
}
.drop-zone:hover .dz-icon,.drop-zone.dragging .dz-icon{transform:scale(1.1);box-shadow:0 0 40px var(--orange-glow);}
.dz-title{font-family:var(--display);font-size:24px;letter-spacing:1px;color:var(--t1);margin-bottom:6px;}
.dz-sub{font-size:13px;color:var(--t3);line-height:1.6;}
.dz-types{display:flex;justify-content:center;gap:8px;margin-top:14px;}
.dz-type{font-size:10px;font-family:var(--mono);padding:3px 10px;border:1px solid var(--border);border-radius:4px;color:var(--t3);}

.file-preview{
  background:var(--surface);border:1px solid rgba(249,115,22,0.3);border-radius:var(--r);
  padding:20px 24px;display:flex;align-items:center;gap:16px;margin-bottom:20px;
  animation:dropBounce 0.4s cubic-bezier(0.22,1,0.36,1) both;
  box-shadow:0 0 20px rgba(249,115,22,0.08);
}
.fp-icon{width:44px;height:44px;background:var(--orange-dim);border:1px solid var(--orange-glow);border-radius:var(--r2);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.fp-info{flex:1;}
.fp-name{font-size:14px;font-weight:600;color:var(--t1);margin-bottom:2px;font-family:var(--mono);}
.fp-size{font-size:11px;color:var(--t3);font-family:var(--mono);}
.fp-clear{padding:6px 12px;background:transparent;border:1px solid var(--border);border-radius:var(--r3);color:var(--t3);font-size:11px;cursor:pointer;transition:all 0.2s;}
.fp-clear:hover{border-color:var(--red);color:var(--red);}

.upload-action{display:flex;align-items:center;gap:14px;margin-bottom:32px;}
.upload-main-btn{
  flex:1;padding:16px 24px;
  background:linear-gradient(135deg,var(--orange),#fbbf24);
  border:none;border-radius:var(--r2);
  color:#fff;font-family:var(--display);font-size:20px;letter-spacing:1px;
  cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden;
  box-shadow:0 8px 32px var(--orange-glow);
}
.upload-main-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);transform:translateX(-100%);transition:transform 0.5s;}
.upload-main-btn:hover::before{transform:translateX(100%);}
.upload-main-btn:hover{box-shadow:0 12px 48px var(--orange-glow);transform:translateY(-2px);}
.upload-main-btn:disabled{background:var(--surface3);color:var(--t3);cursor:not-allowed;box-shadow:none;transform:none;}

.progress-wrap{margin-bottom:32px;}
.progress-label{display:flex;justify-content:space-between;font-size:11px;font-family:var(--mono);color:var(--t3);margin-bottom:6px;}
.progress-track{height:4px;background:var(--surface3);border-radius:2px;overflow:hidden;}
.progress-fill{height:100%;background:linear-gradient(90deg,var(--orange),#fbbf24);border-radius:2px;transition:width 0.3s ease;box-shadow:0 0 8px var(--orange-glow);}

.recent-uploads-mini{animation:fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both;}
.rum-head{font-size:11px;font-family:var(--mono);color:var(--t3);letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--border);}
.rum-item{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);}
.rum-item:last-child{border-bottom:none;}
.rum-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.rum-name{flex:1;font-size:12px;color:var(--t1);font-family:var(--mono);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.rum-meta{font-size:10px;color:var(--t3);font-family:var(--mono);}

/* ══ RESPONSIVE ═══════════════════════════════════════ */
@media(max-width:1100px){
  .home-stats{grid-template-columns:repeat(2,1fr);}
  .cards-row{grid-template-columns:repeat(2,1fr);}
  .ac-grid{grid-template-columns:1fr 1fr;}
}
@media(max-width:900px){
  .sidebar{display:none;}
  .cards-row{grid-template-columns:1fr;}
  .home-grid{grid-template-columns:1fr;}
  .home-stats{grid-template-columns:1fr 1fr;}
  .insight-flex{flex-direction:column;}
  .wastage-grid{grid-template-columns:1fr;}
  .ac-grid{grid-template-columns:1fr;}
  .content{padding:20px 16px;}
  .topbar{padding:0 16px;}
}

.sr{opacity:0;transform:translateY(20px);transition:opacity 0.5s cubic-bezier(0.22,1,0.36,1),transform 0.5s cubic-bezier(0.22,1,0.36,1);}
.sr.vis{opacity:1;transform:none;}
`;

/* ─── UTILS ──────────────────────────────────────────────────────────────── */
const ZONE_COLORS = ["orange","blue","green","red","violet"];
const ZONE_CSS = {
  orange:{ c:"var(--orange)", cd:"var(--orange-dim)", cg:"var(--orange-glow)", bc:"var(--orange-dim)", bcc:"var(--orange)", bcb:"rgba(249,115,22,0.2)" },
  blue:  { c:"var(--blue)",   cd:"var(--blue-dim)",   cg:"var(--blue-glow)",   bc:"var(--blue-dim)",   bcc:"var(--blue)",   bcb:"rgba(56,189,248,0.2)" },
  green: { c:"var(--green)",  cd:"var(--green-dim)",  cg:"rgba(16,185,129,0.25)", bc:"var(--green-dim)", bcc:"var(--green)", bcb:"rgba(16,185,129,0.2)" },
  red:   { c:"var(--red)",    cd:"var(--red-dim)",    cg:"rgba(239,68,68,0.25)",  bc:"var(--red-dim)",   bcc:"var(--red)",   bcb:"rgba(239,68,68,0.2)" },
  violet:{ c:"var(--violet)", cd:"var(--violet-dim)", cg:"rgba(167,139,250,0.25)",bc:"var(--violet-dim)",bcc:"var(--violet)",bcb:"rgba(167,139,250,0.2)"}
};

function getZoneColor(i){ return ZONE_COLORS[i % ZONE_COLORS.length]; }
function fmtBytes(b){ if(b<1024)return b+"B"; if(b<1024*1024)return (b/1024).toFixed(1)+"KB"; return (b/1024/1024).toFixed(1)+"MB"; }
function severityOf(pct){ const p=parseFloat(pct); return p>10?"bad":p>5?"warn":"ok"; }

/* ─── HOOKS ──────────────────────────────────────────────────────────────── */
function useScrollReveal(){
  useEffect(()=>{
    const els=document.querySelectorAll(".sr");
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{ if(e.isIntersecting){e.target.classList.add("vis");io.unobserve(e.target);} }),{threshold:0.08});
    els.forEach(el=>io.observe(el));
    return()=>io.disconnect();
  });
}

/* ─── ANIMATED NUMBER ────────────────────────────────────────────────────── */
function AnimNum({ target, duration=1000, prefix="", suffix="" }){
  const [val,setVal]=useState(0);
  const raw=parseFloat(String(target).replace(/[^0-9.]/g,""))||0;
  const isFloat=String(target).includes(".");
  useEffect(()=>{
    let start=null;
    const step=ts=>{
      if(!start)start=ts;
      const p=Math.min((ts-start)/duration,1);
      const e=1-Math.pow(1-p,4);
      setVal(isFloat?(e*raw).toFixed(1):Math.round(e*raw));
      if(p<1)requestAnimationFrame(step);
      else setVal(isFloat?raw.toFixed(1):Math.round(raw));
    };
    requestAnimationFrame(step);
  },[target]);
  return <>{prefix}{val}{suffix}</>;
}

/* ─── CLOCK ──────────────────────────────────────────────────────────────── */
function Clock(){
  const[t,setT]=useState(new Date());
  useEffect(()=>{ const id=setInterval(()=>setT(new Date()),1000); return()=>clearInterval(id); },[]);
  return <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--t3)"}}>{t.toLocaleTimeString("en-GB")}</span>;
}

/* ─── STAT BAR ───────────────────────────────────────────────────────────── */
function StatBar({ label, value, max=100, color="var(--orange)", color2, glow }){
  const pct=Math.max(Math.min((value/max)*100,100),0);
  return(
    <div className="stat-row">
      <div className="stat-header">
        <span className="stat-header-label">{label}</span>
        <span className="stat-header-val" style={{color}}>{pct<1?pct.toFixed(2):pct.toFixed(1)}%</span>
      </div>
      <div className="stat-track">
        <div className="stat-fill" style={{"--w":`${Math.max(pct,1)}%`,width:`${Math.max(pct,1)}%`,background:`linear-gradient(90deg,${color},${color2||color})`,boxShadow:`0 0 8px ${color}`}} />
      </div>
    </div>
  );
}

/* ─── METRIC CARD ────────────────────────────────────────────────────────── */
function MetricCard({ label, value, sub, color, dim, glow, color2, icon, bar=0, delay=0 }){
  return(
    <div className="metric-card sr" style={{"--c":color,"--c-dim":dim,"--c-glow":glow,animationDelay:`${delay}s`}}>
      <div className="mc-top">
        <span className="mc-label">{label}</span>
        <div className="mc-icon">{icon}</div>
      </div>
      <div className="mc-value"><AnimNum target={value} /></div>
      {sub && <div className="mc-sub">{sub}</div>}
      {bar>0 && <div className="mc-bar"><div className="mc-bar-fill" style={{"--w":`${bar}%`,width:`${bar}%`,"--c2":color2||color}} /></div>}
    </div>
  );
}

/* ─── HOURLY BAR CHART ───────────────────────────────────────────────────── */
function HourlyBarChart({ hourlyData }){
  if(!hourlyData||Object.keys(hourlyData).length===0)return null;
  const entries=Object.entries(hourlyData).map(([h,v])=>({hour:Number(h),value:Number(v)})).sort((a,b)=>a.hour-b.hour);
  const maxVal=Math.max(...entries.map(e=>e.value));
  return(
    <div>
      {entries.map(({hour,value})=>{
        const pct=maxVal>0?(value/maxVal)*100:0;
        const color=pct>85?"var(--red)":pct>60?"var(--orange)":"var(--blue)";
        return(
          <div className="hourly-row" key={hour}>
            <div className="hourly-h">{String(hour).padStart(2,"0")}:00</div>
            <div className="hourly-track">
              <div className="hourly-fill" style={{"--w":`${Math.max(pct,1)}%`,width:`${Math.max(pct,1)}%`,background:color,boxShadow:`0 0 6px ${color}66`,animationDelay:`${hour*0.02}s`}} />
            </div>
            <div className="hourly-val">{value.toFixed(3)} kW</div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── ZONE HEATMAP ───────────────────────────────────────────────────────── */
function ZoneHeatmap({ heatmapData }){
  const keys=Object.keys(heatmapData||{});
  const[zone,setZone]=useState(keys[0]||"");
  if(!heatmapData||keys.length===0)return<p style={{color:"var(--t3)",fontSize:12}}>No heatmap data.</p>;
  const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const data=heatmapData[zone]||[];
  const maxVal=Math.max(...data.flat(),0.001);
  const colorIdx=keys.indexOf(zone)%ZONE_COLORS.length;
  const colName=ZONE_COLORS[colorIdx];
  const rgbs={orange:"249,115,22",blue:"56,189,248",green:"16,185,129",red:"239,68,68",violet:"167,139,250"};
  const rgb=rgbs[colName];
  const getColor=(val)=>{
    const i=val/maxVal;
    return i<0.05?"rgba(44,32,16,0.9)":`rgba(${rgb},${(0.12+i*0.88).toFixed(2)})`;
  };
  return(
    <div>
      <div className="zone-tabs">
        {keys.map((k,i)=>{
          const cn=ZONE_COLORS[i%ZONE_COLORS.length];
          return<button key={k} className={`zone-tab${zone===k?" zt-"+cn:""}`} onClick={()=>setZone(k)} style={{textTransform:"capitalize"}}>{k}</button>;
        })}
      </div>
      <div className="hm-wrap">
        <div className="hm-grid">
          <div/>
          {days.map(d=><div key={d} className="hm-day">{d}</div>)}
          {data.map((row,hour)=>(
            <Fragment key={hour}>
              <div className="hm-hour">{String(hour).padStart(2,"0")}</div>
              {row.map((val,day)=>(
                <div key={day} className="hm-cell" style={{background:getColor(val)}} title={`${String(hour).padStart(2,"0")}:00 ${days[day]} — ${val.toFixed(3)}`} />
              ))}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="hm-legend">
        <span>Low</span>
        <div className="hm-legend-bar" style={{background:`linear-gradient(90deg,rgba(44,32,16,0.9),rgba(${rgb},1))`}} />
        <span>High · Peak: {maxVal.toFixed(3)}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOGIN SCREEN
═══════════════════════════════════════════════════════════════════════════ */
function LoginScreen({ onLogin, theme, toggleTheme }){
  const handle=()=>{
    if(window.google){
      window.google.accounts.id.initialize({
        client_id:GOOGLE_CLIENT_ID,
        callback:(resp)=>{
          const p=JSON.parse(atob(resp.credential.split(".")[1]));
          onLogin({name:p.name,email:p.email,picture:p.picture});
        }
      });
      window.google.accounts.id.prompt();
    } else {
      onLogin({name:"Demo User",email:"demo@anomax.io",picture:null});
    }
  };
  return(
    <>
      <style>{CSS}</style>
      <div className="mesh-bg"><div className="mesh-orb mesh-orb-1"/><div className="mesh-orb mesh-orb-2"/><div className="mesh-orb mesh-orb-3"/><div className="mesh-grid"/></div>
      <div style={{position:"fixed",top:16,right:16,zIndex:100}}>
        <button className="theme-toggle" onClick={toggleTheme} title={theme==="dark"?"Switch to light":"Switch to dark"}>
          {theme==="dark"
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          }
        </button>
      </div>
      <div className="login-root">
        <div className="login-bolt">⚡</div>
        <div className="login-card">
          <div style={{textAlign:"center"}}>
            <div className="login-logo">AN<span className="hi">OM</span>AX</div>
            <div style={{fontSize:10,color:"var(--t3)",fontFamily:"var(--mono)",marginTop:6,letterSpacing:1.5}}>ENERGY INTELLIGENCE PLATFORM</div>
          </div>
          <div className="login-sub">Upload energy datasets · Detect anomalies<br/>Get smart usage insights in seconds</div>
          <div className="login-div"/>
          <button className="g-btn" onClick={handle}>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>
          <p className="login-terms">Your data stays on your device. No server storage.</p>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOME TAB
═══════════════════════════════════════════════════════════════════════════ */
function HomeTab({ user, uploads, onDelete, onSettingsSave }){
  useScrollReveal();
  const[displayName,setDisplayName]=useState(user.name);
  const[defaultTab,setDefaultTab]=useState("Dashboard");
  const[notifs,setNotifs]=useState(true);
  const[saved,setSaved]=useState(false);
  const totalUploads=uploads.length;
  const avgAnomaly=uploads.length>0?(uploads.reduce((a,u)=>a+parseFloat(u.anomalyPct||0),0)/uploads.length).toFixed(1):"0";
  const bestFile=uploads.length>0?uploads.reduce((a,b)=>parseFloat(a.anomalyPct)<parseFloat(b.anomalyPct)?a:b,uploads[0]):null;
  const worstFile=uploads.length>0?uploads.reduce((a,b)=>parseFloat(a.anomalyPct)>parseFloat(b.anomalyPct)?a:b,uploads[0]):null;

  const save=()=>{ onSettingsSave({displayName,defaultTab,notifs}); setSaved(true); setTimeout(()=>setSaved(false),2000); };

  return(
    <div className="tab-page">
      <div className="home-hero sr">
        <div className="home-hero-greet">Welcome back</div>
        <div className="home-hero-name">{displayName}</div>
        <div className="home-hero-sub">Here's your energy monitoring overview. Last updated just now.</div>
      </div>

      <div className="home-stats">
        {[
          {label:"Total Uploads",val:totalUploads,sub:"All time",sv:"var(--orange)",sg:"var(--orange-glow)",delay:0},
          {label:"Avg Anomaly Rate",val:avgAnomaly+"%",sub:"Across all datasets",sv:"var(--blue)",sg:"var(--blue-glow)",delay:0.05},
          {label:"Best File",val:bestFile?parseFloat(bestFile.anomalyPct).toFixed(1)+"%":"—",sub:bestFile?bestFile.name.slice(0,18)+"…":"No uploads yet",sv:"var(--green)",sg:"rgba(16,185,129,0.25)",delay:0.1},
          {label:"Needs Attention",val:worstFile&&parseFloat(worstFile.anomalyPct)>5?parseFloat(worstFile.anomalyPct).toFixed(1)+"%":"—",sub:worstFile&&parseFloat(worstFile.anomalyPct)>5?worstFile.name.slice(0,18)+"…":"All clear",sv:"var(--red)",sg:"rgba(239,68,68,0.25)",delay:0.15},
        ].map((s,i)=>(
          <div key={i} className="home-stat sr" style={{"--sv":s.sv,"--sg":s.sg,animationDelay:`${s.delay}s`}}>
            <div className="home-stat-label">{s.label}</div>
            <div className="home-stat-val">{s.val}</div>
            <div className="home-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="home-grid">
        {/* LEFT — Settings only, no profile card */}
       <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div className="settings-card">
            <div className="panel-head">
              <span className="panel-title"><span className="panel-title-dot"/>Preferences</span>
              <span className="panel-badge">Editable</span>
            </div>
            <div className="settings-row">
               <div><div className="settings-label">Display name</div><div className="settings-desc">Shown in the sidebar</div></div>
              <input className="settings-input" value={displayName} onChange={e=>setDisplayName(e.target.value)}/>
            </div>
            <div className="settings-row">
              <div><div className="settings-label">Default tab</div><div className="settings-desc">Opens after upload</div></div>
              <select className="settings-input" value={defaultTab} onChange={e=>setDefaultTab(e.target.value)} style={{appearance:"none",cursor:"pointer"}}>
                {["Dashboard","Insights","Analysis","Submetering"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="settings-row">
              <div><div className="settings-label">Anomaly alerts</div><div className="settings-desc">Flag high anomaly files</div></div>
              <label className="toggle"><input type="checkbox" checked={notifs} onChange={e=>setNotifs(e.target.checked)}/><span className="toggle-sl"/></label>
            </div>
            <button className="save-btn" onClick={save}>
              {saved?"✓ Saved":"Save changes"}
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {/* Activity timeline */}
          <div className="panel sr">
            <div className="panel-head">
              <span className="panel-title"><span className="panel-title-dot"/>Recent Activity</span>
              <span className="panel-badge">{uploads.length} events</span>
            </div>
            <div className="panel-body">
              {uploads.length===0
                ?<p style={{color:"var(--t3)",fontSize:12,textAlign:"center",padding:"20px 0"}}>No activity yet. Upload a file to get started.</p>
                :<div className="timeline">
                  {[...uploads].reverse().slice(0,5).map((u,i)=>{
                    const sv=severityOf(u.anomalyPct);
                    const dotColor=sv==="ok"?"var(--green)":sv==="warn"?"var(--orange)":"var(--red)";
                    return(
                      <div className="tl-item" key={i}>
                        <div className="tl-dot" style={{background:dotColor+"22",borderColor:dotColor+"44"}}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={dotColor} strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                        </div>
                        <div className="tl-body">
                          <div className="tl-title">{u.name}</div>
                          <div className="tl-sub">{u.date} · {u.records} records · <span style={{color:dotColor}}>{u.anomalyPct}% anomaly</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              }
            </div>
          </div>

          {/* History table */}
          <div className="panel history-wrap sr">
            <div className="panel-head">
              <span className="panel-title"><span className="panel-title-dot"/>Upload History</span>
              <span className="panel-badge">{uploads.length} files</span>
            </div>
            {uploads.length===0
              ?<div style={{padding:"32px",textAlign:"center",color:"var(--t3)",fontSize:12}}>No upload history yet.</div>
              :<div style={{overflowX:"auto"}}>
                <table className="history-table">
                  <thead>
                    <tr><th>File</th><th>Date</th><th>Records</th><th>Anomaly</th><th>Status</th><th></th></tr>
                  </thead>
                  <tbody>
                    {[...uploads].reverse().map((u,i)=>{
                      const sv=severityOf(u.anomalyPct);
                      return(
                        <tr key={i}>
                          <td><span className="fname">{u.name.length>24?u.name.slice(0,24)+"…":u.name}</span></td>
                          <td>{u.date}</td>
                          <td style={{fontFamily:"var(--mono)"}}>{u.records}</td>
                          <td style={{fontFamily:"var(--mono)",color:"var(--orange)"}}>{u.anomalyPct}%</td>
                          <td><span className={`severity-badge sv-${sv}`}>{sv==="ok"?"Normal":sv==="warn"?"Elevated":"High"}</span></td>
                          <td><button className="del-btn" onClick={()=>onDelete(uploads.length-1-i)}>Delete</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   UPLOAD TAB — ref-based drag/drop, no child-element flicker
═══════════════════════════════════════════════════════════════════════════ */
function UploadTab({ uploads, onUploadComplete }){
  useScrollReveal();
  const[file,setFile]=useState(null);
  const[dragging,setDragging]=useState(false);
  const[loading,setLoading]=useState(false);
  const[progress,setProgress]=useState(0);
  const inputRef=useRef();
  const dropRef=useRef();
  const dragCounter=useRef(0);

  // Ref-based drag handlers — counter tracks enter/leave of nested children
  useEffect(()=>{
    const el=dropRef.current;
    if(!el)return;
    const onEnter=e=>{e.preventDefault();dragCounter.current++;if(dragCounter.current===1)setDragging(true);};
    const onLeave=e=>{e.preventDefault();dragCounter.current--;if(dragCounter.current===0)setDragging(false);};
    const onOver=e=>e.preventDefault();
    const onDrop=e=>{
      e.preventDefault();dragCounter.current=0;setDragging(false);
      const f=e.dataTransfer.files[0];
      if(f)handleFile(f);
    };
    el.addEventListener("dragenter",onEnter);
    el.addEventListener("dragleave",onLeave);
    el.addEventListener("dragover",onOver);
    el.addEventListener("drop",onDrop);
    return()=>{
      el.removeEventListener("dragenter",onEnter);
      el.removeEventListener("dragleave",onLeave);
      el.removeEventListener("dragover",onOver);
      el.removeEventListener("drop",onDrop);
    };
  },[]);

  const handleFile=f=>{
    if(f&&(f.name.endsWith(".csv")||f.name.endsWith(".xlsx")||f.name.endsWith(".json")))setFile(f);
    else alert("Please select a CSV, Excel, or JSON file");
  };

  const doUpload = async () => {
  if (!file) return;

  setLoading(true);
  setProgress(0);

  try {
    const fd = new FormData();
    fd.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "http://127.0.0.1:8000/upload");

    // ✅ REAL upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100;
        setProgress(percent);
      }
    };

    // ✅ Success
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);

        setProgress(100);

        setTimeout(() => {
          setLoading(false);
          setProgress(0);
          setFile(null);
          onUploadComplete(data, file);
        }, 300);
      } else {
        throw new Error("Upload failed");
      }
    };

    // ❌ Error handling
    xhr.onerror = () => {
      setLoading(false);
      setProgress(0);
      alert("Upload failed. Check backend.");
    };

    // ⏱️ Timeout (VERY important for large files)
    xhr.timeout = 60000; // 60 sec
    xhr.ontimeout = () => {
      setLoading(false);
      setProgress(0);
      alert("Upload timed out. Try again.");
    };

    xhr.send(fd);

  } catch (err) {
    setLoading(false);
    setProgress(0);
    alert("Something went wrong.");
  }
};

  return(
    <div className="tab-page">
      <div className="upload-hero">
        <div className="upload-hero-title">UPLOAD <span className="hi">DATA</span></div>
        <div className="upload-hero-sub">Drop your energy dataset below to begin anomaly detection analysis</div>
      </div>

      {!file&&(
        <div
          ref={dropRef}
          className={`drop-zone${dragging?" dragging":""}`}
          onClick={()=>inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" accept=".csv,.xlsx,.json" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
          <div className="dz-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
            </svg>
          </div>
          <div className="dz-title">{dragging?"DROP IT ⚡":"Drag & Drop"}</div>
          <div className="dz-sub">or click to browse your files<br/>Supports CSV, Excel, and JSON datasets</div>
          <div className="dz-types">
            {[".CSV",".XLSX",".JSON"].map(t=><span key={t} className="dz-type">{t}</span>)}
          </div>
        </div>
      )}

      {file&&!loading&&(
        <div className="file-preview">
          <div className="fp-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
            </svg>
          </div>
          <div className="fp-info">
            <div className="fp-name">{file.name}</div>
            <div className="fp-size">{fmtBytes(file.size)} · Ready to upload</div>
          </div>
          <button className="fp-clear" onClick={()=>setFile(null)}>✕ Remove</button>
        </div>
      )}

      {loading&&(
        <div className="progress-wrap">
          <div className="progress-label"><span>Processing dataset…</span><span style={{color:"var(--orange)"}}>{Math.round(progress)}%</span></div>
          <div className="progress-track"><div className="progress-fill" style={{width:`${progress}%`}}/></div>
        </div>
      )}

      <div className="upload-action sr">
        <button className="upload-main-btn" disabled={!file||loading} onClick={doUpload}>
          {loading?"ANALYZING…":"ANALYZE DATASET ⚡"}
        </button>
      </div>

      {uploads.length>0&&(
        <div className="recent-uploads-mini sr">
          <div className="rum-head">Recent uploads ({uploads.length})</div>
          {[...uploads].reverse().slice(0,5).map((u,i)=>{
            const sv=severityOf(u.anomalyPct);
            const dc=sv==="ok"?"var(--green)":sv==="warn"?"var(--orange)":"var(--red)";
            return(
              <div className="rum-item" key={i}>
                <div className="rum-dot" style={{background:dc,boxShadow:`0 0 6px ${dc}`}}/>
                <div className="rum-name">{u.name}</div>
                <div className="rum-meta">{u.anomalyPct}% · {u.date}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD TAB
═══════════════════════════════════════════════════════════════════════════ */
function DashboardTab({ result }){
  useScrollReveal();
  const pct=parseFloat(result.anomaly_percentage);
  const aColor=pct>10?"var(--red)":pct>5?"var(--orange)":"var(--green)";
  const aGlow=pct>10?"rgba(239,68,68,0.3)":pct>5?"var(--orange-glow)":"rgba(16,185,129,0.25)";
  return(
    <div className="tab-page">
      <div className="sec-head sr"><span className="sec-head-title">OVERVIEW</span><div className="sec-head-line"/><span className="sec-head-badge">LIVE</span></div>
      <div className="cards-row">
        <MetricCard label="Raw Records" value={(result.raw_record_count??result.total_data_points).toLocaleString()} sub="Total rows loaded from CSV"
          color="var(--blue)" dim="var(--blue-dim)" glow="var(--blue-glow)" color2="#7dd3fc" bar={70} delay={0}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>}
        />
        <MetricCard label="Anomalies Detected" value={result.total_anomalies} sub="Flagged events"
          color="var(--red)" dim="var(--red-dim)" glow="rgba(239,68,68,0.3)" color2="#fca5a5" bar={pct} delay={0.08}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
        />
        <MetricCard label="Anomaly Rate" value={result.anomaly_percentage+"%"} sub="Of total data stream"
          color={aColor} dim={pct>10?"var(--red-dim)":pct>5?"var(--orange-dim)":"var(--green-dim)"} glow={aGlow} bar={pct} delay={0.16}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={aColor} strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
        />
      </div>

      <div className="panel sr" style={{animationDelay:"0.2s"}}>
        <div className="panel-head"><span className="panel-title"><span className="panel-title-dot"/>System Insight</span><span className="panel-badge">Auto-analysis</span></div>
        <div className="panel-body">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            <div style={{fontSize:13,lineHeight:1.8,color:"var(--t2)"}}>
              System loaded <strong style={{color:"var(--t1)"}}>{(result.raw_record_count??result.total_data_points).toLocaleString()}</strong> raw
              records, resampled to <strong style={{color:"var(--t1)"}}>{result.total_data_points.toLocaleString()}</strong> hourly
              points. <strong style={{color:aColor}}>{result.total_anomalies}</strong> anomalies
              flagged ({result.anomaly_percentage}%). {pct<5?"Usage appears generally stable.":"Elevated anomaly rate — review device activity."}
            </div>
            <div>
              <StatBar label="Normal readings" value={100-pct} max={100} color="var(--green)" glow="rgba(16,185,129,0.3)"/>
              <StatBar label="Anomaly events" value={pct} max={100} color="var(--red)" glow="rgba(239,68,68,0.3)"/>
              <StatBar label="Data integrity" value={100-pct} max={100} color="var(--blue)" glow="var(--blue-glow)"/>
            </div>
          </div>
        </div>
      </div>

      <div className="panel sr" style={{animationDelay:"0.3s"}}>
        <div className="panel-head"><span className="panel-title"><span className="panel-title-dot"/>Usage Pattern</span><span className="panel-badge">Visual</span></div>
        <div className="panel-body"><img src={result.anomaly_plot} className="graph-img" alt="Anomaly graph"/></div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   INSIGHTS TAB
═══════════════════════════════════════════════════════════════════════════ */
function InsightsTab({ result }){
  useScrollReveal();
  return(
    <div className="tab-page">
      <div className="sec-head sr"><span className="sec-head-title">INSIGHTS</span><div className="sec-head-line"/><span className="sec-head-badge">Smart</span></div>

      <div className="panel sr">
        <div className="panel-head"><span className="panel-title"><span className="panel-title-dot"/>Peak Usage Analysis</span><span className="panel-badge">AI insight</span></div>
        <div className="panel-body insight-flex">
          <div className="insight-graph"><img src={result.hourly_plot} className="graph-img" alt="Hourly"/></div>
          <div className="insight-text">
            <p style={{marginBottom:12}}>{result.smart_summary}</p>
            <div className="insight-kv">
              <div className="insight-kv-row"><span className="insight-kv-key">Peak hour</span><span className="insight-kv-val">{result.peak_hour}:00</span></div>
              <div className="insight-kv-row"><span className="insight-kv-key">Lowest hour</span><span className="insight-kv-val">{result.low_hour}:00</span></div>
              <div className="insight-kv-row"><span className="insight-kv-key">Peak-to-low gap</span><span className="insight-kv-val">{result.usage_gap} kW</span></div>
            </div>
            <p style={{marginTop:12,fontSize:12,opacity:0.6}}>{result.peak_reason}</p>
          </div>
        </div>
      </div>

      <div className="panel sr">
        <div className="panel-head"><span className="panel-title"><span className="panel-title-dot"/>All 24 Hours</span><span className="panel-badge">kW values</span></div>
        <div className="panel-body"><HourlyBarChart hourlyData={result.hourly_avg}/></div>
      </div>

      {[
        {title:"Daily Trend",badge:"Time series",plot:result.daily_plot,text:result.daily_explanation},
        {title:"Monthly Trend",badge:"Seasonal",plot:result.monthly_plot,text:result.monthly_explanation},
      ].map((p,i)=>(
        <div className="panel sr" key={i} style={{animationDelay:`${i*0.1}s`}}>
          <div className="panel-head"><span className="panel-title"><span className="panel-title-dot"/>{p.title}</span><span className="panel-badge">{p.badge}</span></div>
          <div className="panel-body insight-flex">
            <div className="insight-graph"><img src={p.plot} className="graph-img" alt={p.title}/></div>
            <div className="insight-text"><p>{p.text}</p></div>
          </div>
        </div>
      ))}

      <div className="panel sr">
        <div className="panel-head"><span className="panel-title"><span className="panel-title-dot"/>Night vs Day</span><span className="panel-badge">Waste analysis</span></div>
        <div className="panel-body">
          <p style={{fontSize:13,color:"var(--t2)",marginBottom:16}}>
            Night usage is <strong style={{color:"var(--orange)"}}>{result.waste_score}%</strong> of daytime.{" "}
            {result.waste_score>50?"High night consumption — possible idle appliance wastage.":"Well-balanced day/night usage pattern."}
          </p>
          <StatBar label="Night vs Day ratio" value={Math.min(result.waste_score,100)} max={100} color={result.waste_score>50?"var(--red)":"var(--green)"}/>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANALYSIS TAB
═══════════════════════════════════════════════════════════════════════════ */
function AnalysisTab({ result }){
  useScrollReveal();
  const effC=result.efficiency_score>70?"var(--green)":result.efficiency_score>40?"var(--orange)":"var(--red)";
  const effG=result.efficiency_score>70?"rgba(16,185,129,0.3)":result.efficiency_score>40?"var(--orange-glow)":"rgba(239,68,68,0.3)";
  return(
    <div className="tab-page">
      <div className="sec-head sr"><span className="sec-head-title">DEEP ANALYSIS</span><div className="sec-head-line"/><span className="sec-head-badge">Scoring</span></div>

      <div className="ac-grid">
        {[
          {label:"Efficiency Score",val:`${result.efficiency_score}%`,desc:result.efficiency_msg,c:effC,g:effG},
          {label:"High Usage Events",val:result.high_usage_count,desc:"Readings above mean + 1σ threshold",c:"var(--orange)",g:"var(--orange-glow)"},
          {label:"Night Waste Score",val:`${result.waste_score}%`,desc:"Night usage as % of daytime",c:result.waste_score>50?"var(--red)":"var(--green)",g:result.waste_score>50?"rgba(239,68,68,0.3)":"rgba(16,185,129,0.25)"},
        ].map((c,i)=>(
          <div key={i} className="ac-card sr" style={{"--c":c.c,"--c-glow":c.g,animationDelay:`${i*0.08}s`}}>
            <div className="ac-label">{c.label}</div>
            <div className="ac-value"><AnimNum target={c.val}/></div>
            <div className="ac-desc">{c.desc}</div>
          </div>
        ))}
      </div>

      <div className="panel sr">
        <div className="panel-head"><span className="panel-title"><span className="panel-title-dot"/>Efficiency Breakdown</span><span className="panel-badge">Scoring</span></div>
        <div className="panel-body">
          <StatBar label="Energy efficiency" value={result.efficiency_score} max={100} color={effC}/>
          <StatBar label="Waste score" value={Math.min(result.waste_score,100)} max={100} color={result.waste_score>50?"var(--red)":"var(--green)"}/>
          <StatBar label="Anomaly rate" value={parseFloat(result.anomaly_percentage)} max={100} color="var(--red)"/>
        </div>
      </div>

      <div className="panel sr">
        <div className="panel-head"><span className="panel-title"><span className="panel-title-dot"/>Smart Recommendation</span><span className="panel-badge">AI engine</span></div>
        <div className="panel-body"><div className="rec-box"><strong>Recommendation: </strong>{result.recommendation}</div></div>
      </div>

      {result.wastage&&(
        <div className="panel sr">
          <div className="panel-head"><span className="panel-title"><span className="panel-title-dot"/>Wastage Analysis</span><span className="panel-badge">Zone detail</span></div>
          <div className="panel-body">
            <div className="wastage-grid">
              <div className="wastage-item"><div className="wastage-label">Peak waste hour</div><div className="wastage-val">{result.wastage.peak_waste_hour}:00</div><div className="wastage-desc">Hour with highest abnormal load</div></div>
              <div className="wastage-item"><div className="wastage-label">Main source</div><div className="wastage-val" style={{fontSize:22}}>{result.wastage.main_source}</div><div className="wastage-desc">Zone contributing most to high-usage events</div></div>
              <div className="wastage-item"><div className="wastage-label">Summary</div><div className="wastage-desc" style={{marginTop:8,fontSize:12}}>{result.wastage.message}</div></div>
            </div>
          </div>
        </div>
      )}

      {result.anomaly_hour_distribution&&Object.keys(result.anomaly_hour_distribution).length>0&&(
        <div className="panel sr">
          <div className="panel-head"><span className="panel-title"><span className="panel-title-dot"/>Anomaly Hour Distribution</span><span className="panel-badge">Pattern</span></div>
          <div className="panel-body">
            {Object.entries(result.anomaly_hour_distribution).sort((a,b)=>Number(a[0])-Number(b[0])).map(([h,c])=>(
              <StatBar key={h} label={`${String(h).padStart(2,"0")}:00`} value={c} max={Math.max(...Object.values(result.anomaly_hour_distribution))} color="var(--red)"/>
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
function SubmeteringTab({ result }){
  useScrollReveal();
  const zoneKeys = (() => {
    if(result.sub_pct && Object.keys(result.sub_pct).length>0) return Object.keys(result.sub_pct);
    const raw = Object.keys(result).filter(k=>k.startsWith("sub_")&&k!=="sub_pct"&&k!=="sub_insight");
    return raw.map(k=>k.replace("sub_",""));
  })();
  const subAnomalies = result.sub_anomalies || {};

  return(
    <div className="tab-page">
      <div className="sec-head sr"><span className="sec-head-title">SUBMETERING</span><div className="sec-head-line"/><span className="sec-head-badge">{zoneKeys.length} zones</span></div>

      <div className="zone-cards">
        {zoneKeys.map((zone,i)=>{
          const colName=getZoneColor(i);
          const cs=ZONE_CSS[colName];
          const totKey=`sub_${zone}`;
          const totVal=result[totKey]!==undefined?Number(result[totKey]).toLocaleString(undefined,{maximumFractionDigits:1}):"—";
          const anomCount=subAnomalies[zone];
          const hasAnom=anomCount!=null;
          const anomSv=hasAnom&&anomCount>20?"bad":hasAnom&&anomCount>5?"warn":"ok";
          const anomColor=anomSv==="ok"?"var(--green)":anomSv==="warn"?"var(--orange)":"var(--red)";
          const anomDim=anomSv==="ok"?"var(--green-dim)":anomSv==="warn"?"var(--orange-dim)":"var(--red-dim)";
          return(
            <div key={zone} className="zone-card sr" style={{"--c":cs.c,"--c-glow":cs.cg,animationDelay:`${i*0.07}s`}}>
              <div className="zone-card-name">{zone}</div>
              <div className="zone-card-val">{totVal}</div>
              <div className="zone-card-sub">Total energy units</div>
              {hasAnom&&(
                <div className="zone-anom-badge" style={{"--bc":anomDim,"--bcc":anomColor,"--bcb":`${anomColor}40`}}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={anomColor} strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                  {anomCount} anomalies
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="panel sr">
        <div className="panel-head"><span className="panel-title"><span className="panel-title-dot"/>Zone Usage Share</span><span className="panel-badge">Distribution</span></div>
        <div className="panel-body insight-flex">
          <div className="insight-graph"><img src={result.pie_chart} className="graph-img" alt="Pie"/></div>
          <div className="insight-text">
            {result.sub_pct&&zoneKeys.map((zone,i)=>{
              const cs=ZONE_CSS[getZoneColor(i)];
              return<StatBar key={zone} label={zone} value={result.sub_pct[zone]||0} max={100} color={cs.c}/>;
            })}
            {result.sub_insight&&<p style={{marginTop:14,fontSize:12,opacity:0.6}}>{result.sub_insight}</p>}
          </div>
        </div>
      </div>

      {Object.keys(subAnomalies).length>0&&(
        <div className="panel sr">
          <div className="panel-head"><span className="panel-title"><span className="panel-title-dot"/>Anomalies Per Zone</span><span className="panel-badge">Detection</span></div>
          <div className="panel-body">
            {Object.entries(subAnomalies).map(([zone,count],i)=>(
              <StatBar key={zone} label={zone} value={count} max={Math.max(...Object.values(subAnomalies),1)} color={ZONE_CSS[getZoneColor(i)].c}/>
            ))}
          </div>
        </div>
      )}

      <div className="panel sr">
        <div className="panel-head"><span className="panel-title"><span className="panel-title-dot"/>Sub Meter Correlation</span><span className="panel-badge">Heatmap</span></div>
        <div className="panel-body insight-flex">
          <div className="insight-graph"><img src={result.correlation_plot} className="graph-img" alt="Correlation"/></div>
          <div className="insight-text">
            <p>The correlation heatmap shows how usage patterns between zones relate. High values mean two zones tend to be active at the same times.</p>
            {result.correlation_insight&&<p style={{marginTop:12,fontSize:12,opacity:0.6}}>{result.correlation_insight}</p>}
          </div>
        </div>
      </div>

      {result.heatmap_data&&(
        <div className="panel sr">
          <div className="panel-head"><span className="panel-title"><span className="panel-title-dot"/>Zone Activity Heatmap</span><span className="panel-badge">24 × 7</span></div>
          <div className="panel-body"><ZoneHeatmap heatmapData={result.heatmap_data}/></div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   NAV CONFIG
═══════════════════════════════════════════════════════════════════════════ */
const NAV=[
  {id:"Home",label:"Home",icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"/></svg>},
  {id:"Upload",label:"Upload",icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>},
  {id:"Dashboard",label:"Dashboard",icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>},
  {id:"Insights",label:"Insights",icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>},
  {id:"Analysis",label:"Analysis",icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>},
  {id:"Submetering",label:"Submetering",icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5"/></svg>},
];

const PAGE_TITLES={Home:"Home",Upload:"Upload Data",Dashboard:"Energy Dashboard",Insights:"Usage Insights",Analysis:"Deep Analysis",Submetering:"Submetering"};

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════════════════ */
export default function App(){
  const[user,setUser]      =useState(()=>{ try{return JSON.parse(localStorage.getItem("anomax_user")||"null");}catch{return null;} });
  const[result,setResult]  =useState(null);
  const[nav,setNav]        =useState("Home");
  const[uploads,setUploads]=useState(()=>{ try{return JSON.parse(localStorage.getItem("anomax_uploads")||"[]");}catch{return[];} });
  const[theme,setTheme]    =useState(()=>localStorage.getItem("anomax_theme")||"dark");

  // Apply theme attribute to html element
  useEffect(()=>{
    document.documentElement.setAttribute("data-theme",theme);
    localStorage.setItem("anomax_theme",theme);
  },[theme]);

  useEffect(()=>{
    if(!document.getElementById("gsi")){
      const s=document.createElement("script");
      s.id="gsi";s.src="https://accounts.google.com/gsi/client";s.async=true;
      document.head.appendChild(s);
    }
  },[]);

  const toggleTheme=()=>setTheme(t=>t==="dark"?"light":"dark");
  const login=u=>{ setUser(u); localStorage.setItem("anomax_user",JSON.stringify(u)); };
  const signout=()=>{ setUser(null);setResult(null);setNav("Home"); localStorage.removeItem("anomax_user"); };

  const onUploadComplete=(data,file)=>{
    setResult(data);
    const entry={name:file.name,date:new Date().toLocaleDateString("en-GB"),records:(data.raw_record_count??data.total_data_points??0).toLocaleString(),anomalyPct:data.anomaly_percentage};
    const updated=[...uploads,entry];
    setUploads(updated);
    localStorage.setItem("anomax_uploads",JSON.stringify(updated));
    setNav("Dashboard");
  };

  const onDelete=idx=>{
    const updated=uploads.filter((_,i)=>i!==idx);
    setUploads(updated);
    localStorage.setItem("anomax_uploads",JSON.stringify(updated));
  };

  const onSettingsSave=({displayName})=>{
    const u={...user,name:displayName};
    setUser(u);
    localStorage.setItem("anomax_user",JSON.stringify(u));
  };

  if(!user) return <LoginScreen onLogin={login} theme={theme} toggleTheme={toggleTheme}/>;

  const needsData=["Dashboard","Insights","Analysis","Submetering"].includes(nav)&&!result;

  // Sun icon for light mode, moon for dark
  const ThemeIcon=()=>theme==="dark"
    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;

  return(
    <>
      <style>{CSS}</style>
      <div className="mesh-bg"><div className="mesh-orb mesh-orb-1"/><div className="mesh-orb mesh-orb-2"/><div className="mesh-orb mesh-orb-3"/><div className="mesh-grid"/></div>
      <div className="app">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sb-logo">
            <div className="sb-logo-mark">AN<span className="hi">OM</span>AX</div>
            <div className="sb-tagline">Energy Intelligence</div>
          </div>
          <div className="sb-user" onClick={()=>setNav("Home")}>
            <div className="sb-avatar">
              {user.picture?<img src={user.picture} alt={user.name}/>:user.name?.[0]??"U"}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div className="sb-uname">{user.name}</div>
              <div className="sb-uemail">{user.email}</div>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
          <nav className="sb-nav">
            <div className="sb-nav-label">Navigation</div>
            {NAV.map(item=>(
              <div key={item.id} className={`sb-item${nav===item.id?" active":""}`} onClick={()=>setNav(item.id)}>
                {item.icon}
                {item.label}
              </div>
            ))}
          </nav>
          <div className="sb-footer">
            <div className="sb-footer-row">
              <button className="sb-signout" onClick={signout}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign out
              </button>
              <button className="theme-toggle" onClick={toggleTheme} title={theme==="dark"?"Light mode":"Dark mode"}>
                <ThemeIcon/>
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="topbar">
            <div className="topbar-left">
              <div className="topbar-eyebrow">ANOMAX · MONITORING ACTIVE</div>
              <div className="topbar-title">{PAGE_TITLES[nav]}</div>
            </div>
            <div className="topbar-right">
              <div className="topbar-pill"><span className="topbar-dot"/><Clock/></div>
            </div>
          </div>

          <div className="content">
            {nav==="Home"       &&<HomeTab user={user} uploads={uploads} onDelete={onDelete} onSettingsSave={onSettingsSave}/>}
            {nav==="Upload"     &&<UploadTab uploads={uploads} onUploadComplete={onUploadComplete}/>}
            {nav==="Dashboard"  &&result&&<DashboardTab result={result}/>}
            {nav==="Insights"   &&result&&<InsightsTab  result={result}/>}
            {nav==="Analysis"   &&result&&<AnalysisTab  result={result}/>}
            {nav==="Submetering"&&result&&<SubmeteringTab result={result}/>}
            {needsData&&(
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",gap:16,textAlign:"center",animation:"fadeUp 0.4s ease both"}}>
                <div style={{width:72,height:72,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 24px var(--orange-glow)"}}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>
                </div>
                <div style={{fontFamily:"var(--display)",fontSize:22,letterSpacing:"1px",color:"var(--t1)"}}>No Data Loaded</div>
                <div style={{fontSize:13,color:"var(--t3)",lineHeight:1.7}}>Go to the <strong style={{color:"var(--orange)"}}>Upload</strong> tab to analyze a dataset</div>
                <button onClick={()=>setNav("Upload")} style={{marginTop:8,padding:"12px 28px",background:"linear-gradient(135deg,var(--orange),#fbbf24)",border:"none",borderRadius:"var(--r2)",color:"#fff",fontFamily:"var(--display)",fontSize:16,letterSpacing:"1px",cursor:"pointer",boxShadow:"0 8px 24px var(--orange-glow)"}}>
                  GO TO UPLOAD ⚡
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
