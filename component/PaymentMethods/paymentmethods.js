/**
 * Payment Methods Modal Component
 * Maneja la lógica del modal de medios de pago
 */

(function() {
    'use strict';

    // Detectar la profundidad de la página actual
    function getPageDepth() {
        const path = window.location.pathname;
        const pathParts = path.split('/').filter(p => p && p !== 'index.html' && !p.includes('.html'));
        const depth = pathParts.length > 0 ? pathParts.length : 0;
        return depth;
    }

    // Obtener ruta base para recursos (imágenes de bancos y SVG de tarjetas)
    function getBasePath() {
        // Detectar si estamos en GitHub Pages
        if (window.location.hostname.includes('github.io')) {
            const pathParts = window.location.pathname.split('/').filter(p => p);
            const repoName = pathParts[0] || 'Connects-v1.2';
            return `/${repoName}/Productos/img`;
        }

        // Comportamiento normal para desarrollo local
        // Las páginas de productos están en Productos/*/index.html
        // Las imágenes están en Productos/img/
        // Desde Productos/Kit/index.html necesitamos ../img
        // Desde Productos/Inversor Solar/index.html necesitamos ../img
        const depth = getPageDepth();
        if (depth >= 2) {
            // Estamos en una página de producto (Productos/Nombre/index.html)
            return '../img';
        }
        // Fallback
        return '../../Productos/img';
    }

    // Configurar rutas de imágenes de bancos
    function setupBankImages() {
        const basePath = getBasePath();
        const bankImages = {
            'galicia': `${basePath}/Galicia.png`,
            'santander': `${basePath}/Santander.png`,
            'bbva': `${basePath}/BBVA.png`,
            'hipotecario': `${basePath}/Hipotecario.png`
        };

        Object.keys(bankImages).forEach(bank => {
            const img = document.querySelector(`[data-payment-bank-img="${bank}"]`);
            if (img) {
                img.src = bankImages[bank];
            }
        });
    }

    // Configurar rutas de imágenes SVG de tarjetas
    function setupCardImages() {
        const basePath = getBasePath();
        const cardImages = {
            'visa': `${basePath}/SVG/Visa.svg`,
            'mastercard': `${basePath}/SVG/mastercard.svg`,
            'amex': `${basePath}/SVG/Amex.svg`,
            'naranjax': `${basePath}/SVG/NaranjaX.svg`
        };

        Object.keys(cardImages).forEach(card => {
            const img = document.querySelector(`[data-payment-card-img="${card}"]`);
            if (img) {
                img.src = cardImages[card];
            }
        });
    }

    // Inicializar modal de medios de pago
    function initPaymentMethodsModal() {
        const paymentMethodsModal = document.getElementById('paymentMethodsModal');
        if (!paymentMethodsModal) return;

        const paymentMethodsDialog = paymentMethodsModal.querySelector('.payment-methods__dialog');
        const paymentMethodsClosers = paymentMethodsModal.querySelectorAll('[data-payment-methods-close]');

        function openPaymentMethods() {
            if (!paymentMethodsModal) return;
            // Compatibilidad con Opera: bloquear scroll en body y html
            paymentMethodsModal.classList.add('is-open');
            paymentMethodsModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            paymentMethodsDialog?.focus();
        }

        function closePaymentMethods() {
            if (!paymentMethodsModal) return;
            // Compatibilidad con Opera: restaurar scroll en body y html
            const scrollY = document.body.style.top;
            paymentMethodsModal.classList.remove('is-open');
            paymentMethodsModal.setAttribute('aria-hidden', 'true');
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            // Restaurar posición de scroll
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        // Agregar event listeners a los iconos de pago
        function attachPaymentIconListeners() {
            const paymentIcons = document.querySelectorAll('.payment-icons i');
            paymentIcons.forEach(icon => {
                // Verificar si ya tiene el listener
                if (icon.dataset.paymentListener === 'true') {
                    return; // Ya tiene el listener, no duplicar
                }
                
                // Marcar como procesado
                icon.dataset.paymentListener = 'true';
                
                icon.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openPaymentMethods();
                });
                
                icon.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openPaymentMethods();
                    }
                });
            });
        }

        // Cerrar con botones de cerrar
        paymentMethodsClosers.forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closePaymentMethods();
            });
        });

        // Cerrar al hacer clic fuera del diálogo
        paymentMethodsModal.addEventListener('click', (e) => {
            if (e.target === paymentMethodsModal || e.target.classList.contains('payment-methods__overlay')) {
                closePaymentMethods();
            }
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && paymentMethodsModal.classList.contains('is-open')) {
                closePaymentMethods();
            }
        });

        // Configurar imágenes de bancos
        setupBankImages();
        
        // Configurar imágenes SVG de tarjetas
        setupCardImages();

        // Inicializar listeners de iconos de pago
        attachPaymentIconListeners();

        // Re-inicializar listeners cuando se cargan componentes dinámicamente
        // Usar un debounce para evitar múltiples llamadas
        let attachTimeout = null;
        const observer = new MutationObserver(() => {
            clearTimeout(attachTimeout);
            attachTimeout = setTimeout(() => {
                attachPaymentIconListeners();
            }, 100);
        });

        // Observar cambios en el DOM para detectar cuando se agregan nuevos iconos
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // También exponer funciones globalmente para uso externo
        window.openPaymentMethods = openPaymentMethods;
        window.closePaymentMethods = closePaymentMethods;
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPaymentMethodsModal);
    } else {
        initPaymentMethodsModal();
    }

    // También ejecutar después de un pequeño delay para asegurar que los componentes estén cargados
    setTimeout(initPaymentMethodsModal, 100);

    // Escuchar evento cuando el componente se carga dinámicamente
    window.addEventListener('paymentMethodsLoaded', () => {
        setTimeout(initPaymentMethodsModal, 50);
    });
})();
