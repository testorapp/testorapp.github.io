// Helper function for flash messages (self-contained in auth.js)
function showMessage(msg, type = 'success') {
    const container = document.getElementById('flashMessages');
    if (!container) return;
    container.innerHTML = `<div class="flash flash-${type}">${msg}</div>`;
    setTimeout(() => container.innerHTML = '', 5000);
}

// ==================== REGISTER (localStorage only) ====================
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const terms = document.getElementById('terms');
    if (terms && !terms.checked) {
        showMessage('You must agree to the Terms of Service.', 'error');
        return;
    }

    const firstName = document.getElementById('first_name')?.value.trim();
    const lastName = document.getElementById('last_name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();

    if (!firstName || !lastName || !email) {
        showMessage('Please fill in all fields.', 'error');
        return;
    }

    // Save user to localStorage
    const user = {
        firstName: firstName,
        lastName: lastName,
        email: email
    };

    localStorage.setItem('user', JSON.stringify(user));

    // Show success and redirect
    showMessage('Account created! Welcome to Testora.', 'success');
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 800);
});
