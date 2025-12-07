document.addEventListener('DOMContentLoaded', () => {
    // 1. VIZZY SETUP
    const vizzyContainer = document.createElement('div');
    vizzyContainer.className = 'vizzy-container';
    vizzyContainer.innerHTML = `
        <div class="vizzy-speech-bubble" id="vizzy-speech">Hi! Need help?</div>
        <div class="vizzy-widget" id="vizzy-widget">
            <!-- Inject SVG Here -->
        </div>
        <div class="vizzy-menu" id="vizzy-menu">
            <div class="vizzy-face-small">
               <!-- Small Vizzy Face Inject later -->
            </div>
            <ul class="vizzy-menu-links">
                <li><a href="mailto:sragarwal@outlook.in"><i class="fas fa-envelope"></i> Email Me</a></li>
                <li><a href="https://www.linkedin.com/in/shubam-agarwal/" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a></li>
                <li><a href="assets/resume.pdf" download><i class="fas fa-file-download"></i> Resume</a></li>
            </ul>
        </div>
    `;

    // Load SVG content for Widget
    fetch('assets/svg/vizzy.svg')
        .then(response => response.text())
        .then(svgContent => {
            const widget = vizzyContainer.querySelector('#vizzy-widget');
            if (widget) {
                widget.innerHTML = svgContent;
                // Add class for idle animation by default
                widget.classList.add('vizzy-idle');
            }
            // Add to body
            document.body.appendChild(vizzyContainer);
            initVizzyInteractions();

            // Also inject into Hero if placeholder exists and empty
            const heroWrapper = document.querySelector('.vizzy-hero-wrapper');
            if (heroWrapper) {
                 heroWrapper.innerHTML = svgContent;
                 const heroSvg = heroWrapper.querySelector('svg');
                 if(heroSvg) {
                     heroSvg.classList.add('vizzy-curious');
                 }
            }
        });

    // 2. INTERACTION LOGIC
    function initVizzyInteractions() {
        const widget = document.getElementById('vizzy-widget');
        const menu = document.getElementById('vizzy-menu');
        const bubble = document.getElementById('vizzy-speech');

        // Easter Egg State
        let clickCount = 0;
        let easterEggTriggered = false;

        // Toggle menu
        widget.addEventListener('click', (e) => {
            e.stopPropagation();

            // Easter Egg Logic
            clickCount++;
            if (clickCount >= 5 && !easterEggTriggered) {
                easterEggTriggered = true;
                triggerEasterEgg(widget, bubble);
                clickCount = 0;
                return;
            }
            setTimeout(() => clickCount = 0, 1000); // Reset count if not rapid

            // Normal Menu Toggle
            menu.classList.toggle('active');
            const isExpanded = menu.classList.contains('active');
            localStorage.setItem('vizzy_expanded', isExpanded);
        });

        // Restore state
        if (localStorage.getItem('vizzy_expanded') === 'true') {
            menu.classList.add('active');
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!widget.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove('active');
            }
        });

        // Hover effects
        widget.addEventListener('mouseenter', () => {
            if (!easterEggTriggered) {
                bubble.textContent = "Quick Links";
                bubble.classList.add('visible');
            }
        });

        widget.addEventListener('mouseleave', () => {
            if (!easterEggTriggered) {
                bubble.classList.remove('visible');
            }
        });

        // SCROLL TRACKING (Eye Follow)
        const pupils = document.querySelectorAll('.vizzy-pupil');
        let lastScrollTop = 0;

        window.addEventListener('scroll', () => {
            const st = window.pageYOffset || document.documentElement.scrollTop;
            const direction = st > lastScrollTop ? 'down' : 'up';

            pupils.forEach(pupil => {
                const baseCy = 55;
                const offset = direction === 'down' ? 3 : -3;
                pupil.setAttribute('cy', baseCy + offset);
                setTimeout(() => pupil.setAttribute('cy', baseCy), 300);
            });
            lastScrollTop = st <= 0 ? 0 : st;
        });

        // INTERSECTION OBSERVERS FOR STATES

        // 1. Impressed (Near Metrics)
        const metricsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVizzyState('impressed');
                    if (widget.contains(document.querySelector('.vizzy-idle'))) { // Only float text if widget is mostly idle
                         showBubble("Wow! Look at that!");
                    }
                    setTimeout(() => resetVizzyState(), 3000);
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll('.metric-value').forEach(el => metricsObserver.observe(el));

        // 2. Thinking (Skills)
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVizzyState('thinking');
                } else {
                    // Reset if leaving? No, let timeout handle or just leave it
                }
            });
        }, { threshold: 0.2 });
        const skillsSection = document.getElementById('skills');
        if (skillsSection) skillsObserver.observe(skillsSection);

        // 3. Waving (Contact)
        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVizzyState('waving'); // Custom class handling for wave
                    showBubble("I promise he checks his email! 🤖");
                }
            });
        }, { threshold: 0.2 });
        const contactSection = document.getElementById('contact');
        if (contactSection) contactObserver.observe(contactSection);

        // Helper Functions
        function setVizzyState(state) {
            const svgs = document.querySelectorAll('#vizzy-widget svg, .vizzy-hero-wrapper svg');
            svgs.forEach(svg => {
                svg.classList.remove('vizzy-idle', 'vizzy-curious', 'vizzy-impressed', 'vizzy-thinking');
                svg.classList.add(`vizzy-${state}`);
            });
        }

        function resetVizzyState() {
            const svgs = document.querySelectorAll('#vizzy-widget svg, .vizzy-hero-wrapper svg');
            svgs.forEach(svg => {
                svg.classList.remove('vizzy-impressed', 'vizzy-thinking');
                svg.classList.add('vizzy-idle');
            });
        }

        function showBubble(text) {
            bubble.textContent = text;
            bubble.classList.add('visible');
            setTimeout(() => bubble.classList.remove('visible'), 4000);
        }

        function triggerEasterEgg(widget, bubble) {
            widget.style.transition = 'transform 1s';
            widget.style.transform = 'rotate(360deg) scale(1.2)';
            bubble.textContent = "You found me! I'd hire Shubham. 🤖";
            bubble.classList.add('visible');

            // Confetti effect (simple CSS classes or JS creation)
            createConfetti();

            setTimeout(() => {
                widget.style.transform = 'none';
                bubble.classList.remove('visible');
                easterEggTriggered = false;
            }, 5000);
        }

        function createConfetti() {
            for (let i = 0; i < 30; i++) {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.bottom = '50px';
                confetti.style.right = '50px';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.background = ['#ff0', '#f00', '#0f0', '#00f'][Math.floor(Math.random()*4)];
                confetti.style.zIndex = '2000';
                document.body.appendChild(confetti);

                // Animate
                const destX = (Math.random() - 0.5) * 500;
                const destY = -Math.random() * 500;

                confetti.animate([
                    { transform: 'translate(0,0)', opacity: 1 },
                    { transform: `translate(${destX}px, ${destY}px) rotate(720deg)`, opacity: 0 }
                ], {
                    duration: 2000 + Math.random() * 1000,
                    easing: 'ease-out'
                }).onfinish = () => confetti.remove();
            }
        }
    }
});
