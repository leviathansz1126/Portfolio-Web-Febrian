import { useEffect, useRef, useState } from "react";
import "./PageIntro.css";

// ─── Dot Grid Canvas Animation ──────────────────────────────────────────────
function DotGrid({ onDone }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const COLS = Math.ceil(W / 28);
    const ROWS = Math.ceil(H / 28);
    const SPACING_X = W / COLS;
    const SPACING_Y = H / ROWS;
    const cx = W / 2;
    const cy = H / 2;

    // Build dots
    const dots = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const tx = col * SPACING_X + SPACING_X / 2;
        const ty = row * SPACING_Y + SPACING_Y / 2;
        const dx = tx - cx;
        const dy = ty - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.sqrt(cx * cx + cy * cy);
        dots.push({
          x: cx,
          y: cy,
          tx,
          ty,
          dist,
          delay: (dist / maxDist) * 900 + Math.random() * 120,
          alpha: 0,
          radius: Math.random() * 1.5 + 0.8,
        });
      }
    }

    let startTime = null;
    const PHASE_EXPAND = 1200;  // ms dots travel outward
    const PHASE_HOLD = 400;     // ms they stay
    const PHASE_SHRINK = 600;   // ms they collapse back
    const TOTAL = PHASE_EXPAND + PHASE_HOLD + PHASE_SHRINK;

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }
    function easeInExpo(t) {
      return t === 0 ? 0 : Math.pow(2, 10 * t - 10);
    }

    function draw(ts) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;

      ctx.clearRect(0, 0, W, H);

      for (const d of dots) {
        const local = elapsed - d.delay;
        let progress = 0;
        let alpha = 0;

        if (local >= 0 && elapsed < PHASE_EXPAND + PHASE_HOLD) {
          // expanding
          const t = Math.min(local / PHASE_EXPAND, 1);
          progress = easeOutExpo(t);
          alpha = Math.min(t * 3, 1);
        } else if (elapsed >= PHASE_EXPAND + PHASE_HOLD) {
          // shrinking
          const t = Math.min((elapsed - PHASE_EXPAND - PHASE_HOLD) / PHASE_SHRINK, 1);
          progress = 1 - easeInExpo(t);
          alpha = 1 - t;
        }

        d.x = cx + (d.tx - cx) * progress;
        d.y = cy + (d.ty - cy) * progress;
        d.alpha = alpha;

        if (d.alpha > 0.01) {
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${d.alpha * 0.85})`;
          ctx.fill();
        }
      }

      if (elapsed < TOTAL + 200) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        onDone();
      }
    }

    rafRef.current = requestAnimationFrame(draw);

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [onDone]);

  return <canvas ref={canvasRef} className="page-intro__canvas" />;
}

// ─── Text Reveal ─────────────────────────────────────────────────────────────
function TextReveal({ text, delay = 900 }) {
  const chars = text.split("");
  return (
    <div className="page-intro__text">
      {chars.map((ch, i) => (
        <span
          key={i}
          className="page-intro__char"
          style={{ animationDelay: `${delay + i * 45}ms` }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PageIntro({ children, title = "Your Name" }) {
  const [phase, setPhase] = useState("intro"); // intro | exit | done

  const handleDotsDone = () => {
    setPhase("exit");
    setTimeout(() => setPhase("done"), 600);
  };

  if (phase === "done") return <>{children}</>;

  return (
    <>
      {/* Actual page content — hidden until done */}
      <div
        style={{
          opacity: 0,
          pointerEvents: "none",
          position: "fixed",
          inset: 0,
          zIndex: -1,
        }}
      >
        {children}
      </div>

      {/* Intro overlay */}
      <div className={`page-intro ${phase === "exit" ? "page-intro--exit" : ""}`}>
        <DotGrid onDone={handleDotsDone} />
        <div className="page-intro__center">
          <TextReveal text={title} delay={400} />
          <div className="page-intro__subtitle">
            {"portfolio".split("").map((ch, i) => (
              <span
                key={i}
                className="page-intro__sub-char"
                style={{ animationDelay: `${700 + i * 60}ms` }}
              >
                {ch}
              </span>
            ))}
          </div>
          <div className="page-intro__line" />
        </div>
      </div>
    </>
  );
}
