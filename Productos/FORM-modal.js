// FORM- modal controller (shared by Productos/*/index.html)
// The user requested "FORM-" prefix. JS identifiers can't contain '-', so we expose
// functions on window using bracket notation keys like window["FORM-openModal"].

(function () {
  const MODAL_ID = "FORM-modal";
  const TITLE_ID = "FORM-modal-title";

  function qs(sel, root = document) {
    return root.querySelector(sel);
  }

  function qsa(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }

  function getModalEls() {
    const modal = document.getElementById(MODAL_ID);
    if (!modal) return null;
    return {
      modal,
      dialog: qs(".FORM-modal__dialog", modal),
      title: document.getElementById(TITLE_ID),
      closeEls: qsa("[data-FORM-close]", modal),
      forms: qsa(".FORM-form[data-FORM-form]", modal),
    };
  }

  function setMode(mode) {
    const els = getModalEls();
    if (!els) return;

    let title = "Formulario";
    if (mode === "financing") title = "Consultar opciones de financiación";
    if (mode === "transfer") title = "Abonar con transferencia";
    if (els.title) els.title.textContent = title;

    els.forms.forEach((form) => {
      const formMode = form.getAttribute("data-FORM-form");
      form.style.display = formMode === mode ? "block" : "none";
    });
  }

  // Cache de elementos para mejor rendimiento
  let cachedElements = null;

  function getCachedElements() {
    if (!cachedElements) {
      cachedElements = getModalEls();
    }
    return cachedElements;
  }

  function openModal(mode) {
    const els = getCachedElements();
    if (!els) return;

    // Forzar reflow para animación suave
    els.modal.offsetHeight;

    setMode(mode);
    els.modal.classList.add("FORM-is-open");
    els.modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("FORM-modal-open");
    // Compatibilidad con Opera: bloquear scroll en body y html
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    // Guardar posición de scroll para restaurarla después
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    // Limpiar cache después de animación
    setTimeout(() => {
      cachedElements = null;
    }, 300);
  }

  function closeModal() {
    const els = getCachedElements();
    if (!els) return;

    // Forzar reflow para animación suave
    els.modal.offsetHeight;

    els.modal.classList.remove("FORM-is-open");
    els.modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("FORM-modal-open");
    // Compatibilidad con Opera: restaurar scroll en body y html
    const scrollY = document.body.style.top;
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    // Restaurar posición de scroll
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    // Limpiar cache después de animación
    setTimeout(() => {
      cachedElements = null;
    }, 300);
  }

  // Sistema de validación en tiempo real
  function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    let isValid = true;
    let message = '';

    // Validaciones específicas por tipo de campo
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(value);
      message = isValid ? '' : 'Email inválido';
    } else if (field.type === 'tel' && value) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
      isValid = phoneRegex.test(value);
      message = isValid ? '' : 'Teléfono inválido';
    } else if (field.type === 'text' && field.name.includes('cuit') && value) {
      // Validación básica de CUIT/CUIL
      const cuitRegex = /^[0-9]{2}-[0-9]{8}-[0-9]$|^[0-9]{11}$/;
      isValid = cuitRegex.test(value.replace(/[-\s]/g, ''));
      message = isValid ? '' : 'CUIT/CUIL inválido';
    }

    // Validación de requerido
    if (isRequired && !value) {
      isValid = false;
      message = 'Campo requerido';
    }

    // Actualizar estado visual
    field.classList.toggle('FORM-field--error', !isValid && value !== '');
    field.classList.toggle('FORM-field--success', isValid && value !== '');

    // Mostrar/ocultar mensaje de error
    let errorEl = field.parentNode.querySelector('.FORM-field-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'FORM-field-error';
      field.parentNode.appendChild(errorEl);
    }
    errorEl.textContent = message;
    errorEl.style.display = message ? 'block' : 'none';

    return isValid;
  }

  // Sistema de indicadores de carga
  function setLoading(button, loading) {
    const originalText = button.textContent;
    if (loading) {
      button.disabled = true;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      button.classList.add('FORM-submit--loading');
    } else {
      button.disabled = false;
      button.innerHTML = originalText;
      button.classList.remove('FORM-submit--loading');
    }
  }

  function init() {
    const els = getModalEls();
    if (!els) return;

    // Open buttons
    qsa("[data-FORM-open]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const mode = btn.getAttribute("data-FORM-open");
        openModal(mode);
      });
    });

    // Close buttons & overlay
    els.closeEls.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      });
    });

    // Click outside dialog closes (overlay-only)
    els.modal.addEventListener("click", (e) => {
      // only close if clicking the overlay, not inside the dialog
      if (e.target === els.modal || e.target.classList.contains("FORM-modal__overlay")) {
        closeModal();
      }
    });

    // Prevent clicks inside dialog from bubbling to modal
    if (els.dialog) {
      els.dialog.addEventListener("click", (e) => e.stopPropagation());
    }

    // ESC closes
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && els.modal.classList.contains("FORM-is-open")) {
        closeModal();
      }
    });

    // Validación en tiempo real para todos los campos
    qsa('.FORM-input, .FORM-select, .FORM-file').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        // Limpiar errores mientras el usuario escribe
        if (field.value.trim()) {
          field.classList.remove('FORM-field--error');
          const errorEl = field.parentNode.querySelector('.FORM-field-error');
          if (errorEl) errorEl.style.display = 'none';
        }
      });
    });

    // Manejo de envío de formularios con feedback
    qsa('.FORM-form').forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validar todos los campos
        const fields = form.querySelectorAll('.FORM-input, .FORM-select, .FORM-file');
        let allValid = true;
        fields.forEach(field => {
          if (!validateField(field)) allValid = false;
        });

        if (!allValid) {
          // Mostrar mensaje de error general
          alert('Por favor, complete todos los campos correctamente.');
          return;
        }

        // Mostrar loading
        const submitBtn = form.querySelector('.FORM-submit');
        setLoading(submitBtn, true);

        try {
          // Enviar formulario
          const formData = new FormData(form);
          const response = await fetch(form.action, {
            method: form.method,
            body: formData
          });

          if (response.ok) {
            // Éxito
            alert('Formulario enviado correctamente. Nos pondremos en contacto pronto.');
            closeModal();
            form.reset();
          } else {
            throw new Error('Error en el envío');
          }
        } catch (error) {
          alert('Error al enviar el formulario. Por favor, inténtelo de nuevo.');
          console.error('Error:', error);
        } finally {
          setLoading(submitBtn, false);
        }
      });
    });

    // Default state
    setMode("financing");
    closeModal();
  }

  // Expose "FORM-" prefixed functions on window
  window["FORM-init"] = init;
  window["FORM-openModal"] = openModal;
  window["FORM-closeModal"] = closeModal;
  window["FORM-setMode"] = setMode;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


