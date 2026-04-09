document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("leadModal");
  const openButtons = document.querySelectorAll(".open-modal");
  const closeButton = document.getElementById("closeModal");
  const leadForm = document.getElementById("leadForm");
  const submitBtn = document.getElementById("submitBtn");
  const formMessage = document.getElementById("formMessage");

  function openModal() {
    if (!modal) return;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  openButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      openModal();
    });
  });

  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  window.addEventListener("load", function () {
    const alreadyShown = localStorage.getItem("aljar_mobile_modern_modal_shown");

    if (!alreadyShown && window.innerWidth <= 768) {
      setTimeout(function () {
        openModal();
        localStorage.setItem("aljar_mobile_modern_modal_shown", "true");
      }, 5000);
    }
  });

  document.querySelectorAll('a[href*="wa.me"]').forEach((el) => {
    el.addEventListener("click", function () {
      if (typeof gtag === "function") {
        gtag("event", "whatsapp_click", {
          event_category: "engagement",
          event_label: window.location.pathname || "/",
        });
      }
    });
  });

  document.querySelectorAll('a[href^="tel:"]').forEach((el) => {
    el.addEventListener("click", function () {
      if (typeof gtag === "function") {
        gtag("event", "phone_click", {
          event_category: "engagement",
          event_label: window.location.pathname || "/",
        });
      }
    });
  });

  if (leadForm) {
    leadForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(leadForm);

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "جاري الإرسال...";
      }

      if (formMessage) {
        formMessage.textContent = "";
      }

      try {
        const response = await fetch("https://formspree.io/f/mreojdba", {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          if (formMessage) {
            formMessage.textContent = "تم إرسال البيانات بنجاح";
          }

          leadForm.reset();

          if (typeof gtag === "function") {
            gtag("event", "form_submit", {
              event_category: "lead",
              event_label: window.location.pathname || "/",
            });
          }

          setTimeout(function () {
            closeModal();
            if (formMessage) {
              formMessage.textContent = "";
            }
          }, 1500);
        } else {
          if (formMessage) {
            formMessage.textContent = "حدث خطأ، حاول مرة أخرى";
          }
        }
      } catch (error) {
        if (formMessage) {
          formMessage.textContent = "تعذر الإرسال، تحقق من الاتصال بالإنترنت";
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "إرسال البيانات";
        }
      }
    });
  }
});