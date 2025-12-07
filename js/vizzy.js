document.addEventListener('DOMContentLoaded', () => {
    const vizzyContainer = document.createElement('div');
    vizzyContainer.className = 'vizzy-container';
    vizzyContainer.innerHTML = `
        <div class="vizzy-speech-bubble" id="vizzy-speech">Hi! Need help?</div>
        <div class="vizzy-menu" id="vizzy-menu">
            <ul class="vizzy-menu-links">
                <li><a href="mailto:sragarwal@outlook.in"><i class="fas fa-envelope"></i> Email Me</a></li>
                <li><a href="https://www.linkedin.com/in/shubam-agarwal/" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a></li>
                <li><a href="assets/resume.pdf" download><i class="fas fa-file-download"></i> Resume</a></li>
            </ul>
        </div>
        <div class="vizzy-widget" id="vizzy-widget">
            <!-- Inject SVG Here -->
        </div>
    `;

    // Load SVG content
    fetch('assets/svg/vizzy.svg')
        .then(response => response.text())
        .then(svgContent => {
            const widget = vizzyContainer.querySelector('#vizzy-widget');
            if (widget) {
                widget.innerHTML = svgContent;
            }
            // Add to body
            document.body.appendChild(vizzyContainer);
            initVizzyInteractions();
        });
});

function initVizzyInteractions() {
    const widget = document.getElementById('vizzy-widget');
    const menu = document.getElementById('vizzy-menu');
    const bubble = document.getElementById('vizzy-speech');
    const pupil = document.querySelector('.vizzy-pupil');

    // Toggle menu
    widget.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('active');
        const isExpanded = menu.classList.contains('active');
        localStorage.setItem('vizzy_expanded', isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!widget.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('active');
        }
    });

    // Restore state
    if (localStorage.getItem('vizzy_expanded') === 'true') {
        menu.classList.add('active');
    }

    // Hover effects
    widget.addEventListener('mouseenter', () => {
        bubble.textContent = "Quick Links";
        bubble.classList.add('visible');
    });

    widget.addEventListener('mouseleave', () => {
        bubble.classList.remove('visible');
    });

    // Scroll Tracking
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        const direction = st > lastScrollTop ? 'down' : 'up';

        // Move pupil based on scroll direction
        if (pupil) {
            const yOffset = direction === 'down' ? 2 : -2;
            pupil.setAttribute('cy', 55 + yOffset);

            // Reset after delay
            setTimeout(() => {
                pupil.setAttribute('cy', 55);
            }, 500);
        }
        lastScrollTop = st <= 0 ? 0 : st;
    });

    // Intersection Observer for metrics to trigger "Excited" state
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                widget.classList.add('vizzy-impressed');
                bubble.textContent = "Wow! Look at that!";
                bubble.classList.add('visible');
                setTimeout(() => {
                    widget.classList.remove('vizzy-impressed');
                    bubble.classList.remove('visible');
                }, 3000);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.metric-value, .project-metric, .highlight').forEach(el => observer.observe(el));
}
