document.addEventListener('DOMContentLoaded', () => {
    // 1. VIZZY SETUP
    const vizzyContainer = document.createElement('div');
    vizzyContainer.className = 'vizzy-container floating-widget';
    vizzyContainer.id = 'floatingWidget';
    vizzyContainer.dataset.state = 'collapsed';

    // Check localStorage
    if (localStorage.getItem('vizzy-widget-dismissed') === 'true') {
        vizzyContainer.style.display = 'none';
    }

    vizzyContainer.innerHTML = `
        <!-- Collapsed State -->
        <button class="floating-widget__trigger" aria-label="Quick actions">
             <div class="vizzy-wrapper-widget"></div>
        </button>

        <!-- Expanded State -->
        <div class="floating-widget__panel">
            <div class="floating-widget__header">
            <span class="floating-widget__title">Quick Links</span>
            <button class="floating-widget__close" aria-label="Close widget">×</button>
            </div>

            <div class="floating-widget__links">
            <a href="mailto:sragarwal@outlook.in" class="floating-widget__link">
                <span class="icon">📧</span>
                <span class="label">Email</span>
            </a>
            <a href="https://www.linkedin.com/in/shubam-agarwal/" target="_blank" class="floating-widget__link">
                <span class="icon">💼</span>
                <span class="label">LinkedIn</span>
            </a>
            <a href="assets/Shubham_Agarwal_Resume.pdf" download class="floating-widget__link">
                <span class="icon">📄</span>
                <span class="label">Resume</span>
            </a>
            </div>
        </div>
    `;

    document.body.appendChild(vizzyContainer);

    // Load SVG content for Widget and other placeholders
    fetch('assets/svg/vizzy.svg')
        .then(response => response.text())
        .then(svgContent => {
            // Widget
            const widgetWrapper = vizzyContainer.querySelector('.vizzy-wrapper-widget');
            if (widgetWrapper) {
                widgetWrapper.innerHTML = svgContent;
                widgetWrapper.querySelector('svg').classList.add('vizzy', 'vizzy-idle');
            }

            // Hero
            const heroWrapper = document.querySelector('.vizzy-hero-wrapper');
            if (heroWrapper) {
                 heroWrapper.innerHTML = svgContent;
                 const heroSvg = heroWrapper.querySelector('svg');
                 if(heroSvg) {
                     heroSvg.classList.add('vizzy', 'vizzy--curious');
                 }
            }

            // Footer
            const footerVizzy = document.querySelector('.vizzy--farewell');
            if (footerVizzy) {
                // It's likely an <svg> tag in HTML waiting for content if we used inline SVG there?
                // Or we can replace the parent.
                // The footer HTML structure uses <svg class="vizzy vizzy--tiny vizzy--farewell">...</svg>
                // So let's find the parent and inject.
                const footerParent = footerVizzy.parentElement;
                if(footerParent) {
                    footerParent.innerHTML = svgContent + '<span class="vizzy-tooltip">Thanks for scrolling! 👋</span>';
                    const newSvg = footerParent.querySelector('svg');
                    newSvg.classList.add('vizzy', 'vizzy--tiny', 'vizzy--farewell'); // Add classes back
                }
            }

            initVizzyInteractions();
        });

    function initVizzyInteractions() {
        const widget = document.getElementById('floatingWidget');
        const trigger = widget.querySelector('.floating-widget__trigger');
        const closeBtn = widget.querySelector('.floating-widget__close');

        // Widget Toggle
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const state = widget.dataset.state;
            widget.dataset.state = state === 'collapsed' ? 'expanded' : 'collapsed';

            // Easter Egg Logic handled below
        });

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            localStorage.setItem('vizzy-widget-dismissed', 'true');
            widget.style.opacity = '0';
            setTimeout(() => widget.style.display = 'none', 300);
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!widget.contains(e.target)) {
                widget.dataset.state = 'collapsed';
            }
        });

        // SCROLL TRACKING (Eye Follow)
        const pupils = document.querySelectorAll('.vizzy-pupil');
        let lastScrollTop = 0;

        window.addEventListener('scroll', throttle(() => {
            const st = window.pageYOffset || document.documentElement.scrollTop;
            const direction = st > lastScrollTop ? 'down' : 'up';

            pupils.forEach(pupil => {
                const offset = direction === 'down' ? 3 : -3;
                pupil.style.transform = `translateY(${offset}px)`;
                setTimeout(() => pupil.style.transform = 'translateY(0)', 300);
            });
            lastScrollTop = st <= 0 ? 0 : st;
        }, 100));

        // INTERSECTION OBSERVERS FOR STATES

        // 1. Impressed (Near Metrics)
        const metricsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVizzyState('impressed');
                    setTimeout(() => resetVizzyState(), 3000);
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll('.metric-card').forEach(el => metricsObserver.observe(el));

        // 2. Thinking (Skills)
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVizzyState('thinking');
                }
            });
        }, { threshold: 0.2 });
        const skillsSection = document.getElementById('skills');
        if (skillsSection) skillsObserver.observe(skillsSection);

        // 3. Waving (Contact)
        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVizzyState('waving');
                    // Add speech bubble to contact vizzy if it exists
                }
            });
        }, { threshold: 0.2 });
        const contactSection = document.getElementById('contact');
        if (contactSection) contactObserver.observe(contactSection);

        // Easter Egg
        let clickCount = 0;
        let clickTimer;
        trigger.addEventListener('click', () => {
             clickCount++;
             clearTimeout(clickTimer);
             if (clickCount >= 5) {
                 triggerEasterEgg(trigger);
                 clickCount = 0;
             }
             clickTimer = setTimeout(() => clickCount = 0, 2000);
        });
    }

    function setVizzyState(state) {
        const svgs = document.querySelectorAll('.vizzy');
        svgs.forEach(svg => {
            // Remove all state classes
            svg.classList.remove('vizzy--curious', 'vizzy--impressed', 'vizzy--thinking', 'vizzy--waving');
            svg.classList.add(`vizzy--${state}`);
        });
    }

    function resetVizzyState() {
        const svgs = document.querySelectorAll('.vizzy');
        svgs.forEach(svg => {
             svg.classList.remove('vizzy--curious', 'vizzy--impressed', 'vizzy--thinking', 'vizzy--waving');
             // Default is handled by CSS or vizzy-idle
        });
    }

    function triggerEasterEgg(element) {
        element.style.animation = 'vizzy-spin 0.5s ease-out';
        setTimeout(() => element.style.animation = '', 500);
        createConfetti();
        // Show bubble logic could go here
        alert("You found me! Here's a secret: I'd hire Shubham. But I'm biased—he built me. 🤖");
    }

    function createConfetti() {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'confetti-particle';
            particle.style.setProperty('--x', Math.random());
            particle.style.setProperty('--delay', Math.random() * 0.5);
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 3000);
        }
    }

    // Throttle helper
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
});
