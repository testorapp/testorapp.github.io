// ==================== NAVBAR USER MENU ====================
function updateNav() {
    const navActions = document.getElementById('navActions');
    const mobileCta = document.getElementById('mobileCta');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!navActions) return;

    if (user) {
        navActions.innerHTML = `
            <div class="user-menu">
                <span class="user-name">${user.firstName}</span>
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

        document.body.addEventListener('click', handleLogoutClick);
    } else {
        const publicPages = ['index.html', 'register.html', 'how-it-works.html',
            'payment.html', 'privacy.html', 'terms.html', 'cookies.html',
            'location.html'];
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        if (publicPages.includes(currentPage)) {
            navActions.innerHTML = `
                <a href="register.html" class="btn btn-primary">Get Started</a>
            `;
            if (mobileCta) {
                mobileCta.innerHTML = `
                    <a href="register.html" class="btn btn-primary">Get Started</a>
                `;
            }
        }
    }
}

function handleLogoutClick(e) {
    if (e.target.id !== 'logoutBtn' && e.target.id !== 'mobileLogoutBtn') return;
    e.preventDefault();
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// ==================== HOME DASHBOARD ====================
function loadDashboard() {
    const earningsEl = document.getElementById('statEarnings');
    const completedEl = document.getElementById('statCompleted');
    const pendingEl = document.getElementById('statPending');
    const welcomeName = document.getElementById('welcomeName');

    if (!earningsEl) return;

    // Load user name from localStorage
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (welcomeName && user) {
        welcomeName.textContent = user.firstName;
    }

// Hardcoded stats (no backend)
    earningsEl.textContent = '$0.00';
    completedEl.textContent = '0';
    pendingEl.textContent = '3';
}

// ==================== AVAILABLE SITES ====================
function loadSites() {
    const grid = document.querySelector('.sites-grid');
    if (!grid) return;

    if (typeof sites !== 'undefined') {
        grid.innerHTML = sites.map(site => `
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
}

// ==================== MODALS ====================
window.closeModal = function() {
    const modal = document.getElementById('instructionsModal');
    if (modal) modal.style.display = 'none';
};

window.openModal = function(url) {
    const modal = document.getElementById('instructionsModal');
    const proceedBtn = document.getElementById('proceedBtn');

    if (modal) {
        modal.style.display = 'flex';

        // Auto-scroll to the modal on mobile
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                const content = modal.querySelector('.modal-content');

                if (content) {
                    content.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }, 100);
        }
    }

    if (proceedBtn) {
        proceedBtn.onclick = () => {
            window.open(url, '_blank', 'noopener,noreferrer');
            closeModal();
        };
    }
};

// ==================== LOGO (smart home routing) ====================
function handleLogoClick(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
        window.location.href = 'home.html';
    } else {
        window.location.href = 'index.html';
    }
}

// Single DOMContentLoaded handler
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.logo').forEach(logo => {
        logo.addEventListener('click', handleLogoClick);
    });
    updateNav();
    loadDashboard();
    loadSites();
});

