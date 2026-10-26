/**
 * BUCKY TOWING - MAIN JAVASCRIPT MODULE
 * Performance-optimized, modular interactions and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileNav();
    initScrollReveal();
    initParticleCanvas();
    initMotion();
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
   2. Mobile Drawer Navigation (animated)
   --------------------------------------------------------- */
function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    if (!toggleBtn) return;

    const page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
    const links = [
        { href: 'index.html', key: 'index', icon: 'home', label: 'Home' },
        { href: 'services.html', key: 'services', icon: 'auto_towing', label: 'Services' },
        { href: 'about.html', key: 'about', icon: 'info', label: 'About Us' },
        { href: 'contact.html', key: 'contact', icon: 'location_on', label: 'Contact' },
        { href: 'https://public.towbook.com/k7KV', key: 'request', icon: 'send', label: 'Request Service', external: true }
    ];

    let drawer = document.getElementById('mobile-drawer');
    if (!drawer) {
        drawer = document.createElement('div');
        drawer.id = 'mobile-drawer';
        drawer.className = 'mobile-drawer';
        drawer.setAttribute('aria-hidden', 'true');
        drawer.innerHTML = `
            <div class="drawer-backdrop" data-close></div>
            <nav class="drawer-panel" aria-label="Mobile Navigation">
                <ul class="drawer-links">
                    ${links.map((l, i) => `
                    <li style="--i:${i}">
                        <a href="${l.href}" class="drawer-link${l.key === page ? ' is-active' : ''}"
                           ${l.external ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                            <span class="drawer-link-icon material-symbols-outlined">${l.icon}</span>
                            <span class="drawer-link-label">${l.label}</span>
                            <span class="drawer-link-arrow material-symbols-outlined">${l.external ? 'open_in_new' : 'arrow_forward'}</span>
                        </a>
                    </li>`).join('')}
                </ul>
                <div class="drawer-cta" style="--i:${links.length}">
                    <a href="tel:6086906868" class="btn btn-primary btn-shimmer drawer-call">
                        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">call</span>
                        Call 608-690-6868
                    </a>
                    <p class="drawer-note"><span class="drawer-pulse"></span>24/7 Emergency Dispatch &middot; Dane County, WI</p>
                </div>
            </nav>`;
        document.body.appendChild(drawer);
    }

    const icon = (name) => `<span class="material-symbols-outlined">${name}</span>`;
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-controls', 'mobile-drawer');

    const setOpen = (open) => {
        const header = document.querySelector('.site-header');
        const top = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
        drawer.style.setProperty('--drawer-top', top + 'px');
        drawer.classList.toggle('is-open', open);
        drawer.setAttribute('aria-hidden', String(!open));
        document.body.classList.toggle('drawer-open', open);
        toggleBtn.classList.toggle('is-open', open);
        toggleBtn.setAttribute('aria-expanded', String(open));
        toggleBtn.innerHTML = icon(open ? 'close' : 'menu');
    };

    toggleBtn.addEventListener('click', () => setOpen(!drawer.classList.contains('is-open')));
    drawer.addEventListener('click', (e) => {
        if (e.target.closest('[data-close]') || e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 991) setOpen(false); });
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


/* ---------------------------------------------------------
   5. Motion System — intro loader, entrances, scroll effects
   (opacity/transform only, so layout & responsive never change)
   --------------------------------------------------------- */
function initMotion() {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const markReady = () => root.classList.add('site-ready');

    initPreloader(markReady);
    if (reduce) { markReady(); return; }

    initScrollProgress();
    initStaggerGroups();
    initAccentUnderlines();
    initButtonRipple();
    initPageTransitions();
}

function initPreloader(onDone) {
    const pl = document.getElementById('preloader');
    const root = document.documentElement;
    if (!pl || root.classList.contains('pl-skip')) {
        if (pl) pl.remove();
        onDone();
        return;
    }
    try { sessionStorage.setItem('bt_intro', '1'); } catch (e) { /* private mode */ }

    const MIN_MS = 2800, MAX_MS = 4800;
    const started = performance.now();
    let finished = false;
    const finish = () => {
        if (finished) return;
        finished = true;
        pl.classList.add('pl-done');
        onDone();
        setTimeout(() => pl.remove(), 800);
    };
    const whenLoaded = () => setTimeout(finish, Math.max(0, MIN_MS - (performance.now() - started)));
    if (document.readyState === 'complete') whenLoaded();
    else window.addEventListener('load', whenLoaded, { once: true });
    setTimeout(finish, MAX_MS);
    pl.addEventListener('click', finish); // tap to skip
}

function initScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    let ticking = false;
    const update = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
        ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
}

function initStaggerGroups() {
    const groups = new Set();
    ['.services-grid', '.services-catalog-grid', '.trust-grid', '.footer-grid',
     '.fleet-gallery-grid', '.form-row', '.contact-grid-layout > div:first-child > .form-card > div']
        .forEach(sel => document.querySelectorAll(sel).forEach(g => groups.add(g)));
    document.querySelectorAll('.service-area-pill').forEach(p => groups.add(p.parentElement));
    document.querySelectorAll('.map-container').forEach(m => groups.add(m));

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const g = entry.target;
            io.unobserve(g);
            g.classList.add('fx-in');
            const longest = (g.__fxCount || 1) * 70 + 900;
            setTimeout(() => {
                g.classList.add('fx-done');
                g.querySelectorAll(':scope > .fx-item').forEach(el => el.classList.remove('fx-item'));
            }, longest);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    groups.forEach(g => {
        if (!g || g.closest('#preloader, #mobile-drawer')) return;
        const kids = [...g.children].filter(el => !['SCRIPT', 'STYLE', 'svg'].includes(el.tagName) && !el.classList.contains('map-svg-bg'));
        if (!kids.length) return;
        g.classList.add('fx-stagger');
        if (g.classList.contains('reveal')) g.classList.add('active');
        kids.forEach((el, i) => {
            el.classList.remove('reveal');
            el.classList.add('fx-item');
            el.style.setProperty('--fx-i', i);
        });
        g.__fxCount = kids.length;
        io.observe(g);
    });
}

function initAccentUnderlines() {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('fx-in'); io.unobserve(e.target); } });
    }, { threshold: 0.6 });
    document.querySelectorAll('.section-title .text-accent, .hero-title .text-accent').forEach(el => {
        el.classList.add('fx-underline');
        io.observe(el);
    });
}

function initButtonRipple() {
    document.addEventListener('pointerdown', (e) => {
        const btn = e.target.closest('.btn, .header-phone-btn, .drawer-link');
        if (!btn) return;
        const r = btn.getBoundingClientRect();
        const size = Math.max(r.width, r.height) * 2;
        const ink = document.createElement('span');
        ink.className = 'fx-ripple';
        ink.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
        btn.appendChild(ink);
        setTimeout(() => ink.remove(), 650);
    }, { passive: true });
}

function initPageTransitions() {
    const root = document.documentElement;
    window.addEventListener('pageshow', (e) => { if (e.persisted) root.classList.remove('page-leaving'); });
    document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href]');
        if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (a.target && a.target !== '_self') return;
        const url = new URL(a.href, location.href);
        if (url.origin !== location.origin || !/\.html?$|\/$/.test(url.pathname)) return;
        if (url.pathname === location.pathname && url.hash) return;
        e.preventDefault();
        root.classList.add('page-leaving');
        setTimeout(() => { location.href = url.href; }, 220);
    });
}
