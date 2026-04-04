import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   TEAM DATA
═══════════════════════════════════════════════════════════════ */
const TEAM = [
  { name: "Payal Korde",        role: "Documentation",      img: "./public/payal.jpg",    linkedin: "https://www.linkedin.com/in/payal-korde-9832a9379/",        github: "https://github.com/payalkorde" },
  { name: "Vanshika Kotgirwar", role: "Frontend Developer", img: "./public/vanshika.jpg", linkedin: "https://www.linkedin.com/in/vanshika-kotgirwar-2019182b0/",  github: "https://github.com/vanshikakotgirwar02" },
  { name: "Piyush Ladukar",     role: "Backend Developer",  img: "./public/piyush.jpg",   linkedin: "https://www.linkedin.com/in/piyush-ladukar/",               github: "https://github.com/PiyushLadukar" },
  { name: "Yasmin Sheikh",      role: "Data Scientist",     img: "./public/yasmin.jpeg",  linkedin: "https://www.linkedin.com/in/yasminsheikh1250/",             github: "https://github.com/yasminsheikh3125" },
  { name: "Aditya Kanojiya",    role: "Documentation",      img: "./public/aditya.jpg",   linkedin: "https://www.linkedin.com/in/aditya-kanojiya-7a95112a3/",    github: "https://github.com/adityakanojiya120" },
];
const GUIDE = {
  name: "Prof. Priyanka Dudhe", role: "Project Guide",
  img: "./public/priyanka-mam.png",
  linkedin: "https://www.linkedin.com/in/priyankaa-dudhe-1ba42a58/",
  github: "https://github.com"
};
const LINKS = {
  github: "https://github.com/yasminsheikh3125/AnomaxR",
  paper:  "./public/reserch-paper.pdf",
  // YouTube watch URL → converted to embed below
  youtubeWatch: "https://www.youtube.com/watch?v=KqPgVuNlb_4",
};

// Convert watch URL to embed URL
function toEmbed(url) {
  try {
    const u = new URL(url);
    const v = u.searchParams.get("v");
    return v ? `https://www.youtube.com/embed/${v}?autoplay=0&rel=0` : url;
  } catch { return url; }
}

/* ─── ICONS ─────────────────────────────────────────────── */
const I = {
  bolt:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  brain:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96-.46 2.5 2.5 0 01-1.07-4.6A3 3 0 016 9.5a3 3 0 013.5-2.96V2z"/><path d="M14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96-.46 2.5 2.5 0 001.07-4.6A3 3 0 0118 9.5a3 3 0 00-3.5-2.96V2z"/></svg>,
  server:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>,
  upload:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  layers:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  bar:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  github:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>,
  linkedin: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  sun:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  moon:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  arrow:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  download: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  cpu:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  check:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  star:     <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  play:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  // Google icon as a proper SVG for the sign-in button
  google: (
    <svg viewBox="0 0 18 18" width="18" height="18" style={{flexShrink:0}}>
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
    </svg>
  ),
};

/* ─── TECH STACK — animated SVG logos ──────────────────── */
const TECH_STACK = [
  {
    name: "Python",
    color: "#3776ab",
    glow: "rgba(55,118,171,0.4)",
    logo: (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <path fill="#3776ab" d="M15.9 3C9.8 3 10.2 5.6 10.2 5.6v2.8h5.8v.8H8.1S4 8.7 4 14.8c0 6.2 3.5 6 3.5 6h2.1v-2.9s-.1-3.5 3.4-3.5h5.9s3.3.1 3.3-3.2V6.3S22.8 3 15.9 3zm-3.3 1.9c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1-1.1-.5-1.1-1.1.5-1.1 1.1-1.1z"/>
        <path fill="#ffd43b" d="M16.1 29c6.1 0 5.7-2.6 5.7-2.6v-2.8h-5.8v-.8h7.9s4.1.5 4.1-5.6c0-6.2-3.5-6-3.5-6h-2.1v2.9s.1 3.5-3.4 3.5h-5.9s-3.3-.1-3.3 3.2v5.7s-.6 3.5 6.3 3.5zm3.3-1.9c-.6 0-1.1-.5-1.1-1.1s.5-1.1 1.1-1.1 1.1.5 1.1 1.1-.5 1.1-1.1 1.1z"/>
      </svg>
    )
  },
  {
    name: "FastAPI",
    color: "#009688",
    glow: "rgba(0,150,136,0.4)",
    logo: (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <circle cx="16" cy="16" r="14" fill="#009688"/>
        <polygon points="14,8 22,16 14,16 14,24 10,16 18,16" fill="white"/>
      </svg>
    )
  },
  {
    name: "Sklearn",
    color: "#f89939",
    glow: "rgba(248,153,57,0.4)",
    logo: (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <ellipse cx="16" cy="16" rx="14" ry="10" fill="#f89939" opacity="0.9"/>
        <ellipse cx="16" cy="16" rx="8" ry="14" fill="#3499cd" opacity="0.8"/>
        <circle cx="16" cy="16" r="5" fill="#e1812c"/>
        <text x="16" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif">SK</text>
      </svg>
    )
  },
  {
    name: "React",
    color: "#61dafb",
    glow: "rgba(97,218,251,0.4)",
    logo: (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <circle cx="16" cy="16" r="2.8" fill="#61dafb"/>
        <ellipse cx="16" cy="16" rx="14" ry="5.5" fill="none" stroke="#61dafb" strokeWidth="1.5"/>
        <ellipse cx="16" cy="16" rx="14" ry="5.5" fill="none" stroke="#61dafb" strokeWidth="1.5" transform="rotate(60 16 16)"/>
        <ellipse cx="16" cy="16" rx="14" ry="5.5" fill="none" stroke="#61dafb" strokeWidth="1.5" transform="rotate(120 16 16)"/>
      </svg>
    )
  },
  {
    name: "Pandas",
    color: "#e36b00",
    glow: "rgba(227,107,0,0.4)",
    logo: (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <rect x="6" y="4" width="5" height="12" rx="2.5" fill="#130754"/>
        <rect x="21" y="4" width="5" height="12" rx="2.5" fill="#e36b00"/>
        <rect x="6" y="16" width="5" height="12" rx="2.5" fill="#e36b00"/>
        <rect x="21" y="16" width="5" height="12" rx="2.5" fill="#130754"/>
        <rect x="13" y="10" width="6" height="2" rx="1" fill="#130754" opacity="0.5"/>
        <rect x="13" y="20" width="6" height="2" rx="1" fill="#e36b00" opacity="0.5"/>
      </svg>
    )
  },
  {
    name: "Vite",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.4)",
    logo: (
      <svg viewBox="0 0 32 32" width="28" height="28">
        <polygon points="16,3 30,27 2,27" fill="none" stroke="#a855f7" strokeWidth="2"/>
        <polygon points="16,8 26,24 6,24" fill="#a855f7" opacity="0.2"/>
        <line x1="16" y1="10" x2="16" y2="22" stroke="#ffd62e" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="16" cy="23" r="1.5" fill="#ffd62e"/>
      </svg>
    )
  },
];

/* ─── CSS ────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Bebas+Neue&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

.h-root{
  --o:#f97316;--o2:#fb923c;--o3:#fbbf24;
  --odim:rgba(249,115,22,0.12);--oglow:rgba(249,115,22,0.35);--omid:rgba(249,115,22,0.2);
  --bg:#1a1208;--bg1:#231a0e;--bg2:#2c2010;--bg3:#362814;
  --bd:rgba(247,197,140,0.08);--bd2:rgba(247,197,140,0.16);--bd3:rgba(247,197,140,0.26);
  --t1:#fdf6e3;--t2:#d4b896;--t3:#8a6e52;--t4:#3d2a18;
  --green:#10b981;--red:#ef4444;--blue:#38bdf8;--violet:#a78bfa;
  --font:'Outfit',sans-serif;--mono:'JetBrains Mono',monospace;--display:'Bebas Neue',sans-serif;
  font-family:var(--font);background:var(--bg);color:var(--t1);
  overflow-x:hidden;position:relative;scroll-behavior:smooth;
}
.h-root.h-light{
  --bg:#fef9f0;--bg1:#fff8ed;--bg2:#fff3e0;--bg3:#fde8c8;
  --bd:rgba(160,100,40,0.1);--bd2:rgba(160,100,40,0.18);--bd3:rgba(160,100,40,0.28);
  --t1:#2c1a08;--t2:#5a3a1c;--t3:#9a6c44;--t4:#e8d4b4;
  --odim:rgba(249,115,22,0.1);--oglow:rgba(249,115,22,0.25);
}

/* ── KEYFRAMES ── */
@keyframes fadeInLeft{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
@keyframes fadeInRight{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}
@keyframes floatSlow{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-14px) rotate(1deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
@keyframes orb1{0%,100%{transform:translate(0,0)}33%{transform:translate(-40px,25px)}66%{transform:translate(30px,-20px)}}
@keyframes orb2{0%,100%{transform:translate(0,0)}33%{transform:translate(50px,-30px)}66%{transform:translate(-20px,40px)}}
@keyframes slideDown{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 20px var(--oglow)}50%{box-shadow:0 0 60px var(--oglow),0 0 100px rgba(249,115,22,0.15)}}
@keyframes cardFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes memberReveal{from{opacity:0;transform:translateY(50px) scale(0.9)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes ringExpand{0%{transform:scale(1);opacity:0.8}100%{transform:scale(1.6);opacity:0}}
@keyframes lineGrow{from{stroke-dashoffset:1000}to{stroke-dashoffset:0}}
@keyframes barGrowX{from{width:0}to{width:var(--w)}}
@keyframes dotPing{0%{transform:scale(1);opacity:1}70%{transform:scale(3);opacity:0}100%{opacity:0}}
@keyframes scanLine{0%{top:0%}100%{top:100%}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes techFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-8px) scale(1.05)}}
@keyframes techSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes techPulse{0%,100%{box-shadow:0 0 0 0 var(--tg,rgba(249,115,22,0.4))}50%{box-shadow:0 0 0 8px rgba(0,0,0,0)}}
@keyframes techReveal{from{opacity:0;transform:translateY(30px) scale(0.8)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes shimmerSweep{0%{left:-100%}100%{left:200%}}
@keyframes imgFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}

/* ── CURSOR GLOW ── */
.h-cursor-glow{position:fixed;width:300px;height:300px;pointer-events:none;z-index:999;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(249,115,22,0.06) 0%,transparent 70%);transition:left 0.1s,top 0.1s;}

/* ── BG ── */
.h-bg{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;}
.h-orb{position:absolute;border-radius:50%;filter:blur(80px);}
.h-orb-1{width:700px;height:700px;background:radial-gradient(circle,rgba(249,115,22,0.1),transparent 70%);top:-200px;left:-150px;animation:orb1 22s ease-in-out infinite;}
.h-orb-2{width:600px;height:600px;background:radial-gradient(circle,rgba(251,191,36,0.07),transparent 70%);bottom:-200px;right:-150px;animation:orb2 28s ease-in-out infinite;}
.h-orb-3{width:400px;height:400px;background:radial-gradient(circle,rgba(167,139,250,0.05),transparent 70%);top:40%;left:55%;animation:orb1 18s ease-in-out infinite reverse;}
.h-light .h-orb-1{background:radial-gradient(circle,rgba(249,115,22,0.12),transparent 70%);}

/* ── NAV ── */
.h-nav{position:fixed;top:0;left:0;right:0;z-index:100;height:64px;display:flex;align-items:center;border-bottom:1px solid var(--bd);background:rgba(26,18,8,0.85);backdrop-filter:blur(20px);animation:slideDown 0.6s ease both;transition:background 0.3s;}
.h-light .h-nav{background:rgba(254,249,240,0.9);}
.h-nav-inner{max-width:1260px;margin:0 auto;width:100%;padding:0 28px;display:flex;align-items:center;gap:32px;}
.h-nav-logo{font-family:var(--display);font-size:28px;letter-spacing:2px;color:var(--t1);cursor:pointer;flex-shrink:0;transition:opacity 0.2s;}
.h-nav-logo:hover{opacity:0.8;}
.h-hi{color:var(--o);text-shadow:0 0 20px var(--oglow);}
.h-nav-links{display:flex;align-items:center;gap:4px;flex:1;justify-content:center;}
.h-nav-link{padding:7px 16px;font-size:13px;font-weight:500;color:var(--t3);text-decoration:none;border-radius:8px;transition:all 0.2s;}
.h-nav-link:hover{color:var(--t1);background:var(--odim);}
.h-nav-right{display:flex;align-items:center;gap:10px;flex-shrink:0;}
.h-theme-btn{width:38px;height:38px;border-radius:8px;border:1px solid var(--bd2);background:transparent;color:var(--t3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
.h-theme-btn:hover{background:var(--odim);color:var(--o);border-color:var(--oglow);}
.h-theme-btn svg{width:16px;height:16px;}

/* NAV SIGN IN — dark glass, NOT orange */
.h-nav-signin{
  display:flex;align-items:center;gap:9px;padding:9px 18px;
  background:rgba(255,255,255,0.08);
  border:1px solid rgba(255,255,255,0.18);
  border-radius:10px;cursor:pointer;
  font-family:var(--font);font-size:13px;font-weight:600;color:var(--t1);
  transition:all 0.25s;backdrop-filter:blur(8px);
  position:relative;overflow:hidden;
}
.h-light .h-nav-signin{background:rgba(0,0,0,0.07);border-color:rgba(0,0,0,0.14);color:var(--t1);}
.h-nav-signin::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);transform:translateX(-100%);transition:transform 0.5s;}
.h-nav-signin:hover::before{transform:translateX(100%);}
.h-nav-signin:hover{background:rgba(255,255,255,0.14);border-color:rgba(255,255,255,0.3);transform:translateY(-1px);}

/* ── HERO ── */
.h-hero{min-height:100vh;display:flex;align-items:center;padding:80px 28px 60px;position:relative;z-index:1;}
.h-hero-inner{max-width:1260px;margin:0 auto;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;}
.h-hero-left{animation:fadeInLeft 0.8s cubic-bezier(0.22,1,0.36,1) both 0.1s;}
.h-hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border:1px solid var(--bd2);border-radius:20px;font-size:12px;font-family:var(--mono);color:var(--t3);background:var(--bg1);margin-bottom:24px;}
.h-hero-badge-dot{width:7px;height:7px;border-radius:50%;background:var(--o);flex-shrink:0;box-shadow:0 0 8px var(--o);animation:pulse 2s ease infinite;}
.h-hero-headline{font-family:var(--display);font-size:clamp(48px,5.5vw,76px);line-height:1.02;letter-spacing:1px;color:var(--t1);margin-bottom:20px;min-height:168px;}
.h-hero-sub{font-size:16px;line-height:1.8;color:var(--t2);margin-bottom:20px;max-width:500px;}
.h-hero-sub strong{color:var(--o);}

/* File format pill */
.h-file-pills{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:30px;}
.h-file-pill{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border:1px solid var(--bd2);border-radius:6px;font-size:11px;font-family:var(--mono);color:var(--t3);background:var(--bg1);transition:all 0.2s;}
.h-file-pill:hover{border-color:var(--o);color:var(--o);background:var(--odim);}
.h-file-pill-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;}

.h-hero-btns{display:flex;flex-wrap:wrap;gap:12px;}

/* BUTTONS */
.h-btn-primary{display:flex;align-items:center;gap:10px;padding:14px 28px;background:linear-gradient(135deg,var(--o),var(--o3));border:none;border-radius:12px;cursor:pointer;font-family:var(--font);font-size:15px;font-weight:700;color:#fff;transition:all 0.25s;box-shadow:0 8px 32px var(--oglow);position:relative;overflow:hidden;text-decoration:none;}
.h-btn-primary::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);transform:translateX(-100%);transition:transform 0.5s;}
.h-btn-primary:hover::before{transform:translateX(100%);}
.h-btn-primary:hover{box-shadow:0 12px 48px var(--oglow);transform:translateY(-2px);}
.h-btn-primary svg{width:18px;height:18px;flex-shrink:0;}
.h-btn-secondary{display:flex;align-items:center;gap:10px;padding:13px 26px;background:var(--bg1);border:1px solid var(--bd2);border-radius:12px;cursor:pointer;font-family:var(--font);font-size:15px;font-weight:600;color:var(--t1);transition:all 0.25s;text-decoration:none;}
.h-btn-secondary:hover{border-color:var(--o);color:var(--o);background:var(--odim);transform:translateY(-1px);}
.h-btn-secondary svg{width:16px;height:16px;flex-shrink:0;}
.h-btn-ghost{display:flex;align-items:center;gap:8px;padding:13px 20px;background:transparent;border:1px solid var(--bd);border-radius:12px;cursor:pointer;font-family:var(--font);font-size:14px;font-weight:500;color:var(--t3);transition:all 0.25s;text-decoration:none;}
.h-btn-ghost:hover{border-color:var(--bd2);color:var(--t1);background:var(--bg1);}
.h-btn-ghost svg{width:15px;height:15px;flex-shrink:0;}

/* HERO RIGHT - video */
.h-hero-right{animation:fadeInRight 0.8s cubic-bezier(0.22,1,0.36,1) both 0.2s;position:relative;}
.h-video-wrap{position:relative;border-radius:20px;overflow:hidden;border:1px solid var(--bd2);box-shadow:0 32px 80px rgba(0,0,0,0.5),0 0 60px var(--oglow);animation:floatSlow 6s ease-in-out infinite;}
.h-video-frame{width:100%;aspect-ratio:16/9;display:block;border:none;}
.h-video-badge{position:absolute;top:14px;left:14px;background:rgba(0,0,0,0.75);backdrop-filter:blur(8px);border:1px solid rgba(249,115,22,0.3);border-radius:8px;padding:6px 12px;font-size:11px;font-family:var(--mono);color:var(--o);display:flex;align-items:center;gap:6px;}
.h-video-badge-dot{width:6px;height:6px;border-radius:50%;background:#ef4444;animation:pulse 1.5s ease infinite;}
.h-hero-scroll{display:flex;justify-content:center;padding-top:48px;}
.h-scroll-line{width:1px;height:60px;background:linear-gradient(180deg,var(--o),transparent);animation:pulse 2s ease infinite;}

/* ── STATS ── */
.h-stats{display:grid;grid-template-columns:repeat(3,1fr);max-width:1000px;margin:0 auto;padding:0 28px 80px;gap:24px;position:relative;z-index:1;}
.h-stat-card{background:var(--bg1);border:1px solid var(--bd);border-radius:16px;padding:32px 28px;text-align:center;position:relative;overflow:hidden;transition:transform 0.3s,border-color 0.3s;}
.h-stat-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--odim),transparent);pointer-events:none;}
.h-stat-card:hover{transform:translateY(-4px);border-color:var(--o);}
.h-stat-val{font-family:var(--display);font-size:56px;color:var(--o);letter-spacing:1px;line-height:1;text-shadow:0 0 30px var(--oglow);}
.h-stat-label{font-size:14px;font-weight:600;color:var(--t1);margin-top:8px;}
.h-stat-sub{font-size:12px;color:var(--t3);font-family:var(--mono);margin-top:4px;}

/* ── SECTIONS ── */
.h-section{padding:100px 28px;position:relative;z-index:1;}
.h-section-alt{background:linear-gradient(180deg,transparent,rgba(249,115,22,0.03),transparent);}
.h-section-inner{max-width:1260px;margin:0 auto;}
.h-section-head{text-align:center;margin-bottom:64px;}
.h-section-tag{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-family:var(--mono);letter-spacing:2px;text-transform:uppercase;color:var(--o);padding:5px 14px;border:1px solid var(--bd2);border-radius:20px;background:var(--odim);margin-bottom:16px;}
.h-section-title{font-family:var(--display);font-size:clamp(32px,4vw,52px);letter-spacing:1px;color:var(--t1);line-height:1.1;margin-bottom:16px;}
.h-section-sub{font-size:16px;color:var(--t2);max-width:560px;margin:0 auto;line-height:1.7;}

/* ── FEATURES ── */
.h-features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.h-feat-card{background:var(--bg1);border:1px solid var(--bd);border-radius:16px;padding:28px;position:relative;overflow:hidden;transition:transform 0.3s cubic-bezier(0.22,1,0.36,1),border-color 0.3s,box-shadow 0.3s;}
.h-feat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--o),transparent);opacity:0;transition:opacity 0.3s;}
.h-feat-card:hover{transform:translateY(-6px);border-color:rgba(249,115,22,0.3);box-shadow:0 20px 48px rgba(0,0,0,0.3);}
.h-feat-card:hover::before{opacity:1;}
.h-feat-icon{width:44px;height:44px;border-radius:10px;background:var(--odim);border:1px solid var(--bd2);display:flex;align-items:center;justify-content:center;margin-bottom:16px;color:var(--o);transition:all 0.3s;}
.h-feat-card:hover .h-feat-icon{background:var(--omid);box-shadow:0 0 20px var(--oglow);}
.h-feat-icon svg{width:22px;height:22px;}
.h-feat-title{font-size:16px;font-weight:700;color:var(--t1);margin-bottom:10px;}
.h-feat-desc{font-size:13px;color:var(--t3);line-height:1.7;}

/* ── HOW IT WORKS ── */
.h-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:28px;position:relative;}
.h-steps::before{content:'';position:absolute;top:52px;left:12%;right:12%;height:1px;background:linear-gradient(90deg,transparent,var(--bd2),var(--bd2),transparent);}
.h-step{text-align:center;padding:32px 20px;position:relative;background:var(--bg1);border:1px solid var(--bd);border-radius:16px;transition:transform 0.3s,border-color 0.3s;}
.h-step:hover{transform:translateY(-4px);border-color:var(--bd2);}
.h-step-num{font-family:var(--display);font-size:56px;color:var(--odim);line-height:1;margin-bottom:8px;transition:color 0.3s;}
.h-step:hover .h-step-num{color:var(--omid);}
.h-step-icon{width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,var(--odim),var(--bg2));border:1px solid var(--bd2);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;color:var(--o);}
.h-step-icon svg{width:24px;height:24px;}
.h-step-title{font-size:15px;font-weight:700;color:var(--t1);margin-bottom:8px;}
.h-step-desc{font-size:13px;color:var(--t3);line-height:1.6;}

/* ══════════════════════════════════════════════════════════
   ANIMATED TECH STACK
══════════════════════════════════════════════════════════ */
.h-tech-grid{
  display:grid;grid-template-columns:repeat(6,1fr);gap:20px;
}
.h-tech-card{
  position:relative;
  background:var(--bg1);border:1px solid var(--bd);border-radius:18px;
  padding:28px 16px 20px;text-align:center;
  display:flex;flex-direction:column;align-items:center;gap:12px;
  cursor:default;overflow:hidden;
  transition:transform 0.4s cubic-bezier(0.22,1,0.36,1),border-color 0.3s,box-shadow 0.3s;
  animation:techReveal 0.6s cubic-bezier(0.22,1,0.36,1) both;
}
.h-tech-card::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse at 50% 0%,var(--tg,rgba(249,115,22,0.1)),transparent 70%);
  opacity:0;transition:opacity 0.3s;pointer-events:none;
}
.h-tech-card::after{
  content:'';position:absolute;left:-50%;width:50%;height:100%;top:0;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent);
  transform:skewX(-20deg);
  transition:left 0s;
}
.h-tech-card:hover::after{left:150%;transition:left 0.6s ease;}
.h-tech-card:hover::before{opacity:1;}
.h-tech-card:hover{
  transform:translateY(-10px) scale(1.04);
  border-color:var(--tc,rgba(249,115,22,0.4));
  box-shadow:0 20px 48px rgba(0,0,0,0.4),0 0 24px var(--tg,rgba(249,115,22,0.2));
}

.h-tech-logo-wrap{
  width:60px;height:60px;border-radius:14px;
  background:var(--bg2);border:1px solid var(--bd2);
  display:flex;align-items:center;justify-content:center;
  position:relative;transition:all 0.4s cubic-bezier(0.22,1,0.36,1);
  flex-shrink:0;
}
.h-tech-card:hover .h-tech-logo-wrap{
  background:var(--bg3);
  box-shadow:0 0 20px var(--tg,rgba(249,115,22,0.3));
  animation:techFloat 2s ease-in-out infinite;
}
.h-tech-name{
  font-size:12px;font-weight:700;color:var(--t2);font-family:var(--mono);
  letter-spacing:0.5px;transition:color 0.2s;
}
.h-tech-card:hover .h-tech-name{color:var(--t1);}

/* Glow ring under logo */
.h-tech-ring{
  position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);
  width:40px;height:4px;border-radius:2px;
  background:var(--tc,var(--o));opacity:0;
  filter:blur(4px);transition:opacity 0.3s;
}
.h-tech-card:hover .h-tech-ring{opacity:0.8;}

/* ══════════════════════════════════════════════════════════
   TEAM SECTION
══════════════════════════════════════════════════════════ */
.h-guide-wrap{display:flex;justify-content:center;margin-bottom:48px;}
.h-guide-card{
  position:relative;background:var(--bg1);border:1px solid var(--bd);border-radius:24px;
  padding:36px 48px;display:flex;align-items:center;gap:36px;
  max-width:560px;width:100%;overflow:hidden;
  transition:transform 0.35s cubic-bezier(0.22,1,0.36,1),border-color 0.3s,box-shadow 0.3s;
  animation:scaleIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
}
.h-guide-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--odim),transparent 50%);pointer-events:none;}
.h-guide-card::after{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--o),var(--o3),transparent);border-radius:24px 24px 0 0;}
.h-guide-card:hover{transform:translateY(-8px);border-color:rgba(249,115,22,0.4);box-shadow:0 24px 60px rgba(0,0,0,0.4),0 0 40px var(--oglow);}
.h-guide-badge{position:absolute;top:16px;right:16px;font-size:10px;font-family:var(--mono);letter-spacing:1px;text-transform:uppercase;color:var(--o);background:var(--odim);border:1px solid rgba(249,115,22,0.3);padding:4px 10px;border-radius:6px;}
.h-guide-img-wrap{position:relative;flex-shrink:0;}
.h-guide-img{
  width:130px;height:130px;border-radius:50%;object-fit:cover;
  border:3px solid var(--o);
  box-shadow:0 0 30px var(--oglow),0 8px 24px rgba(0,0,0,0.4);
  display:block;transition:transform 0.3s;
  animation:imgFloat 4s ease-in-out infinite;
}
.h-guide-card:hover .h-guide-img{transform:scale(1.06);}
.h-guide-ring{position:absolute;inset:-10px;border-radius:50%;border:2px solid rgba(249,115,22,0.3);animation:ringExpand 3s ease-out infinite;}
.h-guide-ring2{position:absolute;inset:-20px;border-radius:50%;border:1px solid rgba(249,115,22,0.15);animation:ringExpand 3s ease-out infinite 1.5s;}
.h-guide-info{flex:1;}
.h-guide-name{font-family:var(--display);font-size:28px;letter-spacing:0.5px;color:var(--t1);line-height:1;margin-bottom:6px;}
.h-guide-role{font-size:13px;color:var(--o);font-weight:600;font-family:var(--mono);margin-bottom:18px;}
.h-guide-links{display:flex;gap:10px;}
.h-guide-link{width:38px;height:38px;border-radius:9px;border:1px solid var(--bd2);background:var(--bg2);color:var(--t3);display:flex;align-items:center;justify-content:center;text-decoration:none;transition:all 0.2s;}
.h-guide-link:hover{background:var(--odim);color:var(--o);border-color:var(--oglow);}
.h-guide-link svg{width:17px;height:17px;}

/* TEAM GRID */
.h-team-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:22px;}
.h-member-card{
  background:var(--bg1);border:1px solid var(--bd);border-radius:22px;
  padding:32px 20px 24px;text-align:center;
  position:relative;overflow:hidden;
  transition:transform 0.35s cubic-bezier(0.22,1,0.36,1),border-color 0.3s,box-shadow 0.3s;
  animation:memberReveal 0.6s cubic-bezier(0.22,1,0.36,1) both;
  cursor:default;
}
.h-member-card::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,var(--odim),transparent 50%);opacity:0;transition:opacity 0.3s;pointer-events:none;}
.h-member-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,var(--o),transparent);opacity:0;transition:opacity 0.3s;}
.h-member-card:hover::before{opacity:1;}
.h-member-card:hover::after{opacity:1;}
.h-member-card:hover{transform:translateY(-12px) scale(1.03);border-color:rgba(249,115,22,0.4);box-shadow:0 24px 56px rgba(0,0,0,0.4),0 0 32px var(--oglow);}

.h-member-img-wrap{position:relative;display:inline-block;margin-bottom:18px;}
.h-member-img{
  /* LARGE images */
  width:110px;height:110px;
  border-radius:50%;object-fit:cover;object-position:center top;
  display:block;
  border:3px solid var(--bd2);
  transition:all 0.4s cubic-bezier(0.22,1,0.36,1);
  box-shadow:0 8px 28px rgba(0,0,0,0.35);
  animation:imgFloat 4s ease-in-out infinite;
}
.h-member-card:hover .h-member-img{
  border-color:var(--o);
  box-shadow:0 0 28px var(--oglow),0 14px 36px rgba(0,0,0,0.45);
  transform:scale(1.1);
}
.h-member-status{position:absolute;bottom:6px;right:6px;width:16px;height:16px;border-radius:50%;background:var(--green);border:2px solid var(--bg1);box-shadow:0 0 8px var(--green);}
.h-member-name{font-size:15px;font-weight:700;color:var(--t1);margin-bottom:5px;transition:color 0.2s;}
.h-member-card:hover .h-member-name{color:var(--o);}
.h-member-role{font-size:11px;color:var(--t3);font-family:var(--mono);margin-bottom:18px;line-height:1.4;}
.h-member-links{display:flex;justify-content:center;gap:9px;}
.h-member-link{width:34px;height:34px;border-radius:9px;border:1px solid var(--bd);background:var(--bg2);color:var(--t3);display:flex;align-items:center;justify-content:center;text-decoration:none;transition:all 0.2s;}
.h-member-link:hover{background:var(--odim);color:var(--o);border-color:var(--oglow);transform:scale(1.12);}
.h-member-link svg{width:15px;height:15px;}

/* ── CTA ── */
.h-cta{padding:100px 28px;position:relative;z-index:1;background:radial-gradient(ellipse 80% 60% at 50% 50%,rgba(249,115,22,0.06),transparent);}
.h-cta-inner{max-width:680px;margin:0 auto;text-align:center;position:relative;}
.h-cta-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:300px;border-radius:50%;background:radial-gradient(ellipse,rgba(249,115,22,0.12),transparent 70%);pointer-events:none;}
.h-cta-title{font-family:var(--display);font-size:clamp(40px,5vw,64px);letter-spacing:1px;color:var(--t1);margin-bottom:16px;}
.h-cta-sub{font-size:16px;color:var(--t2);margin-bottom:36px;line-height:1.7;}
.h-cta-btn{
  display:inline-flex;align-items:center;gap:14px;padding:18px 44px;
  background:linear-gradient(135deg,var(--o),var(--o3));
  border:none;border-radius:16px;cursor:pointer;
  font-family:var(--font);font-size:18px;font-weight:700;color:#fff;
  transition:all 0.25s;box-shadow:0 12px 48px var(--oglow);
  position:relative;overflow:hidden;margin-bottom:28px;
  animation:glowPulse 3s ease-in-out infinite;
}
.h-cta-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);transform:translateX(-100%);transition:transform 0.6s;}
.h-cta-btn:hover::before{transform:translateX(100%);}
.h-cta-btn:hover{transform:translateY(-3px);box-shadow:0 20px 60px var(--oglow);}
.h-cta-checks{display:flex;justify-content:center;gap:24px;flex-wrap:wrap;}
.h-cta-check{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--t3);}
.h-check-icon{width:18px;height:18px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;}
.h-check-icon svg{width:10px;height:10px;}

/* ── FOOTER ── */
.h-footer{border-top:1px solid var(--bd);padding:52px 28px;position:relative;z-index:1;background:rgba(16,11,4,0.6);}
.h-light .h-footer{background:rgba(254,249,240,0.8);}
.h-footer-inner{max-width:1260px;margin:0 auto;text-align:center;}
.h-footer-logo{font-family:var(--display);font-size:38px;letter-spacing:2px;color:var(--t1);margin-bottom:8px;}
.h-footer-sub{font-size:14px;color:var(--t3);margin-bottom:28px;}
/* Footer sign-in — same glass style as nav */
.h-footer-signin{
  display:inline-flex;align-items:center;gap:12px;padding:14px 36px;
  background:rgba(255,255,255,0.1);
  border:1px solid rgba(255,255,255,0.22);
  border-radius:14px;cursor:pointer;
  font-family:var(--font);font-size:16px;font-weight:600;color:var(--t1);
  transition:all 0.25s;backdrop-filter:blur(12px);
  position:relative;overflow:hidden;margin-bottom:28px;
  text-decoration:none;
}
.h-light .h-footer-signin{background:rgba(0,0,0,0.07);border-color:rgba(0,0,0,0.15);color:var(--t1);}
.h-footer-signin::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);transform:translateX(-100%);transition:transform 0.5s;}
.h-footer-signin:hover::before{transform:translateX(100%);}
.h-footer-signin:hover{background:rgba(255,255,255,0.18);border-color:rgba(255,255,255,0.36);transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.2);}
.h-footer-btns{display:flex;justify-content:center;gap:12px;margin-bottom:24px;flex-wrap:wrap;}
.h-footer-btn{display:flex;align-items:center;gap:8px;padding:10px 20px;background:var(--bg1);border:1px solid var(--bd2);border-radius:10px;color:var(--t2);text-decoration:none;font-size:13px;font-weight:500;transition:all 0.2s;}
.h-footer-btn:hover{border-color:var(--bd3);color:var(--t1);}
.h-footer-btn svg{width:15px;height:15px;}
.h-footer-copy{font-size:12px;color:var(--t4);font-family:var(--mono);}

/* ── SCROLL REVEAL ── */
.reveal{opacity:0;transform:translateY(36px);transition:opacity 0.7s cubic-bezier(0.22,1,0.36,1),transform 0.7s cubic-bezier(0.22,1,0.36,1);}
.revealed{opacity:1;transform:none;}

/* ── RESPONSIVE ── */
@media(max-width:1100px){.h-tech-grid{grid-template-columns:repeat(3,1fr);}}
@media(max-width:1024px){.h-team-grid{grid-template-columns:repeat(3,1fr);}.h-features-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:768px){
  .h-hero-inner{grid-template-columns:1fr;gap:40px;}
  .h-steps{grid-template-columns:repeat(2,1fr);}.h-steps::before{display:none;}
  .h-team-grid{grid-template-columns:repeat(2,1fr);}
  .h-tech-grid{grid-template-columns:repeat(2,1fr);}
  .h-stats{grid-template-columns:1fr;}.h-features-grid{grid-template-columns:1fr;}
  .h-nav-links{display:none;}.h-hero-headline{min-height:auto;}
  .h-guide-card{flex-direction:column;text-align:center;}
}
`;

/* ── CANVAS PARTICLES ── */
function ParticleCanvas({ theme }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const particles = useRef([]);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = window.innerWidth, H = window.innerHeight;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    particles.current = Array.from({ length: 55 }, () => ({ x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-0.5)*0.25, vy:(Math.random()-0.5)*0.25, r:Math.random()*1.4+0.4, alpha:Math.random()*0.4+0.08 }));
    const color = theme==="light" ? "160,100,40" : "249,115,22";
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      const ps = particles.current;
      ps.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(${color},${p.alpha})`; ctx.fill();
      });
      for(let i=0;i<ps.length;i++) for(let j=i+1;j<ps.length;j++){
        const dx=ps[i].x-ps[j].x, dy=ps[i].y-ps[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<110){ ctx.beginPath(); ctx.moveTo(ps[i].x,ps[i].y); ctx.lineTo(ps[j].x,ps[j].y); ctx.strokeStyle=`rgba(${color},${0.05*(1-d/110)})`; ctx.lineWidth=0.5; ctx.stroke(); }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize",resize); cancelAnimationFrame(animRef.current); };
  }, [theme]);
  return <canvas ref={canvasRef} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0,opacity:0.65}}/>;
}

function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const move = e => { if(ref.current){ ref.current.style.left=e.clientX+"px"; ref.current.style.top=e.clientY+"px"; } };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div ref={ref} className="h-cursor-glow"/>;
}

function Counter({ to, suffix="", duration=2000, start }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let s = null;
    const step = ts => { if(!s)s=ts; const p=Math.min((ts-s)/duration,1); const e=1-Math.pow(1-p,3); setVal(Math.round(e*to)); if(p<1)requestAnimationFrame(step); else setVal(to); };
    requestAnimationFrame(step);
  }, [start, to]);
  return <>{val}{suffix}</>;
}

function Typewriter({ texts, speed=55, pause=2000 }) {
  const [display, setDisplay] = useState("");
  const [tIdx, setTIdx] = useState(0);
  const [cIdx, setCIdx] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = texts[tIdx]; let t;
    if (!del && cIdx < cur.length) t = setTimeout(() => { setDisplay(cur.slice(0,cIdx+1)); setCIdx(c=>c+1); }, speed);
    else if (!del && cIdx===cur.length) t = setTimeout(() => setDel(true), pause);
    else if (del && cIdx>0) t = setTimeout(() => { setDisplay(cur.slice(0,cIdx-1)); setCIdx(c=>c-1); }, speed/2);
    else if (del && cIdx===0) { setDel(false); setTIdx(t=>(t+1)%texts.length); }
    return () => clearTimeout(t);
  }, [cIdx, del, tIdx, texts, speed, pause]);
  return (
    <span>
      {display}
      <span style={{display:"inline-block",width:3,height:"0.85em",background:"var(--o)",marginLeft:4,verticalAlign:"text-bottom",animation:"blink 1s step-end infinite"}}/>
    </span>
  );
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){e.target.classList.add("revealed");io.unobserve(e.target);} }), { threshold:0.08 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

/* ══════════════════════════════════════════════════════════
   MAIN HOME COMPONENT
══════════════════════════════════════════════════════════ */
export default function Home({ onLaunchApp, theme, toggleTheme }) {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);
  useReveal();

  useEffect(() => {
    if (!statsRef.current) return;
    const io = new IntersectionObserver(([e]) => { if(e.isIntersecting)setStatsVisible(true); }, { threshold:0.3 });
    io.observe(statsRef.current);
    return () => io.disconnect();
  }, []);

  const FEATURES = [
    { icon:I.brain,    title:"Isolation Forest ML",    desc:"Unsupervised anomaly detection — no labels needed, works directly on raw energy streams with high precision." },
    { icon:I.server,   title:"FastAPI Backend",         desc:"Lightning-fast Python backend processes datasets in under 50ms, production-ready with REST endpoints." },
    { icon:I.upload,   title:"Multi-Format Ingestion",  desc:"Smart parser handles CSV, XLS, XLSX, TXT and more — auto-detects submetering zones and resamples hourly." },
    { icon:I.activity, title:"Real-Time Detection",     desc:"Instant anomaly flagging with peak hour analysis, night/day waste scoring, and efficiency metrics dashboard." },
    { icon:I.layers,   title:"Scalable Architecture",   desc:"Microservice-ready design with Docker support, horizontal scaling, and clean REST API endpoints." },
    { icon:I.bar,      title:"Visual Dashboard",        desc:"Interactive charts, correlation heatmaps, zone breakdowns — all rendered instantly from a single upload." },
  ];

  const STEPS = [
    { icon:I.upload, title:"Upload Dataset",  desc:"Drag & drop your CSV, XLS, XLSX, or TXT file. Supports multi-zone submetering data." },
    { icon:I.cpu,    title:"Preprocessing",   desc:"Data is cleaned, resampled to hourly intervals and normalized automatically." },
    { icon:I.brain,  title:"ML Detection",    desc:"Isolation Forest model scores each point — anomalies are flagged instantly." },
    { icon:I.bar,    title:"Dashboard",        desc:"Visualize anomalies, peak usage, zone breakdowns and efficiency scores." },
  ];

  // File formats supported
  const FILE_FORMATS = [
    { ext:".CSV",  color:"#10b981" },
    { ext:".XLS",  color:"#38bdf8" },
    { ext:".XLSX", color:"#3b82f6" },
    { ext:".TXT",  color:"#a78bfa" },
    { ext:".XLSB", color:"#f97316" },
  ];

  const embedUrl = toEmbed(LINKS.youtubeWatch);

  return (
    <div className={`h-root${theme==="light"?" h-light":""}`}>
      <style>{CSS}</style>
      <CursorGlow/>
      <div className="h-bg">
        <div className="h-orb h-orb-1"/>
        <div className="h-orb h-orb-2"/>
        <div className="h-orb h-orb-3"/>
      </div>
      <ParticleCanvas theme={theme}/>

      {/* ── NAV ── */}
      <nav className="h-nav">
        <div className="h-nav-inner">
          <div className="h-nav-logo" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>
            AN<span className="h-hi">OM</span>AX
          </div>
          <div className="h-nav-links">
            {["Features","How It Works","Team"].map(l=>(
              <a key={l} className="h-nav-link" href={`#${l.toLowerCase().replace(/ /g,"-")}`}>{l}</a>
            ))}
          </div>
          <div className="h-nav-right">
            <button className="h-theme-btn" onClick={toggleTheme}>{theme==="dark"?I.sun:I.moon}</button>
            <button className="h-nav-signin" onClick={onLaunchApp}>
              {I.google}
              <span>Sign in</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="h-hero">
        <div className="h-hero-inner">
          <div className="h-hero-left reveal">
            <div className="h-hero-badge">
              <span className="h-hero-badge-dot"/>
              Anomaly Detection System
            </div>
            <h1 className="h-hero-headline">
              <Typewriter texts={[
                "Electricity Intelligence Reimagined",
                "Anomaly Detection at Scale",
                "ML-Powered Energy Insights",
                "Smart Grid Analytics"
              ]}/>
            </h1>
            <p className="h-hero-sub">
              Anomax uses <strong>Isolation Forest</strong> and <strong>FastAPI</strong> to detect unusual electricity consumption patterns — upload your dataset and get deep insights in seconds.
            </p>
            {/* Supported file formats */}
            <div className="h-file-pills">
              <span style={{fontSize:12,color:"var(--t3)",fontFamily:"var(--mono)",alignSelf:"center"}}>Supports:</span>
              {FILE_FORMATS.map(f=>(
                <div key={f.ext} className="h-file-pill">
                  <div className="h-file-pill-dot" style={{background:f.color}}/>
                  {f.ext}
                </div>
              ))}
            </div>
            <div className="h-hero-btns">
              <button className="h-btn-primary" onClick={onLaunchApp}>
                {I.bolt}<span>Launch App</span>
              </button>
              <a className="h-btn-secondary" href="#how-it-works">
                {I.play}<span>See How It Works</span>
              </a>
              <a className="h-btn-ghost" href={LINKS.paper} target="_blank" rel="noopener noreferrer" download>
                {I.download}<span>Research Paper</span>
              </a>
              <a className="h-btn-ghost" href={LINKS.github} target="_blank" rel="noopener noreferrer">
                {I.github}<span>GitHub</span>
              </a>
            </div>
          </div>
          <div className="h-hero-right reveal" style={{animationDelay:"0.2s"}}>
            <div className="h-video-wrap">
              <div className="h-video-badge"><span className="h-video-badge-dot"/>DEMO VIDEO</div>
              {/* Properly embedded YouTube iframe */}
              <iframe
                src={embedUrl}
                title="Anomax Demo"
                className="h-video-frame"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
        <div className="h-hero-scroll"><div className="h-scroll-line"/></div>
      </section>

      {/* ── STATS ── */}
      <section className="h-stats" ref={statsRef}>
        {[
          {val:98, suffix:"%",  label:"Detection Accuracy",  sub:"Isolation Forest precision"},
          {val:1000,suffix:"+", label:"Data Points / Upload", sub:"Hourly resampled records"},
          {val:50, suffix:"ms", label:"Response Time",        sub:"FastAPI backend speed"},
        ].map((s,i)=>(
          <div key={i} className="h-stat-card reveal" style={{animationDelay:`${i*0.12}s`}}>
            <div className="h-stat-val"><Counter to={s.val} suffix={s.suffix} start={statsVisible}/></div>
            <div className="h-stat-label">{s.label}</div>
            <div className="h-stat-sub">{s.sub}</div>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section className="h-section" id="features">
        <div className="h-section-inner">
          <div className="h-section-head reveal">
            <div className="h-section-tag">Platform Features</div>
            <h2 className="h-section-title">Everything you need to detect energy anomalies</h2>
            <p className="h-section-sub">From raw dataset to actionable insights — fully automated, production-ready pipeline.</p>
          </div>
          <div className="h-features-grid">
            {FEATURES.map((f,i)=>(
              <div key={i} className="h-feat-card reveal" style={{animationDelay:`${i*0.08}s`}}>
                <div className="h-feat-icon">{f.icon}</div>
                <div className="h-feat-title">{f.title}</div>
                <div className="h-feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="h-section h-section-alt" id="how-it-works">
        <div className="h-section-inner">
          <div className="h-section-head reveal">
            <div className="h-section-tag">Pipeline</div>
            <h2 className="h-section-title">How Anomax Works</h2>
            <p className="h-section-sub">Four intelligent steps from raw data to actionable energy intelligence.</p>
          </div>
          <div className="h-steps">
            {STEPS.map((s,i)=>(
              <div key={i} className="h-step reveal" style={{animationDelay:`${i*0.1}s`}}>
                <div className="h-step-num">{String(i+1).padStart(2,"0")}</div>
                <div className="h-step-icon">{s.icon}</div>
                <div className="h-step-title">{s.title}</div>
                <div className="h-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK — animated logo cards ── */}
      <section className="h-section" id="tech">
        <div className="h-section-inner">
          <div className="h-section-head reveal">
            <div className="h-section-tag">Tech Stack</div>
            <h2 className="h-section-title">Built with industry-grade tools</h2>
            <p className="h-section-sub">A carefully chosen stack for performance, scalability, and developer experience.</p>
          </div>
          <div className="h-tech-grid">
            {TECH_STACK.map((t,i)=>(
              <div
                key={i}
                className="h-tech-card reveal"
                style={{
                  animationDelay:`${i*0.1}s`,
                  "--tc":t.color,
                  "--tg":t.glow,
                }}
              >
                <div className="h-tech-logo-wrap">
                  {t.logo}
                  <div className="h-tech-ring"/>
                </div>
                <div className="h-tech-name">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="h-section h-section-alt" id="team">
        <div className="h-section-inner">
          <div className="h-section-head reveal">
            <div className="h-section-tag">The Team</div>
            <h2 className="h-section-title">Built by passionate engineers</h2>
            <p className="h-section-sub">A multidisciplinary team combining ML, backend, and frontend expertise.</p>
          </div>

          {/* Guide */}
          <div className="h-guide-wrap reveal">
            <div className="h-guide-card">
              <div className="h-guide-badge">Project Guide</div>
              <div className="h-guide-img-wrap">
                <img src={GUIDE.img} alt={GUIDE.name} className="h-guide-img"/>
                <div className="h-guide-ring"/>
                <div className="h-guide-ring2"/>
              </div>
              <div className="h-guide-info">
                <div className="h-guide-name">{GUIDE.name}</div>
                <div className="h-guide-role">{GUIDE.role}</div>
                <div className="h-guide-links">
                  <a href={GUIDE.linkedin} className="h-guide-link" target="_blank" rel="noopener noreferrer">{I.linkedin}</a>
                  <a href={GUIDE.github}   className="h-guide-link" target="_blank" rel="noopener noreferrer">{I.github}</a>
                </div>
              </div>
            </div>
          </div>

          {/* Team members */}
          <div className="h-team-grid">
            {TEAM.map((m,i)=>(
              <div key={i} className="h-member-card reveal" style={{animationDelay:`${i*0.1}s`}}>
                <div className="h-member-img-wrap">
                  <img src={m.img} alt={m.name} className="h-member-img"/>
                  <div className="h-member-status"/>
                </div>
                <div className="h-member-name">{m.name}</div>
                <div className="h-member-role">{m.role}</div>
                <div className="h-member-links">
                  <a href={m.linkedin} className="h-member-link" target="_blank" rel="noopener noreferrer">{I.linkedin}</a>
                  <a href={m.github}   className="h-member-link" target="_blank" rel="noopener noreferrer">{I.github}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="h-cta">
        <div className="h-cta-inner reveal">
          <div className="h-cta-glow"/>
          <div className="h-section-tag" style={{display:"inline-flex",justifyContent:"center"}}>Get Started Today</div>
          <h2 className="h-cta-title">Start detecting anomalies today</h2>
          <p className="h-cta-sub">Upload your first dataset in seconds. No setup required.</p>
          
          <div className="h-cta-checks">
            {["Free to use","User Friendly","Open Source"].map(c=>(
              <div key={c} className="h-cta-check">
                <span className="h-check-icon">{I.check}</span>{c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="h-footer">
        <div className="h-footer-inner">
          <div className="h-footer-logo">AN<span className="h-hi">OM</span>AX</div>
          <p className="h-footer-sub">AI-powered electricity anomaly detection platform.</p>
          {/* Footer Sign In — glass style, readable */}
          <div style={{marginBottom:8}}>
            <button className="h-footer-signin" onClick={onLaunchApp}>
              {I.google}
              <span>Sign in with Google — It's Free</span>
            </button>
          </div>
          <div className="h-footer-btns">
            <a href={LINKS.github} className="h-footer-btn" target="_blank" rel="noopener noreferrer">
              {I.github}<span>GitHub Repo</span>
            </a>
            <a href={LINKS.paper} className="h-footer-btn" download target="_blank" rel="noopener noreferrer">
              {I.download}<span>Research Paper</span>
            </a>
          </div>
          <div className="h-footer-copy">© 2026 Anomax · Group No. 29 · Mini Project</div>
        </div>
      </footer>
    </div>
  );
}