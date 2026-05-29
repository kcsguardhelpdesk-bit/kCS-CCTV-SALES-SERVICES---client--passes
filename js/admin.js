// Dynamic Admin Panel Controller
const API_BASE = '';

let localProductData = {
    filters: { categories: [], brands: [] },
    products: []
};
let localInquiries = [];
let localJobs = [];
let currentFilter = 'All';

// Tab Switcher Elements
const navProducts = document.getElementById('nav-products');
const navInquiries = document.getElementById('nav-inquiries');
const navJobPosts = document.getElementById('nav-job-posts');
const navJobApps = document.getElementById('nav-job-apps');
const productsPanel = document.getElementById('products-panel');
const inquiriesPanel = document.getElementById('inquiries-panel');
const jobPostsPanel = document.getElementById('job-posts-panel');
const jobAppsPanel = document.getElementById('job-apps-panel');
const inquiryBadge = document.getElementById('inquiry-badge');
const jobsBadge = document.getElementById('jobs-badge');
const inquiriesSubtitle = document.getElementById('inquiries-subtitle');
const jobsSubtitle = document.getElementById('jobs-subtitle');

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

// Jobs DOM Elements
const jobsTbody = document.getElementById('jobs-tbody');
const addJobBtn = document.getElementById('add-job-btn');
const jobModal = document.getElementById('job-modal');
const closeJobModalBtn = document.getElementById('close-job-modal-btn');
const cancelJobModalBtn = document.getElementById('cancel-job-modal-btn');
const saveJobBtn = document.getElementById('save-job-btn');

// Job Form elements
const formJobId = document.getElementById('form-job-id');
const formJobName = document.getElementById('form-job-name');
const formJobEmail = document.getElementById('form-job-email');
const formJobPhone = document.getElementById('form-job-phone');
const formJobRole = document.getElementById('form-job-role');
const formJobExperience = document.getElementById('form-job-experience');
const formJobSkills = document.getElementById('form-job-skills');
const formJobLocation = document.getElementById('form-job-location');
const formJobResume = document.getElementById('form-job-resume');
const formJobDetails = document.getElementById('form-job-details');
const jobModalTitle = document.getElementById('job-modal-title');


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

// Fetch job applications from MongoDB API
async function fetchJobs() {
    try {
        const response = await fetch(`${API_BASE}/api/careers`, {
            credentials: 'include'
        });
        const result = await response.json();
        if (result.success) {
            localJobs = result.data;
            updateJobsCounters();
        }
    } catch (err) {
        console.error('Failed to load job applications from MongoDB API:', err);
    }
}

// Update Jobs Badge and Header counts
function updateJobsCounters() {
    if (localJobs.length > 0) {
        jobsBadge.textContent = localJobs.length;
        jobsBadge.style.display = 'inline-block';
        jobsSubtitle.textContent = `${localJobs.length} applications received`;
    } else {
        jobsBadge.style.display = 'none';
        jobsSubtitle.textContent = 'No applications received yet';
    }
}

// Tab Switching Event Handlers
navProducts.addEventListener('click', (e) => {
    e.preventDefault();
    navInquiries.classList.remove('active');
    navJobPosts.classList.remove('active');
    navJobApps.classList.remove('active');
    navProducts.classList.add('active');
    inquiriesPanel.style.display = 'none';
    jobPostsPanel.style.display = 'none';
    jobAppsPanel.style.display = 'none';
    productsPanel.style.display = 'block';
});

navInquiries.addEventListener('click', async (e) => {
    e.preventDefault();
    navProducts.classList.remove('active');
    navJobPosts.classList.remove('active');
    navJobApps.classList.remove('active');
    navInquiries.classList.add('active');
    productsPanel.style.display = 'none';
    jobPostsPanel.style.display = 'none';
    jobAppsPanel.style.display = 'none';
    inquiriesPanel.style.display = 'block';
    await fetchInquiries();
    renderInquiriesTable();
});

navJobPosts.addEventListener('click', async (e) => {
    e.preventDefault();
    navProducts.classList.remove('active');
    navInquiries.classList.remove('active');
    navJobApps.classList.remove('active');
    navJobPosts.classList.add('active');
    productsPanel.style.display = 'none';
    inquiriesPanel.style.display = 'none';
    jobAppsPanel.style.display = 'none';
    jobPostsPanel.style.display = 'block';
    await fetchJobOpenings();
    renderPostsTable();
});

navJobApps.addEventListener('click', async (e) => {
    e.preventDefault();
    navProducts.classList.remove('active');
    navInquiries.classList.remove('active');
    navJobPosts.classList.remove('active');
    navJobApps.classList.add('active');
    productsPanel.style.display = 'none';
    inquiriesPanel.style.display = 'none';
    jobPostsPanel.style.display = 'none';
    jobAppsPanel.style.display = 'block';
    await fetchJobs();
    renderJobsTable();
});

// Initialize
async function init() {
    await fetchProducts();
    await fetchInquiries(); // Fetch inquiries to set badge count right away!
    await fetchJobs(); // Fetch job applications to set badge count right away!
    await fetchJobOpenings(); // Fetch job openings to set badge count right away!
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
                    <!-- Delete inquiry from database (DISABLED BY ADMIN REQUEST) -->
                    <button class="btn btn-sm btn-danger delete-inq-btn" disabled data-id="${inq._id}" style="padding: 0.4rem 0.6rem; opacity: 0.4; cursor: not-allowed;" title="Delete Record Disabled">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        inquiriesTbody.appendChild(tr);
    });

    // Attach Delete Listener (Only for active non-disabled buttons)
    document.querySelectorAll('.delete-inq-btn:not([disabled])').forEach(btn => {
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

// Calculate relative time (e.g. Just Now, 1 Hour Ago, 2 Days Ago)
function getRelativeTime(date) {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
        return "Just Now";
    }
    if (diffMins < 60) {
        return `${diffMins} Min${diffMins > 1 ? 's' : ''} Ago`;
    }
    if (diffHours < 24) {
        return `${diffHours} Hour${diffHours > 1 ? 's' : ''} Ago`;
    }
    return `${diffDays} Day${diffDays > 1 ? 's' : ''} Ago`;
}

// Jobs Table Renderer (Secure against XSS using textContent/element builders)
function renderJobsTable() {
    jobsTbody.replaceChildren(); // Clean clearing
    
    if (localJobs.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="8" style="text-align: center; padding: 3rem; color: #64748b;">
                <i data-lucide="inbox" style="width: 48px; height: 48px; margin: 0 auto 1rem; color: #cbd5e1; display: block;"></i>
                No job applications submitted yet.
            </td>
        `;
        jobsTbody.appendChild(tr);
        if (window.lucide) window.lucide.createIcons();
        return;
    }

    localJobs.forEach(job => {
        const dateStr = new Date(job.createdAt).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });

        // Clean phone number for WhatsApp linking
        const rawPhone = job.phone.replace(/[^0-9]/g, '');
        const waPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

        const tr = document.createElement('tr');

        // Create cells securely using element properties to avoid XSS from database content
        const tdDate = document.createElement('td');
        tdDate.style.fontSize = '0.85rem';
        tdDate.style.color = '#64748b';
        tdDate.style.fontWeight = '500';
        
        const relativeTime = getRelativeTime(job.createdAt);
        tdDate.innerHTML = `
            <div style="font-weight:600; color:#334155;">${dateStr}</div>
            <div style="font-size:0.75rem; color:#10b981; font-weight:700; margin-top:0.25rem; display:inline-block; background:rgba(16,185,129,0.08); padding:2px 6px; border-radius:4px; border:1px solid rgba(16,185,129,0.15);">${relativeTime}</div>
        `;

        const tdName = document.createElement('td');
        const strongName = document.createElement('strong');
        strongName.textContent = job.name;
        tdName.appendChild(strongName);

        const tdRole = document.createElement('td');
        const spanRole = document.createElement('span');
        spanRole.style.background = 'rgba(6, 182, 212, 0.1)';
        spanRole.style.color = '#06b6d4';
        spanRole.style.fontSize = '0.75rem';
        spanRole.style.fontWeight = '700';
        spanRole.style.padding = '4px 8px';
        spanRole.style.borderRadius = '6px';
        spanRole.style.border = '1px solid rgba(6, 182, 212, 0.2)';
        spanRole.textContent = job.role;
        tdRole.appendChild(spanRole);

        const tdLocation = document.createElement('td');
        tdLocation.style.fontWeight = '600';
        tdLocation.style.color = '#1e293b';
        tdLocation.textContent = job.preferredLocation;

        const tdContact = document.createElement('td');
        tdContact.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:0.25rem; font-size:0.85rem;">
                <span style="display:flex; align-items:center; gap:0.25rem;">
                    <i class="fa-solid fa-envelope" style="color:#64748b; font-size:0.75rem;"></i> <span class="email-val"></span>
                </span>
                <span style="display:flex; align-items:center; gap:0.25rem;">
                    <i class="fa-solid fa-phone" style="color:#64748b; font-size:0.75rem;"></i> <span class="phone-val"></span>
                </span>
            </div>
        `;
        tdContact.querySelector('.email-val').textContent = job.email;
        tdContact.querySelector('.phone-val').textContent = job.phone;

        const tdSkills = document.createElement('td');
        tdSkills.innerHTML = `
            <div style="font-size:0.85rem; line-height:1.45;">
                <div style="margin-bottom: 0.25rem;"><strong>Skills:</strong> <span class="skills-val"></span></div>
                <div><strong>Exp:</strong> <span class="exp-val"></span></div>
            </div>
        `;
        tdSkills.querySelector('.skills-val').textContent = job.skills;
        tdSkills.querySelector('.exp-val').textContent = job.experience;

        const tdResume = document.createElement('td');
        if (job.resumeLink && (job.resumeLink.startsWith('http://') || job.resumeLink.startsWith('https://'))) {
            const btnResume = document.createElement('a');
            btnResume.href = job.resumeLink;
            btnResume.target = '_blank';
            btnResume.className = 'btn btn-sm';
            btnResume.style.background = 'rgba(6, 182, 212, 0.1)';
            btnResume.style.color = '#06b6d4';
            btnResume.style.border = '1px solid rgba(6, 182, 212, 0.2)';
            btnResume.style.fontWeight = '700';
            btnResume.style.padding = '4px 10px';
            btnResume.style.borderRadius = '6px';
            btnResume.style.textDecoration = 'none';
            btnResume.style.display = 'inline-flex';
            btnResume.style.alignItems = 'center';
            btnResume.style.gap = '4px';
            btnResume.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Resume';
            tdResume.appendChild(btnResume);
        } else {
            tdResume.textContent = '-';
        }

        const tdActions = document.createElement('td');
        tdActions.innerHTML = `
            <div class="action-btns" style="gap: 0.5rem;">
                <a class="btn tel-link" style="background:#e2e8f0; color:#1e293b; padding:0.4rem 0.6rem; border-radius:4px; font-size:0.8rem;" title="Call Applicant">
                    <i class="fa-solid fa-phone"></i>
                </a>
                <a target="_blank" class="btn wa-link" style="background:#25d366; color:#fff; padding:0.4rem 0.6rem; border-radius:4px; font-size:0.8rem;" title="Chat on WhatsApp">
                    <i class="fa-brands fa-whatsapp"></i>
                </a>
                <a class="btn email-link" style="background:#3b82f6; color:#fff; padding:0.4rem 0.6rem; border-radius:4px; font-size:0.8rem;" title="Reply via Email">
                    <i class="fa-solid fa-envelope"></i>
                </a>
                <button class="btn btn-sm btn-primary edit-job-btn" style="padding: 0.4rem 0.6rem; background:#3b82f6; border:none; color:#fff;" title="Edit Record">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-job-btn" style="padding: 0.4rem 0.6rem;" title="Delete Record">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        tdActions.querySelector('.tel-link').href = `tel:${job.phone}`;
        tdActions.querySelector('.wa-link').href = `https://wa.me/${waPhone}?text=Hi%20${encodeURIComponent(job.name)},%20this%20is%20KCS%20Guard%20responding%20to%20your%20application%20for%20the%20${encodeURIComponent(job.role)}%20position.`;
        tdActions.querySelector('.email-link').href = `mailto:${job.email}?subject=KCS%20Guard%20Job%20Application%20Response&body=Hi%20${encodeURIComponent(job.name)},`;
        
        const editBtn = tdActions.querySelector('.edit-job-btn');
        editBtn.addEventListener('click', () => {
            openJobEditModal(job);
        });

        const deleteBtn = tdActions.querySelector('.delete-job-btn');
        deleteBtn.addEventListener('click', async () => {
            await deleteJob(job._id);
        });

        tr.appendChild(tdDate);
        tr.appendChild(tdName);
        tr.appendChild(tdRole);
        tr.appendChild(tdLocation);
        tr.appendChild(tdContact);
        tr.appendChild(tdSkills);
        tr.appendChild(tdResume);
        tr.appendChild(tdActions);

        jobsTbody.appendChild(tr);
    });
    
    if (window.lucide) window.lucide.createIcons();
}

// Delete job application from database
async function deleteJob(id) {
    if (confirm("Are you sure you want to delete this job application permanently from the database?")) {
        try {
            const response = await fetch(`${API_BASE}/api/careers/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const result = await response.json();
            if (response.ok && result.success) {
                await fetchJobs();
                renderJobsTable();
            } else {
                alert(result.message || 'Failed to delete application.');
            }
        } catch (err) {
            console.error('Error deleting job application:', err);
            alert('Server connection error. Failed to delete application.');
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

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

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

// Job Application modal handlers
function openJobModal(isEdit = false) {
    jobModal.classList.add('active');
    
    if (!isEdit) {
        jobModalTitle.textContent = 'Add New Application';
        formJobId.value = '';
        formJobName.value = '';
        formJobEmail.value = '';
        formJobPhone.value = '';
        formJobRole.value = 'Senior CCTV Installation Technician';
        formJobExperience.value = 'Fresher (No Experience)';
        formJobSkills.value = '';
        formJobLocation.value = 'Venkatagiri';
        formJobResume.value = '';
        formJobDetails.value = '';
    } else {
        jobModalTitle.textContent = 'Edit Application Details';
    }
}

function closeJobModal() {
    jobModal.classList.remove('active');
}

function openJobEditModal(job) {
    formJobId.value = job._id;
    formJobName.value = job.name;
    formJobEmail.value = job.email;
    formJobPhone.value = job.phone;
    formJobRole.value = job.role;
    formJobExperience.value = job.experience;
    formJobSkills.value = job.skills;
    formJobLocation.value = job.preferredLocation;
    formJobResume.value = job.resumeLink;
    formJobDetails.value = job.details || '';
    
    openJobModal(true);
}

// Attach event listeners for Jobs Modal
if (addJobBtn) {
    addJobBtn.addEventListener('click', () => openJobModal(false));
}

if (closeJobModalBtn) {
    closeJobModalBtn.addEventListener('click', closeJobModal);
}

if (cancelJobModalBtn) {
    cancelJobModalBtn.addEventListener('click', closeJobModal);
}

if (jobModal) {
    jobModal.addEventListener('click', (e) => {
        if (e.target === jobModal) {
            closeJobModal();
        }
    });
}

if (saveJobBtn) {
    saveJobBtn.addEventListener('click', async () => {
        // Validate required fields
        if (!formJobName.value.trim() || !formJobEmail.value.trim() || !formJobPhone.value.trim() || 
            !formJobSkills.value.trim() || !formJobResume.value.trim()) {
            alert("Please fill in all required fields (Name, Email, Phone, Skills, and Resume Link).");
            return;
        }

        const id = formJobId.value;
        const payload = {
            name: formJobName.value.trim(),
            email: formJobEmail.value.trim(),
            phone: formJobPhone.value.trim(),
            role: formJobRole.value,
            experience: formJobExperience.value,
            skills: formJobSkills.value.trim(),
            preferredLocation: formJobLocation.value,
            resumeLink: formJobResume.value.trim(),
            details: formJobDetails.value.trim()
        };

        try {
            let response;
            if (id) {
                // Update Application (PUT)
                response = await fetch(`${API_BASE}/api/careers/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                });
            } else {
                // Create Application (POST)
                response = await fetch(`${API_BASE}/api/careers`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                });
            }

            const result = await response.json();
            if (response.ok && result.success) {
                alert(id ? "Job application updated successfully in database!" : "Job application added manually successfully!");
                closeJobModal();
                await fetchJobs();
                renderJobsTable();
            } else {
                alert(result.message || "Failed to save job application.");
            }
        } catch (err) {
            console.error("Error saving job application:", err);
            alert("Server connection error. Failed to save application.");
        }
    });
}

// ---------------- JOB OPENINGS (POSTS) CRUD CONTROLLERS ----------------

let localJobOpenings = [];

// DOM Elements
const postsTbody = document.getElementById('posts-tbody');
const postsSubtitle = document.getElementById('posts-subtitle');
const addPostBtn = document.getElementById('add-post-btn');
const postModal = document.getElementById('post-modal');
const closePostModalBtn = document.getElementById('close-post-modal-btn');
const cancelPostModalBtn = document.getElementById('cancel-post-modal-btn');
const savePostBtn = document.getElementById('save-post-btn');

// Form Fields
const formPostId = document.getElementById('form-post-id');
const formPostSlugId = document.getElementById('form-post-slug-id');
const formPostTitle = document.getElementById('form-post-title');
const formPostCategory = document.getElementById('form-post-category');
const formPostLocation = document.getElementById('form-post-location');
const formPostType = document.getElementById('form-post-type');
const formPostExperience = document.getElementById('form-post-experience');
const formPostSalary = document.getElementById('form-post-salary');
const formPostDescription = document.getElementById('form-post-description');
const formPostSkills = document.getElementById('form-post-skills');
const formPostRequirements = document.getElementById('form-post-requirements');
const postModalTitle = document.getElementById('post-modal-title');

// Subnav DOM Switchers
const btnJobPosts = document.getElementById('btn-job-posts');
const btnJobApplications = document.getElementById('btn-job-applications');
const jobPostsView = document.getElementById('job-posts-view');
const jobAppsView = document.getElementById('job-apps-view');

// Fetch Job Openings
async function fetchJobOpenings() {
    try {
        const response = await fetch(`${API_BASE}/api/job-openings`, {
            credentials: 'include'
        });
        const result = await response.json();
        if (result.success) {
            localJobOpenings = result.data;
            updatePostsCounters();
        }
    } catch (err) {
        console.error('Failed to load job openings:', err);
    }
}

// Update Counters
function updatePostsCounters() {
    if (postsSubtitle) {
        postsSubtitle.textContent = `${localJobOpenings.length} openings listed`;
    }
}

// Render Table
function renderPostsTable() {
    if (!postsTbody) return;
    postsTbody.replaceChildren();

    if (localJobOpenings.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="9" style="text-align: center; padding: 3rem; color: #64748b;">
                <i data-lucide="inbox" style="width: 48px; height: 48px; margin: 0 auto 1rem; color: #cbd5e1; display: block;"></i>
                No job openings listed yet. Add one to list it on Careers page!
            </td>
        `;
        postsTbody.appendChild(tr);
        if (window.lucide) window.lucide.createIcons();
        return;
    }

    localJobOpenings.forEach(post => {
        const tr = document.createElement('tr');

        const tdId = document.createElement('td');
        tdId.style.fontSize = '0.85rem';
        tdId.style.color = '#64748b';
        tdId.style.fontWeight = '700';
        tdId.style.fontFamily = 'monospace';
        tdId.textContent = post.id;
        tr.appendChild(tdId);

        const tdTitle = document.createElement('td');
        const strongTitle = document.createElement('strong');
        strongTitle.textContent = post.title;
        tdTitle.appendChild(strongTitle);

        const tdCategory = document.createElement('td');
        const spanCat = document.createElement('span');
        spanCat.style.background = 'rgba(8, 145, 178, 0.08)';
        spanCat.style.color = '#0891b2';
        spanCat.style.fontSize = '0.75rem';
        spanCat.style.fontWeight = '700';
        spanCat.style.padding = '4px 8px';
        spanCat.style.borderRadius = '6px';
        spanCat.style.border = '1px solid rgba(8, 145, 178, 0.15)';
        spanCat.textContent = post.category;
        tdCategory.appendChild(spanCat);

        const tdLocation = document.createElement('td');
        tdLocation.style.fontWeight = '600';
        tdLocation.textContent = post.location;

        const tdType = document.createElement('td');
        tdType.textContent = post.type;

        const tdSalary = document.createElement('td');
        tdSalary.style.fontWeight = '600';
        tdSalary.textContent = post.salary;

        const tdSkills = document.createElement('td');
        tdSkills.style.fontSize = '0.85rem';
        tdSkills.style.maxWidth = '200px';
        tdSkills.style.overflow = 'hidden';
        tdSkills.style.textOverflow = 'ellipsis';
        tdSkills.style.whiteSpace = 'nowrap';
        tdSkills.textContent = Array.isArray(post.skills) ? post.skills.join(', ') : post.skills;

        const tdStatus = document.createElement('td');
        const isActive = post.active !== false;
        
        // Modern Pill Button Toggle
        const statusBtn = document.createElement('button');
        statusBtn.className = 'btn';
        statusBtn.style.padding = '4px 12px';
        statusBtn.style.borderRadius = '20px';
        statusBtn.style.fontSize = '0.72rem';
        statusBtn.style.fontWeight = '800';
        statusBtn.style.border = '1px solid';
        statusBtn.style.cursor = 'pointer';
        statusBtn.style.display = 'inline-flex';
        statusBtn.style.alignItems = 'center';
        statusBtn.style.gap = '5px';
        statusBtn.style.transition = 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
        statusBtn.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
        
        if (isActive) {
            statusBtn.style.background = 'rgba(16, 185, 129, 0.1)';
            statusBtn.style.color = '#059669';
            statusBtn.style.borderColor = 'rgba(16, 185, 129, 0.25)';
            statusBtn.innerHTML = '<i class="fa-solid fa-circle" style="color:#10b981; font-size:0.55rem; animation: pulse 2s infinite;"></i> ON';
            statusBtn.title = "Click to turn Job opening OFF";
        } else {
            statusBtn.style.background = 'rgba(100, 116, 139, 0.1)';
            statusBtn.style.color = '#64748b';
            statusBtn.style.borderColor = 'rgba(100, 116, 139, 0.25)';
            statusBtn.innerHTML = '<i class="fa-solid fa-circle" style="color:#64748b; font-size:0.55rem;"></i> OFF';
            statusBtn.title = "Click to turn Job opening ON";
        }
        
        statusBtn.addEventListener('click', async () => {
            try {
                statusBtn.disabled = true;
                statusBtn.textContent = '...';
                
                const response = await fetch(`${API_BASE}/api/job-openings/${post._id}/toggle`, {
                    method: 'PUT',
                    credentials: 'include'
                });
                const result = await response.json();
                if (response.ok && result.success) {
                    post.active = result.active;
                    renderPostsTable();
                } else {
                    alert(result.message || 'Failed to toggle status.');
                    renderPostsTable();
                }
            } catch (err) {
                console.error('Error toggling active state:', err);
                alert('Connection failure. Failed to toggle status.');
                renderPostsTable();
            }
        });
        
        tdStatus.appendChild(statusBtn);

        const tdActions = document.createElement('td');
        tdActions.innerHTML = `
            <div class="action-btns" style="gap: 0.5rem;">
                <button class="btn btn-sm btn-primary edit-post-btn" style="padding: 0.4rem 0.6rem; background:#3b82f6; border:none; color:#fff;" title="Edit Job opening">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-post-btn" style="padding: 0.4rem 0.6rem;" title="Delete Job opening">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        tdActions.querySelector('.edit-post-btn').addEventListener('click', () => openPostEditModal(post));
        tdActions.querySelector('.delete-post-btn').addEventListener('click', () => deletePostOpening(post._id));

        tr.appendChild(tdTitle);
        tr.appendChild(tdCategory);
        tr.appendChild(tdLocation);
        tr.appendChild(tdType);
        tr.appendChild(tdSalary);
        tr.appendChild(tdSkills);
        tr.appendChild(tdStatus);
        tr.appendChild(tdActions);

        postsTbody.appendChild(tr);
    });

    if (window.lucide) window.lucide.createIcons();
}

// Modal Toggle Handlers
function openPostModal(isEdit = false) {
    if (!postModal) return;
    postModal.classList.add('active');

    if (!isEdit) {
        postModalTitle.textContent = 'Add New Job Post';
        formPostId.value = '';
        formPostSlugId.value = '';
        formPostTitle.value = '';
        formPostCategory.value = '';
        formPostLocation.value = 'Venkatagiri';
        formPostType.value = 'Full-Time';
        formPostExperience.value = '';
        formPostSalary.value = '';
        formPostDescription.value = '';
        formPostSkills.value = '';
        formPostRequirements.value = '';
    } else {
        postModalTitle.textContent = 'Edit Job Post';
    }
}

function closePostModal() {
    if (postModal) postModal.classList.remove('active');
}

function openPostEditModal(post) {
    formPostId.value = post._id;
    formPostSlugId.value = post.id || '';
    formPostTitle.value = post.title;
    formPostCategory.value = post.category;
    formPostLocation.value = post.location;
    formPostType.value = post.type;
    formPostExperience.value = post.experience;
    formPostSalary.value = post.salary;
    formPostDescription.value = post.description;
    formPostSkills.value = Array.isArray(post.skills) ? post.skills.join(', ') : post.skills;
    formPostRequirements.value = Array.isArray(post.requirements) ? post.requirements.join('\n') : post.requirements;

    openPostModal(true);
}

// Delete Opening
async function deletePostOpening(id) {
    if (confirm("Are you sure you want to delete this job opening post permanently? It will disappear from the client Careers page.")) {
        try {
            const response = await fetch(`${API_BASE}/api/job-openings/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const result = await response.json();
            if (response.ok && result.success) {
                await fetchJobOpenings();
                renderPostsTable();
            } else {
                alert(result.message || 'Failed to delete opening.');
            }
        } catch (err) {
            console.error('Error deleting opening:', err);
            alert('Server connection error. Failed to delete opening.');
        }
    }
}

// Bind Modal controls
if (addPostBtn) addPostBtn.addEventListener('click', () => openPostModal(false));
if (closePostModalBtn) closePostModalBtn.addEventListener('click', closePostModal);
if (cancelPostModalBtn) cancelPostModalBtn.addEventListener('click', closePostModal);
if (postModal) {
    postModal.addEventListener('click', (e) => {
        if (e.target === postModal) closePostModal();
    });
}

// Save Opening (Create / Update)
if (savePostBtn) {
    savePostBtn.addEventListener('click', async () => {
        // Validate required
        if (!formPostTitle.value.trim() || !formPostCategory.value.trim() || !formPostExperience.value.trim() ||
            !formPostSalary.value.trim() || !formPostDescription.value.trim() || !formPostSkills.value.trim() ||
            !formPostRequirements.value.trim()) {
            alert("Please fill in all fields before saving.");
            return;
        }

        const id = formPostId.value;
        const payload = {
            id: formPostSlugId.value.trim(),
            title: formPostTitle.value.trim(),
            category: formPostCategory.value.trim(),
            location: formPostLocation.value,
            type: formPostType.value,
            experience: formPostExperience.value.trim(),
            salary: formPostSalary.value.trim(),
            description: formPostDescription.value.trim(),
            skills: formPostSkills.value.trim(),
            requirements: formPostRequirements.value.trim()
        };

        try {
            let response;
            if (id) {
                // Update
                response = await fetch(`${API_BASE}/api/job-openings/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                });
            } else {
                // Create
                response = await fetch(`${API_BASE}/api/job-openings`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                });
            }

            const result = await response.json();
            if (response.ok && result.success) {
                alert(id ? "Job opening updated successfully!" : "New job opening added successfully!");
                closePostModal();
                await fetchJobOpenings();
                renderPostsTable();
            } else {
                alert(result.message || "Failed to save job opening.");
            }
        } catch (err) {
            console.error("Error saving job opening:", err);
            alert("Server connection error. Failed to save job opening.");
        }
    });
}

// Run Init
document.addEventListener('DOMContentLoaded', init);
