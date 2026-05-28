import { useRef } from "react";
import "./ReactBitsPack.css";

export function AmbientBackground() {
  return (
    <div className="rb-ambient" aria-hidden="true">
      <span className="rb-mesh rb-mesh-1" />
      <span className="rb-mesh rb-mesh-2" />
      <span className="rb-mesh rb-mesh-3" />
      <span className="rb-grid" />
      <span className="rb-noise" />
    </div>
  );
}

export function SplitTitle({ lines = [] }) {
  return (
    <h1 className="rb-split-title">
      {lines.map((line, lineIndex) => (
        <span className="rb-title-line" key={`${line}-${lineIndex}`}>
          {line.split("").map((char, charIndex) => (
            <span
              className="rb-title-char"
              style={{
                animationDelay: `${lineIndex * 0.16 + charIndex * 0.018}s`,
              }}
              key={`${line}-${char}-${charIndex}`}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

export function BlurText({ text = "", className = "" }) {
  return (
    <p className={`rb-blur-text ${className}`}>
      {text.split(" ").map((word, index) => (
        <span
          key={`${word}-${index}`}
          style={{ animationDelay: `${index * 0.035}s` }}
        >
          {word}&nbsp;
        </span>
      ))}
    </p>
  );
}

export function ProfileCard({
  image = "/profile.jpg",
  name = "Febrian",
  role = "Web Developer",
  handle = "@fevrii1z",
}) {
  return (
    <div className="rb-profile-card">
      <div className="rb-profile-image">
        <img
          src={image}
          alt=""
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
        <div className="rb-profile-placeholder">
          <span>F</span>
        </div>
        <div className="rb-profile-overlay" />
      </div>

      <div className="rb-profile-name">
        <h3>{name}</h3>
        <p>{role}</p>
      </div>

      <div className="rb-profile-footer">
        <div>
          <strong>{handle}</strong>
          <small>Online</small>
        </div>
        <a href="#contact">Contact Me</a>
      </div>
    </div>
  );
}

export function SpotlightCard({ children, className = "" }) {
  const cardRef = useRef(null);

  const handleMouseMove = (event) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
  };

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`rb-spotlight-card ${className}`}
    >
      {children}
    </article>
  );
}

export function MagicBento({ items = [] }) {
  return (
    <div className="rb-bento-grid">
      {items.map((item, index) => (
        <SpotlightCard
          key={item.title}
          className={
            index === 0 ? "rb-bento-card rb-bento-large" : "rb-bento-card"
          }
        >
          <span>{item.kicker}</span>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </SpotlightCard>
      ))}
    </div>
  );
}

export function ScrollVelocity({ items = [] }) {
  const loopItems = [...items, ...items, ...items];

  return (
    <div className="rb-marquee">
      <div className="rb-marquee-track">
        {loopItems.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}

export function GlassSurface({ children, className = "" }) {
  return <div className={`rb-glass ${className}`}>{children}</div>;
}

export function ProjectPreview({ variant = 1 }) {
  return (
    <div className={`rb-preview rb-preview-${variant}`}>
      <div className="rb-preview-dots">
        <span />
        <span />
        <span />
      </div>

      <div className="rb-preview-layout">
        <div className="rb-preview-side" />

        <div className="rb-preview-main">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}