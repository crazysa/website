class DevBotController {
    constructor() {
        this.container = document.getElementById('devbot-container');
        this.bot = document.getElementById('devbot');
        this.eyes = document.querySelectorAll('.devbot-eye');

        // Settings
        this.baseY = 20; // Bottom position px
        this.minX = 50;
        this.maxX = window.innerWidth - 150;
        this.idleTime = 0;
        this.isMoving = false;
        this.currentSection = 'home';
        this.targetX = 100;
        this.currentX = -200; // Start off-screen
        this.mouseNear = false;
        this.isInteracting = false;

        // Initialize
        this.init();
    }

    init() {
        // Event Listeners
        window.addEventListener('resize', () => {
            this.maxX = window.innerWidth - 150;
        });

        // Mouse Tracking
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));

        // Scroll/Section Detection
        this.setupIntersectionObserver();

        // Click Interaction
        this.container.addEventListener('click', () => this.handleClick());

        // Start Loop
        this.animate();

        // Initial Entrance
        setTimeout(() => {
            this.container.classList.add('visible');
            this.walkTo(100, () => {
                this.wave();
            });
        }, 1000);
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.4
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setSection(entry.target.id);
                }
            });
        }, options);

        document.querySelectorAll('section, header').forEach(section => {
            observer.observe(section);
        });
    }

    setSection(sectionId) {
        if (this.currentSection === sectionId) return;
        this.currentSection = sectionId;
        this.resetState();

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
                // Walk fast back and forth
                this.startPatrol(true);
                break;
            case 'contact':
                this.setProp('sign');
                this.setEmotion('love');
                this.walkTo(window.innerWidth / 2 - 60); // Center
                break;
            default:
                this.setEmotion('normal');
        }
    }

    handleMouseMove(e) {
        if (this.isInteracting) return;

        const rect = this.container.getBoundingClientRect();
        const botX = rect.left + rect.width / 2;
        const botY = rect.top + rect.height / 2;

        const dist = Math.hypot(e.clientX - botX, e.clientY - botY);

        if (dist < 150) {
            // Close proximity behavior
            if (!this.mouseNear) {
                this.mouseNear = true;
                this.setEmotion('surprised');
                // Back away slightly
                const runDir = e.clientX < botX ? 1 : -1;
                this.walkTo(this.currentX + (runDir * 50));
            }
        } else {
            if (this.mouseNear) {
                this.mouseNear = false;
                this.setEmotion('normal');
            }

            // Look at cursor logic could go here (css transform eyes)
        }
    }

    handleClick() {
        this.isInteracting = true;
        this.setEmotion('happy');
        this.bot.classList.add('devbot-waving');

        // Jump animation
        this.container.style.transform = `translateY(-50px)`;
        setTimeout(() => {
            this.container.style.transform = `translateY(0)`;
        }, 200);

        setTimeout(() => {
            this.bot.classList.remove('devbot-waving');
            this.setEmotion('normal');
            this.isInteracting = false;
        }, 1500);
    }

    walkTo(x, callback) {
        // Clamp X
        x = Math.max(this.minX, Math.min(x, this.maxX));
        this.targetX = x;
        this.isMoving = true;

        // Determine direction
        if (this.targetX > this.currentX) {
            this.container.classList.remove('face-left');
        } else {
            this.container.classList.add('face-left');
        }

        this.onMoveComplete = callback;
    }

    startPatrol(fast = false) {
        // Simple random walk behavior
        const patrol = () => {
            if (this.currentSection !== 'experience' && this.currentSection !== 'skills') return;

            const randomX = Math.random() * (this.maxX - this.minX) + this.minX;
            this.walkTo(randomX, () => {
                setTimeout(patrol, Math.random() * 3000 + 1000);
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
    }

    wave() {
        this.bot.classList.add('devbot-waving');
        setTimeout(() => {
            this.bot.classList.remove('devbot-waving');
        }, 2000);
    }

    animate() {
        // Animation Loop
        if (this.isMoving) {
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

// Initialize when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    window.devBot = new DevBotController();
});
