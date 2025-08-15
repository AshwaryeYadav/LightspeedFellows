// Deadline timer functionality
function updateTimer() {
    // Set the deadline date (September 1, 2025 at 11:59 PM PT)
    const deadline = new Date('2025-09-01T23:59:00-07:00').getTime();
    const now = new Date().getTime();
    const timeLeft = deadline - now;

    if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // Update the timer display
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

        // Add urgency styling when less than 7 days remaining
        if (days < 7) {
            const timerNumbers = document.querySelectorAll('.timer-number');
            timerNumbers.forEach(number => {
                number.style.color = '#dc3545';
                number.style.animation = 'pulse 1s infinite';
            });
        }
    } else {
        // Deadline has passed
        document.querySelector('.deadline-timer').innerHTML = `
            <div class="timer-header">
                <i class="fas fa-times-circle"></i>
                <span>Applications Have Closed</span>
            </div>
            <div class="timer-note">
                <i class="fas fa-calendar"></i>
                <span>Thank you for your interest. Applications for this cycle are now closed.</span>
            </div>
        `;
    }
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize timer
    updateTimer();
    setInterval(updateTimer, 1000);
    
    // Smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });



    // Form validation and submission
    const applicationForm = document.getElementById('applicationForm');
    
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitForm();
            }
        });

        // Real-time form validation
        const requiredFields = applicationForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                clearFieldError(this);
            });
        });

        // Word count validation for essay fields
        const essayFields = ['essay1', 'essay2'];
        essayFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', function() {
                    const wordCount = this.value.trim().split(/\s+/).filter(word => word.length > 0).length;
                    const maxWords = 250;
                    
                    if (wordCount > maxWords) {
                        showFieldError(this, `Maximum ${maxWords} words allowed. Current: ${wordCount}`);
                    } else {
                        clearFieldError(this);
                    }
                });
            }
        });
    }

    // Continuous scroll animations
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateScrollAnimations() {
        const currentScrollY = window.scrollY;
        const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        
        // Get all animated elements
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .roll-in-left, .roll-in-right, .roll-out-left, .roll-out-right, .feature-card, .timeline-item, .step, .note-card, .criteria-list li, .eligibility-criteria h3');
        
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const elementTop = rect.top;
            const elementBottom = rect.bottom;
            const windowHeight = window.innerHeight;
            
            // Check if element is in viewport
            const isInView = elementTop < windowHeight && elementBottom > 0;
            
            if (scrollDirection === 'down') {
                // Scrolling down - show elements when they enter viewport
                if (isInView) {
                    if (el.classList.contains('fade-in') || 
                        el.classList.contains('slide-in-left') || 
                        el.classList.contains('slide-in-right') || 
                        el.classList.contains('scale-in') ||
                        el.classList.contains('roll-in-left') ||
                        el.classList.contains('roll-in-right')) {
                        el.classList.add('visible');
                    } else if (el.classList.contains('roll-out-left') || el.classList.contains('roll-out-right')) {
                        el.classList.remove('hidden');
                    } else {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }
                }
            } else {
                // Scrolling up - hide elements when they leave viewport
                if (!isInView) {
                    if (el.classList.contains('fade-in') || 
                        el.classList.contains('slide-in-left') || 
                        el.classList.contains('slide-in-right') || 
                        el.classList.contains('scale-in') ||
                        el.classList.contains('roll-in-left') ||
                        el.classList.contains('roll-in-right')) {
                        el.classList.remove('visible');
                    } else if (el.classList.contains('roll-out-left') || el.classList.contains('roll-out-right')) {
                        el.classList.add('hidden');
                    } else {
                        el.style.opacity = '0';
                        el.style.transform = 'translateY(30px)';
                    }
                }
            }
        });
        
        lastScrollY = currentScrollY;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollAnimations);
            ticking = true;
        }
    }

    // Initialize elements as hidden
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .roll-in-left, .roll-in-right, .roll-out-left, .roll-out-right, .feature-card, .timeline-item, .step, .note-card, .criteria-list li, .eligibility-criteria h3');
    animatedElements.forEach(el => {
        if (!el.classList.contains('fade-in') && 
            !el.classList.contains('slide-in-left') && 
            !el.classList.contains('slide-in-right') && 
            !el.classList.contains('scale-in') &&
            !el.classList.contains('roll-in-left') &&
            !el.classList.contains('roll-in-right') &&
            !el.classList.contains('roll-out-left') &&
            !el.classList.contains('roll-out-right')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
        }
    });

    // Add scroll event listener
    window.addEventListener('scroll', requestTick);
    
    // Initial check for elements in viewport
    updateScrollAnimations();



    // File upload preview
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                // Show file name
                const fileName = file.name;
                const fileSize = (file.size / 1024 / 1024).toFixed(2); // MB
                
                // Create or update file info display
                let fileInfo = this.parentNode.querySelector('.file-info');
                if (!fileInfo) {
                    fileInfo = document.createElement('div');
                    fileInfo.className = 'file-info';
                    fileInfo.style.cssText = 'margin-top: 8px; font-size: 0.9rem; color: #007AFF;';
                    this.parentNode.appendChild(fileInfo);
                }
                
                fileInfo.textContent = `${fileName} (${fileSize} MB)`;
                
                // Validate file type and size
                const allowedTypes = ['.pdf', '.doc', '.docx'];
                const fileExtension = '.' + fileName.split('.').pop().toLowerCase();
                const maxSize = 10; // 10MB
                
                if (!allowedTypes.includes(fileExtension)) {
                    showFieldError(this, 'Please upload a PDF, DOC, or DOCX file.');
                    return;
                }
                
                if (file.size > maxSize * 1024 * 1024) {
                    showFieldError(this, `File size must be less than ${maxSize}MB.`);
                    return;
                }
                
                clearFieldError(this);
            }
        });
    });
});

// Form validation functions
function validateForm() {
    let isValid = true;
    const requiredFields = document.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Clear previous error
    clearFieldError(field);
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required.');
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address.');
            isValid = false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number.');
            isValid = false;
        }
    }
    
    // GPA validation
    if (field.id === 'gpa' && value) {
        const gpa = parseFloat(value);
        if (isNaN(gpa) || gpa < 0 || gpa > 4.0) {
            showFieldError(field, 'GPA must be between 0.0 and 4.0.');
            isValid = false;
        }
    }
    
    return isValid;
}

function showFieldError(field, message) {
    // Remove existing error
    clearFieldError(field);
    
    // Add error styling
    field.style.borderColor = '#dc3545';
    field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = 'color: #dc3545; font-size: 0.9rem; margin-top: 5px; display: flex; align-items: center; gap: 5px;';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    // Remove error styling
    field.style.borderColor = '#e2e8f0';
    field.style.boxShadow = '';
    
    // Remove error message
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Form submission
function submitForm() {
    const submitButton = document.querySelector('.submit-button');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
        // Show success message
        showSuccessMessage();
        
        // Reset form
        document.getElementById('applicationForm').reset();
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Clear file info displays
        const fileInfos = document.querySelectorAll('.file-info');
        fileInfos.forEach(info => info.remove());
        
    }, 2000);
}

function showSuccessMessage() {
    // Create success overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        max-width: 400px;
        margin: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    `;
    
    messageBox.innerHTML = `
        <div style="font-size: 3rem; color: #27ae60; margin-bottom: 20px;">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3 style="color: #1a1a1a; margin-bottom: 15px; font-size: 1.5rem;">Application Submitted!</h3>
        <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Thank you for your interest in the Lightspeed Fellows program. We've received your application and will review it carefully.
        </p>
        <p style="color: #666; font-size: 0.9rem;">
            You will receive a confirmation email shortly. We'll be in touch about next steps.
        </p>
        <button onclick="this.closest('.success-overlay').remove()" style="
            background: linear-gradient(135deg, #007AFF, #5856D6);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
            transition: transform 0.3s ease;
        " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            Close
        </button>
    `;
    
    overlay.className = 'success-overlay';
    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.remove();
        }
    }, 5000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add some interactive hover effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.primary-button, .secondary-button, .submit-button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 