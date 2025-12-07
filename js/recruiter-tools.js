const RecruiterTools = {
    summary: "Senior CV Engineer with 6+ years experience. Key achievements: $72K annual cost savings (Azure optimization), 500% performance improvements, 300K+ hours automated, led team of 5 for camera calibration system with 1mm accuracy. Specializes in Computer Vision, VLMs, and Autonomous Vehicle AI. Currently at Deepen.AI.",
    
    init: function() {
        this.injectToolsUI();
        this.setupEventListeners();
    },
    
    injectToolsUI: function() {
        const placeholder = document.getElementById('recruiter-tools-placeholder');
        if (!placeholder) return;
        
        placeholder.innerHTML = `
            <div class="recruiter-tools" style="margin-bottom: 2rem;">
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button id="copy-summary-btn" class="btn btn--small" style="background: rgba(100, 255, 218, 0.1); color: var(--accent-primary); border: 1px solid rgba(100, 255, 218, 0.3);">
                        <i class="fas fa-copy"></i> Copy Summary
                    </button>
                    <button id="email-template-btn" class="btn btn--small" style="background: rgba(100, 255, 218, 0.1); color: var(--accent-primary); border: 1px solid rgba(100, 255, 218, 0.3);">
                        <i class="fas fa-envelope"></i> Email Template
                    </button>
                </div>
            </div>
        `;
    },
    
    setupEventListeners: function() {
        const self = this;
        
        const copyBtn = document.getElementById('copy-summary-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', function() {
                self.copySummary();
            });
        }
        
        const emailBtn = document.getElementById('email-template-btn');
        if (emailBtn) {
            emailBtn.addEventListener('click', function() {
                self.openEmailTemplate();
            });
        }
    },
    
    copySummary: function() {
        const self = this;
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(this.summary).then(function() {
                self.showToast('Summary copied to clipboard!');
            }).catch(function() {
                self.fallbackCopy(self.summary);
            });
        } else {
            this.fallbackCopy(this.summary);
        }
    },
    
    fallbackCopy: function(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            this.showToast('Summary copied to clipboard!');
        } catch (err) {
            this.showToast('Failed to copy. Please try again.');
        }
        
        document.body.removeChild(textarea);
    },
    
    openEmailTemplate: function() {
        const subject = encodeURIComponent("Opportunity for Senior CV Engineer - Shubham Agarwal");
        const body = encodeURIComponent(
            "Hi Shubham,\n\n" +
            "I came across your profile and was impressed by your background in Computer Vision and AI. " +
            "I'd like to discuss a potential opportunity that might interest you.\n\n" +
            "[Add details about the role/company here]\n\n" +
            "Would you be available for a brief call this week?\n\n" +
            "Best regards,\n" +
            "[Your Name]"
        );
        
        window.location.href = `mailto:sragarwal@outlook.in?subject=${subject}&body=${body}`;
    },
    
    showToast: function(message) {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--bg-card);
            color: var(--accent-primary);
            padding: 1rem 2rem;
            border-radius: 8px;
            border: 1px solid var(--accent-primary);
            z-index: 10000;
            animation: toastSlideUp 0.3s ease-out;
            font-family: var(--font-main);
        `;
        
        document.body.appendChild(toast);
        
        if (!document.getElementById('toast-style')) {
            const style = document.createElement('style');
            style.id = 'toast-style';
            style.textContent = `
                @keyframes toastSlideUp {
                    from {
                        opacity: 0;
                        transform: translate(-50%, 20px);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(function() {
                toast.remove();
            }, 300);
        }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    RecruiterTools.init();
});

