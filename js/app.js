// ==================== MOBILE MENU ====================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu?.classList.remove('active');
    });
});

// ==================== FLASH MESSAGES ====================
function showFlash(message, type = 'success') {
    const container = document.getElementById('flashMessages');
    if (!container) return;
    container.innerHTML = `<div class="flash flash-${type}">${message}</div>`;
    setTimeout(() => container.innerHTML = '', 5000);
}

// ==================== AUTH CHECK (for protected pages) ====================
const protectedPages = ['home.html', 'available-sites.html'];
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

if (protectedPages.includes(currentPage)) {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
    }
}
