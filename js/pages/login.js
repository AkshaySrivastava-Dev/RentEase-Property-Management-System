/**
 * RentEase - Login Page Controller
 * Handles user authentication, credential validation, error alerts, and dashboard routing.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Ensure seed data is initialized before attempting authentication
  if (typeof SeedData !== 'undefined' && SeedData.init) {
    SeedData.init();
  } else if (window.RentEase && window.RentEase.seedData && window.RentEase.seedData.initSeedData) {
    window.RentEase.seedData.initSeedData();
  }

  // If already authenticated, redirect immediately
  if (typeof AuthService !== 'undefined' && AuthService.isAuthenticated && AuthService.isAuthenticated()) {
    const current = AuthService.getCurrentUser();
    if (current && current.role === ROLES.ADMIN) {
      window.location.href = 'admin/dashboard.html';
      return;
    } else if (current && current.role === ROLES.TENANT) {
      window.location.href = 'tenant/dashboard.html';
      return;
    }
  }

  // 2. Element References (supporting both login-email and email ID conventions)
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('login-email') || document.getElementById('email');
  const passwordInput = document.getElementById('login-password') || document.getElementById('password');
  const errorAlert = document.getElementById('login-error-alert');
  const autofillAdminBtn = document.getElementById('autofill-admin-btn') || document.getElementById('admin-demo-btn');
  const autofillTenantBtn = document.getElementById('autofill-tenant-btn') || document.getElementById('tenant-demo-btn');

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

  // 3. Form Submit Handler
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError();

      if (!emailInput || !passwordInput) {
        showError('Form inputs not detected.');
        return;
      }

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      // Validation
      if (!email) {
        showError('Please enter your email address.');
        emailInput.focus();
        return;
      }

      if (typeof Validators !== 'undefined' && !Validators.isEmail(email)) {
        showError('Please enter a valid email address.');
        emailInput.focus();
        return;
      }

      if (!password) {
        showError('Please enter your password.');
        passwordInput.focus();
        return;
      }

      // Execute authentication service
      const res = AuthService.login(email, password);

      if (res.success && res.user) {
        if (typeof Toast !== 'undefined') {
          Toast.success(`Welcome back, ${res.user.name}! Redirecting...`);
        }

        // Determine correct dashboard destination based on authenticated role
        const targetUrl = res.user.role === ROLES.ADMIN 
          ? 'admin/dashboard.html' 
          : 'tenant/dashboard.html';

        setTimeout(() => {
          window.location.href = targetUrl;
        }, 200);
      } else {
        showError(res.message || 'Invalid email or password. Please try again.');
        passwordInput.value = '';
        passwordInput.focus();
      }
    });
  }

  // 4. Autofill Helpers for instant testing
  if (autofillAdminBtn) {
    autofillAdminBtn.addEventListener('click', () => {
      if (emailInput) emailInput.value = 'admin@rentease.demo';
      if (passwordInput) passwordInput.value = 'admin123';
      clearError();
    });
  }

  if (autofillTenantBtn) {
    autofillTenantBtn.addEventListener('click', () => {
      if (emailInput) emailInput.value = 'tenant@rentease.demo';
      if (passwordInput) passwordInput.value = 'tenant123';
      clearError();
    });
  }
});
