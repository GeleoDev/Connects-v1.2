/**
 * Promo Banner Component JavaScript
 * Maneja la lógica del promo banner: configuración de rutas
 */

(function() {
    'use strict';

    // Detectar la profundidad de la página actual (carpetas por encima del archivo actual)
    function getPageDepth(pathParts) {
        if (!pathParts || !pathParts.length) return 0;
        const parts = [...pathParts];
        const last = parts[parts.length - 1];
        // Si el último segmento parece archivo (.html), no cuenta como carpeta
        if (last && last.includes('.html')) {
            parts.pop();
        }
        // Profundidad es cantidad de carpetas por encima de la raíz del proyecto
        return Math.max(parts.length, 0);
    }

    // Obtener la ruta base para recursos (soporta GitHub Pages, file:// y rutas anidadas)
    function getBasePath() {
        const pathParts = window.location.pathname.split('/').filter(p => p);
        const projectAliases = ['Connects v1.2', 'Connects%20v1.2', 'Connects-v1.2'];

        if (window.location.hostname.includes('github.io')) {
            const repoName = pathParts[0] || 'Connects-v1.2';
            return `/${repoName}/`;
        }

        // Soporte para abrir con file:// (Windows/Mac) detectando la carpeta del proyecto
        const projectIndex = pathParts.findIndex(p => projectAliases.includes(p));
        if (projectIndex !== -1) {
            const subParts = pathParts.slice(projectIndex + 1);
            const last = subParts[subParts.length - 1];
            if (last && last.includes('.html')) subParts.pop();
            const depthFromProject = subParts.length;
            return depthFromProject <= 0 ? './' : '../'.repeat(depthFromProject);
        }

        // Fallback: cálculo por profundidad
        const depth = getPageDepth(pathParts);
        return depth <= 0 ? './' : '../'.repeat(depth);
    }

    // Configurar Promo Banner
    function setupPromoBanner() {
        const promoBanner = document.querySelector('.promo-banner');
        if (!promoBanner) return;

        const basePath = getBasePath();
        const promoLink = promoBanner.querySelector('[data-promo-link]');
        const promoImage = promoBanner.querySelector('[data-promo-img]');
        
        if (promoLink) {
            // Redirigir a la sección de productos en Energías Renovables
            promoLink.href = `${basePath}Energias-renovables/#products`;
        }

        if (promoImage) {
            // Ajustar la ruta del recurso según el entorno
            promoImage.src = `${basePath}img/Equipo_All_In_One_HBP_1800_en_PNG.png`;
        }

        // Ajustar posición del promobanner para que quede pegado al navbar
        function updatePromoBannerPosition() {
            const navbar = document.querySelector('.compo-navbar');
            if (navbar && promoBanner) {
                // Obtener la altura real del navbar incluyendo padding y border
                const navbarRect = navbar.getBoundingClientRect();
                const navbarHeight = navbarRect.height;
                // Asegurar que no haya espacio: usar la altura exacta
                promoBanner.style.top = `${navbarHeight}px`;
                promoBanner.style.marginTop = '0';
                promoBanner.style.paddingTop = '0';
            }
        }

        // Función para esperar a que el navbar esté completamente cargado
        function waitForNavbar() {
            const navbar = document.querySelector('.compo-navbar');
            if (navbar && navbar.offsetHeight > 0) {
                updatePromoBannerPosition();
                return true;
            }
            return false;
        }

        // Intentar actualizar posición inmediatamente
        if (!waitForNavbar()) {
            // Si el navbar no está listo, esperar un poco
            setTimeout(() => {
                if (!waitForNavbar()) {
                    // Si aún no está, usar requestAnimationFrame
                    requestAnimationFrame(() => {
                        updatePromoBannerPosition();
                    });
                }
            }, 100);
        }

        // Actualizar posición cuando el navbar cambia (scroll, resize, etc.)
        window.addEventListener('resize', updatePromoBannerPosition);
        window.addEventListener('scroll', updatePromoBannerPosition, { passive: true });
        
        // Observar cambios en el navbar (por si cambia de tamaño)
        const navbar = document.querySelector('.compo-navbar');
        if (navbar) {
            const resizeObserver = new ResizeObserver(() => {
                updatePromoBannerPosition();
            });
            resizeObserver.observe(navbar);
        }

        // También escuchar cuando el navbar se carga completamente
        window.addEventListener('navbarLoaded', () => {
            setTimeout(updatePromoBannerPosition, 50);
        });
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

