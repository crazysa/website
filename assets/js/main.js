/* ============================================
   SHUBHAM AGARWAL - PORTFOLIO WEBSITE
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initScrollProgress();
    initNavigation();
    initMobileMenu();
    initCounterAnimation();
    initExperienceCards();
    initRecruiterTools();
    initFloatingWidget();
    initBackToTop();
    initProgressBars();
    initAOS();
});

/* ============================================
   SCROLL PROGRESS BAR
   ============================================ */

function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    });
}

/* ============================================
   NAVIGATION
   ============================================ */

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section, header');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active link highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

/* ============================================
   MOBILE MENU
   ============================================ */

function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileLinks = document.querySelectorAll('.mobile-menu__nav a');

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenuClose.addEventListener('click', closeMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (hamburger) hamburger.classList.remove('open');
    if (mobileMenu) mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */

function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    animateCounter(entry.target);
                }, index * 150);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutExpo(progress);
        const current = Math.floor(target * eased);
        
        element.textContent = prefix + current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = prefix + target + suffix;
        }
    }

    requestAnimationFrame(update);
}

function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

/* ============================================
   EXPERIENCE CARDS
   ============================================ */

function initExperienceCards() {
    const cards = document.querySelectorAll('.experience-card');

    cards.forEach(card => {
        const header = card.querySelector('.experience-card__header');
        const toggle = card.querySelector('.experience-card__toggle');
        const body = card.querySelector('.experience-card__body');
        const moreToggle = card.querySelector('.more-toggle');
        const moreContent = card.querySelector('.more-content');
        const meaningToggle = card.querySelector('.meaning-toggle');
        const meaningContent = card.querySelector('.meaning-content');

        // Header click to expand/collapse
        if (header && toggle) {
            header.addEventListener('click', () => {
                const isActive = card.classList.contains('experience-card--active');
                
                if (isActive) {
                    card.classList.remove('experience-card--active');
                    toggle.setAttribute('aria-expanded', 'false');
                    if (body) body.hidden = true;
                } else {
                    card.classList.add('experience-card--active');
                    toggle.setAttribute('aria-expanded', 'true');
                    if (body) body.hidden = false;
                }
            });
        }

        // More achievements toggle
        if (moreToggle && moreContent) {
            moreToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                moreToggle.classList.toggle('open');
                moreContent.hidden = !moreContent.hidden;
                const span = moreToggle.querySelector('span');
                if (span) {
                    span.textContent = moreContent.hidden ? '+ Show 8 more achievements' : '- Show less';
                }
            });
        }

        // Meaning toggle
        if (meaningToggle && meaningContent) {
            meaningToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                meaningContent.hidden = !meaningContent.hidden;
            });
        }
    });
}

/* ============================================
   RECRUITER TOOLS
   ============================================ */

function initRecruiterTools() {
    const copySummaryBtn = document.getElementById('copySummary');
    const copyEmailBtn = document.getElementById('copyEmail');
    const customSummaryBtn = document.getElementById('customSummaryBtn');
    const modal = document.getElementById('customSummaryModal');
    const modalClose = modal?.querySelector('.modal__close');
    const modalBackdrop = modal?.querySelector('.modal__backdrop');
    const copyCustomBtn = document.getElementById('copyCustomSummary');
    const checkboxes = document.querySelectorAll('.skill-checkboxes input[type="checkbox"]');

    // Copy summary
    if (copySummaryBtn) {
        copySummaryBtn.addEventListener('click', () => {
            const summary = document.getElementById('recruiterSummary').textContent.trim();
            copyToClipboard(summary);
            showToast('✓ Summary copied to clipboard!');
        });
    }

    // Copy email template
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const emailTemplate = `Subject: Senior CV Engineer - Shubham Agarwal | $72K Savings Track Record

Hi [Name],

I came across your role for [Position] and believe my background in Computer Vision and ML systems would be a strong fit.

Key highlights:
• $72,000 annual cost savings through Azure optimization at Deepen.AI
• 500% performance improvement over industry-standard CV solutions
• Led team of 5 engineers for camera calibration system (1mm accuracy)
• 5+ years shipping CV systems from research to production

I'm currently at Deepen.AI (2.5+ years) and available with 30-day notice.

Would love to discuss how I can bring similar results to [Company].

Best,
Shubham Agarwal
LinkedIn: linkedin.com/in/shubam-agarwal
Website: crazysa.github.io/website
Email: sragarwal@outlook.in`;

            copyToClipboard(emailTemplate);
            showToast('✓ Email template copied!');
        });
    }

    // Open custom summary modal
    if (customSummaryBtn && modal) {
        customSummaryBtn.addEventListener('click', () => {
            modal.hidden = false;
            updateGeneratedSummary();
        });
    }

    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', () => modal.hidden = true);
    }
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', () => modal.hidden = true);
    }

    // Update generated summary on checkbox change
    checkboxes.forEach(cb => {
        cb.addEventListener('change', updateGeneratedSummary);
    });

    // Copy custom summary
    if (copyCustomBtn) {
        copyCustomBtn.addEventListener('click', () => {
            const summary = document.getElementById('generatedSummaryText').textContent;
            copyToClipboard(summary);
            showToast('✓ Custom summary copied!');
            modal.hidden = true;
        });
    }
}

function updateGeneratedSummary() {
    const checkboxes = document.querySelectorAll('.skill-checkboxes input[type="checkbox"]:checked');
    const skills = Array.from(checkboxes).map(cb => cb.value);
    const summaryEl = document.getElementById('generatedSummaryText');
    
    if (skills.length === 0) {
        summaryEl.textContent = 'Please select at least one skill.';
        return;
    }

    const skillList = skills.join(', ');
    const highlights = [];
    
    if (skills.includes('Cost Optimization') || skills.includes('Cloud (Azure/AWS)')) {
        highlights.push('$72K annual cost savings');
    }
    if (skills.includes('Computer Vision') || skills.includes('OpenCV')) {
        highlights.push('500% performance improvement');
    }
    if (skills.includes('Team Leadership')) {
        highlights.push('led 5-person team to achieve 1mm calibration accuracy');
    }

    let summary = `Senior CV/ML Engineer with expertise in ${skillList}`;
    if (highlights.length > 0) {
        summary += `, demonstrated by ${highlights.join(' and ')}`;
    }
    summary += '. 5+ YoE | Hyderabad/Remote | 30-day notice.';
    
    summaryEl.textContent = summary;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
        console.error('Failed to copy:', err);
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('visible');
    
    setTimeout(() => {
        toast.classList.remove('visible');
    }, 3000);
}

/* ============================================
   FLOATING WIDGET
   ============================================ */

function initFloatingWidget() {
    const widget = document.getElementById('floatingWidget');
    if (!widget) return;

    const trigger = widget.querySelector('.floating-widget__trigger');
    const closeBtn = widget.querySelector('.floating-widget__close');
    const storageKey = 'vizzy-widget-dismissed';

    // Check if dismissed
    if (localStorage.getItem(storageKey) === 'true') {
        widget.style.display = 'none';
        return;
    }

    trigger.addEventListener('click', () => {
        const state = widget.dataset.state;
        widget.dataset.state = state === 'collapsed' ? 'expanded' : 'collapsed';
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        localStorage.setItem(storageKey, 'true');
        widget.style.opacity = '0';
        setTimeout(() => widget.style.display = 'none', 300);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!widget.contains(e.target)) {
            widget.dataset.state = 'collapsed';
        }
    });
}

/* ============================================
   BACK TO TOP
   ============================================ */

function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ============================================
   PROGRESS BARS (Skills)
   ============================================ */

function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    if (progressBars.length === 0) return;

    const observerOptions = {
        threshold: 0.5
    };

    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const percent = bar.dataset.percent || 0;
                bar.style.width = `${percent}%`;
                progressObserver.unobserve(bar);
            }
        });
    }, observerOptions);

    progressBars.forEach(bar => progressObserver.observe(bar));
}

/* ============================================
   AOS (Animate On Scroll)
   ============================================ */

function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 50
        });
    }
}

/* ============================================
   VIZZY EASTER EGG
   ============================================ */

let vizzyClickCount = 0;
let vizzyClickTimer;

document.querySelectorAll('.vizzy, .vizzy-mini, .vizzy-tiny').forEach(vizzy => {
    vizzy.addEventListener('click', () => {
        vizzyClickCount++;
        clearTimeout(vizzyClickTimer);

        if (vizzyClickCount >= 5) {
            triggerEasterEgg();
            vizzyClickCount = 0;
        }

        vizzyClickTimer = setTimeout(() => {
            vizzyClickCount = 0;
        }, 2000);
    });
});

function triggerEasterEgg() {
    // Create confetti
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'confetti-particle';
        particle.style.setProperty('--x', Math.random());
        particle.style.setProperty('--delay', Math.random() * 0.5);
        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 3000);
    }

    // Show message
    showToast("🤖 You found me! I'd hire Shubham. But I'm biased—he built me!");
}

/* ============================================
   ANALYTICS HELPERS (Optional)
   ============================================ */

function trackEvent(eventName, properties = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    console.log('Track:', eventName, properties);
}

// Track resume downloads
document.querySelectorAll('a[download]').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('resume_download', { 
            location: link.closest('section')?.id || 'unknown' 
        });
    });
});

// Track contact clicks
document.querySelectorAll('a[href^="mailto:"], a[href*="linkedin"]').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('contact_click', {
            type: link.href.includes('mailto') ? 'email' : 'linkedin'
        });
    });
});
