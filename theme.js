/**
 * Testora - Dark/Light Mode Theme Toggle
 */
const Theme = {
    key: 'testora_theme',

    init() {
        const saved = localStorage.getItem(this.key);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = saved || (prefersDark ? 'dark' : 'light');
        this.set(theme, false);
        this.createToggle();
    },

    set(theme, save = true) {
        document.documentElement.setAttribute('data-theme', theme);
        if (save) localStorage.setItem(this.key, theme);
    },

    toggle() {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        this.set(next);
        // Update toggle icon
        const btn = document.getElementById('themeToggle');
        if (btn) {
            btn.innerHTML = next === 'dark'
                ? '<i class="fas fa-sun"></i>'
                : '<i class="fas fa-moon"></i>';
        }
    },

    createToggle() {
        const navActions = document.getElementById('navActions');
        if (!navActions) return;
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const btn = document.createElement('button');
        btn.id = 'themeToggle';
        btn.className = 'theme-toggle-btn';
        btn.innerHTML = current === 'dark'
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
        btn.setAttribute('aria-label', 'Toggle theme');
        btn.addEventListener('click', () => this.toggle());
        navActions.prepend(btn);
    }
};

// Initialize theme on DOM ready
document.addEventListener('DOMContentLoaded', () => Theme.init());
