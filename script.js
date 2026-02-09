const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");
const modal  = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");
const container = document.getElementById("buttons");

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function ensurePositioning() {
  const cs = window.getComputedStyle(container);
  if (cs.position === "static") container.style.position = "relative";
  noBtn.style.position = "absolute";
  noBtn.style.right = "auto";
}

function moveNoButton(ev) {
  ensurePositioning();

  const rect = container.getBoundingClientRect();
  const padding = 10;

  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;

  const maxX = rect.width  - btnW - padding;
  const maxY = rect.height - btnH - padding;

  // If the container is too small, do nothing (prevents NaN/negative issues)
  if (maxX <= padding || maxY <= padding) return;

  // Pointer position relative to container
  const clientX = ev?.clientX ?? ev?.touches?.[0]?.clientX ?? (rect.left + rect.width / 2);
  const clientY = ev?.clientY ?? ev?.touches?.[0]?.clientY ?? (rect.top  + rect.height / 2);

  const x0 = clientX - rect.left;
  const y0 = clientY - rect.top;

  // Current button position from styles (fallback to center)
  const curX = Number.parseFloat(noBtn.style.left) || (rect.width / 2 - btnW / 2);
  const curY = Number.parseFloat(noBtn.style.top)  || (rect.height / 2 - btnH / 2);

  // Move away from pointer
  const dx = curX - x0;
  const dy = curY - y0;
  const len = Math.hypot(dx, dy) || 1;

  const jump = 160; // bigger jump = harder to catch
  let nx = curX + (dx / len) * jump + (Math.random() * 80 - 40);
  let ny = curY + (dy / len) * jump + (Math.random() * 80 - 40);

  nx = clamp(nx, padding, maxX);
  ny = clamp(ny, padding, maxY);

  noBtn.style.left = `${nx}px`;
  noBtn.style.top  = `${ny}px`;
}

/* --- Make it "always responsive" --- */

// 1) Desktop hover
noBtn.addEventListener("mouseenter", moveNoButton);

// 2) Mobile + desktop press
noBtn.addEventListener(
  "pointerdown",
  (e) => {
    e.preventDefault();
    moveNoButton(e);
  },
  { passive: false }
);

// 3) If a click slips through, still run
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  moveNoButton(e);
});

// 4) IMPORTANT: Run away when pointer gets CLOSE (works great on mobile)
let rafLock = false;
container.addEventListener(
  "pointermove",
  (e) => {
    // throttle so it doesn't spam
    if (rafLock) return;
    rafLock = true;
    requestAnimationFrame(() => {
      rafLock = false;

      const b = noBtn.getBoundingClientRect();
      const px = e.clientX;
      const py = e.clientY;

      // distance from pointer to center of button
      const cx = b.left + b.width / 2;
      const cy = b.top + b.height / 2;
      const dist = Math.hypot(px - cx, py - cy);

      // If finger/mouse gets within 90px, run!
      if (dist < 90) moveNoButton(e);
    });
  },
  { passive: true }
);

/* --- Yes / Modal --- */
yesBtn.addEventListener("click", () => modal.classList.add("show"));
closeBtn.addEventListener("click", () => modal.classList.remove("show"));
