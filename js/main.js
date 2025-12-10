/**
 * Morafi - Biuro Rachunkowe
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initCookieBanner();
    initNavigation();
    initScrollEffects();
    initContactForm();
    initSmoothScroll();
});

/**
 * Cookie Banner Functionality
 * Compliant with RODO/GDPR requirements
 */
function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const rejectBtn = document.getElementById('reject-cookies');

    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');

    if (!cookieConsent) {
        // Show banner after a short delay
        setTimeout(function() {
            banner.classList.add('show');
        }, 1000);
    }

    // Accept all cookies
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            localStorage.setItem('cookieConsentDate', new Date().toISOString());
            banner.classList.remove('show');
            // Here you would enable analytics/marketing cookies
            enableAnalytics();
        });
    }

    // Reject optional cookies
    if (rejectBtn) {
        rejectBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'rejected');
            localStorage.setItem('cookieConsentDate', new Date().toISOString());
            banner.classList.remove('show');
            // Only essential cookies will be used
        });
    }
}

/**
 * Enable analytics (placeholder function)
 */
function enableAnalytics() {
    // This function would enable Google Analytics or other tracking
    // Example: gtag('consent', 'update', { 'analytics_storage': 'granted' });
    console.log('Analytics enabled');
}

/**
 * Navigation Functionality
 */
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');

            // Toggle aria-expanded for accessibility
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking on a link
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Scroll Effects and Animations
 */
function initScrollEffects() {
    // Observer for single elements
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(function(el) {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // About section elements
    const aboutImage = document.querySelector('.about-image');
    if (aboutImage) {
        aboutImage.classList.add('animate-on-scroll', 'animate-left');
        observer.observe(aboutImage);
    }

    const aboutText = document.querySelector('.about-text');
    if (aboutText) {
        aboutText.classList.add('animate-on-scroll', 'animate-right');
        observer.observe(aboutText);
    }

    // Contact elements
    const contactCard = document.querySelector('.contact-card');
    if (contactCard) {
        contactCard.classList.add('animate-on-scroll', 'animate-left');
        observer.observe(contactCard);
    }

    const contactForm = document.querySelector('.contact-form-wrapper');
    if (contactForm) {
        contactForm.classList.add('animate-on-scroll', 'animate-right');
        observer.observe(contactForm);
    }

    // Staggered animations for grids
    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) {
        servicesGrid.classList.add('animate-stagger');
        observer.observe(servicesGrid);
    }

    const whyGrid = document.querySelector('.why-grid');
    if (whyGrid) {
        whyGrid.classList.add('animate-stagger');
        observer.observe(whyGrid);
    }

    // Hero animation
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

        setTimeout(function() {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        let current = '';

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Contact Form Handling
 */
function initContactForm() {
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = {};

            formData.forEach(function(value, key) {
                data[key] = value;
            });

            // Validate form
            if (!validateForm(data)) {
                return;
            }

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Wysyłanie...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual endpoint)
            setTimeout(function() {
                // Reset form
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Show success message
                showFormMessage('success', 'Dziękujemy za wiadomość! Odpowiemy najszybciej jak to możliwe.');
            }, 1500);

            // For actual implementation, use fetch API:
            /*
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                showFormMessage('success', 'Dziękujemy za wiadomość!');
            })
            .catch(error => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                showFormMessage('error', 'Wystąpił błąd. Spróbuj ponownie później.');
            });
            */
        });
    }
}

/**
 * Form Validation
 */
function validateForm(data) {
    const errors = [];

    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Proszę podać imię i nazwisko');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Proszę podać prawidłowy adres e-mail');
    }

    // Message validation
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Wiadomość musi zawierać co najmniej 10 znaków');
    }

    // Privacy checkbox
    if (!data.privacy) {
        errors.push('Wymagana jest zgoda na przetwarzanie danych osobowych');
    }

    if (errors.length > 0) {
        showFormMessage('error', errors.join('<br>'));
        return false;
    }

    return true;
}

/**
 * Show Form Message
 */
function showFormMessage(type, message) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = 'form-message form-message-' + type;
    messageEl.innerHTML = message;

    // Style the message
    messageEl.style.cssText = type === 'success'
        ? 'padding: 1rem; margin-bottom: 1rem; background: #c6f6d5; color: #22543d; border-radius: 8px;'
        : 'padding: 1rem; margin-bottom: 1rem; background: #fed7d7; color: #742a2a; border-radius: 8px;';

    // Insert before form
    const form = document.getElementById('contact-form');
    form.parentNode.insertBefore(messageEl, form);

    // Scroll to message
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Auto-remove success message
    if (type === 'success') {
        setTimeout(function() {
            messageEl.remove();
        }, 5000);
    }
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                event.preventDefault();

                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Phone number formatting (Polish format)
 */
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');

    if (value.length > 9) {
        value = value.substring(0, 9);
    }

    if (value.length > 6) {
        value = value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6);
    } else if (value.length > 3) {
        value = value.substring(0, 3) + ' ' + value.substring(3);
    }

    input.value = value;
}

// Add phone formatting to phone input
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function() {
        formatPhoneNumber(this);
    });
}
