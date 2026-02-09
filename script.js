const yesBtn   = document.getElementById("yesBtn");
const noBtn    = document.getElementById("noBtn");
const modal    = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");
const container = document.getElementById("buttons");

if (!yesBtn || !noBtn || !container) {
  console.warn("Missing yes/no/buttons elements — skipping No-button behaviour.");
} else {
  let lastMove = 0;
  const MOVE_COOLDOWN_MS = 120;

  function moveNoButton() {
    const now = Date.now();
    if (now - lastMove < MOVE_COOLDOWN_MS) return;
    lastMove = now;

    const containerStyle = window.getComputedStyle(container);
    if (containerStyle.position === "static") {
      container.style.position = "relative";
    }

    const rect = container.getBoundingClientRect();

    const padding = 8;

    noBtn.style.position = "absolute";
    noBtn.style.transition = "left 160ms ease, top 160ms ease, transform 120ms ease";

    const maxX = Math.max(0, rect.width - noBtn.offsetWidth - padding);
    const maxY = Math.max(0, rect.height - noBtn.offsetHeight - padding);

    const x = Math.max(padding, Math.floor(Math.random() * maxX));
    const y = Math.max(padding, Math.floor(Math.random() * maxY));

    noBtn.style.left = `${x}px`;
    noBtn.style.top  = `${y}px`;
    noBtn.style.right = "auto";

    noBtn.style.transform = "scale(1.03)";
    setTimeout(() => { noBtn.style.transform = ""; }, 140);
  }

  noBtn.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") moveNoButton();
  });

  noBtn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    moveNoButton();
  }, { passive: false });

  noBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    moveNoButton();
  }, { passive: false });

  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    moveNoButton();
  });

  yesBtn.addEventListener("click", () => {
    modal.classList.add("show");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");
  });
}
