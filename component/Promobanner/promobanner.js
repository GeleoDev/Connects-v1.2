/**
 * Promo Banner Component JavaScript
 * Maneja la lógica del promo banner: configuración de rutas
 */

(function() {
    'use strict';

    // Detectar la profundidad de la página actual
    function getPageDepth() {
        const path = window.location.pathname;
        const depth = path.split('/').filter(p => p && !p.includes('.html')).length - 1;
        return depth;
    }

    // Configurar Promo Banner
    function setupPromoBanner() {
        const promoBanner = document.querySelector('.promo-banner');
        if (!promoBanner) return;

        const depth = getPageDepth();
        const promoLink = promoBanner.querySelector('[data-promo-link]');
        
        if (promoLink) {
            // Redirigir a Energías Renovables
            if (window.location.hostname.includes('github.io')) {
                // En GitHub Pages, usar ruta absoluta con el repositorio
                const pathParts = window.location.pathname.split('/').filter(p => p);
                const repoName = pathParts[0] || 'Connects-v1.2';
                promoLink.href = `/${repoName}/Energias-renovables/`;
            } else {
                // Comportamiento normal para desarrollo local
                promoLink.href = depth === 0 ? './Energias-renovables/' : '../Energias-renovables/';
            }
        }
    }

    function initVisibilityHandlers() {
        const promoBanner = document.querySelector('.promo-banner');
        if (!promoBanner) return;

        const HIDE_SCROLL_OFFSET = 50;
        const MOBILE_MAX_WIDTH = 800;

        const updateByScroll = () => {
            if (window.innerWidth > MOBILE_MAX_WIDTH) {
                promoBanner.classList.remove('promo-hidden');
                return;
            }
            if (window.scrollY > HIDE_SCROLL_OFFSET) {
                promoBanner.classList.add('promo-hidden');
            } else if (!document.body.classList.contains('compo-menu-open')) {
                promoBanner.classList.remove('promo-hidden');
            }
        };

        const handleMenuToggle = (event) => {
            const isOpen = event?.detail?.open;
            if (window.innerWidth > MOBILE_MAX_WIDTH) {
                promoBanner.classList.remove('promo-hidden');
                return;
            }
            if (isOpen) {
                promoBanner.classList.add('promo-hidden');
            } else if (window.scrollY <= HIDE_SCROLL_OFFSET) {
                promoBanner.classList.remove('promo-hidden');
            }
        };

        const handleResize = () => {
            if (window.innerWidth > MOBILE_MAX_WIDTH) {
                promoBanner.classList.remove('promo-hidden');
                return;
            }
            updateByScroll();
        };

        window.addEventListener('scroll', updateByScroll, { passive: true });
        window.addEventListener('menuToggle', handleMenuToggle);
        window.addEventListener('resize', handleResize);

        // Estado inicial
        updateByScroll();
    }

    // Inicializar promo banner
    function initPromoBanner() {
        setupPromoBanner();
        initVisibilityHandlers();
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPromoBanner);
    } else {
        initPromoBanner();
    }
})();

