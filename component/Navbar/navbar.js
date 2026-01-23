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

        // Función para hacer scroll con offset
        function scrollToHashWithOffset(hash, offset) {
            setTimeout(() => {
                const targetElement = document.getElementById(hash);
                if (targetElement) {
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - offset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }

        // Actualizar enlaces
        Object.keys(links).forEach(key => {
            const link = navbar.querySelector(`[data-nav-link="${key}"]`);
            if (link) {
                link.href = links[key];
                
                // Agregar evento de clic para enlaces con hash (especialmente fibra)
                if (links[key].includes('#')) {
                    link.addEventListener('click', function(e) {
                        const href = this.getAttribute('href');
                        const hashIndex = href.indexOf('#');
                        const hash = href.substring(hashIndex + 1);
                        const urlParts = href.split('#');
                        const targetUrl = urlParts[0];
                        const currentUrl = window.location.pathname + window.location.search;
                        
                        // Si es un enlace a otra página
                        if (targetUrl && !currentUrl.includes(targetUrl.split('/').pop())) {
                            e.preventDefault();
                            sessionStorage.setItem('scrollToHash', hash);
                            sessionStorage.setItem('scrollOffset', '20');
                            window.location.href = href;
                            return;
                        }
                        
                        // Si estamos en la misma página
                        e.preventDefault();
                        scrollToHashWithOffset(hash, 20);
                    });
                }
                
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
        const navbar = document.querySelector('.compo-navbar');
        
        if (!navbarToggle || !navbarMenu || !navbar) return;

        // Evitar registros duplicados si initMobileMenu se ejecuta varias veces
        if (navbarToggle.dataset.bound === 'true') return;
        navbarToggle.dataset.bound = 'true';

        const setMenuState = (open) => {
            navbarToggle.classList.toggle('compo-active', open);
            navbarMenu.classList.toggle('compo-active', open);
            navbarToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            navbarMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
            document.body.classList.toggle('compo-menu-open', open);
            window.dispatchEvent(new CustomEvent('menuToggle', { detail: { open } }));
        };

        const closeMenu = () => setMenuState(false);

        const toggleMenu = (event) => {
            if (event && event.type === 'keydown') {
                if (!['Enter', ' '].includes(event.key)) return;
                event.preventDefault();
            }
            if (window.innerWidth > 763) {
                closeMenu();
                return;
            }
            const isOpen = navbarMenu.classList.contains('compo-active');
            setMenuState(!isOpen);
        };

        const handleOutsideClick = (event) => {
            if (!navbarMenu.classList.contains('compo-active')) return;
            if (navbar.contains(event.target)) return;
            closeMenu();
        };

        const handleResize = () => {
            if (window.innerWidth > 763) {
                closeMenu();
            }
        };

        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        };

        // Estado inicial
        setMenuState(false);

        // Solo click y keydown para evitar doble disparo touch+click
        ['click', 'keydown'].forEach(evt => {
            navbarToggle.addEventListener(evt, toggleMenu);
        });
        document.addEventListener('click', handleOutsideClick);
        window.addEventListener('resize', handleResize);
        document.addEventListener('keydown', handleEsc);

        // Cerrar menú al navegar
        document.querySelectorAll('.compo-navbar-link').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // SIN EFECTO SCROLL - Removido completamente

    // Función para manejar scroll con hash guardado
    function handleStoredHashScroll() {
        const scrollToHash = sessionStorage.getItem('scrollToHash');
        const scrollOffset = parseInt(sessionStorage.getItem('scrollOffset')) || 20;
        
        if (scrollToHash) {
            sessionStorage.removeItem('scrollToHash');
            sessionStorage.removeItem('scrollOffset');
            
            setTimeout(() => {
                const targetElement = document.getElementById(scrollToHash);
                if (targetElement) {
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - scrollOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 200);
        } else {
            // Si hay hash en la URL actual, también ajustarlo
            const hash = window.location.hash.substring(1);
            if (hash) {
                setTimeout(() => {
                    const targetElement = document.getElementById(hash);
                    if (targetElement) {
                        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = elementPosition - 20;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 200);
            }
        }
    }

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
        handleStoredHashScroll();
        // initScrollEffect() - REMOVIDO
        
        return true;
    }

    // Intentar inicializar cuando el DOM esté listo
    function tryInit() {
        if (!initNavbar()) {
            setTimeout(tryInit, 100);
        } else {
            // Ejecutar scroll después de que el navbar esté inicializado
            setTimeout(handleStoredHashScroll, 300);
        }
    }

    // Escuchar evento cuando el navbar se carga dinámicamente
    window.addEventListener('navbarLoaded', () => {
        initNavbar();
        setTimeout(handleStoredHashScroll, 300);
    });

    // Intentar inicializar inmediatamente si el navbar ya existe
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
        // También ejecutar scroll cuando la página esté completamente cargada
        window.addEventListener('load', () => {
            setTimeout(handleStoredHashScroll, 300);
        });
    } else {
        tryInit();
        // Si ya está cargado, ejecutar scroll después de un delay
        setTimeout(handleStoredHashScroll, 300);
    }
})();
