import { useEffect, useState } from "react";
import { PlanetScene, RealSolarSystemScene } from "./components/SpaceScenes";
import "./App.css";

function GalaxyLoader() {
  return (
    <div className="galaxy-loader">
      <div className="loader-stars"></div>
      <div className="loader-nebula one"></div>
      <div className="loader-nebula two"></div>

      <div className="loader-content">
        <div className="loader-orbit">
          <div className="loader-sun"></div>
          <span className="loader-planet planet-a"></span>
          <span className="loader-planet planet-b"></span>
          <span className="loader-planet planet-c"></span>
        </div>

        <p>INITIALIZING POTOFOLIO</p>
        <h1>HI.. WELCOME</h1>

        <div className="loader-bar">
          <span></span>
        </div>

        <small>Loading...</small>
      </div>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <GalaxyLoader />;
  }

  const expertise = [
    {
      number: "01",
      title: "Web Development",
      desc: "Membangun website modern, responsif, cepat, dan memiliki visual yang kuat menggunakan React, JavaScript, HTML, dan CSS.",
    },
    {
      number: "02",
      title: "UI/UX Design",
      desc: "Merancang tampilan digital yang clean, mudah digunakan, dan nyaman dilihat dengan fokus pada pengalaman pengguna.",
    },
    {
      number: "03",
      title: "System Analysis",
      desc: "Menganalisis kebutuhan sistem, membuat alur proses, use case, activity diagram, dan struktur sistem informasi.",
    },
    {
      number: "04",
      title: "Mobile Development",
      desc: "Mengembangkan aplikasi mobile menggunakan Flutter dan Firebase dengan fitur autentikasi, database, dan realtime update.",
    },
  ];

  const projects = [
    {
      title: "Galaxy Portfolio",
      type: "Interactive Web",
      desc: "Website portfolio berbasis React dengan konsep galaxy, realistic planet showcase, animasi tata surya, responsive layout, dan visual premium.",
      tech: ["React", "Vite", "Three.js"],
    },
    {
      title: "Banar.id Marketplace",
      type: "Mobile App",
      desc: "Aplikasi marketplace pertanian untuk menghubungkan petani dan distributor menggunakan Flutter dan Firebase.",
      tech: ["Flutter", "Firebase", "Firestore"],
    },
    {
      title: "Usability Evaluation",
      type: "Research",
      desc: "Analisis usability sistem informasi menggunakan metode Heuristic Evaluation untuk menilai kualitas pengalaman pengguna.",
      tech: ["UI/UX", "Research", "Evaluation"],
    },
    {
      title: "Admin Dashboard",
      type: "Dashboard UI",
      desc: "Desain dashboard admin modern untuk menampilkan data, statistik, laporan, dan manajemen konten secara responsif.",
      tech: ["HTML", "CSS", "JavaScript"],
    },
  ];

  const techStack = [
    "React",
    "Vite",
    "Three.js",
    "JavaScript",
    "HTML5",
    "CSS3",
    "Flutter",
    "Firebase",
    "Firestore",
    "Figma",
    "GitHub",
    "VS Code",
  ];

  return (
    <main className="portfolio">
<nav className="nav">
  <div className="nav-profile">
    <img src="/febrian1.jpeg" alt="Foto Febrian" />
    <div>
      <span>Information Systems Student</span>
      <strong>M Febrian Sidiq Hafadzah</strong>
    </div>
  </div>

  <div className="nav-menu">
    <a href="#about">About</a>
    <a href="#expertise">Expertise</a>
    <a href="#projects">Works</a>
    <a href="#tech">Tech</a>
    <a href="#contact">Contact</a>
  </div>
</nav>

      <section className="hero" id="home">
        <div className="hero-copy">

          <h1>
            M Febrian
            <br />
            <strong>Sidiq Hafadzah</strong>
          </h1>

          <p className="hero-role">Web Developer & UI/UX Enthusiast</p>

          <p className="hero-desc">
            I'm an Information Systems student focusing on web development, interface design, and systems analysis. I build modern, interactive, responsive, and user-friendly digital experiences.
          </p>

          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              Explore Works
            </a>
            <a href="#contact" className="btn btn-outline">
              Contact Me
            </a>
          </div>

          <div className="hero-metrics">
            <div>
              <strong>04+</strong>
              <span>Projects</span>
            </div>
            <div>
              <strong>12+</strong>
              <span>Tech Stack</span>
            </div>
            <div>
              <strong>3D</strong>
              <span>Experience</span>
            </div>
          </div>
        </div>

        <div className="hero-visual hero-space-visual">
          <div className="space-glow one"></div>
          <div className="space-glow two"></div>

          <div className="space-canvas-free">
            <RealSolarSystemScene />
          </div>
        </div>
      </section>

      <section className="ticker">
        <div className="ticker-track">
          <span>Galaxy Portfolio</span>
          <b>✦</b>
          <span>React Developer</span>
          <b>✦</b>
          <span>Realistic Planet Showcase</span>
          <b>✦</b>
          <span>UI/UX Design</span>
          <b>✦</b>
          <span>System Analysis</span>
          <b>✦</b>
          <span>Galaxy Portfolio</span>
          <b>✦</b>
          <span>React Developer</span>
        </div>
      </section>

      <section className="section planet-showcase-section">
        <div className="section-head center">
          <span>Planets</span>
          <h2>Explore the planets in one clean section.</h2>
        </div>

        <div className="planet-showcase-grid">
          <article className="planet-showcase-card">
            <div className="planet-showcase-canvas">
              <PlanetScene planet="mercury" />
            </div>
            <div className="planet-showcase-content">
              <h3>Mercury</h3>
              <p>A small dark-gray planet with a rocky surface covered in visible craters.</p>
            </div>
          </article>

          <article className="planet-showcase-card">
            <div className="planet-showcase-canvas">
              <PlanetScene planet="venus" />
            </div>
            <div className="planet-showcase-content">
              <h3>Venus</h3>
              <p>A golden-brown planet with a thick cloudy surface and a warm glowing look.</p>
            </div>
          </article>

          <article className="planet-showcase-card">
            <div className="planet-showcase-canvas">
              <PlanetScene planet="earth" moon />
            </div>
            <div className="planet-showcase-content">
              <h3>Earth</h3>
              <p>A blue planet with green-brown land areas and soft white cloud layers.</p>
            </div>
          </article>

          <article className="planet-showcase-card">
            <div className="planet-showcase-canvas">
              <PlanetScene planet="mars" />
            </div>
            <div className="planet-showcase-content">
              <h3>Mars</h3>
              <p>A reddish-brown planet with a dry, dusty, and rocky surface texture.</p>
            </div>
          </article>

          <article className="planet-showcase-card">
            <div className="planet-showcase-canvas">
              <PlanetScene planet="jupiter" />
            </div>
            <div className="planet-showcase-content">
              <h3>Jupiter</h3>
             <p>A giant planet with swirling brown, cream, and white atmospheric bands.</p>
            </div>
          </article>

          <article className="planet-showcase-card">
            <div className="planet-showcase-canvas">
              <PlanetScene planet="saturn" ring />
            </div>
            <div className="planet-showcase-content">
              <h3>Saturn</h3>
             <p>A pale yellow planet surrounded by thin rings across its middle area.</p>
            </div>
          </article>

          <article className="planet-showcase-card">
            <div className="planet-showcase-canvas">
              <PlanetScene planet="uranus" />
            </div>
            <div className="planet-showcase-content">
              <h3>Uranus</h3>
              <p>A smooth blue-green planet with a cold, soft, and gaseous appearance.</p>
            </div>
          </article>

          <article className="planet-showcase-card">
            <div className="planet-showcase-canvas">
              <PlanetScene planet="neptune" />
            </div>
            <div className="planet-showcase-content">
              <h3>Neptune</h3>
              <p>A deep blue planet with a dark mysterious atmosphere and smooth surface glow.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="section about" id="about">
        <div className="section-head">
          <span>About Me</span>
          <h2>Building digital products with structure, style, and purpose.</h2>
        </div>

        <div className="about-grid">
          <div className="about-main">
            <p>
              I have a strong interest in technology, particularly web development, mobile apps, UI/UX design, and usability evaluation.
I enjoy creating digital displays that are not only attractive,
but also neat, clear, and user-friendly.
            </p>
            <p>
My focus is on creating responsive websites, functional systems, and modern interface design. I also study systems analysis, UML, software testing, and user requirements.
            </p>
          </div>

          <div className="about-side">
            <div>
              <strong>IPI</strong>
              <span>Information Systems</span>
            </div>
            <div>
              <strong>2026</strong>
              <span>Portfolio Published</span>
            </div>
            <div>
              <strong>Open</strong>
              <span>For Collaboration</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="expertise">
        <div className="section-head center">
          <span>Expertise</span>
          <h2>What I Can Do</h2>
        </div>

        <div className="expertise-grid">
          {expertise.map((item) => (
            <article className="expertise-card" key={item.title}>
              <small>{item.number}</small>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="projects">
        <div className="section-head projects-head">
          <div>
            <span>Selected Works</span>
            <h2>Featured Projects</h2>
          </div>
          <a href="#contact">Start Project →</a>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <article className="project-card" key={project.title}>
              <div className="project-index">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div>
                <span className="project-type">{project.type}</span>
                <h3>{project.title}</h3>
                <p>{project.desc}</p>

                <div className="project-tech">
                  {project.tech.map((tech) => (
                    <small key={tech}>{tech}</small>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section tech-section" id="tech">
        <div className="section-head center">
          <span>Tech Stack</span>
          <h2>Tools I Use</h2>
        </div>

        <div className="tech-grid">
          {techStack.map((tech) => (
            <div className="tech-card" key={tech}>
              {tech}
            </div>
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contact-card">
          <span>Available For Collaboration</span>
          <h2>Let’s build something cosmic.</h2>
          <p>
            Tertarik bekerja sama, membuat project, atau berdiskusi tentang web
            development dan UI/UX? Hubungi saya melalui email atau Instagram.
          </p>

          <div className="contact-actions">
            <a href="mailto:owenknight126@gmail.com" className="btn btn-primary">
              Email Me
            </a>
            <a
              href="https://www.instagram.com/fevrii1z"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
            >
              Instagram
            </a>
          </div>

          <div className="contact-info">
            <div>
              <small>Email</small>
              <strong>owenknight126@gmail.com</strong>
            </div>
            <div>
              <small>Instagram</small>
              <strong>@fevrii1z</strong>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <p>© 2026 M Febrian Sidiq Hafadzah. Galaxy Portfolio built with React.</p>
      </footer>
    </main>
  );
}

export default App;