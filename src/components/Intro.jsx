import { useEffect, useRef, useState } from "react";

// The opening moment: a field of Game of Life chaos condenses into the
// name, holds, then dissolves into the page. Runs once per session.
// Click or press any key to skip.

const CELL = 10;
const TICK = 70;
const ACCENT = { r: 255, g: 180, b: 84 };

export default function Intro({ onSettled, onDone }) {
  const canvasRef = useRef(null);
  const [fading, setFading] = useState(false);

  // read callbacks through a ref so parent re-renders (which recreate the
  // inline props) can never tear down and restart the running animation
  const callbacksRef = useRef({ onSettled, onDone });
  callbacksRef.current = { onSettled, onDone };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cols = Math.ceil(W / CELL);
    const rows = Math.ceil(H / CELL);
    let grid = new Uint8Array(cols * rows);
    let next = new Uint8Array(cols * rows);
    for (let i = 0; i < grid.length; i++) grid[i] = Math.random() < 0.22 ? 1 : 0;

    let target = null;
    let settled = false;
    let finished = false;
    let interval = 0;

    async function computeTarget() {
      try {
        await Promise.race([
          document.fonts.load('800 120px "Bricolage Grotesque Variable"'),
          new Promise((resolve) => setTimeout(resolve, 700)),
        ]);
      } catch {
        // fall back to whatever font is available
      }
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const octx = off.getContext("2d", { willReadFrequently: true });
      const text = W < 700 ? "ishwori." : "ishwori khanal.";
      let size = Math.floor(rows * 0.5);
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      do {
        octx.font = `800 ${size}px "Bricolage Grotesque Variable", "IBM Plex Sans", sans-serif`;
        size -= 1;
      } while (octx.measureText(text).width > cols * 0.86 && size > 4);
      octx.fillStyle = "#fff";
      octx.fillText(text, cols / 2, rows / 2);
      const pixels = octx.getImageData(0, 0, cols, rows).data;
      const t = new Uint8Array(cols * rows);
      for (let i = 0; i < t.length; i++) t[i] = pixels[i * 4 + 3] > 120 ? 1 : 0;
      target = t;
    }
    computeTarget();

    function lifeStep() {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let n = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const nx = (x + dx + cols) % cols;
              const ny = (y + dy + rows) % rows;
              if (grid[ny * cols + nx]) n++;
            }
          }
          const i = y * cols + x;
          next[i] = grid[i] ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
        }
      }
      [grid, next] = [next, grid];
    }

    function draw(assemble) {
      ctx.clearRect(0, 0, W, H);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          if (!grid[i]) continue;
          const isTarget = target && target[i];
          const alpha = isTarget ? 0.55 + assemble * 0.4 : 0.3 - assemble * 0.2;
          if (alpha <= 0.02) continue;
          ctx.fillStyle = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${alpha})`;
          ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
        }
      }
    }

    const t0 = performance.now();

    function step() {
      if (finished) return;
      const t = (performance.now() - t0) / 1000;

      if (!target || t < 0.35) {
        lifeStep();
        draw(0);
        return;
      }

      const raw = Math.min((t - 0.35) / 1.0, 1);
      const ease = raw * raw * (3 - 2 * raw);

      if (raw < 1) {
        lifeStep();
        // pull cells toward the name: light up targets, cull the rest
        for (let i = 0; i < grid.length; i++) {
          if (target[i]) {
            if (Math.random() < 0.12 + ease * 0.55) grid[i] = 1;
          } else if (Math.random() < ease * 0.6) {
            grid[i] = 0;
          }
        }
      } else {
        // hold: the name, crisp, with a faint shimmer around it
        grid.set(target);
        for (let i = 0; i < grid.length; i++) {
          if (!target[i] && Math.random() < 0.004) grid[i] = 1;
        }
        if (t > 1.85 && !settled) {
          settled = true;
          callbacksRef.current.onSettled?.();
          setFading(true);
          setTimeout(() => {
            finished = true;
            callbacksRef.current.onDone?.();
          }, 650);
        }
      }
      draw(ease);
    }

    interval = setInterval(step, TICK);
    draw(0);

    function skip() {
      if (settled || finished) return;
      settled = true;
      callbacksRef.current.onSettled?.();
      setFading(true);
      setTimeout(() => {
        finished = true;
        callbacksRef.current.onDone?.();
      }, 350);
    }
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  return (
    <div className={`intro ${fading ? "fading" : ""}`} aria-hidden="true">
      <canvas ref={canvasRef} />
      <p className="intro-skip">click to skip</p>
    </div>
  );
}
