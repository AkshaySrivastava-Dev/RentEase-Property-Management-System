/**
 * RentEase - Tenant Payments Controller
 * Displays the authenticated tenant's invoices, payment history, KPIs, and simulated rent settlement.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Guard route for Tenant role
  if (typeof AuthService !== 'undefined' && !AuthService.requireAuth(ROLES.TENANT)) {
    return;
  }

  // Render navigation components
  if (typeof Navbar !== 'undefined') Navbar.render('#navbar-container');
  if (typeof Sidebar !== 'undefined') Sidebar.render('#sidebar-container', 'payments');

  const tenant = typeof AuthService !== 'undefined' ? AuthService.getCurrentUser() : null;
  if (!tenant) return;

  const container = document.getElementById('tenant-payments-table-container') || 
                    document.getElementById('tenant-payments-table');
  const statusFilter = document.getElementById('filter-tenant-pay-status');

  let currentFilterStatus = 'All';

  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      currentFilterStatus = e.target.value;
      loadPayments();
    });
  }

  loadPayments();

  function updateKPIs(payments) {
    const totalPaid = payments
      .filter(p => String(p.status).toLowerCase() === 'paid')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const pendingPayments = payments.filter(p => String(p.status).toLowerCase() !== 'paid');
    const pendingBalance = pendingPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const elPaid = document.getElementById('tenant-pay-total-paid');
    const elPending = document.getElementById('tenant-pay-pending-balance');
    const elPendingSub = document.getElementById('tenant-pay-pending-sub');

    if (elPaid) elPaid.textContent = Formatters.currency(totalPaid);
    if (elPending) elPending.textContent = Formatters.currency(pendingBalance);
    if (elPendingSub) {
      elPendingSub.textContent = pendingPayments.length > 0 
        ? `${pendingPayments.length} invoice${pendingPayments.length === 1 ? '' : 's'} awaiting settlement`
        : 'All rent payments settled';
    }
  }

  function loadPayments() {
    if (!container) return;

    // Strict tenant isolation: fetch only payments belonging to this tenant's active lease
    const activeLease = typeof LeaseService !== 'undefined' ? LeaseService.getByTenantId(tenant.id) : null;
    const allTenantPayments = (activeLease && typeof PaymentService !== 'undefined') 
      ? PaymentService.getByTenantId(tenant.id) 
      : [];

    updateKPIs(allTenantPayments);

    let filtered = allTenantPayments;
    if (currentFilterStatus !== 'All') {
      const fLower = currentFilterStatus.toLowerCase();
      filtered = allTenantPayments.filter(p => String(p.status).toLowerCase() === fLower);
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="padding: var(--space-12) var(--space-4); text-align: center;" class="table-empty-state">
          <div class="empty-icon" style="margin-bottom: var(--space-3); color: var(--color-text-muted);">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
            </svg>
          </div>
          <h3 style="font-size: var(--font-size-lg); font-weight: 600; margin-bottom: var(--space-2);">${activeLease ? 'No Invoices Found' : 'No Active Lease'}</h3>
          <p style="color: var(--color-text-secondary); max-width: 440px; margin: 0 auto;">
            ${activeLease ? (allTenantPayments.length === 0 ? 'No rental payment statements are on record for your tenancy.' : 'No invoices match your selected status filter.') : 'There is no active tenancy agreement on file. Invoices are generated once a lease is registered.'}
          </p>
        </div>
      `;
      return;
    }

    container.innerHTML = Table.render({
      columns: [
        { 
          label: 'Property Unit', 
          key: 'property', 
          render: r => `<span style="font-weight: 600;">${r.property ? r.property.title : 'Rental Unit'}</span>` 
        },
        { 
          label: 'Amount Due', 
          key: 'amount', 
          render: r => `<span style="font-weight: 700; color: var(--color-text-primary);">${Formatters.currency(r.amount)}</span>` 
        },
        { 
          label: 'Due Date', 
          key: 'dueDate', 
          render: r => Formatters.date(r.dueDate) 
        },
        { 
          label: 'Paid Date', 
          key: 'paidDate', 
          render: r => r.paidDate ? `<span style="color: var(--color-success); font-weight: 500;">${Formatters.date(r.paidDate)}</span>` : '<span style="color: var(--color-text-muted);">—</span>' 
        },
        { 
          label: 'Status', 
          key: 'status', 
          render: r => {
            const s = String(r.status).toLowerCase();
            const badgeClass = s === 'paid' ? 'badge-success' : (s === 'overdue' ? 'badge-danger' : 'badge-warning');
            return `<span class="badge ${badgeClass}">${String(r.status).toUpperCase()}</span>`;
          } 
        },
        {
          label: 'Action',
          key: 'action',
          align: 'right',
          render: r => {
            const s = String(r.status).toLowerCase();
            if (s === 'paid') {
              return '<span style="display: inline-flex; align-items: center; gap: 4px; color: var(--color-success); font-size: var(--font-size-xs); font-weight: 600;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Settled</span>';
            }
            return `
              <button type="button" class="btn btn-primary btn-sm pay-now-btn" data-id="${r.id}" data-amount="${r.amount}">
                Pay Now
              </button>
            `;
          }
        }
      ],
      data: filtered,
      emptyMessage: 'No payment invoices on record.'
    });

    // Bind simulated Pay Now buttons
    container.querySelectorAll('.pay-now-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const amount = btn.getAttribute('data-amount');

        // Persist payment in LocalStorage
        const res = PaymentService.markAsPaid(id);
        if (res && res.success) {
          if (typeof Toast !== 'undefined') {
            Toast.success(`Payment of ${Formatters.currency(amount)} processed successfully!`);
          }
          loadPayments();
        } else {
          if (typeof Toast !== 'undefined') {
            Toast.error('Failed to process payment. Please try again.');
          }
        }
      });
    });
  }
});
