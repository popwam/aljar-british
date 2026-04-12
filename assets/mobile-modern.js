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

  // تتبع النقر على واتساب واتصال
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

  // معالجة إرسال الفورم مع التحقق الذكي (الفلترة)
  if (leadForm) {
    leadForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // 1. الفلترة: التحقق من الاختبار الرياضي
      const mathAnswer = document.getElementById('mathAnswer').value;
      if (parseInt(mathAnswer) !== 13) {
        alert('عفواً، إجابة الاختبار الرياضي غير صحيحة.');
        return;
      }

      // 2. الفلترة: التحقق من الاسم (يمنع الأسماء الوهمية القصيرة جداً)
      const nameVal = leadForm.querySelector('input[name="name"]').value.trim();
      if (nameVal.length < 3) {
        alert('يرجى إدخال الاسم الكامل لضمان الجدية.');
        return;
      }

      // 3. الفلترة: التحقق من رقم الهاتف (يجب أن يكون أرقام فقط وطول منطقي)
      const phoneVal = leadForm.querySelector('input[name="phone"]').value.trim();
      const phoneRegex = /^[0-9]+$/;
      if (!phoneRegex.test(phoneVal) || phoneVal.length < 10) {
        alert('يرجى إدخال رقم هاتف صحيح (أرقام فقط).');
        return;
      }

      // 4. الفلترة: التحقق من خانة الموافقة
      const confirmCheck = document.getElementById('confirmCall').checked;
      if (!confirmCheck) {
        alert('يرجى الموافقة على تلقي الاتصال للمتابعة.');
        return;
      }

      // إذا اجتاز كل الاختبارات، نبدأ الإرسال
      const formData = new FormData(leadForm);

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "جاري التأكد والإرسال...";
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
            formMessage.textContent = "تم إرسال طلبك بنجاح، سنتواصل معك قريباً.";
            formMessage.style.color = "#10b981";
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
            if (formMessage) formMessage.textContent = "";
          }, 2500);
        } else {
          throw new Error("Failed");
        }
      } catch (error) {
        if (formMessage) {
          formMessage.textContent = "حدث خطأ، يرجى المحاولة مرة أخرى.";
          formMessage.style.color = "#ef4444";
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