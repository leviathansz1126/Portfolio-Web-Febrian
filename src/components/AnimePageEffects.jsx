import { useEffect } from "react";
import { animate, stagger } from "animejs";

const enterSelectors = [
  ".staggered-menu-header",

  ".quote-badge",
  ".hero-title-custom",
  ".hero-description",
  ".hero-actions",
  ".hero-stats .stat-card",
  ".hero-visual",

  ".manifesto-panel",
  ".manifesto-label",
  ".portfolio-scroll-reveal",
  ".manifesto-pixel-wrap",

  ".about-lanyard-panel",
  ".about-label",
  ".about-lanyard-copy h2",
  ".about-blur-text",
  ".about-stats > div",
  ".about-note",
  ".about-lanyard-visual",

  ".section-header",
  ".section-header span",
  ".section-header h2",
  ".section-header p",

  ".service-card",
  ".project-card",
  ".chat-panel",
  ".contact-panel",
  ".contact-links a",
  ".footer",
];

const hoverSelectors = [".project-card", ".service-card", ".stat-card", ".contact-links a"];

function getDirectionClass(el) {
  if (
    el.matches(".hero-content, .quote-badge, .hero-title-custom, .hero-description, .hero-actions")
  ) {
    return "anime-from-left";
  }

  if (el.matches(".hero-visual, .about-lanyard-visual, .manifesto-pixel-wrap")) {
    return "anime-from-right";
  }

  if (el.matches(".project-card, .service-card, .stat-card, .contact-links a")) {
    return "anime-pop";
  }

  return "anime-from-bottom";
}

export default function AnimePageEffects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const elements = enterSelectors
      .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
      .filter(Boolean);

    elements.forEach((el, index) => {
      el.classList.add("anime-safe-reveal", getDirectionClass(el));
      el.style.setProperty("--anime-delay", `${Math.min(index * 22, 220)}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;

          if (entry.isIntersecting) {
            el.classList.add("is-visible");

            animate(el, {
              opacity: [0, 1],
              translateY: [24, 0],
              translateX: [0, 0],
              scale: [0.985, 1],
              filter: ["blur(12px)", "blur(0px)"],
              duration: 760,
              delay: Number.parseInt(el.style.getPropertyValue("--anime-delay")) || 0,
              ease: "outExpo",
            });
          } else {
            el.classList.remove("is-visible");

            animate(el, {
              opacity: 0,
              translateY: 18,
              scale: 0.985,
              filter: "blur(10px)",
              duration: 320,
              ease: "inOutQuad",
            });
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "-6% 0px -6% 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    const hoverElements = hoverSelectors
      .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
      .filter(Boolean);

    const cleanupHover = [];

    hoverElements.forEach((el) => {
      const enter = () => {
        animate(el, {
          translateY: -8,
          scale: 1.018,
          duration: 260,
          ease: "outQuad",
        });
      };

      const leave = () => {
        animate(el, {
          translateY: 0,
          scale: 1,
          duration: 320,
          ease: "outQuad",
        });
      };

      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);

      cleanupHover.push(() => {
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointerleave", leave);
      });
    });

    const nav = document.querySelector(".staggered-menu-header");
    if (nav) {
      animate(nav, {
        opacity: [0, 1],
        translateY: [-20, 0],
        filter: ["blur(12px)", "blur(0px)"],
        duration: 900,
        ease: "outExpo",
      });
    }

    const heroSequence = document.querySelectorAll(
      ".quote-badge, .hero-title-custom, .hero-description, .hero-actions, .hero-stats .stat-card, .hero-visual"
    );

    if (heroSequence.length) {
      animate(heroSequence, {
        opacity: [0, 1],
        translateY: [34, 0],
        filter: ["blur(14px)", "blur(0px)"],
        duration: 850,
        delay: stagger(95, { start: 280 }),
        ease: "outExpo",
      });
    }

    return () => {
      observer.disconnect();

      cleanupHover.forEach((fn) => fn());

      elements.forEach((el) => {
        el.classList.remove(
          "anime-safe-reveal",
          "anime-from-left",
          "anime-from-right",
          "anime-from-bottom",
          "anime-pop",
          "is-visible"
        );

        el.style.removeProperty("--anime-delay");
        el.style.opacity = "";
        el.style.transform = "";
        el.style.filter = "";
      });
    };
  }, []);

  return null;
}