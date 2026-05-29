import { productData as staticProductData } from './data.js';
import { openProductModal } from './modal.js';

// Helper to access dynamic or static fallback product list
const getProductData = () => window.productData || staticProductData;

// Render Featured Products (First 8)
export function renderFeaturedProducts() {
    const featuredGrid = document.getElementById('featured-products-container');
    if (!featuredGrid) return;
    featuredGrid.innerHTML = '';
    
    const activeData = getProductData();
    // 4 products on mobile/tablet, 8 products on desktop
    const limit = window.innerWidth <= 991 ? 4 : 8;
    const featured = activeData.products.slice(0, limit);
    
    featured.forEach(product => {
        const card = createProductCard(product, true);
        featuredGrid.appendChild(card);
    });
    
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Render Full Catalog Items
export function renderCatalog(category) {
    const catalogGrid = document.getElementById('full-catalog-container');
    if (!catalogGrid) return;
    catalogGrid.innerHTML = '';
    
    const activeData = getProductData();
    activeData.products.forEach(product => {
        if (category === 'all' || product.category === category) {
            const card = createProductCard(product, false);
            catalogGrid.appendChild(card);
        }
    });
    
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Helper to create product card
export function createProductCard(product, isFeatured = false) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.cursor = 'pointer';

    card.innerHTML = `
        <div class="product-image-wrapper">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <span class="product-badge">${product.category}</span>
        </div>
        <div class="product-info">
            <div class="product-meta">
                <span class="product-brand">${product.company}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-type">${product.type}</p>
                ${product.resolution && product.resolution !== 'N/A' ? `<p class="product-resolution" style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">🎯 ${product.resolution}</p>` : ''}
                ${product.description ? `<p class="product-description-card" style="font-size: 0.85rem; color: #475569; margin-top: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; line-height: 1.4;">${product.description}</p>` : ''}
            </div>
            <div class="product-footer">
                <div class="price-container">
                    <span class="price-label">Price starting from</span>
                    <span class="product-price">${product.price}</span>
                </div>
                <div class="card-action">
                    <i data-lucide="arrow-up-right"></i>
                </div>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => openProductModal(product));
    return card;
}
