const Vizzy = {
    clickCount: 0,
    currentMood: 'idle',
    
    init: function() {
        this.injectVizzy();
        this.setupInteractions();
        this.setupSectionObserver();
    },
    
    getSVG: function(size) {
        size = size || 100;
        return `
        <svg viewBox="0 0 100 100" width="${size}" height="${size}" class="vizzy-svg">
            <defs>
                <linearGradient id="vizzyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#64ffda;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#52e0c4;stop-opacity:1" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            
            <!-- Antenna -->
            <line class="vizzy-antenna" x1="50" y1="15" x2="50" y2="5" stroke="#64ffda" stroke-width="2"/>
            <circle class="vizzy-antenna-tip" cx="50" cy="5" r="4" fill="#ffd700" filter="url(#glow)"/>
            
            <!-- Head/Body -->
            <rect class="vizzy-body" x="25" y="20" width="50" height="55" rx="12" fill="url(#vizzyGradient)"/>
            
            <!-- Eye (Camera Lens) -->
            <circle class="vizzy-eye" cx="50" cy="45" r="18" fill="#0a192f"/>
            <circle class="vizzy-eye-inner" cx="50" cy="45" r="12" fill="#112240"/>
            <circle class="vizzy-eye-lens" cx="50" cy="45" r="6" fill="#e6f1ff"/>
            <circle cx="53" cy="42" r="2" fill="white" opacity="0.8"/>
            
            <!-- Mouth -->
            <path class="vizzy-mouth" d="M 40 62 Q 50 68 60 62" stroke="#0a192f" stroke-width="2" fill="none" stroke-linecap="round"/>
            
            <!-- Arms -->
            <rect class="vizzy-arm vizzy-arm-left" x="15" y="35" width="8" height="25" rx="4" fill="#52e0c4"/>
            <rect class="vizzy-arm vizzy-arm-right" x="77" y="35" width="8" height="25" rx="4" fill="#52e0c4"/>
            
            <!-- Feet -->
            <ellipse cx="38" cy="82" rx="10" ry="5" fill="#52e0c4"/>
            <ellipse cx="62" cy="82" rx="10" ry="5" fill="#52e0c4"/>
        </svg>
        `;
    },
    
    injectVizzy: function() {
        const heroWrapper = document.querySelector('.vizzy-hero-wrapper');
        if (heroWrapper) {
            heroWrapper.innerHTML = `
                <div class="vizzy-container" id="vizzy-hero">
                    ${this.getSVG(120)}
                    <div class="vizzy-speech-bubble">Hi! I'm Vizzy! 👋</div>
                </div>
            `;
        }
        
        this.createFloatingWidget();
    },
    
    createFloatingWidget: function() {
        const widget = document.createElement('div');
        widget.className = 'floating-vizzy';
        widget.id = 'floating-vizzy';
        widget.innerHTML = `
            <div class="vizzy-container">
                ${this.getSVG(80)}
            </div>
        `;
        
        const panel = document.createElement('div');
        panel.className = 'floating-vizzy-panel';
        panel.id = 'floating-vizzy-panel';
        panel.innerHTML = `
            <a href="mailto:sragarwal@outlook.in">
                <i class="fas fa-envelope"></i>
                <span>Email Me</span>
            </a>
            <a href="https://linkedin.com/in/shubham-agarwal" target="_blank">
                <i class="fab fa-linkedin"></i>
                <span>LinkedIn</span>
            </a>
            <a href="assets/Shubham_Agarwal_Resume.pdf" download>
                <i class="fas fa-file-pdf"></i>
                <span>Resume</span>
            </a>
        `;
        
        document.body.appendChild(widget);
        document.body.appendChild(panel);
        
        widget.addEventListener('click', function() {
            panel.classList.toggle('active');
        });
        
        document.addEventListener('click', function(e) {
            if (!widget.contains(e.target) && !panel.contains(e.target)) {
                panel.classList.remove('active');
            }
        });
    },
    
    setupInteractions: function() {
        const self = this;
        
        document.querySelectorAll('.vizzy-container').forEach(function(container) {
            container.addEventListener('click', function() {
                self.clickCount++;
                
                if (self.clickCount >= 5) {
                    self.triggerEasterEgg();
                    self.clickCount = 0;
                }
            });
            
            container.addEventListener('mouseenter', function() {
                self.setMood(container, 'curious');
            });
            
            container.addEventListener('mouseleave', function() {
                self.setMood(container, 'idle');
            });
        });
    },
    
    setupSectionObserver: function() {
        const self = this;
        const vizzyHero = document.getElementById('vizzy-hero');
        if (!vizzyHero) return;
        
        const sections = document.querySelectorAll('section[id]');
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    
                    switch(sectionId) {
                        case 'hero':
                            self.setMood(vizzyHero, 'waving');
                            break;
                        case 'experience':
                        case 'projects':
                            self.setMood(vizzyHero, 'impressed');
                            break;
                        case 'skills':
                            self.setMood(vizzyHero, 'thinking');
                            break;
                        case 'contact':
                            self.setMood(vizzyHero, 'waving');
                            break;
                        default:
                            self.setMood(vizzyHero, 'idle');
                    }
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(function(section) {
            observer.observe(section);
        });
    },
    
    setMood: function(container, mood) {
        if (!container) return;
        
        container.classList.remove('vizzy-idle', 'vizzy-curious', 'vizzy-impressed', 'vizzy-thinking', 'vizzy-waving');
        container.classList.add('vizzy-' + mood);
        this.currentMood = mood;
    },
    
    triggerEasterEgg: function() {
        const colors = ['#64ffda', '#ffd700', '#60a5fa', '#4ade80', '#f97316'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -10px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                pointer-events: none;
                z-index: 10000;
                animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
            `;
            document.body.appendChild(confetti);
            
            setTimeout(function() {
                confetti.remove();
            }, 4000);
        }
        
        if (!document.getElementById('confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = `
                @keyframes confettiFall {
                    to {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    Vizzy.init();
});

