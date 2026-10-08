/**
 * RentEase - Tenant Dashboard Controller
 * Displays personalized tenant KPIs, assigned home details, invoices, and maintenance tickets.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure seed data is initialized
  if (typeof SeedData !== 'undefined' && SeedData.init) {
    SeedData.init();
  }

  // Guard route for Tenant role
  if (typeof AuthService !== 'undefined' && !AuthService.requireAuth(ROLES.TENANT)) {
    return;
  }

  // Render navigation components
  if (typeof Navbar !== 'undefined') Navbar.render('#navbar-container');
  if (typeof Sidebar !== 'undefined') Sidebar.render('#sidebar-container', 'dashboard');

  const currentUser = typeof AuthService !== 'undefined' ? AuthService.getCurrentUser() : null;
  if (!currentUser) return;

  // Personalize welcome title
  const welcomeTitle = document.getElementById('tenant-welcome-title');
  if (welcomeTitle) {
    welcomeTitle.textContent = `Welcome Home, ${currentUser.name.split(' ')[0]}!`;
  }

  // Retrieve tenant's relational data
  const lease = typeof LeaseService !== 'undefined' ? LeaseService.getByTenantId(currentUser.id) : null;
  const property = (lease && typeof PropertyService !== 'undefined') ? PropertyService.getById(lease.propertyId) : null;
  const payments = (lease && typeof PaymentService !== 'undefined') ? PaymentService.getByTenantId(currentUser.id) : [];
  const maintenance = typeof MaintenanceService !== 'undefined' ? MaintenanceService.getByTenantId(currentUser.id) : [];

  renderKPIs(lease, property, payments, maintenance);
  renderPropertySpotlight(lease, property);
  renderInvoicesSummary(payments);
  renderRecentMaintenance(maintenance);

  function renderKPIs(l, prop, pymts, maint) {
    const elUnit = document.getElementById('tenant-kpi-unit');
    const elUnitSub = document.getElementById('tenant-kpi-unit-sub');
    const elRent = document.getElementById('tenant-kpi-rent');
    const elDueStatus = document.getElementById('tenant-kpi-due-status');
    const elLeaseStatus = document.getElementById('tenant-kpi-lease-status');
    const elLeaseExpiry = document.getElementById('tenant-kpi-lease-expiry');
    const elMaintCount = document.getElementById('tenant-kpi-maint');

    // 1. Current Unit KPI
    if (elUnit) {
      elUnit.textContent = prop ? prop.title : (l ? 'Assigned Residence' : 'No Unit Assigned');
      elUnit.title = prop ? prop.title : '';
    }
    if (elUnitSub) {
      elUnitSub.textContent = prop ? `${prop.address}, ${prop.city}` : 'No active residency';
    }

    // 2. Monthly Rent KPI
    if (elRent) {
      elRent.textContent = l ? Formatters.currency(l.monthlyRent) : (prop ? Formatters.currency(prop.rent) : '₹0');
    }
    if (elDueStatus) {
      const pendingPymt = pymts.find(p => String(p.status).toLowerCase() !== 'paid');
      if (pendingPymt) {
        elDueStatus.innerHTML = `<span style="color: var(--color-warning);">Due ${Formatters.date(pendingPymt.dueDate)}</span>`;
      } else {
        elDueStatus.textContent = 'All payments settled';
      }
    }

    // 3. Lease Status KPI
    if (elLeaseStatus) {
      if (l) {
        const s = String(l.status).toLowerCase();
        const badgeColor = s === 'active' ? 'var(--color-success)' : (s === 'upcoming' ? 'var(--color-primary)' : 'var(--color-warning)');
        elLeaseStatus.innerHTML = `<span style="color: ${badgeColor};">${String(l.status).toUpperCase()}</span>`;
      } else {
        elLeaseStatus.textContent = 'No Lease';
      }
    }
    if (elLeaseExpiry) {
      elLeaseExpiry.textContent = l ? `Until ${Formatters.date(l.endDate)}` : 'Contact management';
    }

    // 4. Active Tickets KPI
    if (elMaintCount) {
      const unresolved = maint.filter(m => String(m.status).toLowerCase() !== 'resolved');
      elMaintCount.textContent = unresolved.length;
    }
  }

  function renderPropertySpotlight(l, prop) {
    const container = document.getElementById('tenant-prop-spotlight');
    if (!container) return;

    if (!prop) {
      container.innerHTML = `
        <div class="table-empty-state" style="padding: 2rem 1rem; text-align: center;">
          <div class="empty-icon" style="margin-bottom: 8px; color: var(--color-text-muted);">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <h4 style="font-size: 1rem; font-weight: 600; margin-bottom: 4px;">No Assigned Property</h4>
          <p style="font-size: 0.85rem; color: var(--color-text-secondary); max-width: 360px; margin: 0 auto;">
            You do not currently have an active tenancy agreement assigned. Please contact the property manager.
          </p>
        </div>
      `;
      return;
    }

    const fallbackImg = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80';
    const amenitiesHtml = (prop.amenities && prop.amenities.length > 0)
      ? `<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 16px;">
          ${prop.amenities.slice(0, 4).map(a => `<span class="badge badge-secondary" style="font-size: 0.725rem; padding: 4px 8px; display: inline-flex; align-items: center; gap: 4px;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-primary);"><polyline points="20 6 9 17 4 12"/></svg>${a}</span>`).join('')}
        </div>`
      : '';

    container.innerHTML = `
      <div style="display: flex; flex-direction: column;">
        <div style="height: 180px; position: relative; border-radius: var(--radius-md); overflow: hidden; background: var(--color-surface-hover); margin-bottom: var(--space-4);">
          <img src="${prop.image || fallbackImg}" alt="${prop.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='${fallbackImg}'" />
          <span class="badge badge-success" style="position: absolute; top: 12px; right: 12px;">ACTIVE RESIDENCE</span>
        </div>
        <div>
          <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); text-transform: uppercase; font-weight: 600;">
            ${prop.type || 'Apartment'} • ${prop.city}
          </div>
          <h3 style="font-size: var(--font-size-base); font-weight: 600; margin: 4px 0 6px;">${prop.title}</h3>
          <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: 12px; display: flex; align-items: center; gap: 4px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            ${prop.address}
          </p>

          <div style="display: flex; gap: 16px; font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: 12px; padding: 10px 0; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
            <span style="display: inline-flex; align-items: center; gap: 4px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
              ${prop.bedrooms || 1} Bedrooms
            </span>
            <span style="display: inline-flex; align-items: center; gap: 4px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-1C4.67 2.5 4 3.17 4 4v17h16V4c0-.83-.67-1.5-1.5-1.5a1.5 1.5 0 0 0-1 1L15 6"/><path d="M4 14h16"/></svg>
              ${prop.bathrooms || 1} Bathrooms
            </span>
            <span style="display: inline-flex; align-items: center; gap: 4px; font-weight: 600; color: var(--color-text-primary);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              ${l ? Formatters.currency(l.monthlyRent) : Formatters.currency(prop.rent)}/mo
            </span>
          </div>

          ${amenitiesHtml}

          <div style="display: flex; gap: 8px; margin-top: auto;">
            <a href="property.html" class="btn btn-secondary btn-sm" style="flex: 1; text-align: center;">View Home Details</a>
            <a href="maintenance.html?action=new" class="btn btn-primary btn-sm" style="flex: 1; text-align: center;">Request Repair</a>
          </div>
        </div>
      </div>
    `;
  }

  function renderInvoicesSummary(pymts) {
    const container = document.getElementById('tenant-payments-summary');
    if (!container) return;

    if (!pymts || pymts.length === 0) {
      container.innerHTML = `
        <div class="table-empty-state" style="padding: 2rem 1rem; text-align: center;">
          <div class="empty-icon" style="margin-bottom: 8px; color: var(--color-text-muted);">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
            </svg>
          </div>
          <h4 style="font-size: 1rem; font-weight: 600; margin-bottom: 4px;">No Invoices Found</h4>
          <p style="font-size: 0.85rem; color: var(--color-text-secondary);">No rental payment statements are on record yet.</p>
        </div>
      `;
      return;
    }

    const recentList = pymts.slice(0, 4);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${recentList.map(p => {
          const s = String(p.status).toLowerCase();
          const badgeClass = s === 'paid' ? 'badge-success' : (s === 'overdue' ? 'badge-danger' : 'badge-warning');
          const isPending = s !== 'paid';

          return `
            <div style="padding: 10px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; background: var(--color-surface);">
              <div>
                <div style="font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary);">
                  ${Formatters.currency(p.amount)}
                </div>
                <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">
                  Due: ${Formatters.date(p.dueDate)}
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="badge ${badgeClass}">${String(p.status).toUpperCase()}</span>
                ${isPending ? `<button type="button" class="btn btn-primary btn-sm btn-quick-pay" data-id="${p.id}" style="padding: 4px 8px; font-size: 0.75rem;">Pay</button>` : ''}
              </div>
            </div>
          `;
        }).join('')}
        <div style="margin-top: 8px; text-align: right;">
          <a href="payments.html" class="text-xs font-semibold text-primary">View complete payment ledger &rarr;</a>
        </div>
      </div>
    `;

    // Bind Quick Pay buttons
    container.querySelectorAll('.btn-quick-pay').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        PaymentService.markAsPaid(id);
        if (typeof Toast !== 'undefined') Toast.success('Rent payment processed successfully!');
        const updatedPayments = PaymentService.getAll({ tenantId: currentUser.id });
        renderKPIs(lease, property, updatedPayments, maintenance);
        renderInvoicesSummary(updatedPayments);
      });
    });
  }

  function renderRecentMaintenance(maint) {
    const container = document.getElementById('tenant-maintenance-table-container');
    if (!container) return;

    if (!maint || maint.length === 0) {
      container.innerHTML = `
        <div class="table-empty-state" style="padding: 2.5rem 1rem; text-align: center;">
          <div class="empty-icon" style="margin-bottom: 8px; color: var(--color-text-muted);">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          <h4 style="font-size: 1rem; font-weight: 600; margin-bottom: 4px;">No Maintenance Requests</h4>
          <p style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 12px;">Everything in your apartment is in order.</p>
          <a href="maintenance.html?action=new" class="btn btn-secondary btn-sm">Report an Issue</a>
        </div>
      `;
      return;
    }

    const recentTickets = maint.slice(0, 5);

    container.innerHTML = Table.render({
      columns: [
        { 
          label: 'Issue Title', 
          key: 'title', 
          render: r => `<strong>${r.title}</strong>` 
        },
        { 
          label: 'Priority', 
          key: 'priority', 
          render: r => {
            const p = String(r.priority).toLowerCase();
            const b = (p === 'urgent' || p === 'high') ? 'badge-danger' : (p === 'medium' ? 'badge-warning' : 'badge-secondary');
            return `<span class="badge ${b}">${String(r.priority).toUpperCase()}</span>`;
          } 
        },
        { 
          label: 'Status', 
          key: 'status', 
          render: r => {
            const s = String(r.status).toLowerCase();
            const b = s === 'resolved' ? 'badge-success' : (s === 'in progress' || s === 'in_progress' ? 'badge-info' : 'badge-warning');
            return `<span class="badge ${b}">${String(r.status).toUpperCase()}</span>`;
          } 
        },
        { 
          label: 'Reported', 
          key: 'createdAt', 
          render: r => Formatters.relativeTime(r.createdAt) 
        }
      ],
      data: recentTickets,
      emptyMessage: 'No maintenance inquiries found.'
    });
  }
});
