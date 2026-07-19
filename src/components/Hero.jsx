import { useEffect, useRef, useState } from "react";
import { FiArrowDown } from "react-icons/fi";
import { site } from "../data";
import { useTypewriter } from "../hooks/useTypewriter";
import GameOfLife from "./GameOfLife";

const CMD = "whoami";

// Types the hero's shell command character by character on load.
function useTypedCommand() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(CMD.length);
      return;
    }
    if (count >= CMD.length) return;
    const timer = setTimeout(() => setCount(count + 1), count === 0 ? 550 : 95);
    return () => clearTimeout(timer);
  }, [count]);

  return { typed: CMD.slice(0, count), done: count >= CMD.length };
}

export default function Hero() {
  const roles = useTypewriter(site.roles);
  const command = useTypedCommand();
  const contentRef = useRef(null);

  // gentle parallax: the content drifts and fades as you scroll away
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = contentRef.current;
        if (!el) return;
        const y = window.scrollY;
        const vh = window.innerHeight;
        if (y > vh) return;
        el.style.transform = `translateY(${y * 0.22}px)`;
        el.style.opacity = String(Math.max(1 - y / (vh * 0.85), 0));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hero" id="top">
      <GameOfLife />
      <div className="container hero-content" ref={contentRef}>
        <p className="hero-eyebrow">
          <span className="user">ishwori@data</span>:~$ {command.typed}
          {!command.done && <span className="caret caret-sm" aria-hidden="true" />}
        </p>

        <h1 className="hero-name">
          Ishwori
          <br />
          Khanal<span className="dot">.</span>
        </h1>

        <p className="hero-roles" aria-label={site.roles.join(", ")}>
          <span className="prompt">&gt;</span>
          <span className="typed">{roles}</span>
          <span className="caret" aria-hidden="true" />
        </p>

        <p className="hero-lede">{site.lede}</p>

        <div className="hero-cta">
          <a className="btn btn-solid" href="#work">
            View work <FiArrowDown aria-hidden="true" />
          </a>
          <a
            className="btn btn-ghost"
            href="https://github.com/ishworii"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>

        <p className="hero-hint">
          psst: the background is running Conway's Game of Life. Click anywhere
          to spark new life.
        </p>
      </div>
    </section>
  );
}
