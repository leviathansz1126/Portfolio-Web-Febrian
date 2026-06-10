import { useMemo } from "react";
import "./App.css";

import StaggeredMenu from "./components/StaggeredMenu";
import Aurora from "./components/Aurora";
import AnimePageEffects from "./components/AnimePageEffects";
import PageIntro from "./components/PageIntro";
import AnimeStyleSections from "./components/AnimeStyleSections";

const staggeredMenuItems = [
  { label: "Home",    ariaLabel: "Go to home section",    link: "#home" },
  { label: "About",   ariaLabel: "Go to about section",   link: "#about" },
  { label: "Project", ariaLabel: "Go to project section", link: "#projects" },
  { label: "Contact", ariaLabel: "Go to contact section", link: "#contact" },
];

const staggeredSocialItems = [
  { label: "Instagram", link: "https://www.instagram.com/fevrii1z" },
  { label: "Email",     link: "mailto:owenknight126@gmail.com" },
  {
    label: "GitHub",
    link: "https://github.com/leviathansz1126/Portfolio-Web-Febrian",
  },
];

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
      isFixed={true}
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

// ─── Main App ─────────────────────────────────────────────────────────────────
function App() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <PageIntro title="Febrian">
      <div className="app">
        <AnimePageEffects />
        <Navbar />

        <main>
          <AnimeStyleSections />
        </main>

        <footer className="footer ajs-dark" style={{ textAlign: "center", padding: "32px 0", fontSize: "13px", color: "rgba(232,230,225,0.35)", letterSpacing: "0.05em" }}>
          © {year} Febrian Portfolio. Built with React + Vite.
        </footer>
      </div>
    </PageIntro>
  );
}

export default App;
