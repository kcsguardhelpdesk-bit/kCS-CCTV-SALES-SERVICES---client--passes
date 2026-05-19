const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.getElementById('nav-links');

export function initNavigation() {
    // Mobile Menu Toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        });
    });

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Brands Modal
    const brandsModal = document.getElementById('brands-modal');
    const openBrandsBtn = document.getElementById('open-brands-btn');
    const closeBrandsBtn = document.getElementById('close-brands-btn');

    if (openBrandsBtn && brandsModal) {
        openBrandsBtn.addEventListener('click', () => {
            brandsModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeBrandsBtn && brandsModal) {
        closeBrandsBtn.addEventListener('click', () => {
            brandsModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Scroll Reveal Animation (Popup effect on scroll)
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Optional: stop observing once revealed
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });
}
