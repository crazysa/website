class DevBotController {
    constructor() {
        this.container = document.getElementById('devbot-container');
        this.bot = document.getElementById('devbot');
        this.speechBubble = document.querySelector('.devbot-speech-bubble');

        // Settings
        this.baseY = 20;
        this.minX = 50;
        this.maxX = window.innerWidth - 150;
        this.currentSection = 'home';
        this.targetX = 100;
        this.currentX = -200;
        this.mouseNear = false;
        this.isInteracting = false;
        this.isMobile = window.innerWidth <= 768;

        this.phrases = {
            home: [
                "Hi! I'm Shubham.",
                "Welcome to my lab!",
                "Check out my research below.",
                "I build scalable systems."
            ],
            experience: [
                "Researching at Deepen.AI...",
                "Optimizing costs... done!",
                "Validating hypothesis...",
                "Financial data integrity is key.",
                "I saved $72,000 annually here!"
            ],
            skills: [
                "Python is my primary tool.",
                "Deep Learning... fascinating.",
                "OpenCV sees everything.",
                "Algorithms are beautiful.",
                "Let's optimize this code."
            ],
            contact: [
                "Let's collaborate!",
                "Send me a signal.",
                "Awaiting your data packet.",
                "Check out my GitHub."
            ],
            click: [
                "Eureka!",
                "Experiment successful!",
                "Systems nominal.",
                "Hello there!"
            ]
        };

        this.init();
    }

    init() {
        window.addEventListener('resize', () => {
            this.maxX = window.innerWidth - 150;
            this.isMobile = window.innerWidth <= 768;
            if(this.isMobile) {
                // Reset position on mobile to be fixed
                this.currentX = window.innerWidth - 80;
                this.container.style.left = '';
                this.container.style.right = '10px';
            }
        });

        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));

        this.setupIntersectionObserver();
        this.container.addEventListener('click', () => this.handleClick());

        // Removed Jetpack dynamic injection as it doesn't fit the Professor theme

        this.animate();

        setTimeout(() => {
            this.container.classList.add('visible');
            if(!this.isMobile) {
                this.walkTo(100, () => {
                    this.wave();
                    this.speak("Hi! I'm Shubham.");
                });
            } else {
                this.speak("Hi! I'm Shubham.");
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
        const options = { threshold: 0.2 }; // Lower threshold for earlier detection
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setSection(entry.target.id);
                }
            });
        }, options);

        document.querySelectorAll('section, header').forEach(section => observer.observe(section));
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
                this.wave();
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
                this.setProp('sign');
                this.setEmotion('love');
                this.walkTo(window.innerWidth / 2 - 60);
                break;
            default:
                this.setEmotion('normal');
        }
    }

    speak(text, duration = 3000) {
        if(!this.speechBubble) return;

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
                this.walkTo(this.currentX + (runDir * 50));
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
        this.wave(); // Wave instead of fly

        setTimeout(() => {
            this.isInteracting = false;
            this.setEmotion('normal');
        }, 2000);
    }

    walkTo(x, callback) {
        if (this.isMobile) return; // No walking on mobile

        x = Math.max(this.minX, Math.min(x, this.maxX));
        this.targetX = x;
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

            // Only walk now, no flying
            const randomX = Math.random() * (this.maxX - this.minX) + this.minX;
            this.walkTo(randomX, () => {
                setTimeout(patrol, Math.random() * 4000 + 3000);
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
        this.container.classList.remove('show-magnifier', 'show-sign');
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
        this.container.classList.remove('flying');
    }

    wave() {
        this.bot.classList.add('devbot-waving');
        setTimeout(() => {
            this.bot.classList.remove('devbot-waving');
        }, 2000);
    }

    animate() {
        if (this.isMoving && !this.isMobile) {
            const speed = this.currentSection === 'skills' ? 4 : 2;
            const dx = this.targetX - this.currentX;

            if (Math.abs(dx) < speed) {
                this.currentX = this.targetX;
                this.isMoving = false;
                this.bot.classList.remove('devbot-walking');
                this.bot.classList.add('devbot-idle');
                if (this.onMoveComplete) {
                    const cb = this.onMoveComplete;
                    this.onMoveComplete = null;
                    cb();
                }
            } else {
                this.currentX += Math.sign(dx) * speed;
                this.bot.classList.remove('devbot-idle');
                this.bot.classList.add('devbot-walking');
            }

            this.container.style.left = `${this.currentX}px`;
        } else {
             this.bot.classList.add('devbot-idle');
        }

        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.devBot = new DevBotController();
});
