/**
 * WhatsApp Button Component JavaScript
 * Configura el enlace de WhatsApp con el número de teléfono
 */

(function() {
    'use strict';

    // Configuración: Número de WhatsApp (formato: código de país + número sin espacios ni caracteres especiales)
    // Argentina: +54 1171025861
    const WHATSAPP_NUMBER = '541171025861';
    
    // Mensaje predefinido (opcional)
    const DEFAULT_MESSAGE = 'Hola! Me gustaría obtener más información.';

    /**
     * Genera la URL de WhatsApp Web/App
     * @param {string} number - Número de teléfono
     * @param {string} message - Mensaje predefinido
     * @returns {string} URL de WhatsApp
     */
    function generateWhatsAppURL(number, message) {
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${number}?text=${encodedMessage}`;
    }

    /**
     * Inicializa el botón de WhatsApp
     */
    function initWhatsAppButton() {
        const whatsappButton = document.getElementById('whatsapp-button');
        const whatsappTooltip = document.querySelector('.whatsapp-tooltip');
        
        if (!whatsappButton) {
            console.warn('Botón de WhatsApp no encontrado');
            return false;
        }

        // Configurar el enlace
        const whatsappURL = generateWhatsAppURL(WHATSAPP_NUMBER, DEFAULT_MESSAGE);
        whatsappButton.href = whatsappURL;

        // Agregar evento de clic para tracking (opcional)
        whatsappButton.addEventListener('click', function() {
            console.log('WhatsApp button clicked');
        });

        // Agregar funcionalidad para cerrar el globo al hacer clic
        if (whatsappTooltip) {
            // Asegurar que el cursor sea pointer
            whatsappTooltip.style.cursor = 'pointer';
            
            // Función para cerrar el globo con transición
            function closeTooltip() {
                // Agregar clase para iniciar la animación de salida
                whatsappTooltip.classList.add('whatsapp-tooltip-closing');
                
                // Esperar a que termine la transición antes de ocultar completamente
                setTimeout(function() {
                    whatsappTooltip.classList.add('whatsapp-tooltip-hidden');
                    whatsappTooltip.style.display = 'none';
                }, 1000); // Duración de la transición (1s)
            }

            // Agregar evento de clic al tooltip
            whatsappTooltip.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeTooltip();
            }, true); // Usar capture phase para asegurar que se ejecute

            // También agregar al contenido del tooltip por si acaso
            const tooltipContent = whatsappTooltip.querySelector('.tooltip-content');
            if (tooltipContent) {
                tooltipContent.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeTooltip();
                }, true);
            }
        }

        return true;
    }

    // Intentar inicializar cuando el DOM esté listo
    function tryInit() {
        if (!initWhatsAppButton()) {
            setTimeout(tryInit, 100);
        }
    }

    // Escuchar evento cuando el componente se carga dinámicamente
    window.addEventListener('whatsappLoaded', initWhatsAppButton);

    // Intentar inicializar inmediatamente si el botón ya existe
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        tryInit();
    }
})();


