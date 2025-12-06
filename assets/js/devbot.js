class DevBotController {
    constructor() {
        this.container = document.getElementById('devbot-container');
        this.bot = document.getElementById('devbot');
        this.eyes = document.querySelectorAll('.devbot-eye');
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
                "Hire him! He's great.",
                "Send a message!",
                "I promise to deliver your email.",
                "Let's build something together."
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

        // Add Jetpack flames dynamically
        const jetpack = document.createElement('div');
        jetpack.className = 'devbot-jetpack';
        jetpack.innerHTML = '<div class="jet-flame left"></div><div class="jet-flame right"></div>';
        this.bot.querySelector('.devbot-body').prepend(jetpack);

        this.animate();

        setTimeout(() => {
            this.container.classList.add('visible');
            if(!this.isMobile) {
                this.walkTo(100, () => {
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

        // Jetpack Jump
        this.container.classList.add('flying');
        this.container.style.transform = `translateY(-100px)`;

        setTimeout(() => {
            this.container.style.transform = `translateY(0)`;
            this.container.classList.remove('flying');
            this.isInteracting = false;
            this.setEmotion('normal');
        }, 1000);
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

            // Random chance to fly instead of walk
            if (Math.random() > 0.7) {
                this.container.classList.add('flying');
                setTimeout(() => this.container.classList.remove('flying'), 2000);
            }

            const randomX = Math.random() * (this.maxX - this.minX) + this.minX;
            this.walkTo(randomX, () => {
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
