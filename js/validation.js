/**
 * Testora Frontend - Client-Side Form Validation
 */

const Validation = {
    /**
     * Validate name: 2-50 chars, letters/spaces/hyphens/apostrophes only
     */
    name(value) {
        if (!value || value.trim().length < 2 || value.trim().length > 50) {
            return 'Name must be between 2 and 50 characters.';
        }
        if (!/^[a-zA-Z\s\-']+$/.test(value.trim())) {
            return 'Name can only contain letters, spaces, hyphens, and apostrophes.';
        }
        return null;
    },

    /**
     * Validate email
     */
    email(value) {
        if (!value || !value.trim()) {
            return 'Email is required.';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
            return 'Please enter a valid email address.';
        }
        return null;
    },

    /**
     * Validate password strength
     */
    password(value) {
        if (!value) {
            return 'Password is required.';
        }
        const errors = [];
        if (value.length < 8) errors.push('at least 8 characters');
        if (!/[A-Z]/.test(value)) errors.push('one uppercase letter');
        if (!/[a-z]/.test(value)) errors.push('one lowercase letter');
        if (!/\d/.test(value)) errors.push('one number');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) errors.push('one special character');
        
        if (errors.length) {
            return `Password must contain ${errors.join(', ')}.`;
        }
        return null;
    },

    /**
     * Validate password match
     */
    confirmPassword(password, confirm) {
        if (!confirm) {
            return 'Please confirm your password.';
        }
        if (password !== confirm) {
            return 'Passwords do not match.';
        }
        return null;
    },

    /**
     * Show field error
     */
    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        field.classList.add('error');
        
        // Remove existing error for this field
        const existing = field.parentElement.querySelector('.form-error');
        if (existing) existing.remove();
        
        if (message) {
            const errorEl = document.createElement('span');
            errorEl.className = 'form-error';
            errorEl.textContent = message;
            field.parentElement.appendChild(errorEl);
        }
    },

    /**
     * Clear field error
     */
    clearError(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        field.classList.remove('error');
        const existing = field.parentElement.querySelector('.form-error');
        if (existing) existing.remove();
    },

    /**
     * Clear all form errors
     */
    clearAll(formId) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        form.querySelectorAll('.form-error').forEach(el => el.remove());
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }
};

// Auto-attach validation to forms
document.addEventListener('DOMContentLoaded', () => {
    // Real-time validation on blur
    document.querySelectorAll('[data-validate]').forEach(field => {
        field.addEventListener('blur', () => {
            const type = field.dataset.validate;
            let error = null;

            switch (type) {
                case 'first_name':
                case 'last_name':
                    error = Validation.name(field.value);
                    break;
                case 'email':
                    error = Validation.email(field.value);
                    break;
                case 'password':
                    error = Validation.password(field.value);
                    break;
                case 'confirm_password': {
                    const passwordField = document.querySelector('[data-validate="password"]');
                    const password = passwordField ? passwordField.value : '';
                    error = Validation.confirmPassword(password, field.value);
                    break;
                }
            }

            if (error) {
                Validation.showError(field.id, error);
            } else {
                Validation.clearError(field.id);
            }
        });

        // Clear error on focus
        field.addEventListener('focus', () => {
            Validation.clearError(field.id);
        });
    });
});

export default Validation;
