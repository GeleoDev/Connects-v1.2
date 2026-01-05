document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    // Añadir clase loaded al body cuando todo esté listo
    function markAsLoaded() {
        document.body.classList.add('loaded');
    }

    // Esperar a que todas las imágenes estén cargadas
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    
    if (images.length === 0) {
        markAsLoaded();
    } else {
        images.forEach(img => {
            if (img.complete) {
                imageLoaded();
            } else {
                img.addEventListener('load', imageLoaded);
                img.addEventListener('error', imageLoaded); // Incluso si falla
            }
        });
    }

    function imageLoaded() {
        loadedImages++;
        if (loadedImages === images.length) {
            markAsLoaded();
        }
    }
 function initEventListeners() {
    // Navbar ahora usa prefijo COMPO- y está manejado por component/Navbar/navbar.js
    // Los event listeners del navbar están en el componente
    
    // Initialize Swiper for battery carousel
    const batteryCarousel = new Swiper('.battery-carousel', {
        loop: true,
        autoplay: {
            delay: 3000,
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
        effect: 'slide',
        speed: 800,
    });

    // Navbar scroll effect ahora está en component/Navbar/navbar.js
    
    // Hero animations
    const energyHeroContent = document.querySelector('.energy-hero-content');
    if (energyHeroContent) {
        energyHeroContent.classList.add('animate');
    }
    
    // Initialize GSAP animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate sections on scroll
    const sections = document.querySelectorAll('.mission, .benefits, .products, .consultation');
    sections.forEach(section => {
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
    
    // Animate individual elements con throttling para mejor performance
    let ticking = false;
    const animateElements = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const elements = document.querySelectorAll('.section-title, .section-subtitle, .benefit-card, .product-card, .mission-content, .mission-image, .consultation-content, .consultation-image');
                
                elements.forEach(element => {
                    const elementPosition = element.getBoundingClientRect().top;
                    const windowHeight = window.innerHeight;
                    
                    if (elementPosition < windowHeight - 100) {
                        element.classList.add('animate');
                    }
                });
                
                ticking = false;
            });
            ticking = true;
        }
    };
    
    // Initial check
    animateElements();
    
    // Check on scroll con throttling
    window.addEventListener('scroll', animateElements, { passive: true });
    
    // Product card hover effect - Optimizado con requestAnimationFrame
    const productCards = document.querySelectorAll('.product-card');
    let rafId = null;
    
    productCards.forEach(card => {
        let isHovering = false;
        
        card.addEventListener('mousemove', (e) => {
            if (!isHovering) {
                isHovering = true;
                card.style.willChange = 'transform';
            }
            
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            
            rafId = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const angleX = (y - centerY) / 20;
                const angleY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
                rafId = null;
            });
        }, { passive: true });
        
        card.addEventListener('mouseleave', () => {
            isHovering = false;
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            card.style.willChange = 'auto';
        });
    });
    

// Función para cerrar modales
function closeAllModals() {
    document.querySelectorAll('.expanded-info').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
}

// Asignar evento a todos los botones de cerrar
document.querySelectorAll('.close-expanded').forEach(button => {
    button.addEventListener('click', closeAllModals);
});

// Cerrar al hacer clic fuera del contenido
document.querySelectorAll('.expanded-info').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeAllModals();
        }
    });
});
    
// Expandable product info functionality
const infoButtons = document.querySelectorAll('.info-btn');
const imagesButtons = document.querySelectorAll('.images-btn');
const expandedInfos = document.querySelectorAll('.expanded-info');
const closeButtons = document.querySelectorAll('.close-expanded');

function showExpandedInfo(targetId) {
    const targetInfo = document.getElementById(targetId);
    
    if (targetInfo) {
        // Close any open info sections first
        expandedInfos.forEach(info => {
            info.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        // Open the selected one
        targetInfo.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate the content in
        gsap.fromTo(targetInfo.querySelector('.expanded-content'), 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
        
        // Reiniciar el carrusel si es el de baterías
        if (targetId === 'battery-images') {
            batteryCarousel.slideTo(0);
            batteryCarousel.autoplay.start();
        }
    }
}

infoButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        showExpandedInfo(targetId);
    });
});

imagesButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        showExpandedInfo(targetId);
    });
});

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const parentInfo = button.closest('.expanded-info');
        if (parentInfo) {
            parentInfo.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Detener autoplay del carrusel al cerrar
            if (parentInfo.id === 'battery-images') {
                batteryCarousel.autoplay.stop();
            }
        }
    });
});

// Close expanded info when clicking outside content
expandedInfos.forEach(info => {
    info.addEventListener('click', (e) => {
        if (e.target === info) {
            info.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Detener autoplay del carrusel al cerrar
            if (info.id === 'battery-images') {
                batteryCarousel.autoplay.stop();
            }
        }
    });
});
    
    // Social Media Modal
    const socialModal = document.getElementById('socialModal');
    const closeModal = document.querySelector('.close-modal');
    
    function showModal() {
        socialModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function hideModal() {
        socialModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    closeModal.addEventListener('click', hideModal);
    
    socialModal.addEventListener('click', (e) => {
        if (e.target === socialModal) {
            hideModal();
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}});