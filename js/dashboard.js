import { getUser, getSites, logout } from './api.js';

// ==================== NAVBAR USER MENU ====================
function updateNav() {
    const navActions = document.getElementById('navActions');
    const mobileCta = document.getElementById('mobileCta');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!navActions) return;

    if (user) {
        navActions.innerHTML = `
            <div class="user-menu">
                <span class="user-name">${user.first_name}</span>
                <div class="user-dropdown">
                    <a href="home.html">Dashboard</a>
                    <a href="available-sites.html">Available Sites</a>
                    <a href="#" id="logoutBtn">Log Out</a>
                </div>
            </div>
        `;
        if (mobileCta) {
            mobileCta.innerHTML = `<a href="#" id="mobileLogoutBtn" class="btn btn-login">Log Out</a>`;
        }

        // Use event delegation to avoid duplicate listeners
        navActions.addEventListener('click', handleLogoutClick);
        if (mobileCta) mobileCta.addEventListener('click', handleLogoutClick);
    } else {
        const publicPages = ['index.html', 'login.html', 'register.html', 'how-it-works.html',
            'payment.html', 'privacy.html', 'terms.html', 'cookies.html',
            'location.html', 'forgot-password.html', 'reset-password.html',
            'resend-activation.html', 'activate.html'];
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        if (publicPages.includes(currentPage)) {
            navActions.innerHTML = `
                <a href="login.html" class="btn btn-login">Sign In</a>
                <a href="register.html" class="btn btn-primary">Sign Up</a>
            `;
            if (mobileCta) {
                mobileCta.innerHTML = `
                    <a href="login.html" class="btn btn-login">Sign In</a>
                    <a href="register.html" class="btn btn-primary">Sign Up</a>
                `;
            }
        }
    }
}

async function handleLogoutClick(e) {
    if (e.target.id !== 'logoutBtn' && e.target.id !== 'mobileLogoutBtn') return;
    e.preventDefault();
    try {
        await logout();
    } catch (err) {
        console.error('Logout error:', err);
    }
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// ==================== HOME DASHBOARD ====================
async function loadDashboard() {
    const earningsEl = document.getElementById('statEarnings');
    const completedEl = document.getElementById('statCompleted');
    const pendingEl = document.getElementById('statPending');

    if (!earningsEl) return;

    try {
        const result = await getUser();
        earningsEl.textContent = '$' + (result.stats?.earnings || 0).toFixed(2);
        completedEl.textContent = result.stats?.tests_completed || 0;
        pendingEl.textContent = result.stats?.pending_tests || 0;
    } catch (err) {
        console.error('Dashboard load failed:', err);
        if (err.status === 401) {
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        }
    }
}

// ==================== AVAILABLE SITES ====================
async function loadSites() {
    const grid = document.querySelector('.sites-grid');
    if (!grid) return;

    try {
        const result = await getSites();
        if (result.sites) {
            grid.innerHTML = result.sites.map(site => `
                <div class="site-card" data-site-id="${site.id}">
                    <div class="site-info">
                        <h3>${site.name}</h3>
                        <div class="site-pay">${site.pay}</div>
                        <span class="site-status ${site.status.toLowerCase()}">${site.status}</span>
                    </div>
                    <button class="btn-start-test" onclick="openModal('${site.url}')">Start Test</button>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error('Sites load failed:', err);
        if (err.status === 401) {
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        }
    }
}

// ==================== MODALS ====================
window.closeModal = function() {
    const modal = document.getElementById('instructionsModal');
    if (modal) modal.style.display = 'none';
};

window.openModal = function(url) {
    const modal = document.getElementById('instructionsModal');
    const proceedBtn = document.getElementById('proceedBtn');
    if (modal) modal.style.display = 'flex';
    if (proceedBtn) {
        proceedBtn.onclick = () => {
            window.open(url, '_blank', 'noopener,noreferrer');
            closeModal();
        };
    }
};

// Payment modal handlers
window.closePaymentModal = function() {
    const modal = document.getElementById('paymentModal');
    if (modal) modal.style.display = 'none';
};

window.selectPayment = function(method) {
    console.log('Selected payment:', method);
    // TODO: implement actual payment flow
    alert('Payment method selected: ' + method + '\n(Connect this to your backend payment API)');
    closePaymentModal();
};

// Warning modal handlers
window.closeWarningModal = function() {
    const modal = document.getElementById('warningModal');
    if (modal) modal.style.display = 'none';
};

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    updateNav();
    loadDashboard();
    loadSites();
});