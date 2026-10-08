/**
 * RentEase - Navbar Component
 * Renders standard authenticated top bar with workspace tag, user profile, and sign-out action.
 */

const Navbar = {
  /**
   * Renders the top navigation header inside a target element
   * @param {string} containerSelector 
   * @param {Object} [options]
   */
  render(containerSelector = '#app-header', options = {}) {
    const container = document.querySelector(containerSelector) || 
                      document.querySelector('#navbar-container') || 
                      document.querySelector('#app-header');
    if (!container) return;

    const user = AuthService.getCurrentUser() || {
      name: 'Guest User',
      role: 'Guest',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    };

    const isAdmin = user.role === ROLES.ADMIN;
    const workspaceTitle = isAdmin ? 'Admin Workspace' : 'Resident Workspace';
    const roleLabel = isAdmin ? 'Property Manager' : 'Resident';

    container.innerHTML = `
      <header class="app-header top-navbar">
        <div class="header-left navbar-left">
          <button type="button" class="mobile-menu-btn navbar-toggle-btn" id="mobile-sidebar-toggle" aria-label="Toggle navigation">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <div class="header-breadcrumb">
            <span class="header-portal-tag">${workspaceTitle}</span>
          </div>
        </div>

        <div class="header-right navbar-right">
          <div class="user-profile-menu">
            <img src="${user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)}" alt="${user.name}" class="user-avatar" />
            <div class="user-info">
              <span class="user-name">${user.name}</span>
              <span class="user-role">${roleLabel}</span>
            </div>
            <button type="button" class="btn btn-secondary btn-sm header-logout-btn" id="navbar-logout-btn" title="Sign out of account">
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>
    `;

    // Bind logout button
    const logoutBtn = container.querySelector('#navbar-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        AuthService.logout();
        if (typeof Toast !== 'undefined') Toast.info('Signed out successfully.');
        setTimeout(() => {
          window.location.href = '../login.html';
        }, 150);
      });
    }

    // Bind mobile menu toggle
    const toggleBtn = container.querySelector('#mobile-sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const sidebar = document.querySelector('.app-sidebar') || document.querySelector('.sidebar');
        const backdrop = document.querySelector('.sidebar-backdrop');
        if (sidebar) sidebar.classList.toggle('is-open');
        if (backdrop) backdrop.classList.toggle('is-active');
      });
    }
  }
};
