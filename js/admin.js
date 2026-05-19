// Dynamic Admin Panel Controller
const API_BASE = '';

let localProductData = {
    filters: { categories: [], brands: [] },
    products: []
};
let localInquiries = [];
let currentFilter = 'All';

// Tab Switcher Elements
const navProducts = document.getElementById('nav-products');
const navInquiries = document.getElementById('nav-inquiries');
const productsPanel = document.getElementById('products-panel');
const inquiriesPanel = document.getElementById('inquiries-panel');
const inquiryBadge = document.getElementById('inquiry-badge');
const inquiriesSubtitle = document.getElementById('inquiries-subtitle');

// Products DOM Elements
const tbody = document.getElementById('products-tbody');
const categoryFilter = document.getElementById('category-filter');
const modal = document.getElementById('product-modal');
const addBtn = document.getElementById('add-product-btn');
const closeBtn = document.getElementById('close-modal-btn');
const cancelBtn = document.getElementById('cancel-modal-btn');
const saveBtn = document.getElementById('save-product-btn');

// Inquiries DOM Elements
const inquiriesTbody = document.getElementById('inquiries-tbody');

// Form Elements
const formId = document.getElementById('form-product-id');
const formCategory = document.getElementById('form-category');
const formName = document.getElementById('form-name');
const formCompany = document.getElementById('form-company');
const formType = document.getElementById('form-type');
const formPrice = document.getElementById('form-price');
const formImage = document.getElementById('form-image');
const fileInput = document.getElementById('form-image-file');
const uploadStatus = document.getElementById('image-upload-status');
const previewContainer = document.getElementById('form-image-preview-container');
const previewImg = document.getElementById('form-image-preview');
const sizeTag = document.getElementById('form-image-size-tag');

const modalTitle = document.getElementById('modal-title');
const companyDropdown = document.getElementById('company-dropdown');

// Inject Description & Resolution Fields since they were missing in the original static template
let formResolution = document.getElementById('form-resolution');
let formDescription = document.getElementById('form-description');

if (!formResolution) {
    const parentForm = document.getElementById('product-form');
    if (parentForm) {
        // Create Resolution group
        const resGroup = document.createElement('div');
        resGroup.className = 'form-group';
        resGroup.innerHTML = `
            <label>Camera Resolution (e.g. 5 Megapixel or N/A)</label>
            <input type="text" class="form-control" id="form-resolution" placeholder="e.g. 5 Megapixel">
        `;
        // Create Description group
        const descGroup = document.createElement('div');
        descGroup.className = 'form-group';
        descGroup.innerHTML = `
            <label>Product Description</label>
            <textarea class="form-control" id="form-description" rows="3" placeholder="Enter short product detail..."></textarea>
        `;
        
        // Append cleanly to form
        parentForm.appendChild(resGroup);
        parentForm.appendChild(descGroup);
        
        window.formResolution = document.getElementById('form-resolution');
        window.formDescription = document.getElementById('form-description');
    }
} else {
    window.formResolution = formResolution;
    window.formDescription = formDescription;
}

// Fetch products from MongoDB API
async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE}/api/products`, {
            credentials: 'include'
        });
        const result = await response.json();
        if (result.success) {
            localProductData = result.data;
        }
    } catch (err) {
        console.error('Failed to load products from MongoDB API:', err);
    }
}

// Fetch inquiries from MongoDB API
async function fetchInquiries() {
    try {
        const response = await fetch(`${API_BASE}/api/inquiries`, {
            credentials: 'include'
        });
        const result = await response.json();
        if (result.success) {
            localInquiries = result.data;
            updateInquiryCounters();
        }
    } catch (err) {
        console.error('Failed to load inquiries from MongoDB API:', err);
    }
}

// Update Inquiry Badge and Header counts
function updateInquiryCounters() {
    if (localInquiries.length > 0) {
        inquiryBadge.textContent = localInquiries.length;
        inquiryBadge.style.display = 'inline-block';
        inquiriesSubtitle.textContent = `${localInquiries.length} inquiries received`;
    } else {
        inquiryBadge.style.display = 'none';
        inquiriesSubtitle.textContent = 'No messages received yet';
    }
}

// Tab Switching Event Handlers
navProducts.addEventListener('click', (e) => {
    e.preventDefault();
    navInquiries.classList.remove('active');
    navProducts.classList.add('active');
    inquiriesPanel.style.display = 'none';
    productsPanel.style.display = 'block';
});

navInquiries.addEventListener('click', async (e) => {
    e.preventDefault();
    navProducts.classList.remove('active');
    navInquiries.classList.add('active');
    productsPanel.style.display = 'none';
    inquiriesPanel.style.display = 'block';
    await fetchInquiries();
    renderInquiriesTable();
});

// Initialize
async function init() {
    await fetchProducts();
    await fetchInquiries(); // Fetch inquiries to set badge count right away!
    renderFilters();
    populateCategoryDropdown();
    renderTable();
    initCompanyDropdown();
    
    // Refresh icons
    if (window.lucide) window.lucide.createIcons();
}

function renderFilters() {
    categoryFilter.innerHTML = '<button class="filter-btn active" data-cat="All">All</button>';
    localProductData.filters.categories.forEach(cat => {
        categoryFilter.innerHTML += `<button class="filter-btn" data-cat="${cat}">${cat}</button>`;
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-cat');
            renderTable();
        });
    });
}

function populateCategoryDropdown() {
    formCategory.innerHTML = '';
    localProductData.filters.categories.forEach(cat => {
        formCategory.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
}

function initCompanyDropdown() {
    function renderDropdown(filter = '') {
        companyDropdown.innerHTML = '';
        const filtered = localProductData.filters.brands.filter(c => c.toLowerCase().includes(filter.toLowerCase()));
        
        if (filtered.length === 0) {
            companyDropdown.classList.add('hidden');
            return;
        }
        
        filtered.forEach(company => {
            const div = document.createElement('div');
            div.className = 'custom-dropdown-item';
            div.textContent = company;
            div.addEventListener('mousedown', () => {
                formCompany.value = company;
                companyDropdown.classList.add('hidden');
            });
            companyDropdown.appendChild(div);
        });
        
        companyDropdown.classList.remove('hidden');
    }

    formCompany.addEventListener('focus', () => renderDropdown(formCompany.value));
    formCompany.addEventListener('input', (e) => renderDropdown(e.target.value));
    formCompany.addEventListener('blur', () => {
        setTimeout(() => companyDropdown.classList.add('hidden'), 150);
    });
}

function renderTable() {
    tbody.innerHTML = '';
    
    const filteredProducts = currentFilter === 'All' 
        ? localProductData.products 
        : localProductData.products.filter(p => p.category === currentFilter);

    filteredProducts.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.image}" class="product-img-preview" alt="Preview"></td>
            <td><strong>${product.name}</strong></td>
            <td><strong>${product.company || '-'}</strong></td>
            <td>
                ${product.type}
                ${product.resolution && product.resolution !== 'N/A' ? `<br><small style="color:#64748b;">${product.resolution}</small>` : ''}
            </td>
            <td>${product.price}</td>
            <td><span style="background:#e2e8f0; padding:2px 6px; border-radius:4px; font-size:0.8rem;">${product.category}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-sm btn-primary edit-btn" data-id="${product.id}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${product.id}">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Attach listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            openEditModal(id);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            deleteProduct(id);
        });
    });
}

// Inquiries Table Renderer
function renderInquiriesTable() {
    inquiriesTbody.innerHTML = '';
    
    if (localInquiries.length === 0) {
        inquiriesTbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 3rem; color: #64748b;">
                    <i data-lucide="inbox" style="width: 48px; height: 48px; margin: 0 auto 1rem; color: #cbd5e1; display: block;"></i>
                    No customer inquiries submitted yet.
                </td>
            </tr>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
    }

    localInquiries.forEach(inq => {
        const dateStr = new Date(inq.createdAt).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });

        // Clean phone number for WhatsApp linking
        const rawPhone = inq.phone.replace(/[^0-9]/g, '');
        const waPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-size:0.85rem; color:#64748b; font-weight:500;">${dateStr}</td>
            <td><strong>${inq.name}</strong></td>
            <td>
                <div style="display:flex; flex-direction:column; gap:0.25rem; font-size:0.85rem;">
                    <span style="display:flex; align-items:center; gap:0.25rem;">
                        <i class="fa-solid fa-envelope" style="color:#64748b; font-size:0.75rem;"></i> ${inq.email}
                    </span>
                    <span style="display:flex; align-items:center; gap:0.25rem;">
                        <i class="fa-solid fa-phone" style="color:#64748b; font-size:0.75rem;"></i> ${inq.phone}
                    </span>
                </div>
            </td>
            <td>
                <span style="background: rgba(59, 130, 246, 0.1); color: #2563eb; font-size: 0.75rem; font-weight: 700; padding: 4px 8px; border-radius: 6px; border: 1px solid rgba(59, 130, 246, 0.2);">
                    ${inq.requirement}
                </span>
            </td>
            <td style="font-size:0.85rem; color:#334155; line-height:1.5; white-space:pre-wrap; max-width: 250px;">${inq.message || '-'}</td>
            <td>
                <div class="action-btns" style="gap: 0.5rem;">
                    <!-- Direct call -->
                    <a href="tel:${inq.phone}" class="btn" style="background:#e2e8f0; color:#1e293b; padding:0.4rem 0.6rem; border-radius:4px; font-size:0.8rem;" title="Call Client">
                        <i class="fa-solid fa-phone"></i>
                    </a>
                    <!-- Direct WhatsApp with custom message -->
                    <a href="https://wa.me/${waPhone}?text=Hi%20${encodeURIComponent(inq.name)},%20this%20is%20KCS%20Guard%20responding%20to%20your%20inquiry%20about%20${encodeURIComponent(inq.requirement)}." target="_blank" class="btn" style="background:#25d366; color:#fff; padding:0.4rem 0.6rem; border-radius:4px; font-size:0.8rem;" title="Reply on WhatsApp">
                        <i class="fa-brands fa-whatsapp"></i>
                    </a>
                    <!-- Direct Email response -->
                    <a href="mailto:${inq.email}?subject=KCS%20Guard%20Security%20Solutions%20Response&body=Hi%20${encodeURIComponent(inq.name)}," class="btn" style="background:#3b82f6; color:#fff; padding:0.4rem 0.6rem; border-radius:4px; font-size:0.8rem;" title="Reply via Email">
                        <i class="fa-solid fa-envelope"></i>
                    </a>
                    <!-- Delete inquiry from database -->
                    <button class="btn btn-sm btn-danger delete-inq-btn" data-id="${inq._id}" style="padding: 0.4rem 0.6rem;" title="Delete Record">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        inquiriesTbody.appendChild(tr);
    });

    // Attach Delete Listener
    document.querySelectorAll('.delete-inq-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const inqId = e.currentTarget.getAttribute('data-id');
            await deleteInquiry(inqId);
        });
    });
    
    if (window.lucide) window.lucide.createIcons();
}

async function deleteInquiry(id) {
    if (confirm("Are you sure you want to delete this client inquiry permanently from the database?")) {
        try {
            const response = await fetch(`${API_BASE}/api/inquiries/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const result = await response.json();
            if (response.ok && result.success) {
                await fetchInquiries();
                renderInquiriesTable();
            } else {
                alert(result.message || 'Failed to delete inquiry.');
            }
        } catch (err) {
            console.error('Error deleting inquiry:', err);
            alert('Server connection error. Failed to delete inquiry.');
        }
    }
}

// Modal Logic
function openModal(isEdit = false) {
    modal.classList.add('active');
    
    // Reset file/image preview variables
    uploadStatus.style.display = 'none';
    uploadStatus.textContent = '';
    previewContainer.style.display = 'none';
    previewImg.src = '';
    fileInput.value = '';

    if (!isEdit) {
        modalTitle.textContent = 'Add New Product';
        formId.value = '';
        formName.value = '';
        formCompany.value = '';
        formType.value = '';
        if (window.formResolution) window.formResolution.value = '';
        if (window.formDescription) window.formDescription.value = '';
        formPrice.value = '';
        formImage.value = '';
    } else {
        modalTitle.textContent = 'Edit Product';
    }
}

function closeModal() {
    modal.classList.remove('active');
}

addBtn.addEventListener('click', () => openModal(false));
closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

function openEditModal(id) {
    const product = localProductData.products.find(p => p.id === id);
    
    if (product) {
        formId.value = product.id;
        formCategory.value = product.category;
        formName.value = product.name;
        formCompany.value = product.company || '';
        formType.value = product.type;
        if (window.formResolution) window.formResolution.value = product.resolution || 'N/A';
        if (window.formDescription) window.formDescription.value = product.description || '';
        formPrice.value = product.price;
        formImage.value = product.image;
        
        // Open modal & set preview immediately
        openModal(true);
        if (product.image) {
            previewImg.src = product.image;
            previewContainer.style.display = 'flex';
            sizeTag.textContent = product.image.startsWith('data:') ? 'Optimized Base64 (Stored in DB)' : 'External Web URL';
        }
    }
}

// Canvas-based Client Side Image Compression Handler (Targets ~50KB at 100% crisp visual neatness)
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show compression state
    uploadStatus.style.display = 'block';
    uploadStatus.textContent = 'Compressing image cleanly to ~50KB...';
    uploadStatus.style.color = '#3b82f6';

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set max dimension (width or height) to 600px for clear visual quality but low size footprint
            const MAX_DIM = 600;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_DIM) {
                    height = Math.round((height * MAX_DIM) / width);
                    width = MAX_DIM;
                }
            } else {
                if (height > MAX_DIM) {
                    width = Math.round((width * MAX_DIM) / height);
                    height = MAX_DIM;
                }
            }

            canvas.width = width;
            canvas.height = height;
            
            // Draw image smoothly
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            // Compress as JPEG at 0.78 quality which provides absolute visual clarity with small file size (~35-50KB)
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.78);

            // Calculate approximate size of Base64 string in KB
            const base64Content = compressedBase64.split(',')[1];
            const sizeInBytes = Math.ceil(base64Content.length * 0.75);
            const sizeInKB = Math.round(sizeInBytes / 1024);

            // Store in form input
            formImage.value = compressedBase64;

            // Show micro preview
            previewImg.src = compressedBase64;
            previewContainer.style.display = 'flex';
            sizeTag.textContent = `Optimized Size: ~${sizeInKB}KB (Original: ${Math.round(file.size / 1024)}KB)`;

            uploadStatus.textContent = '✅ Image successfully optimized and loaded!';
            uploadStatus.style.color = '#059669';
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// Update image preview automatically if URL is pasted manually
formImage.addEventListener('input', () => {
    if (formImage.value.startsWith('http') || formImage.value.startsWith('data:image')) {
        previewImg.src = formImage.value;
        previewContainer.style.display = 'flex';
        sizeTag.textContent = formImage.value.startsWith('data:') ? 'Custom Base64 Upload' : 'External Web URL';
        uploadStatus.style.display = 'none';
    } else {
        previewContainer.style.display = 'none';
    }
});

// CRUD Operations
saveBtn.addEventListener('click', async () => {
    // Basic validation
    if (!formName.value || !formType.value || !formPrice.value || !formImage.value) {
        alert("Please fill in all fields.");
        return;
    }

    const id = formId.value ? parseInt(formId.value) : null;
    
    const payload = {
        name: formName.value,
        company: formCompany.value,
        category: formCategory.value,
        type: formType.value,
        resolution: window.formResolution ? window.formResolution.value : 'N/A',
        description: window.formDescription ? window.formDescription.value : '',
        price: formPrice.value,
        image: formImage.value
    };

    try {
        let response;
        if (id) {
            // Edit Mode API Call
            response = await fetch(`${API_BASE}/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });
        } else {
            // Add Mode API Call
            response = await fetch(`${API_BASE}/api/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });
        }

        const result = await response.json();
        if (response.ok && result.success) {
            closeModal();
            // Re-fetch from MongoDB to sync everything
            await fetchProducts();
            renderFilters();
            renderTable();
        } else {
            alert(result.message || 'Operation failed.');
        }
    } catch (err) {
        console.error('Error saving product:', err);
        alert('Server connection error. Failed to save product.');
    }
});

async function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product from MongoDB?")) {
        try {
            const response = await fetch(`${API_BASE}/api/products/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const result = await response.json();
            if (response.ok && result.success) {
                // Re-fetch and sync
                await fetchProducts();
                renderFilters();
                renderTable();
            } else {
                alert(result.message || 'Failed to delete product.');
            }
        } catch (err) {
            console.error('Error deleting product:', err);
            alert('Server connection error. Failed to delete product.');
        }
    }
}

// Bulk JSON Modal Controllers
const jsonModalBtn = document.getElementById('json-modal-btn');
const jsonModal = document.getElementById('json-modal');
const closeJsonModalBtn = document.getElementById('close-json-modal-btn');
const jsonTextarea = document.getElementById('json-textarea');
const jsonModalStatus = document.getElementById('json-modal-status');
const copyJsonBtn = document.getElementById('copy-json-btn');
const importJsonBtn = document.getElementById('import-json-btn');

if (jsonModalBtn) {
    jsonModalBtn.addEventListener('click', () => {
        jsonModal.classList.add('active');
        // Pre-populate with beautiful, current dynamic database products array
        jsonTextarea.value = JSON.stringify(localProductData.products, null, 4);
        
        jsonModalStatus.style.display = 'none';
        jsonModalStatus.textContent = '';
    });
}

if (closeJsonModalBtn) {
    closeJsonModalBtn.addEventListener('click', () => {
        jsonModal.classList.remove('active');
    });
}

// Close on clicking modal backdrop
if (jsonModal) {
    jsonModal.addEventListener('click', (e) => {
        if (e.target === jsonModal) {
            jsonModal.classList.remove('active');
        }
    });
}

if (copyJsonBtn) {
    copyJsonBtn.addEventListener('click', () => {
        jsonTextarea.select();
        jsonTextarea.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(jsonTextarea.value);
        
        copyJsonBtn.textContent = "Copied to Clipboard! ✓";
        copyJsonBtn.style.background = "#059669";
        copyJsonBtn.style.color = "#ffffff";
        
        setTimeout(() => {
            copyJsonBtn.textContent = "Copy Current JSON";
            copyJsonBtn.style.background = "";
            copyJsonBtn.style.color = "";
        }, 2500);
    });
}

if (importJsonBtn) {
    importJsonBtn.addEventListener('click', async () => {
        jsonModalStatus.style.display = 'none';
        
        try {
            const parsed = JSON.parse(jsonTextarea.value);
            
            // Basic format validation
            const list = Array.isArray(parsed) ? parsed : (parsed.products || []);
            if (list.length === 0) {
                throw new Error("JSON payload must contain a non-empty products array.");
            }
            
            jsonModalStatus.style.display = 'block';
            jsonModalStatus.textContent = '🚀 Executing bulk import in MongoDB Atlas...';
            jsonModalStatus.style.background = 'rgba(59, 130, 246, 0.1)';
            jsonModalStatus.style.color = '#2563eb';
            jsonModalStatus.style.border = '1px solid rgba(59, 130, 246, 0.2)';

            // Call API
            const response = await fetch(`${API_BASE}/api/products/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(parsed)
            });

            const result = await response.json();
            if (response.ok && result.success) {
                jsonModalStatus.textContent = `✅ Success! ${result.message}`;
                jsonModalStatus.style.background = 'rgba(16, 185, 129, 0.1)';
                jsonModalStatus.style.color = '#059669';
                jsonModalStatus.style.border = '1px solid rgba(16, 185, 129, 0.2)';

                // Sync and re-draw everything
                await fetchProducts();
                renderFilters();
                renderTable();

                // Smoothly close after a short delay
                setTimeout(() => {
                    jsonModal.classList.remove('active');
                }, 2000);
            } else {
                jsonModalStatus.textContent = `❌ Import Failed: ${result.message || 'Server rejected request.'}`;
                jsonModalStatus.style.background = 'rgba(239, 68, 68, 0.1)';
                jsonModalStatus.style.color = '#dc2626';
                jsonModalStatus.style.border = '1px solid rgba(239, 68, 68, 0.2)';
            }
        } catch (err) {
            jsonModalStatus.style.display = 'block';
            jsonModalStatus.textContent = `❌ Invalid JSON Structure: ${err.message}`;
            jsonModalStatus.style.background = 'rgba(239, 68, 68, 0.1)';
            jsonModalStatus.style.color = '#dc2626';
            jsonModalStatus.style.border = '1px solid rgba(239, 68, 68, 0.2)';
        }
    });
}

// Run Init
document.addEventListener('DOMContentLoaded', init);
