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
            'Senior Software & Research Engineer',
            'Computer Vision Specialist',
            'AI Researcher',
            'Systems Architect'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true
    });
}

// Initialize Vanilla Tilt
VanillaTilt.init(document.querySelectorAll(".contact-card, .skills-category, .timeline-item"), {
    max: 10,
    speed: 400,
    glare: true,
    "max-glare": 0.1,
    scale: 1.02
});
