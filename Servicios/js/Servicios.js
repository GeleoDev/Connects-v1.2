document.addEventListener('DOMContentLoaded', function() {
    console.log('Script de servicios cargado correctamente');
    
    // ======================
    // NAVBAR FUNCTIONALITY
    // ======================
    // Navbar ahora usa prefijo COMPO- y está manejado por component/Navbar/navbar.js
    // Los event listeners del navbar están en el componente
    
    // ======================
    // SERVICE CARDS
    // ======================
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (serviceCards.length > 0) {
        console.log(`${serviceCards.length} cards encontradas`);
        
        // Mostrar todas las cards inmediatamente
        serviceCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
        
        // Efectos hover
        serviceCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const angleX = (y - centerY) / 15;
                const angleY = (centerX - x) / 15;
                
                card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-10px)';
            });
        });
    } else {
        console.error('No se encontraron cards de servicio');
    }
    
    // ======================
    // SCROLL TO TOP BUTTON
    // ======================
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'Volver arriba');
    scrollToTopBtn.classList.add('scroll-to-top');
    document.body.appendChild(scrollToTopBtn);
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    // ======================
    // SMOOTH SCROLL
    // ======================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#!') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const compoNavbar = document.querySelector('.compo-navbar');
                const navbarHeight = compoNavbar ? compoNavbar.offsetHeight : 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ======================
    // GSAP ANIMATIONS (si está cargado)
    // ======================
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Animaciones para los títulos de sección
        gsap.utils.toArray('.section-title, .section-subtitle').forEach(element => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power2.out'
            });
        });
        
        // Animaciones para las cards
        gsap.utils.toArray('.service-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 75%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 50,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'back.out(1.2)'
            });
        });
    } else {
        console.warn('GSAP no está cargado, las animaciones no se ejecutarán');
    }
});