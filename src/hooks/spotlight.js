// Tracks the pointer inside an element so CSS can draw a spotlight
// (radial-gradient at --mx/--my) and a gentle 3D tilt (--rx/--ry).
// Attach as onMouseMove, with resetTilt on onMouseLeave.
const MAX_TILT = 2.5; // degrees

export function spotlight(e) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const px = e.clientX - rect.left;
  const py = e.clientY - rect.top;
  el.style.setProperty("--mx", `${px}px`);
  el.style.setProperty("--my", `${py}px`);
  el.style.setProperty("--ry", `${((px / rect.width) - 0.5) * 2 * MAX_TILT}deg`);
  el.style.setProperty("--rx", `${((py / rect.height) - 0.5) * -2 * MAX_TILT}deg`);
}

export function resetTilt(e) {
  const el = e.currentTarget;
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ry", "0deg");
}
