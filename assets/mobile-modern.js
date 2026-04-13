document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("leadModal");
  const openButtons = document.querySelectorAll(".open-modal");
  const closeButton = document.getElementById("closeModal");

  const leadForm = document.getElementById("leadForm");
  const submitBtn = document.getElementById("submitBtn");
  const formMessage = document.getElementById("formMessage");

  const desktopLeadForm = document.getElementById("desktopLeadForm");
  const desktopSubmitBtn = document.getElementById("desktopSubmitBtn");
  const desktopFormMessage = document.getElementById("desktopFormMessage");

  function openModal() {
    if (!modal || window.innerWidth >= 769) return;
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

  function showError(id, inputEl, msg) {
    const errorEl = document.getElementById(id);
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.classList.add("active");
    }
    if (inputEl) {
      inputEl.classList.add("input-error");
    }
  }

  function clearErrors(form) {
    form.querySelectorAll(".error-msg").forEach((el) => el.classList.remove("active"));
    form.querySelectorAll("input").forEach((el) => el.classList.remove("input-error"));
  }

  async function handleFormSubmit({
    form,
    submitBtnEl,
    messageEl,
    nameId,
    phoneId,
    jobId,
    nameErrorId,
    phoneErrorId,
    jobErrorId,
    closeAfter = false,
  }) {
    if (!form) return;

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      clearErrors(form);

      let isValid = true;

      const name = document.getElementById(nameId);
      const phone = document.getElementById(phoneId);
      const job = document.getElementById(jobId);

      const repeatedPhone = /^(\d)\1+$/;

      if (!name || name.value.trim().length < 10) {
        showError(nameErrorId, name, "يرجى إدخال الاسم الثلاثي");
        isValid = false;
      }

      if (!phone || phone.value.trim().length < 11 || repeatedPhone.test(phone.value.trim())) {
        showError(phoneErrorId, phone, "رقم الهاتف غير صحيح");
        isValid = false;
      }

      if (!job || job.value.trim().length < 3) {
        showError(jobErrorId, job, "يرجى كتابة وظيفة حقيقية");
        isValid = false;
      }

      if (!isValid) return;

      const formData = new FormData(form);

      if (submitBtnEl) {
        submitBtnEl.disabled = true;
        submitBtnEl.textContent = "جاري الإرسال...";
      }

      if (messageEl) {
        messageEl.textContent = "";
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
          if (messageEl) {
            messageEl.textContent = "تم إرسال البيانات بنجاح";
          }

          form.reset();

          if (typeof gtag === "function") {
            gtag("event", "form_submit", {
              event_category: "lead",
              event_label: window.location.pathname || "/",
            });
          }

          if (closeAfter) {
            setTimeout(() => {
              closeModal();
              if (messageEl) messageEl.textContent = "";
            }, 1800);
          }
        } else {
          if (messageEl) {
            messageEl.textContent = "حدث خطأ، حاول مرة أخرى";
          }
        }
      } catch (err) {
        if (messageEl) {
          messageEl.textContent = "خطأ في الاتصال";
        }
      } finally {
        if (submitBtnEl) {
          submitBtnEl.disabled = false;
          submitBtnEl.textContent = "إرسال البيانات";
        }
      }
    });
  }

  handleFormSubmit({
    form: leadForm,
    submitBtnEl: submitBtn,
    messageEl: formMessage,
    nameId: "userName",
    phoneId: "userPhone",
    jobId: "userJob",
    nameErrorId: "nameError",
    phoneErrorId: "phoneError",
    jobErrorId: "jobError",
    closeAfter: true,
  });

  handleFormSubmit({
    form: desktopLeadForm,
    submitBtnEl: desktopSubmitBtn,
    messageEl: desktopFormMessage,
    nameId: "desktopUserName",
    phoneId: "desktopUserPhone",
    jobId: "desktopUserJob",
    nameErrorId: "desktopNameError",
    phoneErrorId: "desktopPhoneError",
    jobErrorId: "desktopJobError",
    closeAfter: false,
  });
});