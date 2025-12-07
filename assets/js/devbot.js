class DevBotController {
    constructor() {
        this.container = document.getElementById('devbot-container');
        this.bot = document.getElementById('devbot');
        this.eyes = document.querySelectorAll('.devbot-eye');
        this.speechBubble = document.querySelector('.devbot-speech-bubble');

        // Settings
        this.baseY = 20; // Default ground level
        this.minX = 50;
        this.maxX = window.innerWidth - 150;
        this.minY = 20;
        this.maxY = window.innerHeight - 200;

        this.currentSection = 'home';
        this.targetX = 100;
        this.currentX = -200;
        this.targetY = 20;
        this.currentY = 20;

        this.mouseNear = false;
        this.isInteracting = false;
        this.isMobile = window.innerWidth <= 768;
        this.lastStepTime = 0;
        this.stepInterval = 300; // ms

        this.phrases = {
            home: [
                "Hi! I'm DevBot.",
                "Welcome to Shubham's Portfolio!",
                "I live in this browser.",
                "Scroll down for cool stuff!"
            ],
            experience: [
                "Wow, Computer Vision at Deepen.AI!",
                "Analyzing lidar data... beep boop.",
                "Financial systems are complex!",
                "Look at those optimization metrics.",
                "I need a bigger magnifying glass."
            ],
            skills: [
                "I love Python!",
                "Deep Learning is my brain power.",
                "OpenCV helps me see you.",
                "So many algorithms!",
                "Do you speak Binary?"
            ],
            contact: [
                "Send a message!",
                "I promise to deliver your email.",
                "Let's build something together.",
                "Operators are standing by."
            ],
            click: [
                "Ouch! That tickles.",
                "High five!",
                "System Systems... nominal.",
                "You found a secret!"
            ]
        };

        this.init();
    }

    init() {
        window.addEventListener('resize', () => {
            this.maxX = window.innerWidth - 150;
            this.maxY = window.innerHeight - 200;
            this.isMobile = window.innerWidth <= 768;
            if(this.isMobile) {
                // Reset position on mobile to be fixed
                this.currentX = window.innerWidth - 80;
                this.currentY = 20;
                this.container.style.left = '';
                this.container.style.bottom = '20px';
                this.container.style.right = '10px';
            }
        });

        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));

        // Double click to flip
        this.container.addEventListener('dblclick', () => {
             this.bot.style.transition = 'transform 0.5s';
             this.bot.style.transform = 'rotate(360deg)';
             setTimeout(() => {
                 this.bot.style.transition = '';
                 this.bot.style.transform = '';
             }, 500);
             this.speak("Do a barrel roll!");
        });

        this.setupIntersectionObserver();
        this.container.addEventListener('click', () => this.handleClick());
        this.setupInteractiveElements();

        // Add Jetpack flames dynamically
        const jetpack = document.createElement('div');
        jetpack.className = 'devbot-jetpack';
        jetpack.innerHTML = '<div class="jet-flame left"></div><div class="jet-flame right"></div>';
        this.bot.querySelector('.devbot-body').prepend(jetpack);

        this.animate();

        setTimeout(() => {
            this.container.classList.add('visible');
            if(!this.isMobile) {
                this.walkTo(100, 20, () => {
                    this.wave();
                    this.speak("Hi! I'm DevBot.");
                });
            } else {
                this.speak("Hi! I'm DevBot.");
            }
        }, 1000);

        // Random idle speech loop
        setInterval(() => {
            if (!this.isMoving && Math.random() > 0.7) {
                this.speakRandom();
            }
        }, 10000);
    }

    setupIntersectionObserver() {
        const options = { threshold: 0.4 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setSection(entry.target.id);
                }
            });
        }, options);

        document.querySelectorAll('section, header').forEach(section => observer.observe(section));
    }

    setupInteractiveElements() {
        // Phone links
        document.querySelectorAll('a[href^="tel:"]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.setProp('phone');
                this.setEmotion('happy');
                this.speak("Calling...");
            });
            el.addEventListener('mouseleave', () => this.resetState());
        });

        // Email links
        document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.setProp('mail');
                this.setEmotion('happy');
                this.speak("You've got mail!");
            });
            el.addEventListener('mouseleave', () => this.resetState());
        });

        // Github
        document.querySelectorAll('a[href*="github.com"]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.setProp('code');
                this.setEmotion('happy');
                this.speak("Git push origin master!");
            });
            el.addEventListener('mouseleave', () => this.resetState());
        });

        // LinkedIn
        document.querySelectorAll('a[href*="linkedin.com"]').forEach(el => {
             el.addEventListener('mouseenter', () => {
                this.setEmotion('love');
                this.speak("Let's connect!");
            });
            el.addEventListener('mouseleave', () => this.resetState());
        });
    }

    setSection(sectionId) {
        if (this.currentSection === sectionId) return;
        this.currentSection = sectionId;
        this.resetState();

        // Speak something relevant
        setTimeout(() => this.speakRandom(sectionId), 500);

        // Mobile Behavior: Just stay put or bounce
        if (this.isMobile) {
            this.setEmotion(sectionId === 'contact' ? 'love' : 'normal');
            return;
        }

        // Desktop Behavior
        switch(sectionId) {
            case 'home':
                this.walkTo(100, 20, () => {
                    this.wave();
                });
                break;
            case 'experience':
                this.startPatrol();
                this.setProp('magnifier');
                break;
            case 'skills':
                this.setEmotion('happy');
                this.startPatrol(true);
                break;
            case 'contact':
                this.setEmotion('love');
                this.walkTo(window.innerWidth / 2 - 60, 100); // Fly up a bit in contact
                break;
            default:
                this.setEmotion('normal');
        }
    }

    speak(text, duration = 3000) {
        this.speechBubble.textContent = text;
        this.speechBubble.classList.add('visible');

        if (this.speechTimer) clearTimeout(this.speechTimer);
        this.speechTimer = setTimeout(() => {
            this.speechBubble.classList.remove('visible');
        }, duration);
    }

    speakRandom(section = this.currentSection) {
        const options = this.phrases[section] || this.phrases['home'];
        const text = options[Math.floor(Math.random() * options.length)];
        this.speak(text);
    }

    handleMouseMove(e) {
        if (this.isInteracting || this.isMobile) return;

        const rect = this.container.getBoundingClientRect();
        const botX = rect.left + rect.width / 2;
        const botY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - botX, e.clientY - botY);

        if (dist < 150) {
            if (!this.mouseNear) {
                this.mouseNear = true;
                this.setEmotion('surprised');
                const runDir = e.clientX < botX ? 1 : -1;
                // Run away horizontally, keep current Y
                this.walkTo(this.currentX + (runDir * 50), this.currentY);
            }
        } else {
            if (this.mouseNear) {
                this.mouseNear = false;
                this.setEmotion('normal');
            }
        }
    }

    handleClick() {
        this.isInteracting = true;
        this.setEmotion('happy');
        this.speakRandom('click');

        // Jetpack Jump (relative to current position)
        this.container.classList.add('flying');
        // Temporarily animate jump via transform
        this.container.style.transition = 'transform 0.5s ease';
        this.container.style.transform = `translateY(-100px)`;

        setTimeout(() => {
            this.container.style.transform = `translateY(0)`;
            setTimeout(() => {
                 this.container.style.transition = '';
                 this.container.classList.remove('flying');
                 this.isInteracting = false;
                 this.setEmotion('normal');
            }, 500);
        }, 500);
    }

    walkTo(x, y, callback) {
        if (this.isMobile) return; // No walking on mobile

        x = Math.max(this.minX, Math.min(x, this.maxX));
        y = Math.max(this.minY, Math.min(y, this.maxY)); // Ensure Y bounds

        this.targetX = x;
        this.targetY = y;
        this.isMoving = true;

        if (this.targetX > this.currentX) {
            this.container.classList.remove('face-left');
        } else {
            this.container.classList.add('face-left');
        }

        this.onMoveComplete = callback;
    }

    startPatrol(fast = false) {
        if (this.isMobile) return;

        const patrol = () => {
            if (this.currentSection !== 'experience' && this.currentSection !== 'skills') return;

            // Pick a random destination anywhere on screen
            const randomX = Math.random() * (this.maxX - this.minX) + this.minX;
            const randomY = Math.random() * (this.maxY - this.minY) + this.minY;

            this.walkTo(randomX, randomY, () => {
                setTimeout(patrol, Math.random() * 3000 + 2000);
            });
        };
        patrol();
    }

    setEmotion(emotion) {
        this.container.classList.remove('emotion-happy', 'emotion-surprised', 'emotion-love', 'emotion-dizzy');
        if (emotion !== 'normal') {
            this.container.classList.add(`emotion-${emotion}`);
        }
    }

    setProp(prop) {
        this.container.classList.remove('show-magnifier', 'show-phone', 'show-mail', 'show-code');
        if (prop) {
            this.container.classList.add(`show-${prop}`);
        }
    }

    resetState() {
        this.isMoving = false;
        this.bot.classList.remove('devbot-walking', 'devbot-waving');
        this.setEmotion('normal');
        this.setProp(null);
        this.onMoveComplete = null;
        // Don't remove flying here, let animate handle it based on Y
        this.isFlyingZigZag = false;
    }

    wave() {
        this.bot.classList.add('devbot-waving');
        setTimeout(() => {
            this.bot.classList.remove('devbot-waving');
        }, 2000);
    }

    addStep() {
        const step = document.createElement('div');
        step.className = 'magic-step';

        const rect = this.container.getBoundingClientRect();
        // Position at feet relative to viewport
        step.style.left = (rect.left + rect.width / 2 - 10) + 'px';
        step.style.top = (rect.bottom - 10) + 'px'; // Use top instead of bottom for accuracy

        document.body.appendChild(step);

        // Remove after animation
        setTimeout(() => {
            step.remove();
        }, 1000);
    }

    animate() {
        if (this.isMoving && !this.isMobile) {
            const speed = this.currentSection === 'skills' ? 4 : 2;

            const dx = this.targetX - this.currentX;
            const dy = this.targetY - this.currentY;
            const dist = Math.hypot(dx, dy);

            if (dist < speed) {
                // Arrived
                this.currentX = this.targetX;
                this.currentY = this.targetY;
                this.isMoving = false;
                this.bot.classList.remove('devbot-walking');
                this.bot.classList.add('devbot-idle');

                // If on ground, stop flying
                if (this.currentY <= 30) {
                    this.container.classList.remove('flying');
                }

                if (this.onMoveComplete) {
                    const cb = this.onMoveComplete;
                    this.onMoveComplete = null;
                    cb();
                }
            } else {
                // Moving
                const angle = Math.atan2(dy, dx);
                this.currentX += Math.cos(angle) * speed;
                this.currentY += Math.sin(angle) * speed;

                this.bot.classList.remove('devbot-idle');
                this.bot.classList.add('devbot-walking');

                // Always add magic steps when moving (even in air)
                // This creates the illusion of walking on magic steps
                const now = Date.now();
                if (now - this.lastStepTime > this.stepInterval) {
                     this.addStep();
                     this.lastStepTime = now;
                }
            }

            this.container.style.left = `${this.currentX}px`;
            this.container.style.bottom = `${this.currentY}px`;
        } else {
             this.bot.classList.add('devbot-idle');
        }

        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.devBot = new DevBotController();
});
