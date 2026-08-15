/**
 * BUCKY TOWING - MAIN JAVASCRIPT MODULE
 * Performance-optimized, modular interactions and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileNav();
    initScrollReveal();
    initParticleCanvas();
});

/* ---------------------------------------------------------
   1. Header Scroll Elevation & Active Link Tracking
   --------------------------------------------------------- */
function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.style.backgroundColor = 'rgba(11, 11, 11, 0.98)';
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.8)';
        } else {
            header.style.backgroundColor = 'rgba(11, 11, 11, 0.92)';
            header.style.boxShadow = 'none';
        }
    }, { passive: true });
}

/* ---------------------------------------------------------
   2. Mobile Drawer Navigation
   --------------------------------------------------------- */
function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    if (!toggleBtn) return;

    // Create mobile menu overlay if not already in DOM
    let drawer = document.getElementById('mobile-drawer');
    if (!drawer) {
        drawer = document.createElement('div');
        drawer.id = 'mobile-drawer';
        drawer.style.cssText = `
            position: fixed;
            top: 86px;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(11, 11, 11, 0.98);
            backdrop-filter: blur(20px);
            z-index: 99;
            display: none;
            flex-direction: column;
            padding: 30px 24px;
            gap: 20px;
            overflow-y: auto;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        `;
        
        drawer.innerHTML = `
            <a href="index.html" class="nav-tab text-xl font-bold py-3 border-b border-white/10">Home</a>
            <a href="services.html" class="nav-tab text-xl font-bold py-3 border-b border-white/10">Services</a>
            <a href="about.html" class="nav-tab text-xl font-bold py-3 border-b border-white/10">About</a>
            <a href="request-service.html" class="nav-tab text-xl font-bold py-3 border-b border-white/10">Request Service</a>
            <a href="contact.html" class="nav-tab text-xl font-bold py-3 border-b border-white/10">Contact</a>
            <div class="mt-6 flex flex-col gap-3">
                <a href="tel:6086906868" class="btn btn-primary btn-large w-full flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined">call</span> 608-690-6868
                </a>
            </div>
        `;
        document.body.appendChild(drawer);
    }

    let isOpen = false;
    toggleBtn.addEventListener('click', () => {
        isOpen = !isOpen;
        drawer.style.display = isOpen ? 'flex' : 'none';
        toggleBtn.innerHTML = isOpen 
            ? '<span class="material-symbols-outlined text-3xl">close</span>' 
            : '<span class="material-symbols-outlined text-3xl">menu</span>';
    });
}

/* ---------------------------------------------------------
   3. Scroll Reveal Observer
   --------------------------------------------------------- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, (idx % 4) * 80);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/* ---------------------------------------------------------
   4. Floating Ember Particles for Hero
   --------------------------------------------------------- */
function initParticleCanvas() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles = [];
    const particleCount = 35;
    let animationFrameId;

    function resize() {
        canvas.width = canvas.offsetWidth || window.innerWidth;
        canvas.height = canvas.offsetHeight || window.innerHeight;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: canvas.height + Math.random() * 50,
                size: Math.random() * 2.2 + 0.8,
                speedX: (Math.random() - 0.5) * 1.2,
                speedY: -(Math.random() * 1.5 + 0.5),
                opacity: Math.random() * 0.6 + 0.2,
                color: Math.random() > 0.4 ? '#E61919' : '#ff7a7a'
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;

            if (p.y < -10) {
                p.y = canvas.height + 10;
                p.x = Math.random() * canvas.width;
            }

            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        animationFrameId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    }, { passive: true });

    resize();
    createParticles();
    draw();
}
