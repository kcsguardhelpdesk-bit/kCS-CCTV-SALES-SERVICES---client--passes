export function initContactForm() {
    const contactForm = document.querySelector('.contact-form-glass') || document.querySelector('.contact-form-premium');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Sending... <i data-lucide="loader" class="spin"></i>';
            lucide.createIcons();
            
            // Gather form data
            const formData = {
                name: document.getElementById('contact-name').value.trim(),
                email: document.getElementById('contact-email').value.trim(),
                phone: document.getElementById('contact-phone').value.trim(),
                requirement: document.getElementById('requirement-select').value === 'Other' 
                    ? document.getElementById('custom-requirement').value.trim() 
                    : document.getElementById('requirement-select').value
            };
            
            try {
                const response = await fetch('/api/inquiry', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    btn.innerHTML = 'Message Sent! <i data-lucide="check"></i>';
                    btn.style.color = '#10b981';
                    contactForm.reset();
                    
                    // Hide custom requirement if visible
                    const customReq = document.getElementById('custom-requirement');
                    if (customReq) customReq.classList.add('hidden');
                } else {
                    btn.innerHTML = 'Error Sending! <i data-lucide="alert-triangle"></i>';
                    btn.style.color = '#ef4444';
                    console.error('Submission failed:', result.message);
                }
            } catch (err) {
                btn.innerHTML = 'Network Error! <i data-lucide="wifi-off"></i>';
                btn.style.color = '#ef4444';
                console.error('Network error submitting lead:', err);
            } finally {
                lucide.createIcons();
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.color = '';
                    lucide.createIcons();
                }, 3500);
            }
        });
    }

    // Handle Requirement Dropdown
    const reqSelect = document.getElementById('requirement-select');
    const customReq = document.getElementById('custom-requirement');
    
    if (reqSelect && customReq) {
        reqSelect.addEventListener('change', (e) => {
            if (e.target.value === 'Other') {
                customReq.classList.remove('hidden');
                customReq.setAttribute('required', 'true');
            } else {
                customReq.classList.add('hidden');
                customReq.removeAttribute('required');
                customReq.value = '';
            }
        });
    }
}
