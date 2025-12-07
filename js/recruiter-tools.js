document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('recruiter-tools-placeholder');
    if (!container) return;

    // Inject HTML
    container.innerHTML = `
        <div class="recruiter-card" style="background: var(--bg-card); border: 2px dashed rgba(100, 255, 218, 0.4); padding: 1.5rem; border-radius: 8px; margin: 2rem 0; position: relative;">
            <div class="recruiter-card__header" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; color: var(--accent-primary);">
                <span class="icon">📋</span>
                <span class="title" style="font-weight: 700; font-family: var(--font-mono);">RECRUITER QUICK COPY</span>
            </div>
            <p id="summary-text" style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
                Senior CV/ML Engineer | 5+ YoE | Computer Vision, VLMs, LiDAR-Camera Calibration | Python, PyTorch, OpenCV, Azure | Autonomous Vehicles | Hyderabad/Remote | 30-day notice
            </p>
            <div class="recruiter-card__actions" style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <button class="btn-tool" data-action="copy-summary" style="background: rgba(100, 255, 218, 0.1); border: 1px solid var(--accent-primary); color: var(--accent-primary); padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                    📄 Copy Summary
                </button>
                <button class="btn-tool" data-action="email-template" style="background: rgba(100, 255, 218, 0.1); border: 1px solid var(--accent-primary); color: var(--accent-primary); padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                    📧 Email Template
                </button>
                <button class="btn-tool" data-action="custom-builder" style="background: transparent; border: 1px dashed var(--text-tertiary); color: var(--text-secondary); padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                    ⚙️ Build Custom Summary
                </button>
            </div>
        </div>

        <!-- Modal for Custom Builder -->
        <div id="custom-builder-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(10, 25, 47, 0.9); z-index: 2000; align-items: center; justify-content: center;">
            <div style="background: var(--bg-card); padding: 2rem; border-radius: 8px; max-width: 500px; width: 90%; border: 1px solid var(--accent-primary); position: relative;">
                <h3 style="color: var(--text-primary); margin-bottom: 1.5rem;">⚙️ Build Custom Summary</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1.5rem; color: var(--text-secondary); font-size: 0.9rem;">
                    <label><input type="checkbox" value="Computer Vision" checked> Computer Vision</label>
                    <label><input type="checkbox" value="VLM/Multimodal"> VLM/Multimodal</label>
                    <label><input type="checkbox" value="LiDAR Calibration"> LiDAR Calibration</label>
                    <label><input type="checkbox" value="Cloud (Azure/AWS)"> Cloud (Azure/AWS)</label>
                    <label><input type="checkbox" value="Team Leadership"> Team Leadership</label>
                    <label><input type="checkbox" value="Cost Optimization"> Cost Optimization</label>
                </div>
                <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 4px; margin-bottom: 1rem; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-primary);" id="generated-preview">
                    Senior CV Engineer with expertise in Computer Vision...
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 1rem;">
                    <button id="close-modal" style="background: transparent; border: none; color: var(--text-secondary); cursor: pointer;">Cancel</button>
                    <button id="copy-custom" class="btn--primary btn--small">Copy Custom Summary</button>
                </div>
            </div>
        </div>
    `;

    // Event Listeners
    const summaryText = document.getElementById('summary-text').innerText;

    document.querySelector('[data-action="copy-summary"]').addEventListener('click', function() {
        navigator.clipboard.writeText(summaryText).then(() => {
            const original = this.innerHTML;
            this.innerHTML = '✓ Copied!';
            setTimeout(() => this.innerHTML = original, 2000);
            if(typeof Analytics !== 'undefined') Analytics.track('quick_copy', { type: 'summary' });
        });
    });

    document.querySelector('[data-action="email-template"]').addEventListener('click', function() {
        const subject = "Senior CV Engineer - Shubham Agarwal | $72K Savings Track Record";
        const body = `Hi [Name],\n\nI came across your role for [Position] and believe my background in Computer Vision and ML systems would be a strong fit.\n\nKey highlights:\n• $72,000 annual cost savings through Azure optimization at Deepen.AI\n• 500% performance improvement over industry-standard CV solutions\n• Led team of 5 engineers for camera calibration system (1mm accuracy)\n• 5+ years shipping CV systems from research to production\n\nI'm currently at Deepen.AI (2.5+ years) and available with 30-day notice.\n\nWould love to discuss how I can bring similar results to [Company].\n\nBest,\nShubham Agarwal\n[LinkedIn Profile] | [Portfolio URL]`;

        // Copy to clipboard instead of mailto for better UX with formatting
        navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`).then(() => {
            const original = this.innerHTML;
            this.innerHTML = '✓ Copied to Clipboard!';
            setTimeout(() => this.innerHTML = original, 2000);
            if(typeof Analytics !== 'undefined') Analytics.track('quick_copy', { type: 'email' });
        });
    });

    // Custom Builder Logic
    const modal = document.getElementById('custom-builder-modal');
    const preview = document.getElementById('generated-preview');
    const checkboxes = modal.querySelectorAll('input[type="checkbox"]');

    document.querySelector('[data-action="custom-builder"]').addEventListener('click', () => {
        modal.style.display = 'flex';
        updatePreview();
    });

    document.getElementById('close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    document.getElementById('copy-custom').addEventListener('click', function() {
        navigator.clipboard.writeText(preview.innerText).then(() => {
            const original = this.innerText;
            this.innerText = 'Copied!';
            setTimeout(() => {
                this.innerText = original;
                modal.style.display = 'none';
            }, 1000);
            if(typeof Analytics !== 'undefined') Analytics.track('quick_copy', { type: 'custom' });
        });
    });

    checkboxes.forEach(cb => cb.addEventListener('change', updatePreview));

    function updatePreview() {
        const skills = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        let text = "Senior CV Engineer";
        if (skills.length > 0) {
            text += ` with expertise in ${skills.join(', ')}`;
        }
        text += ", demonstrated by leading 5-person team to achieve 1mm calibration accuracy while saving $72K annually.";
        preview.innerText = text;
    }
});
