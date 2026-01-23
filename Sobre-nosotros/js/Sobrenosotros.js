document.addEventListener('DOMContentLoaded', function() {
    // Navbar ahora usa prefijo COMPO- y está manejado por component/Navbar/navbar.js
    // Los event listeners del navbar están en el componente
    
    // GSAP Animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Asegurar que navbar sea visible (usando prefijo COMPO-)
    const navbar = document.querySelector('.compo-navbar');
    if (navbar) {
        navbar.style.opacity = '1';
        navbar.style.transform = 'none';
        navbar.style.visibility = 'visible';
        navbar.style.display = 'block';
    }
    
    // Animate hero content (solo si los elementos existen)
    const heroTitle = document.querySelector('.about-hero-title');
    if (heroTitle) {
        gsap.from('.about-hero-title', {
            duration: 1,
            y: -50,
            opacity: 0,
            ease: 'power3.out'
        });
    }
    
    const heroSubtitle = document.querySelector('.about-hero-subtitle');
    if (heroSubtitle) {
        gsap.from('.about-hero-subtitle', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.3
        });
    }
    
    // Animate cards on scroll
    const aboutCards = document.querySelectorAll('.about-card');
    aboutCards.forEach((card, index) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power2.out'
        });
    });
    
    // Animate values on scroll
    const valueItems = document.querySelectorAll('.value-item');
    valueItems.forEach((item, index) => {
        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power2.out'
        });
    });
    
    // Animate section titles
    const sectionTitles = document.querySelectorAll('.section-title, .section-subtitle');
    sectionTitles.forEach(title => {
        gsap.to(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out'
        });
    });
    
    // Card hover effects
    aboutCards.forEach(card => {
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
});