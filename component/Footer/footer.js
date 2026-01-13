/**
 * Footer Component JavaScript
 * Maneja la lógica del footer: configuración de rutas
 */

(function() {
    'use strict';

    // Calcular la profundidad de la página actual
    function getPageDepth() {
        const path = window.location.pathname;
        // Limpiar la ruta: remover index.html si está presente y filtrar strings vacíos
        const pathParts = path.split('/').filter(p => p && p !== 'index.html' && !p.includes('.html'));
        return pathParts.length;
    }

    // Generar ruta relativa hacia la raíz
    function getRelativePathToRoot() {
        const depth = getPageDepth();
        if (depth === 0) {
            return './';
        }
        // Generar '../' repetido según la profundidad
        return '../'.repeat(depth);
    }

    // Configurar rutas del footer
    function setupFooter() {
        const footer = document.querySelector('.footer');
        if (!footer) return;

        const rootPath = getRelativePathToRoot();

        // Configurar enlaces del footer con rutas relativas correctas
        const links = {
            servicios: `${rootPath}Servicios/index.html`,
            fibra: `${rootPath}fibra-optica/index.html`,
            energias: `${rootPath}Energias-renovables/index.html`,
            sobre: `${rootPath}Sobre-nosotros/index.html`,
            contacto: `${rootPath}index.html#contact`,
            terminos: `${rootPath}TerminosCondiciones/index.html`
        };

        Object.keys(links).forEach(key => {
            const link = footer.querySelector(`[data-footer-link="${key}"]`);
            if (link) {
                link.href = links[key];
            }
        });
    }

    // Inicializar footer
    function initFooter() {
        setupFooter();
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFooter);
    } else {
        initFooter();
    }
})();

