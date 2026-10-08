/**
 * RentEase - Admin Payments Controller
 * Manages rental payments tracking, KPIs, invoice recording, and Mark Paid updates.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Guard route for Admin role
  if (typeof AuthService !== 'undefined' && !AuthService.requireAuth(ROLES.ADMIN)) {
    return;
  }

  // Render navigation components
  if (typeof Navbar !== 'undefined') Navbar.render('#navbar-container');
  if (typeof Sidebar !== 'undefined') Sidebar.render('#sidebar-container', 'payments');

  let currentFilterStatus = 'All';
  let searchQuery = '';

  const tableContainer = document.getElementById('payments-table-container');
  const searchInput = document.getElementById('payment-search-input');
  const statusFilter = document.getElementById('filter-payment-status');
  const addBtn = document.getElementById('btn-record-payment') || document.getElementById('record-payment-btn');
  const paymentModalForm = document.getElementById('payment-form');
  const errorAlert = document.getElementById('payment-error-alert');

  loadPayments();

  // Search Filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      loadPayments();
    });
  }

  // Status Filter
  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      currentFilterStatus = e.target.value;
      loadPayments();
    });
  }

  // Record Payment Button
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      populateLeaseOptions();
      if (paymentModalForm) paymentModalForm.reset();
      clearError();
      const today = new Date().toISOString().split('T')[0];
      const dueInput = document.getElementById('payment-due-date');
      if (dueInput) dueInput.value = today;
      if (typeof Modal !== 'undefined') Modal.open('payment-modal');
    });
  }

  function clearError() {
    if (errorAlert) {
      errorAlert.textContent = '';
      errorAlert.style.display = 'none';
    }
  }

  function showError(msg) {
    if (errorAlert) {
      errorAlert.textContent = msg;
      errorAlert.style.display = 'block';
    }
    if (typeof Toast !== 'undefined') Toast.error(msg);
  }

  function populateLeaseOptions() {
    const leaseSelect = document.getElementById('payment-lease-id');
    if (!leaseSelect) return;

    const allLeases = typeof LeaseService !== 'undefined' ? LeaseService.getAll() : [];
    const activeLeases = allLeases.filter(l => String(l.status).toLowerCase() === 'active');

    if (activeLeases.length === 0) {
      leaseSelect.innerHTML = '<option value="">No active leases found</option>';
      return;
    }

    leaseSelect.innerHTML = activeLeases.map(l => {
      const enriched = typeof LeaseService.enrich === 'function' ? LeaseService.enrich(l) : l;
      return `<option value="${l.id}">${enriched.tenant?.name || 'Resident'} — ${enriched.property?.title || 'Property'} (${Formatters.currency(l.monthlyRent)}/mo)</option>`;
    }).join('');
  }

  // Submit Record Payment Form
  if (paymentModalForm) {
    paymentModalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError();

      const leaseSelect = document.getElementById('payment-lease-id');
      const amountInput = document.getElementById('payment-amount');
      const dueInput = document.getElementById('payment-due-date');
      const statusSelect = document.getElementById('payment-status');

      const leaseId = leaseSelect ? leaseSelect.value : '';
      const amount = amountInput ? Number(amountInput.value) : 0;
      const dueDate = dueInput ? dueInput.value : '';
      const status = statusSelect ? statusSelect.value : 'Pending';

      if (!leaseId) {
        showError('Please select an active tenancy lease agreement.');
        return;
      }

      if (!amount || amount <= 0 || isNaN(amount)) {
        showError('Please enter a valid invoice amount greater than 0.');
        if (amountInput) amountInput.focus();
        return;
      }

      if (!dueDate) {
        showError('Please specify the payment due date.');
        if (dueInput) dueInput.focus();
        return;
      }

      const lease = typeof LeaseService !== 'undefined' ? LeaseService.getById(leaseId) : null;
      const res = PaymentService.create({
        leaseId,
        tenantId: lease ? lease.tenantId : '',
        amount,
        dueDate,
        status,
        paidDate: status.toLowerCase() === 'paid' ? new Date().toISOString().split('T')[0] : null
      });

      if (!res) {
        showError('Failed to record payment invoice. Please try again.');
        return;
      }

      if (typeof Toast !== 'undefined') Toast.success('Payment invoice recorded successfully!');
      if (typeof Modal !== 'undefined') Modal.close('payment-modal');

      loadPayments();
    });
  }

  function updateKPIs() {
    const stats = PaymentService.getStats();

    const elCollected = document.getElementById('pay-kpi-collected');
    const elCollectedSub = document.getElementById('pay-kpi-collected-sub');
    const elPending = document.getElementById('pay-kpi-pending');
    const elPendingSub = document.getElementById('pay-kpi-pending-sub');
    const elOverdue = document.getElementById('pay-kpi-overdue');

    if (elCollected) elCollected.textContent = Formatters.currency(stats.totalCollected);
    if (elCollectedSub) elCollectedSub.textContent = `${stats.paidCount} payment${stats.paidCount === 1 ? '' : 's'} marked paid`;
    if (elPending) elPending.textContent = Formatters.currency(stats.pendingAmount);
    if (elPendingSub) elPendingSub.textContent = `${stats.pendingCount + stats.overdueCount} pending invoice${(stats.pendingCount + stats.overdueCount) === 1 ? '' : 's'}`;
    if (elOverdue) elOverdue.textContent = stats.overdueCount;
  }

  function loadPayments() {
    updateKPIs();

    if (!tableContainer) return;

    let payments = PaymentService.getAll({
      status: currentFilterStatus,
      search: searchQuery
    });

    if (payments.length === 0) {
      tableContainer.innerHTML = `
        <div style="padding: var(--space-12) var(--space-4); text-align: center;" class="table-empty-state">
          <div class="empty-icon" style="margin-bottom: var(--space-3); color: var(--color-text-muted);">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
            </svg>
          </div>
          <h3 style="font-size: var(--font-size-lg); font-weight: 600; margin-bottom: var(--space-2);">No Payment Transactions Found</h3>
          <p style="color: var(--color-text-secondary); max-width: 440px; margin: 0 auto;">
            No payments match your selected search query or status filter.
          </p>
        </div>
      `;
      return;
    }

    tableContainer.innerHTML = Table.render({
      columns: [
        { 
          label: 'Resident', 
          key: 'tenant', 
          render: r => `<strong>${r.tenant ? r.tenant.name : 'Resident'}</strong>` 
        },
        { 
          label: 'Property', 
          key: 'property', 
          render: r => `<span style="font-weight: 500;">${r.property ? r.property.title : 'Unit'}</span>` 
        },
        { 
          label: 'Amount', 
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
          label: 'Actions',
          key: 'actions',
          align: 'right',
          render: r => {
            const s = String(r.status).toLowerCase();
            if (s === 'paid') {
              return '<span style="display: inline-flex; align-items: center; gap: 4px; color: var(--color-success); font-size: var(--font-size-xs); font-weight: 600;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Settled</span>';
            }
            return `
              <button type="button" class="btn btn-primary btn-sm mark-paid-btn" data-id="${r.id}" data-amount="${r.amount}" data-tenant="${r.tenant?.name || 'Resident'}">
                Mark Paid
              </button>
            `;
          }
        }
      ],
      data: payments,
      emptyMessage: 'No payment transactions recorded yet.'
    });

    // Bind Mark Paid Buttons
    tableContainer.querySelectorAll('.mark-paid-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const amount = btn.getAttribute('data-amount');
        const tenant = btn.getAttribute('data-tenant');

        // Update status in LocalStorage via PaymentService
        const res = PaymentService.markAsPaid(id);
        if (res && res.success) {
          if (typeof Toast !== 'undefined') {
            Toast.success(`Payment of ${Formatters.currency(amount)} for ${tenant} marked as Paid!`);
          }
          // Refresh table and KPIs
          loadPayments();
        } else {
          if (typeof Toast !== 'undefined') {
            Toast.error('Failed to update payment status.');
          }
        }
      });
    });
  }
});
