/**
 * BUCKY TOWING - SLIDESHOW MODULE
 * Accessible, touch-enabled carousel with auto-rotation & pause on hover
 */

document.addEventListener('DOMContentLoaded', () => {
    initSlideshows();
});

function initSlideshows() {
    const slideshowContainers = document.querySelectorAll('.slideshow-container');
    slideshowContainers.forEach(container => {
        setupSlideshow(container);
    });
}

function setupSlideshow(container) {
    const slides = container.querySelectorAll('.slide');
    const dots = container.querySelectorAll('.slide-dot');
    const prevBtn = container.querySelector('.slide-prev');
    const nextBtn = container.querySelector('.slide-next');

    if (!slides.length) return;

    let currentIndex = 0;
    let autoPlayInterval = null;

    function showSlide(index) {
        if (index >= slides.length) currentIndex = 0;
        else if (index < 0) currentIndex = slides.length - 1;
        else currentIndex = index;

        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === currentIndex);
        });

        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            showSlide(idx);
            resetAutoPlay();
        });
    });

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    container.addEventListener('mouseenter', stopAutoPlay);
    container.addEventListener('mouseleave', startAutoPlay);

    // Touch swipe support
    let startX = 0;
    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) nextSlide();
            else prevSlide();
            resetAutoPlay();
        }
    }, { passive: true });

    startAutoPlay();
}
