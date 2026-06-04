import { useEffect, useMemo, useState } from "react";
import "./App.css";

import {
  SplitTitle,
  ScrollVelocity,
  SpotlightCard,
  GlassSurface,
  ProjectPreview,
} from "./components/ReactBitsPack";

import ProfileCard from "./components/ProfileCard";

import Aurora from "./components/Aurora";
import BlurText from "./components/BlurText";
import ScrollReveal from "./components/ScrollReveal";
import Lanyard from "./components/Lanyard";
import PixelTransition from "./components/PixelTransition";
import PageMotion from "./components/PageMotion";
import StaggeredMenu from "./components/StaggeredMenu";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Project", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const staggeredMenuItems = [
  { label: "Home", ariaLabel: "Go to home section", link: "#home" },
  { label: "About", ariaLabel: "Go to about section", link: "#about" },
  { label: "Project", ariaLabel: "Go to project section", link: "#projects" },
  { label: "Contact", ariaLabel: "Go to contact section", link: "#contact" },
];

const staggeredSocialItems = [
  { label: "Instagram", link: "https://www.instagram.com/fevrii1z" },
  { label: "Email", link: "mailto:owenknight126@gmail.com" },
  { label: "GitHub", link: "https://github.com" },
];

const tools = [
  "VS Code",
  "React",
  "Vite",
  "JavaScript",
  "HTML",
  "CSS",
  "Firebase",
  "GitHub",
  "Figma",
  "Canva",
  "Responsive UI",
  "Frontend",
  "Landing Page",
  "Portfolio",
];

const services = [
  {
    number: "01",
    title: "Web Development",
    description:
      "Membangun website modern menggunakan React, Vite, JavaScript, HTML, dan CSS dengan struktur rapi.",
  },
  {
    number: "02",
    title: "UI Implementation",
    description:
      "Mengubah ide desain menjadi tampilan website yang clean, interaktif, responsive, dan nyaman digunakan.",
  },
  {
    number: "03",
    title: "Portfolio Design",
    description:
      "Membuat portfolio personal dengan visual premium, section lengkap, dan first impression yang kuat.",
  },
];

const projects = [
  {
    title: "Personal Portfolio",
    category: "React Website",
    description:
      "A modern portfolio website with animated text, profile card, tools section, project showcase, and responsive layout.",
    tags: ["React", "Vite", "CSS"],
  },
  {
    title: "Landing Page Concept",
    category: "Web Interface",
    description:
      "Premium landing page concept with strong hero section, clean content structure, and modern visual hierarchy.",
    tags: ["Landing Page", "Frontend", "UI"],
  },
  {
    title: "Dashboard Interface",
    category: "UI Concept",
    description:
      "Dark dashboard interface concept using card layout, organized statistics, and clean user experience.",
    tags: ["Dashboard", "Cards", "UX"],
  },
  {
    title: "Mobile App UI",
    category: "App Interface",
    description:
      "Responsive mobile interface concept with modern layout, smooth spacing, and clear user flow.",
    tags: ["Mobile", "UI Design", "Responsive"],
  },
];

const contactLinks = [
  {
    label: "Instagram",
    value: "@fevrii1z",
    href: "https://www.instagram.com/fevrii1z",
  },
  {
    label: "Email",
    value: "owenknight126@gmail.com",
    href: "mailto:owenknight126@gmail.com",
  },
];

function Loader() {
  return (
    <div className="loader premium-loader">
      <div className="premium-loader-card">
        <div className="premium-loader-top">
          <span className="premium-loader-mark">F</span>

          <div className="premium-loader-copy">
            <strong>Febrian Portfolio</strong>
            <p>Preparing interactive experience</p>
          </div>
        </div>

        <div className="premium-loader-progress">
          <span />
        </div>

        <div className="premium-loader-bottom">
          <span>React • Vite • Portfolio</span>
          <small>Loading</small>
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <StaggeredMenu
      position="right"
      items={staggeredMenuItems}
      socialItems={staggeredSocialItems}
      displaySocials
      displayItemNumbering={true}
      menuButtonColor="#ffffff"
      openMenuButtonColor="#ffffff"
      changeMenuColorOnOpen={true}
      colors={["#5e00fe", "#00ffab"]}
      accentColor="#00ffab"
      logoUrl="/icons.svg"
      isFixed={false}
      closeOnClickAway={true}
    />
  );
}

function AuroraBackground() {
  return (
    <div className="portfolio-aurora-bg" aria-hidden="true">
      <Aurora
        colorStops={["#5e00fe", "#9463e8", "#00ffab"]}
        blend={0.68}
        amplitude={1.25}
        speed={0.8}
      />
    </div>
  );
}

function SectionHeader({ label, title, text }) {
  return (
    <div className="section-header">
      <span>{label}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function HeroSection({ onBlurComplete }) {
  return (
    <section id="home" className="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <div className="quote-badge">
            <span>“</span>
            Build clean, move fast, make it memorable
          </div>

<h1 className="hero-title-custom">
  <span>M Febrian Sidiq Hafadzah</span>
</h1>
          <BlurText
            className="hero-description"
            text="Web and application developer focused on modern, responsive, and user-friendly design. Building digital projects with a neat appearance, good performance, and a comfortable user experience."
            delay={60}
            animateBy="words"
            direction="top"
            stepDuration={0.28}
            onAnimationComplete={onBlurComplete}
          />

          <div className="hero-actions">
            <a href="/CV-Febrian.pdf" className="btn btn-dark">
              Download CV
            </a>

            <a href="#projects" className="btn btn-glow">
              Explore Projects
            </a>
          </div>

          <div className="hero-stats">
            <StatCard value="20+" label="Project Finished" />
            <StatCard value="3+" label="Years Experience" />
            <StatCard value="React" label="Main Stack" />
          </div>
        </div>

        <div className="hero-visual">
<ProfileCard
  name="M Febrian S.H"
  title="Web Developer"
  handle="fevrii1z"
  status="Online"
  contactText="Contact Me"
  avatarUrl="/profile.jpg"
  miniAvatarUrl="/profile.jpg"
  showUserInfo={false}
  enableTilt={true}
  enableMobileTilt={false}
  behindGlowEnabled
  behindGlowColor="rgba(125, 190, 255, 0.67)"
  iconUrl="/iconpattern.png"
  grainUrl="/grain.webp"
  innerGradient="linear-gradient(145deg, #11182f 0%, #243b62 48%, #0b0b14 100%)"
/>
        </div>
      </div>
    </section>
  );
}

function ManifestoSection() {
  return (
    <section className="section manifesto-section">
      <div className="container">
        <div className="manifesto-panel manifesto-panel-with-pixel">
          <div className="manifesto-copy">
            <span className="manifesto-label">Quotes by Charlie Chaplin</span>

            <ScrollReveal
              baseOpacity={0.12}
              enableBlur
              baseRotation={2.5}
              blurStrength={5}
              containerClassName="portfolio-scroll-reveal"
              textClassName="portfolio-scroll-text"
              rotationEnd="bottom center"
              wordAnimationEnd="bottom center"
            >
              A day without laughter is a wasted day.
            </ScrollReveal>
          </div>

          <div className="manifesto-pixel-wrap">
<PixelTransition
  firstContent={
    <div className="manifesto-pixel-content">
      <span>Psstt..</span>
      <strong>TAP THE CARD!!</strong>
    </div>
  }
  secondContent={
    <video
      className="manifesto-pixel-video"
      src="/meme.mp4"
      loop
      playsInline
      preload="auto"
    />
  }
  gridSize={9}
  pixelColor="#ffffff"
  once={false}
  animationStepDuration={0.42}
  aspectRatio="125%"
  className="custom-pixel-card"
/>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="section about-section">
      <div className="container">
        <div className="about-lanyard-panel">
          <div className="about-lanyard-copy">
            <span className="about-label">About Me</span>

            <h2>Frontend developer with modern visual direction.</h2>

            <BlurText
              className="about-blur-text"
              text="I am Febrian, a frontend developer passionate about building modern, high-performance applications with clean interface design. I enjoy working with React, interactive components, and responsive layouts that help users and businesses grow through functional, aesthetic, and scalable digital products."
              delay={45}
              animateBy="words"
              direction="top"
              stepDuration={0.25}
            />

            <div className="about-stats">
              <div>
                <strong>20+</strong>
                <span>Project Finished</span>
              </div>

              <div>
                <strong>3+</strong>
                <span>Years of Experience</span>
              </div>
            </div>

            <p className="about-note">Working with heart, creating with mind.</p>
          </div>

          <div className="about-lanyard-visual">
            <Lanyard position={[0, 0, 23]} gravity={[0, -40, 0]} fov={20} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolsSection() {
  return (
    <section id="tools" className="section tools-section">
      <div className="container">
        <SectionHeader
          label="Tools & Technologies"
          title="My professional skills."
          text="Stack dan tools utama yang digunakan untuk membuat website modern, responsive, dan siap dikembangkan."
        />

        <ScrollVelocity items={tools} />

        <div className="service-grid">
          {services.map((service) => (
            <SpotlightCard className="service-card" key={service.title}>
              <span className="service-number">{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <SectionHeader
          label="Project"
          title="Selected projects that show creativity and skill."
          text="Showcase project dibuat seperti modern portfolio: preview card, hover spotlight, tag teknologi, dan layout responsive."
        />

        <div className="projects-grid">
          {projects.map((project, index) => (
            <SpotlightCard className="project-card" key={project.title}>
              <ProjectPreview variant={(index % 3) + 1} />

              <span className="project-category">{project.category}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>

              <div className="tag-row">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <SectionHeader
          label="Contact & Chat"
          title="Get in touch with me."
          text="Hubungi Febrian untuk diskusi project, kerja sama, atau kebutuhan website portfolio."
        />

        <div className="contact-grid">
          <GlassSurface className="chat-panel">
            <div className="chat-header">
              <span className="chat-status" />

              <div>
                <strong>Live Chat Preview</strong>
                <small>Interactive contact section</small>
              </div>
            </div>

            <div className="chat-body">
              <div className="message message-left">
                Halo Febrian, bisa bantu buat website portfolio?
              </div>

              <div className="message message-right">
                Bisa. Kita buat yang modern, responsive, dan clean.
              </div>

              <div className="message message-left">
                Saya mau tampilannya seperti portfolio interaktif.
              </div>
            </div>

            <div className="chat-input">
              <span>Type your message...</span>
              <button type="button">Send</button>
            </div>
          </GlassSurface>

          <GlassSurface className="contact-panel">
            <div>
              <span>Contact</span>
              <h2>Let&apos;s build something modern.</h2>
              <p>
                Contact Febrian melalui Instagram atau email untuk project,
                kerja sama, atau portfolio inquiry.
              </p>
            </div>

            <div className="contact-links">
              {contactLinks.map((item) => (
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  key={item.label}
                >
                  <small>{item.label}</small>
                  <strong>{item.value}</strong>
                </a>
              ))}
            </div>
          </GlassSurface>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleBlurTextComplete = () => {
    console.log("BlurText animation completed!");
  };

  return (
    <>
      {loading && <Loader />}

      <div className="app">
      <PageMotion />
      <AuroraBackground />
      <Navbar />

        <main>
          <HeroSection onBlurComplete={handleBlurTextComplete} />
          <ManifestoSection />
          <AboutSection />
          <ToolsSection />
          <ProjectsSection />
          <ContactSection />
        </main>

        <footer className="footer">
          <p>© {year} Febrian Portfolio. Built with React + Vite.</p>
        </footer>
      </div>
    </>
  );
}

export default App;