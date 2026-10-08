/**
 * RentEase - Core Application Orchestrator
 * Bootstraps storage seeding, handles global error triggers, and provides session utilities.
 */

const App = {
  /**
   * Initializes the RentEase runtime
   */
  init() {
    // 1. Seed initial demo data if first run
    if (typeof SeedData !== 'undefined') {
      SeedData.init();
    }

    // 2. Initialize global modal listeners
    if (typeof Modal !== 'undefined') {
      Modal.init();
    }

    // 3. Log startup status
    console.log('RentEase Property Management System initialized successfully.');
  },

  /**
   * Performs 1-click demo login for admin or tenant
   * @param {string} role 'admin' | 'tenant'
   */
  demoLogin(role) {
    if (typeof SeedData !== 'undefined') {
      SeedData.init();
    }

    let email = 'admin@rentease.demo';
    let pass = 'admin123';
    let targetUrl = 'pages/admin/dashboard.html';

    if (role === 'tenant') {
      email = 'tenant@rentease.demo';
      pass = 'tenant123';
      targetUrl = 'pages/tenant/dashboard.html';
    }

    const res = AuthService.login(email, pass);
    if (res.success) {
      if (typeof Toast !== 'undefined') {
        Toast.success(`Logged in as demo ${role}!`);
      }
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 200);
    } else {
      alert(`Could not log in: ${res.message}`);
    }
  }
};

// Auto-run initialization on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

