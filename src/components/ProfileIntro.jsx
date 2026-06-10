import "./ProfileIntro.css";

export default function ProfileIntro() {
  return (
    <section className="profile-intro-section">
      <div className="profile-intro-inner">
        <div className="profile-intro-copy">
          <span>PORTFOLIO PREVIEW</span>

          <h2>
            M Febrian
            <br />
            Sidiq Hafadzah
          </h2>

          <p>
            Frontend developer focused on clean visuals, responsive layouts,
            interactive components, and modern web experiences.
          </p>
        </div>

        <div className="profile-intro-card">
          <img src="/profile.jpg" alt="M Febrian S.H" />
        </div>
      </div>
    </section>
  );
}