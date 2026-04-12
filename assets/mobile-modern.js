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
      
      // إخفاء الأخطاء القديمة
      document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('input').forEach(el => el.classList.remove('input-error'));

      let isValid = true;

      // 1. فحص الاسم
      const name = document.getElementById('userName');
      if (name.value.trim().length < 10) {
        showError('nameError', name, 'يرجى إدخال اسمك الثلاثي');
        isValid = false;
      }

      // 2. فحص الهاتف
      const phone = document.getElementById('userPhone');
      const repeatedPhone = /^(\d)\1+$/;
      if (phone.value.length < 11 || repeatedPhone.test(phone.value)) {
        showError('phoneError', phone, 'رقم الهاتف غير صحيح');
        isValid = false;
      }

      // 3. فحص الوظيفة
      const job = document.getElementById('userJob');
      if (job.value.length < 3) {
        showError('jobError', job, 'يرجى كتابة وظيفة حقيقية');
        isValid = false;
      }

      // 4. فحص كود الأمان (88)
      const code = document.getElementById('secureCode');
      if (code.value !== '88') {
        showError('codeError', code, 'كود التحقق غير صحيح');
        isValid = false;
      }

      if (!isValid) return; // لو فيه غلط ميكملش

      // ... كملي باقي كود الـ fetch الأصلي هنا لإرسال البيانات ...
      const formData = new FormData(leadForm);
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "جاري الإرسال..."; }
      
      try {
        const response = await fetch("https://formspree.io/f/mreojdba", {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });
        if (response.ok) {
          formMessage.textContent = "تم بنجاح!";
          leadForm.reset();
          setTimeout(() => closeModal(), 2000);
        }
      } catch (err) { formMessage.textContent = "خطأ في الاتصال"; }
      finally { submitBtn.disabled = false; submitBtn.textContent = "إرسال البيانات"; }
    });
  }

  // دالة مساعدة لإظهار الخطأ
  function showError(id, inputEl, msg) {
    const errorEl = document.getElementById(id);
    errorEl.textContent = msg;
    errorEl.classList.add('active');
    inputEl.classList.add('input-error');
  }
});