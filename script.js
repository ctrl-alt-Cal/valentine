window.addEventListener("load", () => {
  document.getElementById("question").style.visibility = "visible";
});

const yesBtn   = document.getElementById("yesBtn");
const noBtn    = document.getElementById("noBtn");
const modal    = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");
const container = document.getElementById("buttons");

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function ensurePositioning() {
  if (getComputedStyle(container).position === "static") {
    container.style.position = "relative";
  }
  noBtn.style.position = "absolute";
  noBtn.style.right = "auto";
}

function randomPosition(rect, btnW, btnH, padding) {
  return {
    x: Math.random() * (rect.width  - btnW - padding) + padding,
    y: Math.random() * (rect.height - btnH - padding) + padding
  };
}

function moveNoButton(ev) {
  ensurePositioning();

  const rect = container.getBoundingClientRect();
  const padding = 12;

  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;

  const maxX = rect.width  - btnW - padding;
  const maxY = rect.height - btnH - padding;

  if (maxX <= padding || maxY <= padding) return;

  // Pointer position
  const px = ev?.clientX ?? rect.left + rect.width / 2;
  const py = ev?.clientY ?? rect.top  + rect.height / 2;

  const x0 = px - rect.left;
  const y0 = py - rect.top;

  const curX = parseFloat(noBtn.style.left) || rect.width  / 2;
  const curY = parseFloat(noBtn.style.top)  || rect.height / 2;

  let dx = curX - x0;
  let dy = curY - y0;
  let len = Math.hypot(dx, dy);

  // If vector is too small or weird, force randomness
  if (!len || len < 20) {
    const r = randomPosition(rect, btnW, btnH, padding);
    noBtn.style.left = `${r.x}px`;
    noBtn.style.top  = `${r.y}px`;
    return;
  }

  dx /= len;
  dy /= len;

  const jump = 180;

  let nx = curX + dx * jump + (Math.random() * 80 - 40);
  let ny = curY + dy * jump + (Math.random() * 80 - 40);

  nx = clamp(nx, padding, maxX);
  ny = clamp(ny, padding, maxY);

  // 🔥 EDGE-ESCAPE: if it didn't really move, teleport
  if (Math.abs(nx - curX) < 10 && Math.abs(ny - curY) < 10) {
    const r = randomPosition(rect, btnW, btnH, padding);
    nx = r.x;
    ny = r.y;
  }

  noBtn.style.left = `${nx}px`;
  noBtn.style.top  = `${ny}px`;
}

/* Desktop hover */
noBtn.addEventListener("mouseenter", moveNoButton);

/* Touch + click */
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  moveNoButton(e);
}, { passive: false });

noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  moveNoButton(e);
});

/* PROXIMITY dodge — prevents corner trapping */
let raf = false;
container.addEventListener("pointermove", (e) => {
  if (raf) return;
  raf = true;
  requestAnimationFrame(() => {
    raf = false;
    const b = noBtn.getBoundingClientRect();
    const cx = b.left + b.width / 2;
    const cy = b.top  + b.height / 2;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
    if (dist < 100) moveNoButton(e);
  });
});

/* Modal */
yesBtn.addEventListener("click", () => modal.classList.add("show"));
closeBtn.addEventListener("click", () => modal.classList.remove("show"));

