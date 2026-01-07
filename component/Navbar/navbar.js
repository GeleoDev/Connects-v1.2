/**
 * Navbar Component JavaScript
 * SIN ANIMACIONES - Solo funcionalidad básica
 * Todas las clases usan prefijo COMPO- para evitar conflictos
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
        // Detectar si estamos en GitHub Pages
        if (window.location.hostname.includes('github.io')) {
            // Extraer el nombre del repositorio de la URL
            const pathParts = window.location.pathname.split('/').filter(p => p);
            const repoName = pathParts[0] || 'Connects-v1.2';
            return `/${repoName}/`;
        }

        // Comportamiento normal para desarrollo local
        const depth = getPageDepth();
        if (depth === 0) {
            return './';
        }
        // Generar '../' repetido según la profundidad
        return '../'.repeat(depth);
    }

    // Detectar página actual
    function getCurrentPage() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('servicios')) return 'servicios';
        if (path.includes('fibra-optica')) return 'fibra';
        if (path.includes('energias-renovables')) return 'energias';
        if (path.includes('sobre-nosotros')) return 'sobre';
        return 'home';
    }

    // Configurar rutas del navbar
    function setupNavbar() {
        const navbar = document.querySelector('.compo-navbar');
        if (!navbar) return;

        const currentPage = getCurrentPage();
        const rootPath = getRelativePathToRoot();

        // Configurar logo
        const logoLink = navbar.querySelector('[data-navbar-logo]');
        const logoImg = navbar.querySelector('[data-navbar-logo-img]');
        
        if (logoLink && logoImg) {
            logoLink.href = `${rootPath}index.html`;
            logoImg.src = `${rootPath}img/ConnectsLogo.png`;
        }

        // Configurar enlaces del menú con rutas relativas correctas
        const links = {
            servicios: `${rootPath}Servicios/index.html`,
            fibra: `${rootPath}fibra-optica/index.html`,
            energias: `${rootPath}Energias-renovables/index.html`,
            sobre: `${rootPath}Sobre-nosotros/index.html`,
            contacto: `${rootPath}index.html#contact`
        };

        // Actualizar enlaces
        Object.keys(links).forEach(key => {
            const link = navbar.querySelector(`[data-nav-link="${key}"]`);
            if (link) {
                link.href = links[key];
                // Marcar página actual
                if (key === currentPage) {
                    link.style.opacity = '0.7';
                    link.style.pointerEvents = 'none';
                } else {
                    link.style.opacity = '1';
                    link.style.pointerEvents = 'auto';
                }
            }
        });
    }

    // Inicializar menú móvil
    function initMobileMenu() {
        const navbarToggle = document.querySelector('.compo-navbar-toggle');
        const navbarMenu = document.querySelector('.compo-navbar-menu');
        
        if (navbarToggle && navbarMenu) {
            const toggleMenu = (event) => {
                if (event && event.type === 'keydown' && !['Enter', ' '].includes(event.key)) {
                    return;
                }
                if (window.innerWidth > 763) {
                    // En desktop no usamos menú hamburguesa
                    navbarToggle.classList.remove('compo-active');
                    navbarMenu.classList.remove('compo-active');
                    navbarToggle.setAttribute('aria-expanded', 'false');
                    navbarMenu.setAttribute('aria-hidden', 'true');
                    document.body.classList.remove('compo-menu-open');
                    return;
                }
                const isOpen = navbarMenu.classList.toggle('compo-active');
                navbarToggle.classList.toggle('compo-active', isOpen);
                navbarToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                navbarMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
                document.body.classList.toggle('compo-menu-open', isOpen);
                window.dispatchEvent(new CustomEvent('menuToggle', { detail: { open: isOpen } }));
            };

            ['click', 'touchstart', 'keydown'].forEach(evt => {
                navbarToggle.addEventListener(evt, toggleMenu, { passive: false });
            });
            
            // Cerrar menú al hacer clic en un enlace
            document.querySelectorAll('.compo-navbar-link').forEach(link => {
                link.addEventListener('click', () => {
                    navbarToggle.classList.remove('compo-active');
                    navbarMenu.classList.remove('compo-active');
                    navbarToggle.setAttribute('aria-expanded', 'false');
                    navbarMenu.setAttribute('aria-hidden', 'true');
                    document.body.classList.remove('compo-menu-open');
                    window.dispatchEvent(new CustomEvent('menuToggle', { detail: { open: false } }));
                });
            });

            // Cerrar el menú si se vuelve a escritorio
            const handleResize = () => {
                if (window.innerWidth > 763) {
                    navbarToggle.classList.remove('compo-active');
                    navbarMenu.classList.remove('compo-active');
                    navbarToggle.setAttribute('aria-expanded', 'false');
                    navbarMenu.setAttribute('aria-hidden', 'true');
                    document.body.classList.remove('compo-menu-open');
                    window.dispatchEvent(new CustomEvent('menuToggle', { detail: { open: false } }));
                }
            };

            window.addEventListener('resize', handleResize);
        }
    }

    // SIN EFECTO SCROLL - Removido completamente

    // Inicializar navbar
    function initNavbar() {
        const navbar = document.querySelector('.compo-navbar');
        if (!navbar) {
            return false;
        }

        // Forzar visibilidad inmediata
        navbar.style.opacity = '1';
        navbar.style.visibility = 'visible';
        navbar.style.display = 'block';
        navbar.style.position = 'fixed';
        navbar.style.top = '0';
        navbar.style.left = '0';
        navbar.style.width = '100%';
        navbar.style.zIndex = '10000';
        navbar.style.background = '#34495e';

        setupNavbar();
        initMobileMenu();
        // initScrollEffect() - REMOVIDO
        
        return true;
    }

    // Intentar inicializar cuando el DOM esté listo
    function tryInit() {
        if (!initNavbar()) {
            setTimeout(tryInit, 100);
        }
    }

    // Escuchar evento cuando el navbar se carga dinámicamente
    window.addEventListener('navbarLoaded', initNavbar);

    // Intentar inicializar inmediatamente si el navbar ya existe
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        tryInit();
    }
})();
