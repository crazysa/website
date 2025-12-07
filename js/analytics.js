const Analytics = {
    track(event, properties = {}) {
      // Log to console for dev verification
      console.log('Analytics Track:', event, properties);

      // Placeholder for Google Analytics or similar
      if (typeof gtag !== 'undefined') {
        gtag('event', event, properties);
      }
    }
  };

  // Track key interactions
  document.addEventListener('DOMContentLoaded', () => {
    // Resume downloads
    document.querySelectorAll('[href*="Resume"]').forEach(el => {
      el.addEventListener('click', () => {
        Analytics.track('resume_download', { location: el.closest('section')?.id || 'nav' });
      });
    });

    // Quick copy usage
    document.querySelectorAll('[data-copy]').forEach(el => {
      el.addEventListener('click', () => {
        Analytics.track('quick_copy', { type: el.dataset.copy });
      });
    });

    // Contact link clicks
    document.querySelectorAll('[href^="mailto:"], [href*="linkedin"]').forEach(el => {
      el.addEventListener('click', () => {
        Analytics.track('contact_click', {
          type: el.href.includes('mailto') ? 'email' : 'linkedin'
        });
      });
    });

    // Section visibility tracking
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Analytics.track('section_view', { section: entry.target.id });
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(s => sectionObserver.observe(s));
  });

  // Scroll Depth Tracking
  class ScrollDepthTracker {
    constructor() {
      this.depths = [25, 50, 75, 100];
      this.tracked = new Set();

      window.addEventListener('scroll', () => this.check());
    }

    check() {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );

      this.depths.forEach(depth => {
        if (scrollPercent >= depth && !this.tracked.has(depth)) {
          this.tracked.add(depth);
          Analytics.track('scroll_depth', { depth: `${depth}%` });
        }
      });
    }
  }

  new ScrollDepthTracker();

  // Time on Page Tracking
  class TimeTracker {
    constructor() {
      this.startTime = Date.now();
      this.milestones = [30, 60, 120, 300]; // seconds
      this.tracked = new Set();

      setInterval(() => this.check(), 1000);

      window.addEventListener('beforeunload', () => {
        const totalTime = Math.round((Date.now() - this.startTime) / 1000);
        Analytics.track('time_on_page', { seconds: totalTime });
      });
    }

    check() {
      const elapsed = Math.round((Date.now() - this.startTime) / 1000);

      this.milestones.forEach(milestone => {
        if (elapsed >= milestone && !this.tracked.has(milestone)) {
          this.tracked.add(milestone);
          Analytics.track('time_milestone', { seconds: milestone });
        }
      });
    }
  }

  new TimeTracker();
