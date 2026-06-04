import { useEffect } from "react";

const revealSelectors = [
  ".hero-content",
  ".hero-visual",
  ".manifesto-panel",
  ".about-lanyard-copy",
  ".about-lanyard-visual",
  ".section-header",
  ".service-card",
  ".project-card",
  ".chat-panel",
  ".contact-panel",
  ".footer",
];

function getRevealType(element) {
  if (element.classList.contains("hero-content")) return "reveal-left";
  if (element.classList.contains("hero-visual")) return "reveal-right";
  if (element.classList.contains("about-lanyard-copy")) return "reveal-left";
  if (element.classList.contains("about-lanyard-visual")) return "reveal-right";
  if (element.classList.contains("service-card")) return "reveal-pop";
  if (element.classList.contains("project-card")) return "reveal-pop";
  if (element.classList.contains("chat-panel")) return "reveal-left";
  if (element.classList.contains("contact-panel")) return "reveal-right";

  return "reveal-up";
}

export default function PageMotion() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    document.documentElement.classList.add("page-motion-ready");

    const elements = revealSelectors
      .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
      .filter(Boolean);

    elements.forEach((element, index) => {
      element.classList.add("page-reveal");
      element.classList.add(getRevealType(element));
      element.style.setProperty("--reveal-delay", `${Math.min(index * 45, 240)}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target;

          if (entry.isIntersecting) {
            element.classList.add("is-visible");
          } else {
            element.classList.remove("is-visible");
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "-8% 0px -8% 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();

      elements.forEach((element) => {
        element.classList.remove(
          "page-reveal",
          "reveal-up",
          "reveal-left",
          "reveal-right",
          "reveal-pop",
          "is-visible"
        );
        element.style.removeProperty("--reveal-delay");
      });

      document.documentElement.classList.remove("page-motion-ready");
    };
  }, []);

  return null;
}