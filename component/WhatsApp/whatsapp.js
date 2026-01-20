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
        
        if (!whatsappButton) {
            console.warn('Botón de WhatsApp no encontrado');
            return false;
        }

        // Configurar el enlace
        const whatsappURL = generateWhatsAppURL(WHATSAPP_NUMBER, DEFAULT_MESSAGE);
        whatsappButton.href = whatsappURL;

        // Agregar evento de clic para tracking (opcional)
        whatsappButton.addEventListener('click', function() {
            // Aquí puedes agregar analytics si lo necesitas
            console.log('WhatsApp button clicked');
        });

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


