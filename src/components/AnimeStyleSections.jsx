import { useEffect, useRef, useState } from "react";
import "./AnimeStyleSections.css";

// ─── Scroll progress hook ─────────────────────────────────────────────────────
function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const wh = window.innerHeight;
      // 0 = just entered, 1 = just leaving
      const raw = 1 - rect.bottom / (wh + rect.height);
      setProgress(Math.max(0, Math.min(1, raw)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);
  return progress;
}

// ─── Intersection observer for fade-in ───────────────────────────────────────
function useInView(ref, threshold = 0.2) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

// ─── Canvas: Rotating ring (used for multiple sections) ──────────────────────
function RingCanvas({ color = "#00ffab", dotColor = "#5e00fe", size = 420, tick = 0 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const W = c.width = size;
    const H = c.height = size;
    const cx = W / 2, cy = H / 2;
    ctx.clearRect(0, 0, W, H);

    const R = size * 0.42;
    const tickCount = 120;
    const angle = tick * 0.008;

    // Outer rainbow ring segments
    const segments = [
      { start: 0,    end: 0.22, color: "#ff4444" },
      { start: 0.22, end: 0.38, color: "#ff8c00" },
      { start: 0.38, end: 0.52, color: "#ffe000" },
      { start: 0.52, end: 0.70, color: "#00e676" },
      { start: 0.70, end: 0.83, color: "#00b8ff" },
      { start: 0.83, end: 1.00, color: "#9c27b0" },
    ];
    segments.forEach(({ start, end, color: sc }) => {
      ctx.beginPath();
      ctx.arc(cx, cy, R + 10, (start * 2 - 0.5) * Math.PI + angle, (end * 2 - 0.5) * Math.PI + angle);
      ctx.strokeStyle = sc;
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    // Tick marks on ring
    for (let i = 0; i < tickCount; i++) {
      const a = (i / tickCount) * Math.PI * 2 + angle;
      const isLong = i % 5 === 0;
      const r1 = R - 2;
      const r2 = isLong ? R - 14 : R - 8;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
      ctx.strokeStyle = color;
      ctx.lineWidth = isLong ? 1.5 : 0.8;
      ctx.globalAlpha = 0.6;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Inner dot grid
    const gridN = 7;
    const gridSpacing = (R * 0.75) / gridN;
    for (let row = -gridN; row <= gridN; row++) {
      for (let col = -gridN; col <= gridN; col++) {
        const dx = col * gridSpacing;
        const dy = row * gridSpacing;
        if (Math.sqrt(dx * dx + dy * dy) > R * 0.72) continue;
        ctx.beginPath();
        ctx.arc(cx + dx, cy + dy, 2, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.globalAlpha = 0.35;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Sweep arc inside
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.62, angle, angle + 1.1);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = R * 0.32;
    ctx.stroke();

    // Curved trail lines (like the orange glow on animejs)
    for (let i = 0; i < 4; i++) {
      const trailAngle = angle * 0.6 + i * 0.18;
      const r1 = R * (0.55 + i * 0.045);
      ctx.beginPath();
      ctx.arc(cx, cy, r1, trailAngle, trailAngle + 0.7);
      ctx.strokeStyle = `rgba(255, 160, 80, ${0.55 - i * 0.1})`;
      ctx.lineWidth = 5 - i * 0.8;
      ctx.stroke();
    }

  }, [tick, color, dotColor, size]);

  return <canvas ref={canvasRef} className="ajs-canvas" style={{ width: size, height: size }} />;
}

// ─── Canvas: Dot wave (About section) ────────────────────────────────────────
function DotWaveCanvas({ tick = 0, size = 420 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    c.width = c.height = size;
    ctx.clearRect(0, 0, size, size);
    const cx = size / 2, cy = size / 2;
    const COLS = 13, ROWS = 13;
    const spacing = size * 0.065;

    for (let r = 0; r < ROWS; r++) {
      for (let col = 0; col < COLS; col++) {
        const x = cx + (col - 6) * spacing;
        const y = cy + (r - 6) * spacing;
        const dist = Math.sqrt((col - 6) ** 2 + (r - 6) ** 2);
        const wave = Math.sin(dist * 0.9 - tick * 0.055) * 0.5 + 0.5;
        const radius = 2.5 + wave * 4.5;
        const alpha = 0.2 + wave * 0.75;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 171, ${alpha})`;
        ctx.fill();
      }
    }
  }, [tick, size]);
  return <canvas ref={canvasRef} className="ajs-canvas" style={{ width: size, height: size }} />;
}

// ─── Canvas: Code terminal (Skills section) ──────────────────────────────────
function CodeCanvas({ tick = 0, size = 420 }) {
  const canvasRef = useRef(null);
  const lines = [
    "// Febrian's stack",
    "const skills = {",
    "  frontend: ['React', 'Vite', 'CSS'],",
    "  tools:    ['Figma', 'GitHub', 'Firebase'],",
    "  style:    'clean + modern',",
    "};",
    "",
    "animate('.hero', {",
    "  opacity: [0, 1],",
    "  y: [40, 0],",
    "  ease: 'outExpo',",
    "  delay: stagger(80),",
    "});",
  ];

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    c.width = c.height = size;
    ctx.clearRect(0, 0, size, size);

    // terminal bg
    ctx.fillStyle = "#0d0d0d";
    ctx.roundRect(20, 20, size - 40, size - 40, 12);
    ctx.fill();

    // title bar
    ctx.fillStyle = "#1a1a1a";
    ctx.roundRect(20, 20, size - 40, 36, [12, 12, 0, 0]);
    ctx.fill();

    // dots
    [["#ff5f57", 48], ["#febc2e", 72], ["#28c840", 96]].forEach(([col, x]) => {
      ctx.beginPath();
      ctx.arc(x, 38, 6, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
    });

    ctx.font = "13px 'JetBrains Mono', 'Fira Code', monospace";
    const totalChars = Math.floor(tick * 1.8);
    let charCount = 0;

    lines.forEach((line, i) => {
      const y = 74 + i * 22;
      if (y > size - 20) return;

      let color = "rgba(220,220,220,0.85)";
      if (line.startsWith("//")) color = "rgba(100,180,100,0.9)";
      else if (line.includes(":") && !line.startsWith(" ")) color = "rgba(100,160,255,0.9)";
      else if (line.includes("'")) color = "rgba(255,165,80,0.9)";
      else if (line.startsWith("animate") || line.startsWith("  ease") || line.startsWith("  delay")) color = "rgba(180,120,255,0.9)";
      ctx.fillStyle = color;

      const visible = Math.max(0, totalChars - charCount);
      const shown = line.slice(0, visible);
      ctx.fillText(shown, 36, y);
      charCount += line.length + 1;
    });

    // blinking cursor
    if (Math.floor(tick / 18) % 2 === 0) {
      const cursorLine = Math.min(Math.floor(totalChars / 20), lines.length - 1);
      const cursorX = 36 + ctx.measureText(lines[cursorLine]?.slice(0, totalChars % 20) || "").width;
      ctx.fillStyle = "#00ffab";
      ctx.fillRect(cursorX, 62 + cursorLine * 22, 2, 14);
    }
  }, [tick, size]);
  return <canvas ref={canvasRef} className="ajs-canvas" style={{ width: size, height: size }} />;
}

// ─── Canvas: Project cards mockup ────────────────────────────────────────────
function ProjectCanvas({ tick = 0, size = 420 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    c.width = c.height = size;
    ctx.clearRect(0, 0, size, size);

    const cards = [
      { x: 40, y: 60, w: 160, h: 110, label: "Portfolio", tag: "React", delay: 0 },
      { x: 220, y: 40, w: 160, h: 110, label: "Landing Page", tag: "Frontend", delay: 8 },
      { x: 40, y: 200, w: 160, h: 110, label: "Dashboard UI", tag: "UX", delay: 16 },
      { x: 220, y: 200, w: 160, h: 110, label: "Mobile App", tag: "Mobile", delay: 24 },
    ];

    cards.forEach(({ x, y, w, h, label, tag, delay }) => {
      const t = Math.max(0, Math.min(1, (tick - delay) / 35));
      const yt = y + (1 - t) * 30;
      const alpha = t;
      ctx.save();
      ctx.globalAlpha = alpha;

      // card bg
      ctx.fillStyle = "#1a1a1a";
      ctx.shadowColor = "rgba(94,0,254,0.3)";
      ctx.shadowBlur = 12;
      ctx.roundRect(x, yt, w, h, 10);
      ctx.fill();
      ctx.shadowBlur = 0;

      // accent line top
      ctx.fillStyle = "#5e00fe";
      ctx.fillRect(x, yt, w, 3);

      // label
      ctx.fillStyle = "#ffffff";
      ctx.font = "500 14px Inter, sans-serif";
      ctx.fillText(label, x + 14, yt + 30);

      // tag pill
      ctx.fillStyle = "rgba(0,255,171,0.15)";
      ctx.roundRect(x + 14, yt + 44, ctx.measureText(tag).width + 16, 22, 11);
      ctx.fill();
      ctx.fillStyle = "#00ffab";
      ctx.font = "11px Inter, sans-serif";
      ctx.fillText(tag, x + 22, yt + 59);

      // shimmer bar
      const shimX = (tick * 3 - delay * 6) % (w + 40) - 20;
      const grad = ctx.createLinearGradient(x + shimX, 0, x + shimX + 40, 0);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.5, "rgba(255,255,255,0.06)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.roundRect(x, yt, w, h, 10);
      ctx.fill();

      ctx.restore();
    });
  }, [tick, size]);
  return <canvas ref={canvasRef} className="ajs-canvas" style={{ width: size, height: size }} />;
}

// ─── Canvas: Contact globe ────────────────────────────────────────────────────
function GlobeCanvas({ tick = 0, size = 420 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    c.width = c.height = size;
    ctx.clearRect(0, 0, size, size);
    const cx = size / 2, cy = size / 2;
    const R = size * 0.35;
    const angle = tick * 0.012;

    // lat/lon grid
    for (let lat = -80; lat <= 80; lat += 20) {
      const y = cy + R * Math.sin((lat * Math.PI) / 180);
      const rLat = R * Math.cos((lat * Math.PI) / 180);
      ctx.beginPath();
      ctx.ellipse(cx, y, rLat, rLat * 0.18, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(94,0,254,0.2)";
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
    for (let lon = 0; lon < 360; lon += 30) {
      const a = ((lon + angle * 30) * Math.PI) / 180;
      ctx.beginPath();
      ctx.ellipse(cx, cy, R * Math.abs(Math.cos(a)), R, a, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0,255,171,${0.08 + 0.08 * Math.abs(Math.cos(a))})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Pulse dots on globe
    const nodes = [
      { lat: 20, lon: 80 },
      { lat: -10, lon: 190 },
      { lat: 45, lon: 310 },
      { lat: -35, lon: 240 },
    ];
    nodes.forEach(({ lat, lon }) => {
      const φ = (lat * Math.PI) / 180;
      const λ = ((lon + tick * 1.8) * Math.PI) / 180;
      const screenX = cx + R * Math.cos(φ) * Math.sin(λ);
      const screenY = cy - R * Math.sin(φ);
      const visible = Math.cos(φ) * Math.cos(λ) > -0.2;
      if (!visible) return;
      const pulse = Math.sin(tick * 0.08 + lon) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(screenX, screenY, 3 + pulse * 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,171,${0.12 + pulse * 0.15})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(screenX, screenY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#00ffab";
      ctx.fill();
    });

    // Connection lines between nodes (animated)
    ctx.strokeStyle = "rgba(0,255,171,0.25)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.lineDashOffset = -tick * 0.5;
    const n0 = nodes[0], n1 = nodes[2];
    const x0 = cx + R * Math.cos((n0.lat * Math.PI) / 180) * Math.sin(((n0.lon + tick * 1.8) * Math.PI) / 180);
    const y0 = cy - R * Math.sin((n0.lat * Math.PI) / 180);
    const x1 = cx + R * Math.cos((n1.lat * Math.PI) / 180) * Math.sin(((n1.lon + tick * 1.8) * Math.PI) / 180);
    const y1 = cy - R * Math.sin((n1.lat * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.bezierCurveTo((x0 + x1) / 2, cy - R * 0.7, (x0 + x1) / 2, cy - R * 0.5, x1, y1);
    ctx.stroke();
    ctx.setLineDash([]);

  }, [tick, size]);
  return <canvas ref={canvasRef} className="ajs-canvas" style={{ width: size, height: size }} />;
}

// ─── Section block ────────────────────────────────────────────────────────────
function AjsSection({ id, label, title, text, children, dark = true, labels = [] }) {
  const ref = useRef(null);
  const inView = useInView(ref, 0.15);

  return (
    <section
      ref={ref}
      id={id}
      className={`ajs-section ${dark ? "ajs-dark" : "ajs-light"} ${inView ? "ajs-in" : ""}`}
    >
      <div className="ajs-copy">
        <span className="ajs-label">{label}</span>
        <h2 className="ajs-title">{title}</h2>
        <p className="ajs-text">{text}</p>
        {children}
      </div>

      {labels.length > 0 && (
        <div className="ajs-side-labels">
          {labels.map((l, i) => (
            <span key={i} className="ajs-side-label">{l}</span>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function AnimeStyleSections() {
  const [tick, setTick] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const loop = () => {
      setTick(t => t + 1);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const skills = ["React", "Vite", "JavaScript", "CSS", "Firebase", "Figma", "GitHub"];

  return (
    <div className="ajs-wrapper">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="ajs-hero ajs-dark">
        <div className="ajs-hero-copy">
          <span className="ajs-hero-badge">Frontend Developer</span>
          <h1 className="ajs-hero-title">
            Building the web,<br />
            one pixel<br />
            at a time.
          </h1>
          <p className="ajs-hero-sub">
            Modern, responsive, and user-friendly digital experiences.
          </p>
          <div className="ajs-hero-actions">
            <a href="#projects" className="ajs-btn ajs-btn-primary">Explore Projects</a>
            <a href="/CV-Febrian.pdf" className="ajs-btn ajs-btn-ghost">Download CV</a>
          </div>
        </div>
        <div className="ajs-hero-visual">
          <RingCanvas color="#00ffab" dotColor="rgba(0,255,171,0.5)" size={460} tick={tick} />
        </div>
        <div className="ajs-scroll-hint">
          <span>Scroll</span>
          <div className="ajs-scroll-line" />
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────────────── */}
      <AjsSection
        id="about"
        label="About Me"
        title={<>Frontend developer<br />with modern<br />visual direction.</>}
        text="I'm Febrian — passionate about building high-performance apps with clean interface design. React, interactive components, responsive layouts — that's my language."
        dark={false}
        labels={["React", "Vite", "CSS", "Figma", "Firebase"]}
      >
        <div className="ajs-stats-row">
          <div className="ajs-stat"><strong>20+</strong><span>Projects</span></div>
          <div className="ajs-stat"><strong>3+</strong><span>Years</span></div>
          <div className="ajs-stat"><strong>React</strong><span>Main Stack</span></div>
        </div>
      </AjsSection>
      <div className="ajs-visual-block ajs-light-bg">
        <DotWaveCanvas tick={tick} size={420} />
      </div>

      {/* ── SKILLS ────────────────────────────────────────────────────────── */}
      <AjsSection
        id="tools"
        label="Skills & Tools"
        title={<>The complete<br />developer's<br />toolkit.</>}
        text="Stack and tools used to build modern, responsive, production-ready websites."
        dark={true}
        labels={["JavaScript", "HTML", "CSS", "GitHub", "Canva"]}
      >
        <div className="ajs-tags">
          {skills.map(s => <span key={s} className="ajs-tag">{s}</span>)}
        </div>
      </AjsSection>
      <div className="ajs-visual-block ajs-dark-bg">
        <CodeCanvas tick={tick} size={420} />
      </div>

      {/* ── PROJECTS ──────────────────────────────────────────────────────── */}
      <AjsSection
        id="projects"
        label="Projects"
        title={<>Selected work<br />that shows creativity<br />and skill.</>}
        text="Modern portfolio projects built with clean code, premium visuals, and attention to detail."
        dark={false}
      />
      <div className="ajs-visual-block ajs-light-bg">
        <ProjectCanvas tick={tick} size={420} />
      </div>

      {/* ── CONTACT ───────────────────────────────────────────────────────── */}
      <AjsSection
        id="contact"
        label="Contact"
        title={<>Let's build<br />something<br />modern.</>}
        text="Available for collaborations, freelance projects, and portfolio inquiries."
        dark={true}
      >
        <div className="ajs-contact-links">
          <a href="https://www.instagram.com/fevrii1z" target="_blank" rel="noreferrer" className="ajs-contact-item">
            <span className="ajs-contact-platform">Instagram</span>
            <strong>@fevrii1z</strong>
          </a>
          <a href="mailto:owenknight126@gmail.com" className="ajs-contact-item">
            <span className="ajs-contact-platform">Email</span>
            <strong>owenknight126@gmail.com</strong>
          </a>
        </div>
      </AjsSection>
      <div className="ajs-visual-block ajs-dark-bg">
        <GlobeCanvas tick={tick} size={420} />
      </div>

    </div>
  );
}
