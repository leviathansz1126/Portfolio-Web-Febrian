import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import "./PixelTransition.css";

function PixelTransition({
  firstContent,
  secondContent,
  gridSize = 7,
  pixelColor = "currentColor",
  animationStepDuration = 0.3,
  once = false,
  aspectRatio = "100%",
  className = "",
  style = {},
}) {
  const containerRef = useRef(null);
  const pixelGridRef = useRef(null);
  const defaultRef = useRef(null);
  const activeRef = useRef(null);
  const delayedCallRef = useRef(null);

  const [isActive, setIsActive] = useState(false);

  const isTouchDevice = useMemo(() => {
    if (typeof window === "undefined") return false;

    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches
    );
  }, []);

  useEffect(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;

    pixelGridEl.innerHTML = "";

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement("div");
        pixel.classList.add("pixelated-image-card__pixel");
        pixel.style.backgroundColor = pixelColor;

        const size = 100 / gridSize;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;

        pixelGridEl.appendChild(pixel);
      }
    }
  }, [gridSize, pixelColor]);

  const playVideo = () => {
    const activeEl = activeRef.current;
    const video = activeEl?.querySelector("video");

    if (!video) return;

    video.currentTime = 0;
    video.muted = false;
    video.volume = 1;
    video.playsInline = true;
    video.play().catch(() => {});
  };

  const stopVideo = () => {
    const activeEl = activeRef.current;
    const video = activeEl?.querySelector("video");

    if (!video) return;

    video.pause();
    video.currentTime = 0;
    video.muted = true;
  };

  const animatePixels = (activate) => {
    const pixelGridEl = pixelGridRef.current;
    const defaultEl = defaultRef.current;
    const activeEl = activeRef.current;

    if (!pixelGridEl || !defaultEl || !activeEl) return;

    const pixels = pixelGridEl.querySelectorAll(".pixelated-image-card__pixel");
    if (!pixels.length) return;

    gsap.killTweensOf(pixels);

    if (delayedCallRef.current) {
      delayedCallRef.current.kill();
    }

    if (!activate) {
      stopVideo();
    }

    setIsActive(activate);

    gsap.set(pixels, { display: "none" });

    const totalPixels = pixels.length;
    const staggerDuration = animationStepDuration / totalPixels;

    gsap.to(pixels, {
      display: "block",
      duration: 0,
      stagger: {
        each: staggerDuration,
        from: "random",
      },
    });

    delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
      defaultEl.style.opacity = activate ? "0" : "1";
      activeEl.style.opacity = activate ? "1" : "0";

      // Jangan dibuat auto, biar mouseleave/tap tetap kebaca dari container
      activeEl.style.pointerEvents = "none";

      if (activate) {
        playVideo();
      } else {
        stopVideo();
      }
    });

    gsap.to(pixels, {
      display: "none",
      duration: 0,
      delay: animationStepDuration,
      stagger: {
        each: staggerDuration,
        from: "random",
      },
    });
  };

  const handleEnter = () => {
    if (!isActive) animatePixels(true);
  };

  const handleLeave = () => {
    if (isActive && !once) {
      stopVideo();
      animatePixels(false);
    }
  };

  const handleClick = () => {
    if (!isActive) {
      animatePixels(true);
      return;
    }

    if (isActive && !once) {
      stopVideo();
      animatePixels(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`pixelated-image-card ${className}`}
      style={style}
      onMouseEnter={!isTouchDevice ? handleEnter : undefined}
      onMouseLeave={!isTouchDevice ? handleLeave : undefined}
      onClick={handleClick}
      tabIndex={0}
    >
      <div style={{ paddingTop: aspectRatio }} />

      <div
        ref={defaultRef}
        className="pixelated-image-card__default"
        aria-hidden={isActive}
      >
        {firstContent}
      </div>

      <div
        ref={activeRef}
        className="pixelated-image-card__active"
        aria-hidden={!isActive}
      >
        {secondContent}
      </div>

      <div className="pixelated-image-card__pixels" ref={pixelGridRef} />
    </div>
  );
}

export default PixelTransition;