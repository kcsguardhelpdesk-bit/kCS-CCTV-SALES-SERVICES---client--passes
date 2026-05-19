export function initCarousels() {
    // We only enable JS carousel logic on Mobile/Tablet
    if (window.innerWidth > 1024) return;

    const carousels = ['projects-carousel', 'reviews-carousel'];

    carousels.forEach(id => {
        const wrapper = document.getElementById(id);
        if (!wrapper) return;

        const track = wrapper.querySelector('.carousel-track');
        const prevBtn = wrapper.querySelector('.prev-btn');
        const nextBtn = wrapper.querySelector('.next-btn');
        
        if (!track || !prevBtn || !nextBtn) return;
        
        const items = track.children;
        const totalItems = items.length;
        
        let currentIndex = 0;
        let intervalId;

        function updateSlider() {
            // Slide by 100% of the viewport per item
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalItems;
            updateSlider();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateSlider();
        }

        function startAutoSlide() {
            stopAutoSlide(); // clear existing if any
            intervalId = setInterval(nextSlide, 10000); // 10 seconds auto-slide
        }

        function stopAutoSlide() {
            if (intervalId) clearInterval(intervalId);
        }

        // Button Listeners
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoSlide(); // Reset timer on manual click
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoSlide(); // Reset timer on manual click
        });

        // Touch swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        wrapper.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide(); // pause on touch
        }, { passive: true });

        wrapper.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoSlide(); // resume
        }, { passive: true });

        function handleSwipe() {
            const threshold = 50; // min distance to trigger swipe
            if (touchEndX < touchStartX - threshold) {
                nextSlide(); // Swipe left
            }
            if (touchEndX > touchStartX + threshold) {
                prevSlide(); // Swipe right
            }
        }

        // Initialize
        updateSlider();
        startAutoSlide();
    });
}
