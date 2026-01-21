document.addEventListener('DOMContentLoaded', function() {
    // 1. Inicializar elementos críticos primero
    initCriticalComponents();
    
    // 3. Cargar el resto de funcionalidades de forma diferida
    setTimeout(initSecondaryComponents, 300);
    
    // 4. Inicializar listeners comunes
    initEventListeners();
});

function initCriticalComponents() {
    // Asegurar que navbar sea visible (usando prefijo COMPO-)
    // SIN ANIMACIONES - Solo forzar visibilidad
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
    }

    // Slider hero con configuración mínima inicial
    const heroSwiper = new Swiper('.hero-swiper', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        on: {
            init: function() {
                const activeSlide = this.slides[this.activeIndex];
                const content = activeSlide.querySelector('.hero-content');
                if (content) {
                    content.classList.add('animate');
                }
                updateAutoplayDelay(this, activeSlide);
            },
            slideChange: function() {
                const activeSlide = this.slides[this.activeIndex];
                updateAutoplayDelay(this, activeSlide);
                const content = activeSlide.querySelector('.hero-content');
                if (content) {
                    content.classList.add('animate');
                }
            }
        }
    });

    // Mostrar contenido hero inmediatamente
    document.querySelector('.hero-content')?.classList.add('animate');
}

function updateAutoplayDelay(swiperInstance, activeSlide) {
    if (!swiperInstance || !activeSlide || !swiperInstance.params.autoplay) return;
    const isPrioritySlide = activeSlide.classList.contains('slide-4') || activeSlide.dataset.slideId === 'slide-4';
    const desiredDelay = isPrioritySlide ? 10000 : 5000;

    if (swiperInstance.params.autoplay.delay !== desiredDelay) {
        swiperInstance.autoplay.stop();
        swiperInstance.params.autoplay.delay = desiredDelay;
        swiperInstance.autoplay.start();
    }
}

function initSecondaryComponents() {
    // Registrar ScrollTrigger solo cuando sea necesario
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Animaciones de secciones con ScrollTrigger
        gsap.utils.toArray('section').forEach(section => {
            if (section.classList.contains('services')) {
                return; // Sin animación en la sección "Ofrecemos"
            }
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power2.out'
            });
        });

        // Animación del footer - Esperar a que se cargue dinámicamente
        function initFooterAnimation() {
            const footer = document.querySelector('.footer');
            if (footer) {
                gsap.to('.footer', {
                    backgroundPosition: '100% 50%',
                    duration: 15,
                    repeat: -1,
                    yoyo: true,
                    ease: 'none'
                });
            } else {
                // Si no existe, intentar de nuevo después de un delay
                setTimeout(initFooterAnimation, 500);
            }
        }
        
        // Intentar inicializar la animación del footer
        initFooterAnimation();
        
        // También escuchar evento cuando el footer se carga
        window.addEventListener('footerLoaded', function() {
            const footer = document.querySelector('.footer');
            if (footer && !footer.dataset.animated) {
                footer.dataset.animated = 'true';
                gsap.to('.footer', {
                    backgroundPosition: '100% 50%',
                    duration: 15,
                    repeat: -1,
                    yoyo: true,
                    ease: 'none'
                });
            }
        });
    }

    // Inicializar animaciones de elementos
    initAnimations();
}

function initAnimations() {
    // Animar elementos al hacer scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.section-title, .section-subtitle, .service-card, .contact-form, .contact-map, .about-content, .about-image');
        
        elements.forEach(element => {
            if (element.closest('.services')) {
                // Sin animación para la sección "Ofrecemos"
                element.classList.add('animate');
                return;
            }

            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    }

    // Ejecutar una vez al inicio
    animateOnScroll();
    
    // Y luego en cada scroll
    window.addEventListener('scroll', animateOnScroll);

    // Efecto hover en tarjetas de servicio
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

function initEventListeners() {
    // Los event listeners del navbar están ahora en component/Navbar/navbar.js
    // No duplicar aquí para evitar conflictos

    // Modal redes sociales
    // Eliminado: los enlaces ahora apuntan a las redes reales

    // Modal de agradecimiento
    const thankYouModal = document.getElementById('thankYouModal');
    if (thankYouModal) {
        // Función para abrir modal con bloqueo de scroll compatible con Opera
        function openThankYouModal() {
            thankYouModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
        }
        
        // Función para cerrar modal restaurando scroll compatible con Opera
        function closeThankYouModal() {
            const scrollY = document.body.style.top;
            thankYouModal.classList.remove('active');
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
        
        document.querySelectorAll('.close-modal, .modal-close-btn').forEach(button => {
            button.addEventListener('click', closeThankYouModal);
        });

        thankYouModal.addEventListener('click', (e) => {
            if (e.target === thankYouModal) {
                closeThankYouModal();
            }
        });
    }

    

    // Scroll suave para anclas
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Redirigir si aparece index.html en la URL (solo si no es file://)
if (window.location.protocol !== 'file:' && window.location.href.includes('index.html')) {
    try {
        window.history.replaceState({}, document.title, window.location.href.replace('index.html', ''));
    } catch (e) {
        // Ignorar error si no se puede usar replaceState
        console.warn('No se pudo usar replaceState:', e.message);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Mostrar modal si viene de un envío exitoso
    if (window.location.hash === '#thankyou') {
        const modal = document.getElementById('thankYouModal');
        if (modal) {
            modal.classList.add('active');
            // Compatibilidad con Opera: bloquear scroll en body y html
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            history.replaceState(null, null, ' '); // Limpiar el hash
        }
    }

    // Manejo del formulario
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            }
        });
    }

    // Cerrar modal (compatibilidad con Opera)
    const thankYouModal = document.getElementById('thankYouModal');
    if (thankYouModal) {
        function closeThankYouModal() {
            const scrollY = document.body.style.top;
            thankYouModal.classList.remove('active');
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
        
        const closeButtons = thankYouModal.querySelectorAll('.close-modal, .modal-close-btn');
        closeButtons.forEach(button => {
            button.addEventListener('click', closeThankYouModal);
        });

        thankYouModal.addEventListener('click', (e) => {
            if (e.target === thankYouModal) {
                closeThankYouModal();
            }
        });
    }
});