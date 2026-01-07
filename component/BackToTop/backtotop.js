/**
 * Back To Top Button Component
 * Muestra el botón al hacer scroll y sube suavemente al inicio.
 */

(function() {
    'use strict';

    const SHOW_OFFSET = 200; // px de scroll para mostrar el botón

    function initBackToTop() {
        const btn = document.getElementById('backtotop-button');
        if (!btn) return false;

        const toggleVisibility = () => {
            if (window.scrollY > SHOW_OFFSET) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        };

        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };

        // Listeners
        window.addEventListener('scroll', toggleVisibility, { passive: true });
        btn.addEventListener('click', scrollToTop);

        // Estado inicial
        toggleVisibility();
        return true;
    }

    function tryInit() {
        if (!initBackToTop()) {
            setTimeout(tryInit, 100);
        }
    }

    // Eventos
    window.addEventListener('backToTopLoaded', initBackToTop);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        tryInit();
    }
})();

