import { useEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { site } from "../data";

const LINKS = [
  { label: "work", href: "#work", id: "work" },
  { label: "about", href: "#about", id: "about" },
  { label: "terminal", href: "#terminal", id: "terminal" },
  { label: "contact", href: "#contact", id: "contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  const progressRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const bar = progressRef.current;
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // highlight the section currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id === "top" ? "" : entry.target.id);
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    ["top", ...LINKS.map((l) => l.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />
      <div className="container nav-inner">
        <a href="#top" className="nav-brand" onClick={() => setOpen(false)}>
          {/* the glider: smallest spaceship in Conway's Game of Life */}
          <svg
            className="brand-mark"
            viewBox="0 0 17 17"
            width="18"
            height="18"
            aria-hidden="true"
          >
            <g fill="currentColor">
              <rect x="6" y="0" width="5" height="5" rx="1" />
              <rect x="12" y="6" width="5" height="5" rx="1" />
              <rect x="0" y="12" width="5" height="5" rx="1" />
              <rect x="6" y="12" width="5" height="5" rx="1" />
              <rect x="12" y="12" width="5" height="5" rx="1" />
            </g>
          </svg>
          <span>
            <span className="tilde">~</span>/ishwori
          </span>
        </a>

        <button
          className="nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>

        <ul className={`nav-links ${open ? "open" : ""}`}>
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={active === link.id ? "active" : ""}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              className="resume-link"
              href={site.resumeUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
            >
              resume
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
