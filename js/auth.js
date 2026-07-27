import { register, login, forgotPassword, resendActivation, resetPassword } from './api.js';

function showMessage(msg, type = 'success') {
    const container = document.getElementById('flashMessages');
    if (!container) return;
    container.innerHTML = `<div class="flash flash-${type}">${msg}</div>`;
    setTimeout(() => container.innerHTML = '', 5000);
}

function setLoading(formId, isLoading) {
    const form = document.getElementById(formId);
    if (!form) return;
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    btn.disabled = isLoading;
    btn.dataset.originalText = btn.dataset.originalText || btn.textContent;
    btn.textContent = isLoading ? 'Please wait...' : btn.dataset.originalText;
}

// ==================== REGISTER =====================
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const terms = document.getElementById('terms');
    if (terms && !terms.checked) {
        showMessage('You must agree to the Terms of Service.', 'error');
        return;
    }

    const data = {
        first_name: document.getElementById('first_name')?.value.trim(),
        last_name: document.getElementById('last_name')?.value.trim(),
        email: document.getElementById('email')?.value.trim(),
        password: document.getElementById('password')?.value,
        confirm_password: document.getElementById('confirm_password')?.value,
        terms: terms?.checked || false
    };

    setLoading('registerForm', true);
    try {
        const result = await register(data);
        showMessage(result.message || 'Account created! Check your email to activate.', 'success');
        document.getElementById('registerForm')?.reset();
    } catch (err) {
        const msg = err.response?.errors?.join('<br>') || err.response?.error || err.message || 'Registration failed';
        showMessage(msg, 'error');
    } finally {
        setLoading('registerForm', false);
    }
});

// ==================== LOGIN ====================
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        email: document.getElementById('email')?.value.trim(),
        password: document.getElementById('password')?.value
    };

    setLoading('loginForm', true);
    try {
        const result = await login(data);
        showMessage(result.message || 'Welcome back!', 'success');
        localStorage.setItem('user', JSON.stringify(result.user));
        setTimeout(() => window.location.href = 'home.html', 1000);
    } catch (err) {
        showMessage(err.response?.error || err.message || 'Login failed', 'error');
    } finally {
        setLoading('loginForm', false);
    }
});

// ===================== FORGOT PASSWORD =====================
document.getElementById('forgotPasswordForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email')?.value.trim();

    setLoading('forgotPasswordForm', true);
    try {
        const result = await forgotPassword(email);
        showMessage(result.message || 'Reset link sent to your email.', 'success');
    } catch (err) {
        showMessage(err.response?.error || err.message || 'Request failed', 'error');
    } finally {
        setLoading('forgotPasswordForm', false);
    }
});

// ==================== RESEND ACTIVATION ====================
document.getElementById('resendActivationForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email')?.value.trim();

    setLoading('resendActivationForm', true);
    try {
        const result = await resendActivation(email);
        showMessage(result.message || 'Activation email resent.', 'success');
    } catch (err) {
        showMessage(err.response?.error || err.message || 'Request failed', 'error');
    } finally {
        setLoading('resendActivationForm', false);
    }
});

// ===================== RESET PASSWORD ====================
document.getElementById('resetPasswordForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    const data = {
        password: document.getElementById('password')?.value,
        confirm_password: document.getElementById('confirm_password')?.value
    };

    if (data.password !== data.confirm_password) {
        showMessage('Passwords do not match.', 'error');
        return;
    }

    setLoading('resetPasswordForm', true);
    try {
        const result = await resetPassword(token, data);
        showMessage(result.message || 'Password reset successful!', 'success');
        setTimeout(() => window.location.href = 'login.html', 2000);
    } catch (err) {
        showMessage(err.response?.error || err.message || 'Reset failed', 'error');
    } finally {
        setLoading('resetPasswordForm', false);
    }
});
