document.addEventListener('DOMContentLoaded', () => {
    // 1. AOS Init
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
    });

    // 2. Typed.js Init
    if (document.getElementById('typed-subtitle')) {
        new Typed('#typed-subtitle', {
            strings: [
                '5x faster.',
                'cost 6 figures less.',
                'actually ship to production.'
            ],
            typeSpeed: 40,
            backSpeed: 20,
            backDelay: 2000,
            startDelay: 1000,
            loop: true
        });
    }

    // 3. Navbar Sticky & Scroll Progress
    const navbar = document.querySelector('.navbar');
    const progressBar = document.querySelector('.scroll-progress');
    const backToTop = document.createElement('div');
    backToTop.id = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.className = 'back-to-top';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        // Progress Bar
        if (progressBar) progressBar.style.width = scrolled + "%";

        // Sticky Nav
        if (winScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to Top
        if (scrolled > 50) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 4. Metric Counters
    const metrics = document.querySelectorAll('.metric-value');
    const animateMetrics = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetStr = entry.target.getAttribute('data-target');
                const target = parseInt(targetStr);
                const duration = 2000;
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
                    const currentVal = Math.floor(ease * target);

                    // Formatting
                    let formatted = currentVal;
                    if (targetStr === '72') formatted = '$' + currentVal + 'K';
                    else if (targetStr === '500') formatted = currentVal + '%';
                    else if (targetStr === '300') formatted = currentVal + 'K+';
                    else if (targetStr === '5') formatted = currentVal + '+';

                    entry.target.innerText = formatted;

                    if (progress < 1) requestAnimationFrame(updateCount);
                };

                requestAnimationFrame(updateCount);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    metrics.forEach(metric => animateMetrics.observe(metric));

    // 5. Duration Calculator
    const deepnStart = new Date('2022-04-01');
    const now = new Date();
    let years = now.getFullYear() - deepnStart.getFullYear();
    let months = now.getMonth() - deepnStart.getMonth();
    if (months < 0) {
        years--;
        months += 12;
    }
    const durEl = document.getElementById('dur-deepen');
    if (durEl) durEl.innerText = `${years} yrs ${months} mos`;

    // 6. Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') ?
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';

            // Mobile styling injection
            if(navLinks.classList.contains('active')) {
                Object.assign(navLinks.style, {
                    display: 'flex', flexDirection: 'column', position: 'absolute',
                    top: '100%', left: '0', width: '100%', background: 'var(--bg-secondary)',
                    padding: '2rem', gap: '1.5rem', boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
                });
            } else {
                navLinks.style.display = 'none';
            }
        });
    }

    // Reset mobile menu on resize
    window.addEventListener('resize', () => {
        if(window.innerWidth > 768) {
            navLinks.style = ''; // clear inline styles
            navLinks.classList.remove('active');
            if(hamburger) hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});

// 7. Expandable Cards Logic
function toggleExpand(btn) {
    const details = btn.nextElementSibling;
    details.classList.toggle('open');
    if (details.classList.contains('open')) {
        btn.innerText = "- Show less";
    } else {
        btn.innerText = "+ Show more achievements & impact";
    }
}

// 8. Copy Summary Logic
function copySummary() {
    const text = document.getElementById('recruiter-text').innerText;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.action-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    });
}
