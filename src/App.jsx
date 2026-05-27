import "./App.css";

function App() {
  const projects = [
    {
      title: "Banar.id Marketplace",
      description:
        "Aplikasi marketplace pertanian berbasis Flutter dan Firebase untuk menghubungkan petani dan distributor.",
      tech: ["Flutter", "Firebase", "Firestore"],
    },
    {
      title: "SIPADES Usability Analysis",
      description:
        "Analisis usability sistem pelayanan administrasi desa menggunakan metode Heuristic Evaluation.",
      tech: ["UI/UX", "Heuristic Evaluation", "Research"],
    },
    {
      title: "Portfolio Website",
      description:
        "Website personal portfolio berbasis React untuk menampilkan profil, skill, project, dan kontak.",
      tech: ["React", "Vite", "CSS"],
    },
  ];

  const skills = [
    "React",
    "Flutter",
    "Firebase",
    "UI/UX Design",
    "Figma",
    "HTML",
    "CSS",
    "JavaScript",
    "Software Testing",
    "Heuristic Evaluation",
  ];

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-card">
          <div className="avatar">KP</div>

          <p className="tag">Information Systems Student</p>

          <h1>
            Hi, I’m <span>M Febrian Sidiq Hafadzah</span>
          </h1>

          <p className="subtitle">
            Saya mahasiswa Sistem Informasi yang tertarik pada Web Development,
            UI/UX Design, Flutter, Firebase, dan analisis usability sistem.
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="btn primary">
              Lihat Project
            </a>
            <a href="#contact" className="btn secondary">
              Hubungi Saya
            </a>
          </div>

          <div className="social-links">
            <a href="https://github.com/" target="_blank">
              GitHub
            </a>
            <a href="https://linkedin.com/" target="_blank">
              LinkedIn
            </a>
            <a href="https://www.instagram.com/fevrii1z" target="_blank">
              Instagram
            </a>
            <a href="mailto:owenknight126@gmail.com">Email</a>
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <h2>Tentang Saya</h2>
        <p>
          Saya memiliki minat dalam pengembangan aplikasi web dan mobile,
          terutama pada pembuatan antarmuka yang responsif, modern, dan mudah
          digunakan. Saya juga tertarik pada penelitian usability untuk menilai
          kualitas pengalaman pengguna pada sistem informasi.
        </p>
      </section>

      <section className="section">
        <h2>Skill</h2>
        <div className="skills-grid">
          {skills.map((skill) => (
            <div className="skill-card" key={skill}>
              {skill}
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="projects">
        <h2>Project</h2>
        <div className="projects-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>

              <div className="tech-list">
                {project.tech.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section contact" id="contact">
        <h2>Kontak</h2>
        <p>
          Tertarik bekerja sama atau ingin melihat project saya lebih lanjut?
          Silakan hubungi saya melalui email atau media sosial.
        </p>

        <a className="btn primary" href="mailto:khdzputri@gmail.com">
          Kirim Email
        </a>
      </section>
    </main>
  );
}

export default App;