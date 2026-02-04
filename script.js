const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");
const modal  = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");

function moveNoButton() {
  const container = document.getElementById("buttons");
  const rect = container.getBoundingClientRect();

  const padding = 6;
  const maxX = rect.width - noBtn.offsetWidth - padding;
  const maxY = rect.height - noBtn.offsetHeight - padding;

  const x = Math.max(padding, Math.random() * maxX);
  const y = Math.max(padding, Math.random() * maxY);

  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;
  noBtn.style.right = "auto";
}

// Run away on hover (desktop) and touch (mobile)
noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("mouseover", moveNoButton);
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNoButton();
});

// If she somehow taps it, still dodge
noBtn.addEventListener("click", moveNoButton);

yesBtn.addEventListener("click", () => {
  modal.classList.add("show");
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("show");
});
