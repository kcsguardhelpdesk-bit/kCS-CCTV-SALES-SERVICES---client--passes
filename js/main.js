import { renderFeaturedProducts, renderCatalog } from './ui.js';
import { closeProductModal, handleWhatsAppAction } from './modal.js';
import { initNavigation } from './navigation.js';
import { initContactForm } from './contact.js';
import { initCarousels } from './carousel.js';

// DOM Elements
const openCatalogBtn = document.getElementById('open-catalog-btn');
const closeCatalogBtn = document.getElementById('close-catalog-btn');
const catalogOverlay = document.getElementById('catalog-overlay');
const navQuoteBtn = document.getElementById('nav-quote-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalShareBtn = document.getElementById('modal-share-btn');
const modalEnquireBtn = document.getElementById('modal-enquire-btn');

async function init() {
    // Initialize Lucide icons
    lucide.createIcons();

    // Show Loading State in the DOM before DB fetch
    const featuredGrid = document.getElementById('featured-products-container');
    if (featuredGrid) {
        featuredGrid.innerHTML = `
            <div class="db-loader-container">
                <div class="db-spinner"></div>
                <div class="db-loader-text">Loading live products from database...</div>
            </div>
        `;
    }

    // Fetch live products from backend MongoDB API
    try {
        const response = await fetch('/api/products');
        const result = await response.json();
        if (result.success) {
            window.productData = result.data;
            console.log('Successfully loaded products dynamically from MongoDB Atlas!');
        }
    } catch (err) {
        console.error('Failed to fetch live products, using static fallback:', err);
    }

    // Render Featured Products (Replaces the loader)
    renderFeaturedProducts();

    // Init Navigation & Contact
    initNavigation();
    initContactForm();
    initCarousels();

    // Catalog Listeners
    if (openCatalogBtn) {
        openCatalogBtn.addEventListener('click', () => {
            catalogOverlay.classList.remove('hidden');
            catalogOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            renderCatalog('all');
        });
    }

    if (closeCatalogBtn) {
        closeCatalogBtn.addEventListener('click', () => {
            catalogOverlay.classList.remove('active');
            setTimeout(() => catalogOverlay.classList.add('hidden'), 500); // Wait for transition
            
            const productModal = document.getElementById('product-modal');
            if (productModal.classList.contains('hidden')) {
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Modal Listeners
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeProductModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeProductModal);
    if (modalShareBtn) modalShareBtn.addEventListener('click', () => handleWhatsAppAction('book'));
    if (modalEnquireBtn) modalEnquireBtn.addEventListener('click', () => handleWhatsAppAction('enquire'));

    // Category Filters
    document.querySelectorAll('.category-circle').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-circle').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCatalog(btn.dataset.category);
        });
    });

    // FAQ Accordion
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });

    // Quote Button
    if (navQuoteBtn) {
        navQuoteBtn.addEventListener('click', () => {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Scroll Reveal Observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Initialize Draggable WhatsApp Floating Button
    const whatsappBtn = document.getElementById('whatsapp-floating-btn');
    if (whatsappBtn) {
        initDraggableWhatsApp(whatsappBtn);
    }

    // Initialize Typewriter Welcome Banner
    initWelcomeTypewriter();

    // Listen to resize events to dynamically switch between 4 products and 8 products on mobile/desktop
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            renderFeaturedProducts();
        }, 150);
    });
}

// Draggable WhatsApp Script (Smooth mouse + touch drag)
function initDraggableWhatsApp(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isDragging = false;
    let startX = 0, startY = 0;

    elmnt.addEventListener('mousedown', dragMouseDown);
    elmnt.addEventListener('touchstart', dragTouchStart, { passive: false });

    function dragMouseDown(e) {
        e = e || window.event;
        if (e.button !== 0) return; // Only allow left-click
        startX = e.clientX;
        startY = e.clientY;
        isDragging = false;
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.addEventListener('mouseup', closeDragElement);
        document.addEventListener('mousemove', elementDrag);
    }

    function elementDrag(e) {
        e = e || window.event;
        
        // If moved more than 6px, it's a drag
        if (Math.abs(e.clientX - startX) > 6 || Math.abs(e.clientY - startY) > 6) {
            isDragging = true;
            e.preventDefault();
        }

        if (isDragging) {
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            let newTop = elmnt.offsetTop - pos2;
            let newLeft = elmnt.offsetLeft - pos1;
            
            const rect = elmnt.getBoundingClientRect();
            const buffer = 15;
            
            if (newTop < buffer) newTop = buffer;
            if (newTop > window.innerHeight - rect.height - buffer) newTop = window.innerHeight - rect.height - buffer;
            if (newLeft < buffer) newLeft = buffer;
            if (newLeft > window.innerWidth - rect.width - buffer) newLeft = window.innerWidth - rect.width - buffer;
            
            elmnt.style.top = newTop + "px";
            elmnt.style.left = newLeft + "px";
            elmnt.style.bottom = "auto";
            elmnt.style.right = "auto";
        }
    }

    function closeDragElement(e) {
        document.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('mousemove', elementDrag);
        
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            const clickHandler = (event) => {
                event.preventDefault();
                event.stopPropagation();
                elmnt.removeEventListener('click', clickHandler, true);
            };
            elmnt.addEventListener('click', clickHandler, true);
        }
    }

    function dragTouchStart(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = false;
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;
        document.addEventListener('touchend', closeDragTouch, { passive: false });
        document.addEventListener('touchmove', elementDragTouch, { passive: false });
    }

    function elementDragTouch(e) {
        if (Math.abs(e.touches[0].clientX - startX) > 6 || Math.abs(e.touches[0].clientY - startY) > 6) {
            isDragging = true;
            e.preventDefault(); // Prevent standard page scroll when dragging the button
        }

        if (isDragging) {
            pos1 = pos3 - e.touches[0].clientX;
            pos2 = pos4 - e.touches[0].clientY;
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
            
            let newTop = elmnt.offsetTop - pos2;
            let newLeft = elmnt.offsetLeft - pos1;
            
            const rect = elmnt.getBoundingClientRect();
            const buffer = 15;
            
            if (newTop < buffer) newTop = buffer;
            if (newTop > window.innerHeight - rect.height - buffer) newTop = window.innerHeight - rect.height - buffer;
            if (newLeft < buffer) newLeft = buffer;
            if (newLeft > window.innerWidth - rect.width - buffer) newLeft = window.innerWidth - rect.width - buffer;
            
            elmnt.style.top = newTop + "px";
            elmnt.style.left = newLeft + "px";
            elmnt.style.bottom = "auto";
            elmnt.style.right = "auto";
        }
    }

    function closeDragTouch(e) {
        document.removeEventListener('touchend', closeDragTouch);
        document.removeEventListener('touchmove', elementDragTouch);
        
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            const clickHandler = (event) => {
                event.preventDefault();
                event.stopPropagation();
                elmnt.removeEventListener('click', clickHandler, true);
            };
            elmnt.addEventListener('click', clickHandler, true);
        }
    }
}

// Infinite Typewriter Greeting Banner (welcome to kcs, thanks for coming)
function initWelcomeTypewriter() {
    const welcomeTextEl = document.getElementById('welcome-text');
    if (!welcomeTextEl) return;
    
    const phrases = ["Welcome to KCS", "Thanks for coming"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            welcomeTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40; // Speed up backspace deleting slightly
        } else {
            welcomeTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Premium natural keyboard typing speed
        }
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2200; // Pause beautifully when full phrase is typed
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 600; // Pause before typing the next phrase
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typing after a short loading pause
    setTimeout(type, 800);
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', init);
