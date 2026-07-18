import { useEffect, useRef } from "react";

const CELL = 14; // px per cell (CSS pixels)
const STEP_MS = 160;
const SEED_DENSITY = 0.045;
const ACCENT = { r: 255, g: 180, b: 84 };

// Conway's Game of Life as an ambient canvas.
// The same simulation I wrote in Rust. See the projects section.
export default function GameOfLife() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cols = 0;
    let rows = 0;
    let grid = null; // Uint8Array: 0 dead, 1..255 alive (value = age, capped)
    let next = null;
    let rafId = 0;
    let stepTimer = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth: w, clientHeight: h } = canvas;
      const newCols = Math.ceil(w / CELL);
      const newRows = Math.ceil(h / CELL);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (newCols === cols && newRows === rows && grid) {
        draw();
        return;
      }

      // carry the living cells over so resizes (like the mobile URL bar
      // collapsing) don't wipe the board or any patterns the user stamped
      const oldGrid = grid;
      const oldCols = cols;
      const oldRows = rows;
      cols = newCols;
      rows = newRows;
      grid = new Uint8Array(cols * rows);
      next = new Uint8Array(cols * rows);
      if (oldGrid) {
        const copyCols = Math.min(oldCols, cols);
        const copyRows = Math.min(oldRows, rows);
        for (let y = 0; y < copyRows; y++) {
          for (let x = 0; x < copyCols; x++) {
            grid[y * cols + x] = oldGrid[y * oldCols + x];
          }
        }
      } else {
        seed();
      }
      draw();
    }

    let resizeTimer = 0;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    }

    function seed() {
      for (let i = 0; i < grid.length; i++) {
        grid[i] = Math.random() < SEED_DENSITY ? 1 : 0;
      }
    }

    function neighbors(x, y) {
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          // toroidal wrap
          const nx = (x + dx + cols) % cols;
          const ny = (y + dy + rows) % rows;
          if (grid[ny * cols + nx]) n++;
        }
      }
      return n;
    }

    function step() {
      let alive = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const n = neighbors(x, y);
          if (grid[i]) {
            next[i] = n === 2 || n === 3 ? Math.min(grid[i] + 1, 255) : 0;
          } else {
            next[i] = n === 3 ? 1 : 0;
          }
          if (next[i]) alive++;
        }
      }
      [grid, next] = [next, grid];

      // re-sprinkle if the board goes quiet so it never dies out
      if (alive / grid.length < 0.02) {
        for (let i = 0; i < grid.length; i++) {
          if (Math.random() < 0.03) grid[i] = 1;
        }
      }
    }

    function draw() {
      const { clientWidth: w, clientHeight: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const age = grid[y * cols + x];
          if (!age) continue;
          // newborn cells glow brighter, settled cells fade back
          const alpha = age === 1 ? 0.38 : Math.max(0.24 - age * 0.015, 0.08);
          ctx.fillStyle = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${alpha})`;
          ctx.fillRect(x * CELL + 1.5, y * CELL + 1.5, CELL - 3, CELL - 3);
        }
      }
    }

    function tick() {
      step();
      rafId = requestAnimationFrame(draw);
    }

    function stamp(cx, cy) {
      // r-pentomino: five cells that erupt into chaos for hundreds of
      // generations. much more fun than a lone glider.
      const shape = [[0, 0], [1, 0], [-1, 1], [0, 1], [0, 2]];
      for (const [dx, dy] of shape) {
        const x = (cx + dx + cols) % cols;
        const y = (cy + dy + rows) % rows;
        grid[y * cols + x] = 1;
      }
      draw();
    }

    // listen on the whole hero so clicks work even where content
    // layers sit above the canvas; ignore clicks on real controls
    const host = canvas.parentElement;
    function onClick(e) {
      if (e.target.closest("a, button, input, textarea")) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / CELL);
      const y = Math.floor((e.clientY - rect.top) / CELL);
      stamp(x, y);
    }

    // the terminal's `glider` command releases gliders up here
    function onSpawn(e) {
      const count = e.detail?.count || 5;
      const glider = [[0, -1], [1, 0], [-1, 1], [0, 1], [1, 1]];
      for (let g = 0; g < count; g++) {
        const cx = Math.floor(Math.random() * cols);
        const cy = Math.floor(Math.random() * rows);
        for (const [dx, dy] of glider) {
          const x = (cx + dx + cols) % cols;
          const y = (cy + dy + rows) % rows;
          grid[y * cols + x] = 1;
        }
      }
      draw();
    }
    window.addEventListener("gol:spawn", onSpawn);

    resize();
    window.addEventListener("resize", onResize);
    host.addEventListener("click", onClick);

    if (!reduceMotion) {
      stepTimer = setInterval(tick, STEP_MS);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("gol:spawn", onSpawn);
      host.removeEventListener("click", onClick);
      clearTimeout(resizeTimer);
      clearInterval(stepTimer);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className="gol-canvas" aria-hidden="true" />;
}
