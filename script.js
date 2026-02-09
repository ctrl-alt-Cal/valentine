const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");
const modal  = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");
const container = document.getElementById("buttons");

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function moveNoButton(ev) {
  const rect = container.getBoundingClientRect();

  // Make sure container + button can be positioned
  const cs = window.getComputedStyle(container);
  if (cs.position === "static") container.style.position = "relative";
  noBtn.style.position = "absolute";
  noBtn.style.right = "auto";

  const padding = 10;

  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;

  const maxX = rect.width  - btnW - padding;
  const maxY = rect.height - btnH - padding;

  // If container has no height, we can't move vertically
  // (CSS fix above prevents this)
  const hasY = maxY > padding;

  // Finger position relative to container
  const clientX = (ev?.clientX ?? (ev?.touches?.[0]?.clientX)) ?? (rect.left + rect.width/2);
  const clientY = (ev?.clientY ?? (ev?.touches?.[0]?.clientY)) ?? (rect.top + rect.height/2);

  const x0 = clientX - rect.left;
  const y0 = clientY - rect.top;

  // Current button position (fallback to center)
  const curX = parseFloat(noBtn.style.left || (rect.width/2 - btnW/2));
  const curY = parseFloat(noBtn.style.top  || (rect.height/2 - btnH/2));

  // Vector away from touch
  const dx = curX - x0;
  const dy = curY - y0;

  // If very close, force a direction
  const len = Math.hypot(dx, dy) || 1;

  // Jump distance (bigger = harder to catch)
  const jump = 140;

  let nx = curX + (dx / len) * jump + (Math.random() * 40 - 20);
  let ny = curY + (dy / len) * jump + (Math.random() * 40 - 20);

  // If container is short, still allow some Y randomness
  if (!hasY) ny = curY;

  nx = clamp(nx, padding, maxX);
  ny = clamp(ny, padding, maxY);

  noBtn.style.left = `${nx}px`;
  noBtn.style.top  = `${ny}px`;
}

// Desktop hover
noBtn.addEventListener("mouseenter", moveNoButton);

// Mobile/touch: move immediately on press
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  moveNoButton(e);
}, { passive: false });

// Also move if click slips through
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  moveNoButton(e);
});

yesBtn.addEventListener("click", () => modal.classList.add("show"));
closeBtn.addEventListener("click", () => modal.classList.remove("show"));
