/**
 * RentEase - Sidebar Component
 * Renders role-specific side navigation with unified SVG icons, active states, and logout.
 */

const Sidebar = {
  /**
   * Renders the sidebar navigation for Admin or Tenant
   * @param {string} containerSelector 
   * @param {string} activePage 
   */
  render(containerSelector = '#app-sidebar', activePage = '') {
    const container = document.querySelector(containerSelector) || 
                      document.querySelector('#sidebar-container') || 
                      document.querySelector('#app-sidebar');
    if (!container) return;

    const user = AuthService.getCurrentUser();
    const isAdmin = user && user.role === ROLES.ADMIN;

    // SVG icon templates
    const ICONS = {
      dashboard: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>`,
      properties: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
      tenants: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
      leases: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
      payments: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`,
      maintenance: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
      messages: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
      logout: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`
    };

    // Define navigation items based on role
    const adminNav = [
      { id: 'dashboard', label: 'Dashboard', icon: ICONS.dashboard, path: 'dashboard.html' },
      { id: 'properties', label: 'Properties', icon: ICONS.properties, path: 'properties.html' },
      { id: 'tenants', label: 'Tenants', icon: ICONS.tenants, path: 'tenants.html' },
      { id: 'leases', label: 'Leases', icon: ICONS.leases, path: 'leases.html' },
      { id: 'payments', label: 'Payments', icon: ICONS.payments, path: 'payments.html' },
      { id: 'maintenance', label: 'Maintenance', icon: ICONS.maintenance, path: 'maintenance.html' },
      { id: 'messages', label: 'Messages', icon: ICONS.messages, path: 'messages.html' }
    ];

    const tenantNav = [
      { id: 'dashboard', label: 'Dashboard', icon: ICONS.dashboard, path: 'dashboard.html' },
      { id: 'property', label: 'My Home', icon: ICONS.properties, path: 'property.html' },
      { id: 'lease', label: 'My Lease', icon: ICONS.leases, path: 'lease.html' },
      { id: 'payments', label: 'Payments', icon: ICONS.payments, path: 'payments.html' },
      { id: 'maintenance', label: 'Maintenance', icon: ICONS.maintenance, path: 'maintenance.html' },
      { id: 'messages', label: 'Messages', icon: ICONS.messages, path: 'messages.html' }
    ];

    const navItems = isAdmin ? adminNav : tenantNav;

    const navHtml = navItems.map(item => {
      const isActive = item.id === activePage;
      return `
        <li class="nav-item">
          <a href="${item.path}" class="nav-link ${isActive ? 'active' : ''}">
            <span class="nav-icon">${item.icon}</span>
            <span class="nav-text">${item.label}</span>
          </a>
        </li>
      `;
    }).join('');

    container.innerHTML = `
      <div class="sidebar-backdrop"></div>
      <aside class="app-sidebar sidebar">
        <div class="sidebar-header sidebar-brand">
          <a href="dashboard.html" class="brand-logo" style="text-decoration: none;">
            <div class="brand-logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div style="display: flex; align-items: baseline; gap: 6px;">
              <span class="brand-logo-text brand-name">RentEase</span>
              <span class="brand-logo-badge brand-badge">${isAdmin ? 'Manager' : 'Resident'}</span>
            </div>
          </a>
        </div>

        <nav class="sidebar-content sidebar-nav">
          <div class="nav-group-title">Navigation</div>
          <ul class="nav-list" style="list-style: none; padding: 0; margin: 0;">
            ${navHtml}
          </ul>
        </nav>

        <div class="sidebar-footer">
          <button type="button" class="nav-link sidebar-logout-btn" id="sidebar-logout-btn">
            <span class="nav-icon">${ICONS.logout}</span>
            <span class="nav-text">Sign Out</span>
          </button>
        </div>
      </aside>
    `;

    // Bind logout button
    const logoutBtn = container.querySelector('#sidebar-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        AuthService.logout();
        if (typeof Toast !== 'undefined') Toast.info('Signed out successfully.');
        setTimeout(() => {
          window.location.href = '../login.html';
        }, 150);
      });
    }

    // Bind backdrop click to close mobile drawer
    const backdrop = container.querySelector('.sidebar-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        const sidebar = container.querySelector('.app-sidebar');
        if (sidebar) sidebar.classList.remove('is-open');
        backdrop.classList.remove('is-active');
      });
    }
  }
};
