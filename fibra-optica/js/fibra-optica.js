document.addEventListener('DOMContentLoaded', function() {

        initEventListeners();
    // Añadir clase loaded al body cuando todo esté listo
    function markAsLoaded() {
        document.body.classList.add('loaded');
        
        // Forzar un redibujado para asegurar que los estilos responsive se apliquen
        setTimeout(() => {
            document.body.style.display = 'none';
            document.body.offsetHeight; // Trigger reflow
            document.body.style.display = '';
        }, 50);
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
    // Navbar ahora usa prefijo COMPO- y está manejado por component/Navbar/navbar.js
    // Los event listeners del navbar están en el componente
    
    function initEventListeners() {
    // Navbar ahora usa prefijo COMPO- y está manejado por component/Navbar/navbar.js
    // Hero animations
    const fiberHeroContent = document.querySelector('.fiber-hero-content');
    if (fiberHeroContent) {
        fiberHeroContent.classList.add('animate');
    }
    
    // Initialize GSAP animations
    gsap.registerPlugin(ScrollTrigger);
    

    
    // Initialize Swiper Carousel
    const swiper = new Swiper('.swiper-container', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        effect: 'slide',
        speed: 800,
    });

    
    // Animate sections on scroll
    const sections = document.querySelectorAll('.partnership, .products, .samm-cta, .representatives');
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
    
   // En la función animateElements(), actualizar para incluir los logos
// En la función animateElements(), agregar la nueva sección
const animateElements = () => {
    const elements = document.querySelectorAll(
        '.section-title, .section-subtitle, .product-card, ' +
        '.partnership-content, .partnership-logos, ' +
        '.samm-cta-content, .samm-cta-image, ' +
        '.representatives-content'
    );
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
            element.classList.add('animate');
        }
    });
};
    
    // Initial check
    animateElements();
    
    // Check on scroll
    window.addEventListener('scroll', animateElements);
    
    // Product card hover effect
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
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