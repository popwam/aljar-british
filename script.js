const modal = document.getElementById("leadModal");
const openButtons = document.querySelectorAll(".open-modal");
const closeButton = document.getElementById("closeModal");

function openModal() {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

openButtons.forEach((button) => {
  button.addEventListener("click", openModal);
});

closeButton.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

/*
  Popup logic:
  - يفتح بعد 3 ثواني
  - أول مرة فقط
*/
window.addEventListener("load", () => {
  const alreadyShown = localStorage.getItem("aljar_modal_shown");

  if (!alreadyShown) {
    setTimeout(() => {
      openModal();
      localStorage.setItem("aljar_modal_shown", "true");
    }, 3000);
  }
});