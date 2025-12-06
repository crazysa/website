// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Simple style change for active menu
        if (navLinks.classList.contains('active')) {
             Object.assign(navLinks.style, {
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                top: '70px',
                right: '0',
                backgroundColor: 'rgba(17, 34, 64, 0.95)',
                width: '100%',
                padding: '2rem',
                textAlign: 'center'
             });
        } else {
             navLinks.style.display = 'none';
        }
    });
}

// Reset nav style on resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'row';
        navLinks.style.position = 'static';
        navLinks.style.width = 'auto';
        navLinks.style.padding = '0';
        navLinks.style.backgroundColor = 'transparent';
        if (navLinks.classList.contains('active')) {
             navLinks.classList.remove('active');
        }
    } else {
         if (!navLinks.classList.contains('active')) {
             navLinks.style.display = 'none';
         }
    }
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = "0 10px 30px -10px rgba(2,12,27,0.7)";
    } else {
        navbar.style.boxShadow = "none";
    }
});

// ScrollSpy: Highlight active navbar link
const sections = document.querySelectorAll('section, header');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(a => {
        a.classList.remove('active-link');
        if (a.classList.contains(current)) {
            a.classList.add('active-link'); // Note: Need to add this class in CSS if not present
        }
        // Fallback for href check
        if (a.getAttribute('href') === `#${current}`) {
            a.classList.add('active-link');
        }
    });
});

// Back to Top Button Logic
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Initialize Typed.js
if (document.getElementById('typed-output')) {
    new Typed('#typed-output', {
        strings: [
            'Senior Software & Research Engineer', // Using & is fine now with delay
            'Computer Vision Specialist',
            'AI Researcher',
            'Systems Architect',
            'Generalist'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        startDelay: 1000, // Added delay to ensure page load doesn't cause glitch
        loop: true
    });
}

// Initialize Vanilla Tilt
VanillaTilt.init(document.querySelectorAll(".contact-card, .skills-category, .skill-card, .timeline-content"), {
    max: 10,
    speed: 400,
    glare: true,
    "max-glare": 0.1,
    scale: 1.02
});
