/* KCS Guard Careers System Logic */

// Define the 10 elite job roles mapped to requested locations with explicit skills lists
export const jobOpenings = [
    {
        id: "cctv-technician",
        title: "Senior CCTV Installation Technician",
        category: "Surveillance",
        location: "Gudur",
        type: "Full-Time",
        experience: "2-4 Years",
        salary: "₹18,000 - ₹25,000 / month",
        description: "Looking for an expert technician capable of installing, configuring, and troubleshooting IP & Analog camera systems, NVRs, DVRs, and mobile app integration.",
        skills: ["Hikvision", "CP Plus", "IP Cameras", "Analog CCTV", "NVR Configuration"],
        requirements: [
            "Experience with Hikvision, CP Plus, and Dahua systems",
            "Knowledge of network cabling (CAT6, BNC, coaxial)",
            "Excellent customer communication skills",
            "Must own a two-wheeler for field transit"
        ]
    },
    {
        id: "networking-engineer",
        title: "Lead Network Infrastructure Engineer",
        category: "Networking & IT",
        location: "Nellore",
        type: "Full-Time",
        experience: "3-5 Years",
        salary: "₹25,000 - ₹35,000 / month",
        description: "Lead the design and deployment of enterprise-grade LAN/WAN networking, fiber backbone installation, firewall routing, and smart Wi-Fi mesh systems.",
        skills: ["Layer 3 Switches", "VLAN Setup", "Fiber Optics", "Firewall Setup", "Wi-Fi Mesh"],
        requirements: [
            "Proven experience in Layer 3 switch configurations and VLANs",
            "CCNA or network certification is highly preferred",
            "Hands-on with fiber optic cable splicing and termination",
            "Strong troubleshooting skills for enterprise wireless networks"
        ]
    },
    {
        id: "node-developer",
        title: "Full-Stack Node/JS Developer",
        category: "Software Development",
        location: "Venkatagiri",
        type: "Full-Time",
        experience: "1-3 Years",
        salary: "₹30,000 - ₹45,000 / month",
        description: "Join our IT solutions team to develop and maintain in-house applications, CRM tools, PWA apps, and customer-facing service catalogs.",
        skills: ["Node.js", "Express", "MongoDB", "JavaScript", "REST APIs", "HTML5 & CSS3"],
        requirements: [
            "Strong proficiency in JavaScript, Node.js, Express, and MongoDB",
            "Experience building responsive HTML5/CSS3/JS premium frontends",
            "Familiarity with RESTful APIs and basic server-side security",
            "Eager to write clean, secure, and highly optimized code"
        ]
    },
    {
        id: "biometric-specialist",
        title: "Biometric & Access Control Specialist",
        category: "Access Security",
        location: "Tirupati",
        type: "Full-Time",
        experience: "1-3 Years",
        salary: "₹16,000 - ₹22,000 / month",
        description: "Responsible for setting up attendance systems, biometric fingerprint scanners, RFID readers, and electromagnetic locks for schools and commercial buildings.",
        skills: ["Biometrics", "RFID Scanners", "EM Locks", "Access Control Software", "Wiring"],
        requirements: [
            "Experience in biometric software deployment and database sync",
            "Basic electrical cabling knowledge for electromagnetic lock systems",
            "Strong problem-solving capability on-site",
            "Strong professionalism for client handling"
        ]
    },
    {
        id: "systems-administrator",
        title: "IT Support & Systems Administrator",
        category: "IT Services",
        location: "Venkatagiri",
        type: "Full-Time",
        experience: "2-4 Years",
        salary: "₹20,000 - ₹28,000 / month",
        description: "Deploy Microsoft enterprise suites, perform expert Windows OS setups, handle data backup/recovery, and deliver premium IT maintenance services.",
        skills: ["Windows Server", "Hardware Debugging", "Office 365", "Backup Systems", "OS Setup"],
        requirements: [
            "Expertise in Windows 10/11 pro configuration and deployment",
            "Knowledge of Microsoft 365 licensing and cloud storage security",
            "Hands-on computer hardware diagnosis and chip-level debugging skills",
            "Data security awareness and virus remediation"
        ]
    },
    {
        id: "sales-executive",
        title: "B2B Sales & Development Executive",
        category: "Sales & Marketing",
        location: "Nellore",
        type: "Full-Time",
        experience: "1-3 Years",
        salary: "₹15,000 - ₹22,000 + Incentives",
        description: "Promote KCS Guard security solutions to schools, colleges, hospitals, and commercial establishments. Generate leads and drive B2B installations.",
        skills: ["B2B Sales", "Client Demos", "Telugu Speaking", "Lead Gen", "Negotiation"],
        requirements: [
            "Strong communication in Telugu and English",
            "Passionate about sales, meeting clients, and explaining tech products",
            "Ability to deliver client demonstrations and gather custom quotes",
            "Must possess a valid driving license and own vehicle"
        ]
    },
    {
        id: "office-admin",
        title: "Office Administrator & Customer Support",
        category: "Administration",
        location: "Naidupeta",
        type: "Full-Time",
        experience: "0-2 Years",
        salary: "₹12,000 - ₹16,000 / month",
        description: "Manage client incoming calls, handle doorstep technician calendars, maintain digital registers of queries, and coordinate general administrative duties.",
        skills: ["Spreadsheets", "Client Call Handling", "Billing Control", "English & Telugu"],
        requirements: [
            "Basic computer proficiency (Word, Excel, Email)",
            "Polite, helpful customer communication over phone and WhatsApp",
            "Strong organizational skills and attention to detail",
            "Freshers with good communication skills are welcome to apply"
        ]
    },
    {
        id: "repair-technician",
        title: "Hardware Chip-Level Repair Technician",
        category: "Hardware Diagnostics",
        location: "Venkatagiri",
        type: "Full-Time",
        experience: "2-5 Years",
        salary: "₹18,000 - ₹26,000 / month",
        description: "Perform diagnosis and repair of cameras, DVR motherboards, power adapters, SMPS devices, and recording storage issues in our central lab.",
        skills: ["Chip-level Repair", "Soldering", "Multimeter Use", "SMPS Repair", "Motherboards"],
        requirements: [
            "Hands-on soldering and electronics debugging skills",
            "Experience utilizing multimeters, oscilloscopes, and testing kits",
            "Sound diagnosis of power shorts and camera chip replacements",
            "Focus on high-quality repair standards"
        ]
    },
    {
        id: "cable-installer",
        title: "Cable Laying & Fiber Deployment Associate",
        category: "Field Operations",
        location: "Rapur",
        type: "Contract / Full-Time",
        experience: "0-1 Year",
        salary: "₹12,000 - ₹15,000 / month",
        description: "Support our installation team in laying outdoor CAT6 cables, deploying fiber routes, conduit setups, and camera mounting operations.",
        skills: ["Cable Laying", "Fiber Splicing Support", "Conduit Setups", "Manual Tools", "Drilling"],
        requirements: [
            "Physically fit and comfortable working at heights on ladders",
            "Basic manual tools operation (drilling, cutting, crimping)",
            "Eager to learn security hardware installation on-field",
            "Team-player mindset with a focus on safety guidelines"
        ]
    },
    {
        id: "inventory-coordinator",
        title: "Store Inventory & Logistics Coordinator",
        category: "Operations",
        location: "Kalahasti",
        type: "Full-Time",
        experience: "1-2 Years",
        salary: "₹14,000 - ₹18,000 / month",
        description: "Coordinate parts stock levels (cameras, HDDs, cables, connectors), prepare dispatch checklists for field technicians, and update digital registers.",
        skills: ["Inventory Management", "Logistics Control", "Excel Sheets", "Parts Checking", "Dispatches"],
        requirements: [
            "Familiar with basic inventory systems or spreadsheet logging",
            "Organized sorting of hardware components",
            "Double-check incoming stock orders from global brands",
            "Integrity and attention to detail"
        ]
    }
];

export let activeJobOpenings = [];

// Initialize Careers Module
export async function initCareers() {
    const grid = document.getElementById('careers-grid-container');
    if (!grid) return;

    const searchInput = document.getElementById('search-skills');
    const categorySelect = document.getElementById('filter-category');
    const locationSelect = document.getElementById('filter-location');

    // Fetch dynamic Job Openings from the DB
    try {
        const response = await fetch('/api/job-openings');
        const result = await response.json();
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
            activeJobOpenings = result.data.filter(j => j.active !== false);
        } else {
            activeJobOpenings = jobOpenings;
        }
    } catch (err) {
        console.error('Error fetching job openings, falling back to static list:', err);
        activeJobOpenings = jobOpenings;
    }

    // Populate categories select dynamically
    if (categorySelect) {
        categorySelect.innerHTML = '<option value="">All Categories</option>';
        const uniqueCategories = [...new Set(activeJobOpenings.map(j => j.category))];
        uniqueCategories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            categorySelect.appendChild(opt);
        });
    }

    // Render list function
    function renderJobs(jobs) {
        grid.textContent = ''; // safe clearing

        if (jobs.length === 0) {
            const noRes = document.createElement('div');
            noRes.className = 'no-results';
            noRes.innerHTML = `
                <i data-lucide="info"></i>
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: #1e293b;">No Job Openings Found</h3>
                <p style="margin: 0; font-size: 0.875rem; color: #64748b;">Try refining your search keyword or selecting a different location/category filter.</p>
            `;
            grid.appendChild(noRes);
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        jobs.forEach(job => {
            const card = document.createElement('div');
            card.className = 'job-card';
            
            // Skill badges html
            const skillsHTML = job.skills.map(s => `<span class="skill-badge">${s}</span>`).join('');

            card.innerHTML = `
                <div class="job-info-left">
                    <div class="job-card-header">
                        <span class="job-category">${job.category}</span>
                    </div>
                    <h3 class="job-title">${job.title}</h3>
                    <div class="job-meta-list">
                        <div class="job-meta-item">
                            <i data-lucide="map-pin"></i> <span>${job.location} (On-site)</span>
                        </div>
                        <div class="job-meta-item">
                            <i data-lucide="clock"></i> <span>${job.type}</span>
                        </div>
                        <div class="job-meta-item">
                            <i data-lucide="briefcase"></i> <span>${job.experience}</span>
                        </div>
                    </div>
                    <p class="job-desc">${job.description}</p>
                    <div class="skills-container">
                        ${skillsHTML}
                    </div>
                </div>
                <div class="job-footer">
                    <div class="job-salary">
                        <span>Salary Bracket</span>
                        ${job.salary}
                    </div>
                    <button class="btn btn-secondary apply-trigger" data-id="${job.id}" style="padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer;">
                        View Details
                    </button>
                </div>
            `;

            grid.appendChild(card);
        });

        // Re-attach modal launch events
        document.querySelectorAll('.apply-trigger').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jobId = e.currentTarget.getAttribute('data-id');
                const job = activeJobOpenings.find(j => j.id === jobId);
                if (job) {
                    openJobModal(job);
                }
            });
        });

        if (window.lucide) window.lucide.createIcons();
    }

    // Live search filtering handler
    function filterJobs() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const cat = categorySelect ? categorySelect.value : '';
        const loc = locationSelect ? locationSelect.value : '';

        const filtered = activeJobOpenings.filter(job => {
            // Match category
            if (cat && job.category !== cat) return false;

            // Match location
            if (loc && !job.location.toLowerCase().includes(loc.toLowerCase())) return false;

            // Match skills/keywords query
            if (query) {
                const titleMatch = job.title.toLowerCase().includes(query);
                const descMatch = job.description.toLowerCase().includes(query);
                const skillsMatch = job.skills.some(s => s.toLowerCase().includes(query));
                const catMatch = job.category.toLowerCase().includes(query);
                return titleMatch || descMatch || skillsMatch || catMatch;
            }

            return true;
        });

        renderJobs(filtered);
    }

    // Bind event listeners
    if (searchInput) searchInput.addEventListener('input', filterJobs);
    if (categorySelect) categorySelect.addEventListener('change', filterJobs);
    if (locationSelect) locationSelect.addEventListener('change', filterJobs);

    // Initial render
    renderJobs(activeJobOpenings);

    // Modal elements
    const modal = document.getElementById('careers-modal');
    const closeBtn = document.getElementById('close-careers-modal-btn');
    const form = document.getElementById('careers-application-form');

    // Close Modal on button click
    if (closeBtn) {
        closeBtn.addEventListener('click', closeJobModal);
    }

    // Close Modal on clicking outside the content
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeJobModal();
            }
        });
    }

    // Handle application form submission
    if (form) {
        form.addEventListener('submit', handleApplicationSubmit);
    }
}

// Open detailed view modal
function openJobModal(job) {
    const modal = document.getElementById('careers-modal');
    const modalTitle = document.getElementById('job-modal-title');
    const modalCat = document.getElementById('job-modal-cat');
    const modalDesc = document.getElementById('job-modal-desc');
    const modalReqs = document.getElementById('job-modal-reqs');
    const hiddenInput = document.getElementById('apply-job-role');

    // Populate data safely
    modalTitle.textContent = job.title;
    modalCat.textContent = job.category;
    modalDesc.textContent = job.description;
    hiddenInput.value = job.title;

    modalReqs.textContent = ''; // Clear existing requirements safely
    job.requirements.forEach(req => {
        const li = document.createElement('li');
        li.textContent = req;
        modalReqs.appendChild(li);
    });

    // Open Modal with nice transitions
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
}

// Close modal
function closeJobModal() {
    const modal = document.getElementById('careers-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Submit handler with DB save and WhatsApp redirect
async function handleApplicationSubmit(e) {
    e.preventDefault();

    const role = document.getElementById('apply-job-role').value;
    const name = document.getElementById('apply-name').value.trim();
    const email = document.getElementById('apply-email').value.trim();
    const phone = document.getElementById('apply-phone').value.trim();
    const experience = document.getElementById('apply-experience').value;
    const skills = document.getElementById('apply-skills').value.trim();
    const preferredLocation = document.getElementById('apply-location').value;
    const resumeLink = document.getElementById('apply-resume').value.trim();
    const details = document.getElementById('apply-details').value.trim();

    if (!role || !name || !email || !phone || !experience || !skills || !preferredLocation || !resumeLink) {
        alert("Please fill in all required fields.");
        return;
    }

    const payload = { role, name, email, phone, experience, skills, preferredLocation, resumeLink, details };

    try {
        // Step 1: Save application to MongoDB Atlas
        const response = await fetch('/api/careers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Success! Close modal and reset form
            closeJobModal();
            document.getElementById('careers-application-form').reset();

            // Direct WhatsApp redirect template formatting
            const ownerPhone = "919391154616"; // Elite owner WhatsApp number
            const waMessage = `🚀 *KCS GUARD - NEW JOB APPLICATION* 🚀\n` +
                              `--------------------------------------------------\n` +
                              `*Applicant Name:* ${name}\n` +
                              `*Applied Position:* ${role}\n` +
                              `*Preferred Location:* ${preferredLocation}\n` +
                              `*Experience:* ${experience}\n` +
                              `*Skills:* ${skills}\n` +
                              `*Email:* ${email}\n` +
                              `*Phone Number:* ${phone}\n` +
                              `*GDrive Resume Link:* ${resumeLink}\n` +
                              `*Additional Details:* ${details || 'None'}\n` +
                              `--------------------------------------------------\n` +
                              `Submitted via KCS Guard Portal.`;

            const encodedMessage = encodeURIComponent(waMessage);
            const waURL = `https://wa.me/${ownerPhone}?text=${encodedMessage}`;

            // Show secure alert using a visual cue and redirect directly
            alert("Application submitted successfully to MongoDB! Redirecting to WhatsApp to complete your application with the owner...");
            window.open(waURL, '_blank');
        } else {
            alert(result.message || "Failed to submit application. Please try again.");
        }
    } catch (err) {
        console.error("Error submitting application:", err);
        alert("Connection error. Failed to save application in database. Please check your internet connection.");
    }
}
