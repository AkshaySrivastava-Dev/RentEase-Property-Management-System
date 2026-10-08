/**
 * RentEase - Signup Page Controller
 * Handles new account registration, input validation, role assignment, and session initiation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure seed data is initialized
  if (typeof SeedData !== 'undefined' && SeedData.init) {
    SeedData.init();
  } else if (window.RentEase && window.RentEase.seedData && window.RentEase.seedData.initSeedData) {
    window.RentEase.seedData.initSeedData();
  }

  const signupForm = document.getElementById('signup-form');
  const nameInput = document.getElementById('signup-name') || document.getElementById('name');
  const emailInput = document.getElementById('signup-email') || document.getElementById('email');
  const phoneInput = document.getElementById('signup-phone') || document.getElementById('phone');
  const roleSelect = document.getElementById('signup-role') || document.getElementById('role');
  const passwordInput = document.getElementById('signup-password') || document.getElementById('password');
  const confirmPasswordInput = document.getElementById('signup-confirm-password') || document.getElementById('confirm-password');
  const errorAlert = document.getElementById('signup-error-alert');

  function showError(msg) {
    if (errorAlert) {
      errorAlert.textContent = msg;
      errorAlert.style.display = 'block';
    }
    if (typeof Toast !== 'undefined') {
      Toast.error(msg);
    }
  }

  function clearError() {
    if (errorAlert) {
      errorAlert.textContent = '';
      errorAlert.style.display = 'none';
    }
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError();

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const role = roleSelect ? roleSelect.value : ROLES.TENANT;
      const password = passwordInput ? passwordInput.value : '';
      const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';

      if (!name) {
        showError('Please enter your full name.');
        if (nameInput) nameInput.focus();
        return;
      }

      if (!email || (typeof Validators !== 'undefined' && !Validators.isEmail(email))) {
        showError('Please enter a valid email address.');
        if (emailInput) emailInput.focus();
        return;
      }

      if (!password || password.length < 6) {
        showError('Password must be at least 6 characters long.');
        if (passwordInput) passwordInput.focus();
        return;
      }

      if (confirmPasswordInput && password !== confirmPassword) {
        showError('Passwords do not match. Please verify your password.');
        if (confirmPasswordInput) confirmPasswordInput.focus();
        return;
      }

      const res = AuthService.signup({
        name,
        email,
        password,
        role: role === 'admin' ? ROLES.ADMIN : ROLES.TENANT,
        phone
      });

      if (res.success && res.user) {
        if (typeof Toast !== 'undefined') {
          Toast.success('Account created successfully! Redirecting...');
        }
        setTimeout(() => {
          if (res.user.role === ROLES.ADMIN) {
            window.location.href = 'admin/dashboard.html';
          } else {
            window.location.href = 'tenant/dashboard.html';
          }
        }, 300);
      } else {
        showError(res.message || 'Signup failed. Please try again.');
      }
    });
  }
});
