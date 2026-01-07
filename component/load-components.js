/**
 * Component Loader - Carga componentes Navbar, Footer y Promobanner dinámicamente
 * Ajusta automáticamente las rutas según la ubicación de la página
 */

(function() {
    'use strict';

    // Detectar la profundidad de la página actual
    function getPageDepth() {
        const path = window.location.pathname;
        // Limpiar la ruta: remover index.html si está presente y filtrar strings vacíos
        const pathParts = path.split('/').filter(p => p && p !== 'index.html' && !p.includes('.html'));
        // Si estamos en la raíz (solo '/' o vacío), depth = 0
        // Si estamos en un subdirectorio (ej: /fibra-optica/), depth = 1
        const depth = pathParts.length > 0 ? pathParts.length : 0;
        return depth;
    }

    // Obtener ruta base para componentes
    function getComponentBasePath() {
        // Detectar si estamos en GitHub Pages
        if (window.location.hostname.includes('github.io')) {
            // Extraer el nombre del repositorio de la URL
            // Ejemplo: https://geleodev.github.io/Connects-v1.2/ -> Connects-v1.2
            const pathParts = window.location.pathname.split('/').filter(p => p);
            const repoName = pathParts[0] || 'Connects-v1.2'; // fallback por si acaso
            return `/${repoName}/component`;
        }

        // Comportamiento normal para desarrollo local
        const depth = getPageDepth();
        if (depth === 0) {
            return './component';
        }
        // Generar '../' repetido según la profundidad
        return '../'.repeat(depth) + 'component';
    }

    // Cargar CSS de un componente (solo si no está ya cargado en el HTML)
    function loadComponentCSS(componentName) {
        const basePath = getComponentBasePath();
        // Los archivos están en minúsculas: navbar.css, promobanner.css, footer.css
        const normalizedName = componentName.toLowerCase();
        let cssPath = `${basePath}/${componentName}/${normalizedName}.css`;

        // Para GitHub Pages, usar URL absoluta completa
        if (window.location.hostname.includes('github.io')) {
            cssPath = `${window.location.origin}${cssPath}`;
        }

        // Verificar si ya está cargado en el HTML
        const existingLink = document.querySelector(`link[href*="${componentName}/${normalizedName}.css"]`);
        if (existingLink) {
            return Promise.resolve();
        }

        // Si no está cargado, cargarlo dinámicamente
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssPath;
            link.onload = resolve;
            link.onerror = () => {
                console.warn(`No se pudo cargar CSS de ${componentName}, puede que ya esté en el HTML`);
                resolve(); // Resolver de todas formas para no bloquear
            };
            document.head.appendChild(link);
        });
    }

    // Cargar JS de un componente
    function loadComponentJS(componentName) {
        const basePath = getComponentBasePath();
        // Los archivos están en minúsculas: navbar.js, promobanner.js, footer.js
        const normalizedName = componentName.toLowerCase();
        let jsPath = `${basePath}/${componentName}/${normalizedName}.js`;

        // Para GitHub Pages, usar URL absoluta completa
        if (window.location.hostname.includes('github.io')) {
            jsPath = `${window.location.origin}${jsPath}`;
        }

        // Verificar si ya está cargado
        if (document.querySelector(`script[src="${jsPath}"]`)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = jsPath;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    // Cargar HTML de un componente
    function loadComponentHTML(componentName, placeholderSelector) {
        const basePath = getComponentBasePath();
        // Los archivos están en minúsculas: navbar.html, promobanner.html, footer.html
        const normalizedName = componentName.toLowerCase();
        let htmlPath = `${basePath}/${componentName}/${normalizedName}.html`;

        // Para GitHub Pages, usar URL absoluta completa
        if (window.location.hostname.includes('github.io')) {
            htmlPath = `${window.location.origin}${htmlPath}`;
        }

        // Verificar si estamos en file:// (sistema de archivos) - fetch no funciona
        if (window.location.protocol === 'file:') {
            console.error(`ERROR: No se puede cargar ${componentName} desde file://. Necesitas usar un servidor local (http://localhost).`);
            console.error('Solución: Usa un servidor local como Live Server, Python http.server, o Node.js http-server');
            return Promise.reject(new Error('CORS: fetch no funciona con file:// protocol'));
        }
        
        return fetch(htmlPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al cargar ${componentName}`);
                }
                return response.text();
            })
            .then(html => {
                const placeholder = document.querySelector(placeholderSelector);
                if (placeholder) {
                    // Crear un contenedor temporal para parsear el HTML
                    const temp = document.createElement('div');
                    temp.innerHTML = html.trim();
                    const component = temp.firstElementChild;
                    
                    // Asegurar visibilidad del navbar (usando prefijo COMPO-)
                    // SIN ANIMACIONES - Solo forzar visibilidad inmediata
                    if (componentName === 'Navbar' && component) {
                        const navbar = component.classList.contains('compo-navbar') ? component : component.querySelector('.compo-navbar');
                        if (navbar) {
                            navbar.style.opacity = '1';
                            navbar.style.visibility = 'visible';
                            navbar.style.display = 'block';
                            navbar.style.position = 'fixed';
                            navbar.style.top = '0';
                            navbar.style.left = '0';
                            navbar.style.width = '100%';
                            navbar.style.zIndex = '10000';
                            navbar.style.background = '#34495e';
                        }
                    }
                    
                    // Reemplazar el placeholder con el componente
                    placeholder.parentNode.replaceChild(component, placeholder);
                    return true;
                }
                return false;
            })
            .catch(error => {
                console.error(`Error cargando ${componentName}:`, error);
                return false;
            });
    }

    // Cargar componente completo (HTML + CSS + JS)
    function loadComponent(componentName, placeholderSelector) {
        // Cargar HTML primero, luego CSS y JS
        return loadComponentHTML(componentName, placeholderSelector)
            .then(() => {
                // Cargar CSS primero
                return loadComponentCSS(componentName);
            })
            .then(() => {
                // Esperar un momento para que el CSS se aplique
                return new Promise(resolve => setTimeout(resolve, 10));
            })
            .then(() => {
                // Cargar JS después de que el HTML y CSS estén listos
                return loadComponentJS(componentName);
            })
            .then(() => {
                // Asegurar visibilidad del navbar después de cargar todo (usando prefijo COMPO-)
                // SIN ANIMACIONES - Solo forzar visibilidad inmediata
                if (componentName === 'Navbar') {
                    setTimeout(() => {
                        const navbar = document.querySelector('.compo-navbar');
                        if (navbar) {
                            navbar.style.opacity = '1';
                            navbar.style.visibility = 'visible';
                            navbar.style.display = 'block';
                            navbar.style.position = 'fixed';
                            navbar.style.top = '0';
                            navbar.style.left = '0';
                            navbar.style.width = '100%';
                            navbar.style.zIndex = '10000';
                            navbar.style.background = '#34495e';
                            
                            // Disparar evento personalizado para que navbar.js sepa que está listo
                            window.dispatchEvent(new CustomEvent('navbarLoaded'));
                        }
                    }, 10);
                }
                
                // Asegurar visibilidad del Promobanner después de cargar
                if (componentName === 'Promobanner') {
                    setTimeout(() => {
                        const promobanner = document.querySelector('.promo-banner');
                        if (promobanner) {
                            promobanner.style.opacity = '1';
                            promobanner.style.visibility = 'visible';
                            promobanner.style.display = 'block';
                            promobanner.style.position = 'fixed';
                            promobanner.style.top = '80px'; // Debajo del navbar
                            promobanner.style.left = '0';
                            promobanner.style.width = '100%';
                            promobanner.style.zIndex = '9999';
                        }
                    }, 10);
                }
                
                // Disparar evento cuando el footer se carga
                if (componentName === 'Footer') {
                    setTimeout(() => {
                        const footer = document.querySelector('.footer');
                        if (footer) {
                            window.dispatchEvent(new CustomEvent('footerLoaded'));
                        }
                    }, 10);
                }
                
                // Disparar evento cuando el botón de WhatsApp se carga
                if (componentName === 'WhatsApp') {
                    setTimeout(() => {
                        const whatsappButton = document.querySelector('.whatsapp-button');
                        if (whatsappButton) {
                            window.dispatchEvent(new CustomEvent('whatsappLoaded'));
                        }
                    }, 10);
                }

                // Disparar evento cuando el botón Back To Top se carga
                if (componentName === 'BackToTop') {
                    setTimeout(() => {
                        const backToTopButton = document.querySelector('.backtotop-button');
                        if (backToTopButton) {
                            window.dispatchEvent(new CustomEvent('backToTopLoaded'));
                        }
                    }, 10);
                }
            })
            .catch(error => {
                console.error(`Error cargando componente ${componentName}:`, error);
            });
    }

    // Inicializar componentes
    function initComponents() {
        // Verificar si estamos en file:// y mostrar advertencia
        if (window.location.protocol === 'file:') {
            console.error('⚠️ IMPORTANTE: Estás abriendo el archivo desde el sistema de archivos (file://)');
            console.error('Los componentes NO funcionarán porque fetch() está bloqueado por CORS.');
            console.error('');
            console.error('SOLUCIONES:');
            console.error('1. Usa Live Server en VS Code (extensión "Live Server")');
            console.error('2. Usa Python: python -m http.server 8000');
            console.error('3. Usa Node.js: npx http-server');
            console.error('4. Luego abre: http://localhost:8000');
            return;
        }

        // Cargar Promo Banner (solo si existe el placeholder - actualmente solo en index.html)
        const promoBannerPlaceholder = document.querySelector('[data-component="promobanner"]');
        if (promoBannerPlaceholder) {
            loadComponent('Promobanner', '[data-component="promobanner"]').catch(err => {
                console.error('Error cargando Promobanner:', err);
            });
        }

        // Cargar Navbar
        const navbarPlaceholder = document.querySelector('[data-component="navbar"]');
        if (navbarPlaceholder) {
            loadComponent('Navbar', '[data-component="navbar"]');
        }

        // Cargar Footer
        const footerPlaceholder = document.querySelector('[data-component="footer"]');
        if (footerPlaceholder) {
            loadComponent('Footer', '[data-component="footer"]');
        }

        // Cargar WhatsApp Button (se carga en todas las páginas)
        const whatsappPlaceholder = document.querySelector('[data-component="whatsapp"]');
        if (whatsappPlaceholder) {
            loadComponent('WhatsApp', '[data-component="whatsapp"]');
        }

        // Cargar BackToTop (crear placeholder si no existe para asegurar presencia en todas las páginas)
        let backToTopPlaceholder = document.querySelector('[data-component="backtotop"]');
        if (!backToTopPlaceholder) {
            backToTopPlaceholder = document.createElement('div');
            backToTopPlaceholder.setAttribute('data-component', 'backtotop');
            document.body.appendChild(backToTopPlaceholder);
        }
        loadComponent('BackToTop', '[data-component="backtotop"]');
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initComponents);
    } else {
        initComponents();
    }
})();
