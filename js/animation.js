/**
 * Testora - Scroll-Triggered Animations, Live Counters & Progress Bars
 */

// ==================== INTERSECTION OBSERVER ====================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;

            // Handle reveal animations
            if (el.classList.contains('reveal')) {
                const delay = el.dataset.delay || 0;
                el.style.transitionDelay = `${delay}ms`;
                el.classList.add('revealed');
            }

            // Handle live counters
            if (el.classList.contains('live-counter')) {
                animateCounter(el);
            }

            // Handle progress bars
            if (el.classList.contains('progress-fill')) {
                animateProgressBar(el);
            }

            // Handle staggered children
            if (el.classList.contains('stagger-children')) {
                const children = el.children;
                Array.from(children).forEach((child, i) => {
                    child.style.transitionDelay = `${i * 100}ms`;
                    child.classList.add('revealed');
                });
            }

            animationObserver.unobserve(el);
        }
    });
}, observerOptions);

// ==================== REVEAL ON SCROLL ====================
function initScrollReveal() {
    document.querySelectorAll('.reveal').forEach(el => {
        animationObserver.observe(el);
    });
    document.querySelectorAll('.stagger-children').forEach(el => {
        animationObserver.observe(el);
    });
}

// ==================== LIVE COUNTERS ====================
function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = parseInt(el.dataset.duration) || 1500;
    const isCurrency = el.dataset.currency === 'true';
    // Use data-start if provided, otherwise default to 0 (count up)
    const start = el.dataset.start !== undefined ? parseFloat(el.dataset.start) : 0;
    const isCountingDown = start > target;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = start + (target - start) * eased;

        if (isCurrency) {
            el.textContent = prefix + '$' + current.toFixed(2);
        } else if (Number.isInteger(target)) {
            el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
        } else {
            el.textContent = prefix + current.toFixed(1) + suffix;
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Final value
            if (isCurrency) {
                el.textContent = prefix + '$' + target.toFixed(2);
            } else if (Number.isInteger(target)) {
                el.textContent = prefix + target.toLocaleString() + suffix;
            } else {
                el.textContent = prefix + target + suffix;
            }
        }
    }

    requestAnimationFrame(update);
}

// ==================== PROGRESS BARS ====================
function animateProgressBar(el) {
    const target = parseInt(el.dataset.progress) || 0;
    const duration = parseInt(el.dataset.duration) || 1200;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.style.width = current + '%';

        // Update label if exists
        const label = el.closest('.progress-bar-container')?.querySelector('.progress-label-value');
        if (label) {
            label.textContent = Math.floor(current) + '%';
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.style.width = target + '%';
            if (label) label.textContent = target + '%';
        }
    }

    requestAnimationFrame(update);
}

// ==================== PARALLAX / MOUSE TRACKING ====================
function initMouseTracking() {
    document.querySelectorAll('.mouse-track').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const strength = parseFloat(el.dataset.strength) || 20;
            el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
            el.style.transition = 'transform 0.5s ease';
        });

        el.addEventListener('mouseenter', () => {
            el.style.transition = 'transform 0.1s ease';
        });
    });
}

// ==================== TYPEWRITER EFFECT ====================
function initTypewriter() {
    document.querySelectorAll('.typewriter').forEach(el => {
        const text = el.textContent;
        const speed = parseInt(el.dataset.speed) || 50;
        el.textContent = '';
        el.style.visibility = 'visible';
        let i = 0;

        function type() {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    });
}

// ==================== PAGE TRANSITIONS ====================
function initPageTransitions() {
    // Fade in the page on load
    document.body.classList.add('page-transition');
    setTimeout(() => {
        document.body.classList.add('page-visible');
    }, 50);

    // Add click listeners to internal links for smooth transitions
    document.querySelectorAll('a[href^="index.html"], a[href^="home.html"], a[href^="register.html"], a[href^="available-sites.html"], a[href^="how-it-works.html"], a[href^="payment.html"], a[href^="privacy.html"], a[href^="terms.html"], a[href^="cookies.html"], a[href^="location.html"]').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.classList.contains('logo') || link.id === 'logoutBtn' || link.id === 'mobileLogoutBtn') return;
            e.preventDefault();
            const href = link.getAttribute('href');
            document.body.classList.remove('page-visible');
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initMouseTracking();
    initPageTransitions();

    // Also observe live counters and progress bars that may already be in view
    document.querySelectorAll('.live-counter').forEach(el => {
        animationObserver.observe(el);
    });
    document.querySelectorAll('.progress-fill').forEach(el => {
        animationObserver.observe(el);
    });
});
