import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   TEAM DATA — swap these with your real info
═══════════════════════════════════════════════════════════════ */
const TEAM = [
  { name: "Aryan Mehta",     role: "Full Stack Developer",  img: "https://randomuser.me/api/portraits/men/11.jpg",  linkedin: "https://linkedin.com", github: "https://github.com" },
  { name: "Sneha Patil",     role: "ML Engineer",           img: "https://randomuser.me/api/portraits/women/21.jpg",linkedin: "https://linkedin.com", github: "https://github.com" },
  { name: "Rohan Desai",     role: "Backend Developer",     img: "https://randomuser.me/api/portraits/men/32.jpg",  linkedin: "https://linkedin.com", github: "https://github.com" },
  { name: "Priya Sharma",    role: "Frontend Developer",    img: "https://randomuser.me/api/portraits/women/44.jpg",linkedin: "https://linkedin.com", github: "https://github.com" },
  { name: "Karan Joshi",     role: "Data Scientist",        img: "https://randomuser.me/api/portraits/men/55.jpg",  linkedin: "https://linkedin.com", github: "https://github.com" },
];
const GUIDE = {
  name: "Prof. Priyanka Dudhe", role: "Project Guide",
  img: "https://randomuser.me/api/portraits/women/2.jpg",
  linkedin: "https://linkedin.com", github: "https://github.com"
};

/* ═══════════════════════════════════════════════════════════════
   LINKS — swap these
═══════════════════════════════════════════════════════════════ */
const LINKS = {
  github:   "https://github.com",                         // ← your repo
  paper:    "/research-paper.pdf",                        // ← put PDF in /public/
  demo:     "https://www.youtube.com/embed/dQw4w9WgXcQ",  // ← your demo video
  google:   "#",                                          // handled by onLaunchApp
};

/* ═══════════════════════════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════════════════════════ */
const I = {
  bolt:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  brain:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96-.46 2.5 2.5 0 01-1.07-4.6A3 3 0 016 9.5a3 3 0 013.5-2.96V2z"/><path d="M14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96-.46 2.5 2.5 0 001.07-4.6A3 3 0 0118 9.5a3 3 0 00-3.5-2.96V2z"/></svg>,
  server:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>,
  upload:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  layers:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  bar:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  shield:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  github:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>,
  linkedin: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  sun:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  moon:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  google:   <svg viewBox="0 0 18 18" width="16" height="16"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>,
  arrow:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  file:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  cpu:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  check:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  external: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  download: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
};

/* ═══════════════════════════════════════════════════════════════
   CANVAS PARTICLE BACKGROUND
═══════════════════════════════════════════════════════════════ */
function ParticleCanvas({ theme }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = window.innerWidth, H = window.innerHeight;

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = 60;
    particles.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const color = theme === "light" ? "160,100,40" : "249,115,22";

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const ps = particles.current;
      ps.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.alpha})`;
        ctx.fill();
      });
      // Draw lines between close particles
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.strokeStyle = `rgba(${color},${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [theme]);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0, opacity: 0.7,
    }} />
  );
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════════════════════════════════════ */
function Counter({ to, suffix = "", duration = 2000, start }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let s = null;
    const step = ts => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(e * to));
      if (p < 1) requestAnimationFrame(step);
      else setVal(to);
    };
    requestAnimationFrame(step);
  }, [start, to]);
  return <>{val}{suffix}</>;
}

/* ═══════════════════════════════════════════════════════════════
   TYPING ANIMATION
═══════════════════════════════════════════════════════════════ */
function Typewriter({ texts, speed = 60, pause = 1800 }) {
  const [display, setDisplay] = useState("");
  const [tIdx,    setTIdx]    = useState(0);
  const [cIdx,    setCIdx]    = useState(0);
  const [deleting,setDeleting]= useState(false);

  useEffect(() => {
    const current = texts[tIdx];
    let timeout;
    if (!deleting && cIdx < current.length) {
      timeout = setTimeout(() => { setDisplay(current.slice(0, cIdx + 1)); setCIdx(c => c + 1); }, speed);
    } else if (!deleting && cIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && cIdx > 0) {
      timeout = setTimeout(() => { setDisplay(current.slice(0, cIdx - 1)); setCIdx(c => c - 1); }, speed / 2);
    } else if (deleting && cIdx === 0) {
      setDeleting(false);
      setTIdx(t => (t + 1) % texts.length);
    }
    return () => clearTimeout(timeout);
  }, [cIdx, deleting, tIdx, texts, speed, pause]);

  return (
    <span>
      {display}
      <span style={{ display: "inline-block", width: 3, height: "0.85em", background: "var(--h-orange)", marginLeft: 3, verticalAlign: "text-bottom", animation: "cursorBlink 1s step-end infinite" }} />
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCROLL REVEAL HOOK
═══════════════════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("revealed"); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

/* ═══════════════════════════════════════════════════════════════
   CURSOR GLOW
═══════════════════════════════════════════════════════════════ */
function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const move = e => {
      if (ref.current) {
        ref.current.style.left = e.clientX + "px";
        ref.current.style.top  = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div ref={ref} className="h-cursor-glow" />;
}

/* ═══════════════════════════════════════════════════════════════
   MINI DASHBOARD MOCK
═══════════════════════════════════════════════════════════════ */
function DashboardMock() {
  const bars = [40, 65, 30, 80, 55, 95, 42, 70, 38, 88, 60, 45];
  const anomalies = [5, 9]; // index of anomaly bars
  return (
    <div className="h-dash-mock">
      <div className="h-dash-topbar">
        <div className="h-dash-logo">AN<span>OM</span>AX</div>
        <div style={{ display: "flex", gap: 6 }}>
          {["#ef4444", "#f59e0b", "#10b981"].map((c, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
          ))}
        </div>
      </div>
      <div className="h-dash-stats">
        {[["1,247", "Records"], ["23", "Anomalies"], ["98.1%", "Accuracy"]].map(([v, l]) => (
          <div key={l} className="h-dash-stat">
            <div className="h-dash-stat-val">{v}</div>
            <div className="h-dash-stat-lbl">{l}</div>
          </div>
        ))}
      </div>
      <div className="h-dash-chart">
        <div className="h-dash-chart-label">Energy Consumption — Anomaly Detection</div>
        <div className="h-dash-bars">
          {bars.map((h, i) => (
            <div key={i} className="h-dash-bar-wrap">
              <div
                className={`h-dash-bar${anomalies.includes(i) ? " anomaly" : ""}`}
                style={{ height: `${h}%`, animationDelay: `${i * 0.06}s` }}
              />
            </div>
          ))}
        </div>
        <div className="h-dash-chart-footer">
          <span className="h-dash-legend normal" />Normal
          <span className="h-dash-legend anom" />Anomaly
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN HOME COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function Home({ onLaunchApp, theme, toggleTheme }) {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);
  useReveal();

  // Stats counter trigger
  useEffect(() => {
    if (!statsRef.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
    io.observe(statsRef.current);
    return () => io.disconnect();
  }, []);

  const FEATURES = [
    { icon: I.brain,    title: "Isolation Forest ML",    desc: "Unsupervised anomaly detection using Isolation Forest — no labels needed, works on raw energy streams." },
    { icon: I.server,   title: "FastAPI Backend",        desc: "Lightning-fast Python backend processes datasets in under 50ms, built for production scale." },
    { icon: I.upload,   title: "CSV Ingestion Pipeline", desc: "Smart CSV parser handles multi-column energy datasets, auto-detects submetering zones." },
    { icon: I.activity, title: "Real-Time Detection",    desc: "Instant anomaly flagging with peak hour analysis, night/day waste scoring, and efficiency metrics." },
    { icon: I.layers,   title: "Scalable Architecture",  desc: "Microservice-ready design with Docker support, horizontal scaling, and REST API endpoints." },
    { icon: I.bar,      title: "Visual Dashboard",       desc: "Interactive charts, correlation heatmaps, zone breakdowns — all rendered from a single upload." },
  ];

  const STEPS = [
    { icon: I.upload,   title: "Upload CSV",             desc: "Drag and drop your electricity dataset. Supports multi-zone submetering data." },
    { icon: I.cpu,      title: "Preprocessing",          desc: "Data is cleaned, resampled to hourly intervals and normalized automatically." },
    { icon: I.brain,    title: "ML Detection",           desc: "Isolation Forest model scores each point — anomalies are flagged instantly." },
    { icon: I.bar,      title: "Dashboard Insights",     desc: "Visualize anomalies, peak usage, zone breakdowns and efficiency scores." },
  ];

  const TECH = [
    { name: "Python",           color: "#3776ab" },
    { name: "FastAPI",          color: "#009688" },
    { name: "Isolation Forest", color: "#f59e0b" },
    { name: "React",            color: "#61dafb" },
    { name: "NextAuth",         color: "#a78bfa" },
    { name: "Pandas",           color: "#150458" },
  ];

  return (
    <div className={`h-root${theme === "light" ? " h-light" : ""}`}>
      <CursorGlow />
      <ParticleCanvas theme={theme} />

      {/* ── NAVBAR ───────────────────────────────────── */}
      <nav className="h-nav">
        <div className="h-nav-inner">
          <div className="h-nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            AN<span className="h-hi">OM</span>AX
          </div>
          <div className="h-nav-links">
            {["Features", "How It Works", "Team"].map(l => (
              <a key={l} className="h-nav-link" href={`#${l.toLowerCase().replace(/ /g, "-")}`}>{l}</a>
            ))}
          </div>
          <div className="h-nav-right">
            <button className="h-theme-btn" onClick={toggleTheme} title="Toggle theme">
              <span className="h-theme-icon">{theme === "dark" ? I.sun : I.moon}</span>
            </button>
            <button className="h-nav-signin" onClick={onLaunchApp}>
              {I.google}
              <span>Sign in</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="h-hero">
        <div className="h-hero-inner">
          <div className="h-hero-left reveal">
            <div className="h-hero-badge">
              <span className="h-hero-badge-dot" />
              AI-Powered · Open Source · FastAPI
            </div>
            <h1 className="h-hero-headline">
              <Typewriter texts={["Electricity Intelligence Reimagined", "Anomaly Detection at Scale", "ML-Powered Energy Insights"]} />
            </h1>
            <p className="h-hero-sub">
              Anomax uses <strong>Isolation Forest</strong> and <strong>FastAPI</strong> to detect unusual electricity consumption patterns — upload a CSV and get deep insights in seconds.
            </p>
            <div className="h-hero-btns">
              <button className="h-btn-primary" onClick={onLaunchApp}>
                {I.bolt}
                <span>Launch App</span>
              </button>
              <a className="h-btn-secondary" href="#how-it-works">
                {I.arrow}
                <span>Live Demo</span>
              </a>
              <a className="h-btn-ghost" href={LINKS.paper} target="_blank" rel="noopener noreferrer" download>
                {I.download}
                <span>Research Paper</span>
              </a>
              <a className="h-btn-ghost" href={LINKS.github} target="_blank" rel="noopener noreferrer">
                {I.github}
                <span>GitHub</span>
              </a>
            </div>
          </div>
          <div className="h-hero-right reveal" style={{ animationDelay: "0.2s" }}>
            <div className="h-video-wrap">
              <div className="h-video-glow" />
              <iframe
                src={LINKS.demo}
                title="Anomax Demo"
                className="h-video-frame"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
        <div className="h-hero-scroll-hint">
          <div className="h-scroll-line" />
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────── */}
      <section className="h-stats" ref={statsRef}>
        {[
          { val: 98,   suffix: "%",  label: "Detection Accuracy",  sub: "Isolation Forest precision" },
          { val: 1000, suffix: "+",  label: "Data Points / Upload", sub: "Hourly resampled records" },
          { val: 50,   suffix: "ms", label: "Response Time",        sub: "FastAPI backend speed" },
        ].map((s, i) => (
          <div key={i} className="h-stat-card reveal" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="h-stat-val">
              <Counter to={s.val} suffix={s.suffix} start={statsVisible} />
            </div>
            <div className="h-stat-label">{s.label}</div>
            <div className="h-stat-sub">{s.sub}</div>
          </div>
        ))}
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section className="h-section" id="features">
        <div className="h-section-inner">
          <div className="h-section-head reveal">
            <div className="h-section-tag">Platform Features</div>
            <h2 className="h-section-title">Everything you need to detect energy anomalies</h2>
            <p className="h-section-sub">From raw CSV to actionable insights — fully automated, production-ready pipeline.</p>
          </div>
          <div className="h-features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="h-feat-card reveal" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="h-feat-icon">{f.icon}</div>
                <div className="h-feat-title">{f.title}</div>
                <div className="h-feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section className="h-section h-section-alt" id="how-it-works">
        <div className="h-section-inner">
          <div className="h-section-head reveal">
            <div className="h-section-tag">Pipeline</div>
            <h2 className="h-section-title">How Anomax Works</h2>
            <p className="h-section-sub">Four intelligent steps from raw data to actionable energy intelligence.</p>
          </div>
          <div className="h-steps">
            {STEPS.map((s, i) => (
              <div key={i} className="h-step reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="h-step-num">{String(i + 1).padStart(2, "0")}</div>
                <div className="h-step-icon">{s.icon}</div>
                <div className="h-step-title">{s.title}</div>
                <div className="h-step-desc">{s.desc}</div>
                {i < STEPS.length - 1 && <div className="h-step-arrow">{I.arrow}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ────────────────────────── */}
      <section className="h-section" id="dashboard">
        <div className="h-section-inner">
          <div className="h-section-head reveal">
            <div className="h-section-tag">Live Preview</div>
            <h2 className="h-section-title">See anomalies the moment they happen</h2>
            <p className="h-section-sub">Real-time visualization of energy patterns with anomaly highlighting.</p>
          </div>
          <div className="h-preview-wrap reveal">
            <DashboardMock />
            <div className="h-preview-glow" />
          </div>
        </div>
      </section>

      {/* ── TECH STACK ───────────────────────────────── */}
      <section className="h-section h-section-alt">
        <div className="h-section-inner">
          <div className="h-section-head reveal">
            <div className="h-section-tag">Tech Stack</div>
            <h2 className="h-section-title">Built with industry-grade tools</h2>
          </div>
          <div className="h-tech-row reveal">
            {TECH.map((t, i) => (
              <div key={i} className="h-tech-badge" style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="h-tech-dot" style={{ background: t.color }} />
                {t.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────── */}
      <section className="h-section" id="team">
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
              <img src={GUIDE.img} alt={GUIDE.name} className="h-member-img" />
              <div className="h-member-name">{GUIDE.name}</div>
              <div className="h-member-role">{GUIDE.role}</div>
              <div className="h-member-links">
                <a href={GUIDE.linkedin} className="h-member-link" target="_blank" rel="noopener noreferrer">{I.linkedin}</a>
                <a href={GUIDE.github}   className="h-member-link" target="_blank" rel="noopener noreferrer">{I.github}</a>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="h-team-grid">
            {TEAM.map((m, i) => (
              <div key={i} className="h-member-card reveal" style={{ animationDelay: `${i * 0.08}s` }}>
                <img src={m.img} alt={m.name} className="h-member-img" />
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

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="h-cta">
        <div className="h-cta-inner reveal">
          <div className="h-cta-glow" />
          <div className="h-section-tag" style={{ justifyContent: "center" }}>Get Started Today</div>
          <h2 className="h-cta-title">Start detecting anomalies today</h2>
          <p className="h-cta-sub">Upload your first dataset in seconds. No setup required.</p>
          <button className="h-cta-btn" onClick={onLaunchApp}>
            {I.google}
            <span>Sign in with Google</span>
          </button>
          <div className="h-cta-checks">
            {["Free to use", "No credit card", "Open source"].map(c => (
              <div key={c} className="h-cta-check"><span className="h-check-icon">{I.check}</span>{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="h-footer">
        <div className="h-footer-inner">
          <div className="h-footer-logo">AN<span className="h-hi">OM</span>AX</div>
          <p className="h-footer-sub">AI-powered electricity anomaly detection platform.</p>
          <div className="h-footer-btns">
            <a href={LINKS.github} className="h-footer-btn" target="_blank" rel="noopener noreferrer">
              {I.github} <span>GitHub Repo</span>
            </a>
            <a href={LINKS.paper} className="h-footer-btn" download target="_blank" rel="noopener noreferrer">
              {I.download} <span>Research Paper</span>
            </a>
          </div>
          <div className="h-footer-copy">© 2025 Anomax. Built for the future of energy intelligence.</div>
        </div>
      </footer>
    </div>
  );
}