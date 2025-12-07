const Analytics = {
    events: [],
    
    track: function(eventName, data) {
        const event = {
            name: eventName,
            data: data || {},
            timestamp: new Date().toISOString()
        };
        
        this.events.push(event);
        
        if (typeof console !== 'undefined') {
            console.log('Analytics Track:', eventName, data);
        }
    },
    
    init: function() {
        this.trackPageView();
        this.trackScrollDepth();
        this.trackTimeOnPage();
        this.trackClicks();
    },
    
    trackPageView: function() {
        this.track('page_view', {
            url: window.location.href,
            referrer: document.referrer,
            title: document.title
        });
    },
    
    trackScrollDepth: function() {
        const self = this;
        const milestones = [25, 50, 75, 100];
        const reached = {};
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((scrollTop / docHeight) * 100);
            
            milestones.forEach(function(milestone) {
                if (scrollPercent >= milestone && !reached[milestone]) {
                    reached[milestone] = true;
                    self.track('scroll_depth', { depth: milestone });
                }
            });
        });
    },
    
    trackTimeOnPage: function() {
        const self = this;
        const milestones = [30, 60, 120, 300];
        let secondsOnPage = 0;
        const reached = {};
        
        setInterval(function() {
            secondsOnPage++;
            
            milestones.forEach(function(milestone) {
                if (secondsOnPage === milestone && !reached[milestone]) {
                    reached[milestone] = true;
                    self.track('time_milestone', { seconds: milestone });
                }
            });
        }, 1000);
    },
    
    trackClicks: function() {
        const self = this;
        
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a, button');
            if (!target) return;
            
            const data = {
                element: target.tagName.toLowerCase(),
                text: target.textContent.trim().substring(0, 50),
                href: target.getAttribute('href') || null
            };
            
            if (target.classList.contains('btn--primary')) {
                self.track('cta_click', data);
            } else if (target.getAttribute('href') && target.getAttribute('href').includes('mailto:')) {
                self.track('email_click', data);
            } else if (target.getAttribute('download')) {
                self.track('resume_download', data);
            }
        });
    },
    
    trackSectionView: function(sectionId) {
        this.track('section_view', { section: sectionId });
    }
};

document.addEventListener('DOMContentLoaded', function() {
    Analytics.init();
    
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                Analytics.trackSectionView(entry.target.id);
            }
        });
    }, { threshold: 0.3 });
    
    sections.forEach(function(section) {
        observer.observe(section);
    });
});

