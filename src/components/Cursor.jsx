import { useEffect, useRef } from "react";

// The cursor is a living cell: an amber square that chases the pointer
// and swells over anything interactive. Desktop fine-pointers only.
export default function Cursor() {
  const cellRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    document.documentElement.classList.add("has-cell-cursor");
    const cell = cellRef.current;
    let x = -100;
    let y = -100;
    let cx = -100;
    let cy = -100;
    let raf = 0;

    function onMove(e) {
      x = e.clientX;
      y = e.clientY;
      cell.classList.toggle(
        "hover",
        !!e.target.closest("a, button, .project-card, .skill-tile, input, [role='button']")
      );
    }

    function onDown() {
      cell.classList.add("down");
    }
    function onUp() {
      cell.classList.remove("down");
    }
    function onLeave() {
      cell.classList.add("gone");
    }
    function onEnter() {
      cell.classList.remove("gone");
    }

    function tick() {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      cell.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.documentElement.classList.remove("has-cell-cursor");
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return <div className="cursor-cell" ref={cellRef} aria-hidden="true" />;
}
