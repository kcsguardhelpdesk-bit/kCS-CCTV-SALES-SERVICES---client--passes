import { CONFIG } from './config.js';
import { productData } from './data.js';

const productModal = document.getElementById('product-modal');
const modalImage = document.getElementById('modal-product-image');
const modalBrand = document.getElementById('modal-product-brand');
const modalName = document.getElementById('modal-product-name');
const modalType = document.getElementById('modal-product-type');
const modalPrice = document.getElementById('modal-product-price');
const modalSwitcher = document.getElementById('modal-view-switcher');
const imageWrapper = document.getElementById('main-image-wrapper');
const catalogOverlay = document.getElementById('catalog-overlay');

let currentActiveProduct = null;

export function openProductModal(product) {
    currentActiveProduct = product;
    
    modalImage.src = product.image;
    modalBrand.textContent = product.company;
    modalName.textContent = product.name;
    
    // Combine type and resolution if available
    let typeDisplay = product.type;
    if (product.resolution && product.resolution !== 'N/A') {
        typeDisplay += ` • ${product.resolution}`;
    }
    modalType.textContent = typeDisplay;
    
    // Description injection
    // If there is no existing description element, create one right after modalType
    let descElement = document.getElementById('modal-product-description');
    if (!descElement) {
        descElement = document.createElement('p');
        descElement.id = 'modal-product-description';
        descElement.style.marginTop = '15px';
        descElement.style.color = '#475569';
        descElement.style.fontSize = '0.95rem';
        descElement.style.lineHeight = '1.5';
        
        // Insert after modalType
        modalType.parentNode.insertBefore(descElement, modalType.nextSibling);
    }
    
    if (product.description) {
        descElement.textContent = product.description;
        descElement.style.display = 'block';
    } else {
        descElement.style.display = 'none';
    }
    
    modalPrice.textContent = product.price;
    
    // Handle Views (2D/3D)
    modalSwitcher.innerHTML = '';
    if (product.views && product.views.length > 0) {
        product.views.forEach(view => {
            const btn = document.createElement('button');
            btn.className = 'view-btn';
            btn.textContent = view.label;
            btn.onclick = () => {
                modalImage.src = view.url;
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            };
            modalSwitcher.appendChild(btn);
        });
        // Set first as active
        modalSwitcher.firstChild.classList.add('active');
    }
    
    productModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
}

// Lightbox Feature
if (imageWrapper) {
    imageWrapper.onclick = () => {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${modalImage.src}" alt="Full View">
                <button class="close-lightbox"><i data-lucide="x"></i></button>
            </div>
        `;
        document.body.appendChild(lightbox);
        lucide.createIcons();
        lightbox.onclick = (e) => {
            if (e.target.closest('.close-lightbox') || e.target === lightbox) {
                lightbox.remove();
            }
        };
    };
}

export function closeProductModal() {
    productModal.classList.add('hidden');
    
    // Check if we need to restore scroll
    const isCatalogOpen = catalogOverlay && catalogOverlay.classList.contains('active');
    if (!isCatalogOpen) {
        document.body.style.overflow = 'auto';
    }
}

// WhatsApp Logic
export function handleWhatsAppAction(type) {
    if (!currentActiveProduct) return;
    
    const productLink = window.location.href;
    let text = "";
    
    if (type === 'book') {
        text = `I'm interested in booking this product from ${productData.company ? productData.company.name : 'KCS INFRA'}:\n\n*${currentActiveProduct.name}*\nBrand: ${currentActiveProduct.company}\nPrice: ${currentActiveProduct.price}\n\nView details: ${productLink}`;
    } else {
        text = `Hi ${productData.company ? productData.company.name : 'KCS INFRA'}, I'd like to enquire about:\n\n*${currentActiveProduct.name}*\nBrand: ${currentActiveProduct.company}\n\nPlease share more details and availability.`;
    }
    
    const whatsappUrl = `https://wa.me/${CONFIG.ownerPhone}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
}
