/**
 * RentEase - Admin Dashboard Controller
 * Displays key operational metrics, recent payments, open maintenance tickets, and featured properties.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure seed data is initialized
  if (typeof SeedData !== 'undefined' && SeedData.init) {
    SeedData.init();
  }

  // Guard route for Admin role
  if (typeof AuthService !== 'undefined' && !AuthService.requireAuth(ROLES.ADMIN)) {
    return;
  }

  // Render navigation components
  if (typeof Navbar !== 'undefined') Navbar.render('#navbar-container');
  if (typeof Sidebar !== 'undefined') Sidebar.render('#sidebar-container', 'dashboard');

  // Personalize welcome heading
  const currentUser = typeof AuthService !== 'undefined' ? AuthService.getCurrentUser() : null;
  const welcomeHeading = document.getElementById('welcome-heading');
  if (welcomeHeading && currentUser) {
    welcomeHeading.textContent = `Welcome back, ${currentUser.name.split(' ')[0]}!`;
  }

  renderMetrics();
  renderRecentPayments();
  renderMaintenanceSummary();
  renderPropertiesPreview();

  function renderMetrics() {
    const properties = typeof PropertyService !== 'undefined' ? PropertyService.getAll() : [];
    const tenants = typeof TenantService !== 'undefined' ? TenantService.getAll() : [];
    const maintenance = typeof MaintenanceService !== 'undefined' ? MaintenanceService.getAll() : [];
    const payments = typeof PaymentService !== 'undefined' ? PaymentService.getAll() : [];

    const totalUnits = properties.length;
    const occupiedUnits = properties.filter(p => String(p.status).toLowerCase() === 'occupied').length;
    const availableUnits = totalUnits - occupiedUnits;
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

    const openMaintenance = maintenance.filter(m => String(m.status).toLowerCase() !== 'resolved').length;
    const inProgressMaint = maintenance.filter(m => String(m.status).toLowerCase() === 'in progress' || String(m.status).toLowerCase() === 'in_progress').length;

    const pendingPaymentsList = payments.filter(p => String(p.status).toLowerCase() !== 'paid');
    const pendingAmount = pendingPaymentsList.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const totalCollected = payments.filter(p => String(p.status).toLowerCase() === 'paid').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    // Populate metric cards (supporting both ID conventions)
    const elTotal = document.getElementById('stat-total-props') || document.getElementById('stat-total-properties');
    const elBreakdown = document.getElementById('stat-prop-breakdown');
    const elOccupied = document.getElementById('stat-occupied-props');
    const elOccupancy = document.getElementById('stat-occupancy-rate');
    const elTenants = document.getElementById('stat-total-tenants');
    const elPendingCount = document.getElementById('stat-pending-payments');
    const elPendingAmt = document.getElementById('stat-pending-amount');
    const elOpenMaint = document.getElementById('stat-open-maintenance') || document.getElementById('stat-pending-maintenance');
    const elMaintSub = document.getElementById('stat-maintenance-subtext');
    const elRevenue = document.getElementById('stat-total-revenue');

    if (elTotal) elTotal.textContent = totalUnits;
    if (elBreakdown) elBreakdown.textContent = `${availableUnits} available • ${occupiedUnits} occupied`;
    if (elOccupied) elOccupied.textContent = occupiedUnits;
    if (elOccupancy) elOccupancy.textContent = `${occupancyRate}% occupancy rate`;
    if (elTenants) elTenants.textContent = tenants.length;
    if (elPendingCount) elPendingCount.textContent = pendingPaymentsList.length;
    if (elPendingAmt) elPendingAmt.textContent = `${Formatters.currency(pendingAmount)} awaiting collection`;
    if (elOpenMaint) elOpenMaint.textContent = openMaintenance;
    if (elMaintSub) elMaintSub.textContent = `${inProgressMaint} in progress`;
    if (elRevenue) elRevenue.textContent = Formatters.currency(totalCollected);
  }

  function renderRecentPayments() {
    const container = document.getElementById('recent-payments-table-container') || 
                      document.getElementById('payments-overview-table');
    if (!container) return;

    const payments = typeof PaymentService !== 'undefined' ? PaymentService.getAll().slice(0, 5) : [];
    const enriched = payments.map(p => typeof PaymentService.enrich === 'function' ? PaymentService.enrich(p) : p);

    container.innerHTML = Table.render({
      columns: [
        { 
          label: 'Resident', 
          key: 'tenant', 
          render: r => `<strong>${r.tenant ? r.tenant.name : 'Resident'}</strong>` 
        },
        { 
          label: 'Property', 
          key: 'property', 
          render: r => r.property ? r.property.title : 'Unit' 
        },
        { 
          label: 'Amount', 
          key: 'amount', 
          render: r => Formatters.currency(r.amount) 
        },
        { 
          label: 'Due Date', 
          key: 'dueDate', 
          render: r => Formatters.date(r.dueDate) 
        },
        { 
          label: 'Status', 
          key: 'status', 
          render: r => {
            const s = String(r.status).toLowerCase();
            const badgeClass = s === 'paid' ? 'badge-success' : (s === 'overdue' ? 'badge-danger' : 'badge-warning');
            return `<span class="badge ${badgeClass}">${String(r.status).toUpperCase()}</span>`;
          } 
        }
      ],
      data: enriched,
      emptyMessage: 'No payment transactions recorded yet.'
    });
  }

  function renderMaintenanceSummary() {
    const container = document.getElementById('maintenance-summary-container') || 
                      document.getElementById('pending-tickets-list');
    if (!container) return;

    const allTickets = typeof MaintenanceService !== 'undefined' ? MaintenanceService.getAll() : [];
    const openTickets = allTickets
      .filter(t => String(t.status).toLowerCase() !== 'resolved')
      .slice(0, 4);

    if (openTickets.length === 0) {
      container.innerHTML = `
        <div class="table-empty-state" style="padding: 1.5rem 0;">
          <div class="empty-icon" style="margin-bottom: 8px; color: var(--color-success);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="empty-title" style="font-size: 0.95rem;">All Caught Up</div>
          <div class="empty-desc" style="font-size: 0.85rem;">No open or urgent maintenance tickets.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = openTickets.map(t => {
      const enriched = typeof MaintenanceService.enrich === 'function' ? MaintenanceService.enrich(t) : t;
      const p = String(t.priority).toLowerCase();
      const priorityBadge = (p === 'urgent' || p === 'high') ? 'badge-danger' : 'badge-warning';
      return `
        <div style="padding: 0.75rem 0; border-bottom: 1px solid var(--color-border); display: flex; flex-direction: column; gap: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <strong style="font-size: var(--font-size-sm); color: var(--color-text-primary);">${t.title}</strong>
            <span class="badge ${priorityBadge}">${String(t.priority).toUpperCase()}</span>
          </div>
          <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">
            ${enriched.property ? enriched.property.title : 'Assigned Unit'} • ${Formatters.relativeTime(t.createdAt)}
          </div>
        </div>
      `;
    }).join('');
  }

  function renderPropertiesPreview() {
    const container = document.getElementById('dashboard-properties-preview');
    if (!container) return;

    const properties = typeof PropertyService !== 'undefined' ? PropertyService.getAll().slice(0, 3) : [];

    if (properties.length === 0) {
      container.innerHTML = '<div class="table-empty-state"><div class="empty-desc">No properties added yet.</div></div>';
      return;
    }

    container.innerHTML = properties.map(p => {
      const s = String(p.status).toLowerCase();
      const statusBadge = s === 'occupied' ? 'badge-success' : (s === 'vacant' || s === 'available' ? 'badge-primary' : 'badge-warning');
      const fallbackImg = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80';
      return `
        <div class="card property-card" style="display: flex; flex-direction: column; overflow: hidden;">
          <div style="height: 140px; position: relative; background: var(--color-surface-hover);">
            <img src="${p.image || fallbackImg}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='${fallbackImg}'" />
            <span class="badge ${statusBadge}" style="position: absolute; top: 10px; right: 10px;">${String(p.status).toUpperCase()}</span>
          </div>
          <div class="card-body" style="padding: var(--space-4);">
            <h4 style="font-size: var(--font-size-sm); font-weight: 600; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.title}</h4>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: 8px;">${p.city} • ${p.bedrooms} Beds</div>
            <div style="font-size: var(--font-size-sm); font-weight: 700; color: var(--color-primary);">${Formatters.currency(p.rent)}/mo</div>
          </div>
        </div>
      `;
    }).join('');
  }
});
