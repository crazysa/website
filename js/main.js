document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
    });

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Toggle hamburger icon
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'var(--secondary-color)';
                navLinks.style.padding = '2rem';
                navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                navLinks.style.display = 'none';
            }
        });
    }

    // Scroll Progress Bar
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = scrolled + "%";
        }

        // Navbar blur effect
        const navbar = document.querySelector('.navbar');
        if (winScroll > 50) {
            navbar.style.boxShadow = '0 10px 30px -10px rgba(2, 12, 27, 0.7)';
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '1rem 0';
        }
    });

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    hamburger.click();
                }
            }
        });
    });

    // Metric Counters Animation
    const metrics = document.querySelectorAll('.metric-value');
    const animateMetrics = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const start = 0;
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Ease out quart
                    const ease = 1 - Math.pow(1 - progress, 4);

                    const currentVal = Math.floor(ease * target);

                    // Format number (e.g., 72K, 300K)
                    let displayVal = currentVal;
                    if (target >= 1000) {
                        displayVal = (currentVal / 1000).toFixed(1) + 'K';
                    }

                    // Specific formatting based on context (handled by separate span logic or text append)
                    // But here we are just updating the number.
                    // Let's stick to raw number and let CSS/HTML handle units?
                    // The HTML has label below. The prompt says "$72K", "500%", "300K+".
                    // Let's just animate the number part and append suffix if needed.

                    // Actually, simpler approach:
                    entry.target.innerText = currentVal;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        // Finalize with suffix if needed (hardcoded for now based on prompt logic or data attributes)
                        if (target === 72) entry.target.innerText = '$' + target + 'K';
                        else if (target === 500) entry.target.innerText = target + '%';
                        else if (target === 300) entry.target.innerText = target + 'K+';
                        else if (target === 5) entry.target.innerText = target + '+';
                    }
                };

                requestAnimationFrame(updateCount);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    metrics.forEach(metric => animateMetrics.observe(metric));

    // Calculate Duration
    const deepnStart = new Date('2022-04-01');
    const now = new Date();
    let years = now.getFullYear() - deepnStart.getFullYear();
    let months = now.getMonth() - deepnStart.getMonth();
    if (months < 0) {
        years--;
        months += 12;
    }
    const durationText = `${years} yrs ${months} mos`;
    const durEl = document.getElementById('dur-deepen');
    if (durEl) durEl.innerText = durationText;

});
