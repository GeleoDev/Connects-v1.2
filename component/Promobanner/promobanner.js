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

    // Inicializar promo banner
    function initPromoBanner() {
        setupPromoBanner();
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPromoBanner);
    } else {
        initPromoBanner();
    }
})();

