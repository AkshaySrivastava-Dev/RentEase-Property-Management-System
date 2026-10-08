/**
 * RentEase - Admin Leases Controller
 * Manages lease agreements, creation modal, occupancy synchronization, and termination.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Guard route for Admin role
  if (typeof AuthService !== 'undefined' && !AuthService.requireAuth(ROLES.ADMIN)) {
    return;
  }

  // Render navigation components
  if (typeof Navbar !== 'undefined') Navbar.render('#navbar-container');
  if (typeof Sidebar !== 'undefined') Sidebar.render('#sidebar-container', 'leases');

  let currentFilterStatus = 'All';
  let searchQuery = '';

  const tableContainer = document.getElementById('leases-table-container');
  const searchInput = document.getElementById('lease-search-input');
  const statusFilter = document.getElementById('filter-lease-status');
  const addBtn = document.getElementById('btn-create-lease') || document.getElementById('add-lease-btn');
  const leaseModalForm = document.getElementById('lease-form');
  const errorAlert = document.getElementById('lease-error-alert');

  loadLeases();

  // Search Filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      loadLeases();
    });
  }

  // Status Filter
  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      currentFilterStatus = e.target.value;
      loadLeases();
    });
  }

  // Open Create Lease Modal
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      openCreateLeaseModal();
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

  function openCreateLeaseModal() {
    if (leaseModalForm) leaseModalForm.reset();
    clearError();

    populatePropertyAndTenantOptions();

    // Default dates: today to +1 year
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

    const startInput = document.getElementById('lease-start-date');
    const endInput = document.getElementById('lease-end-date');
    if (startInput) startInput.value = today.toISOString().split('T')[0];
    if (endInput) endInput.value = nextYear.toISOString().split('T')[0];

    const statusInput = document.getElementById('lease-status');
    if (statusInput) statusInput.value = 'Active';

    if (typeof Modal !== 'undefined') {
      Modal.open('lease-modal');
    }
  }

  function populatePropertyAndTenantOptions() {
    const propSelect = document.getElementById('lease-property-id');
    const tenantSelect = document.getElementById('lease-tenant-id');
    const propInfo = document.getElementById('lease-property-info');
    const rentInput = document.getElementById('lease-monthly-rent');
    const depositInput = document.getElementById('lease-deposit');

    if (propSelect) {
      const allProps = typeof PropertyService !== 'undefined' ? PropertyService.getAll() : [];

      if (allProps.length === 0) {
        propSelect.innerHTML = '<option value="">No properties in portfolio</option>';
      } else {
        propSelect.innerHTML = `
          <option value="">-- Choose a property --</option>
          ${allProps.map(p => {
            const isAvail = String(p.status).toLowerCase() === 'available' || String(p.status).toLowerCase() === 'vacant';
            return `<option value="${p.id}" data-rent="${p.rent}" data-status="${p.status}">
              ${p.title} (${p.city}) — ${Formatters.currency(p.rent)}/mo [${isAvail ? 'Available' : p.status}]
            </option>`;
          }).join('')}
        `;
      }

      propSelect.onchange = () => {
        const selectedId = propSelect.value;
        const selectedProp = allProps.find(p => p.id === selectedId);
        if (selectedProp) {
          if (rentInput) rentInput.value = selectedProp.rent;
          if (depositInput) depositInput.value = selectedProp.rent * 2;
          if (propInfo) {
            const isOccupied = String(selectedProp.status).toLowerCase() === 'occupied';
            propInfo.innerHTML = isOccupied 
              ? `<span style="display: inline-flex; align-items: center; gap: 4px; color: var(--color-warning);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg> Note: Currently marked Occupied. Creating an active lease will reassign residency.</span>`
              : `<span style="display: inline-flex; align-items: center; gap: 4px; color: var(--color-success);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Property is Available for occupancy.</span>`;
          }
        } else {
          if (propInfo) propInfo.textContent = '';
        }
      };
    }

    if (tenantSelect) {
      // Find tenants from TenantService or storage users
      let tenants = typeof TenantService !== 'undefined' ? TenantService.getAll() : [];
      if (tenants.length === 0 && typeof Storage !== 'undefined') {
        const users = Storage.get(STORAGE_KEYS.USERS, []);
        tenants = users.filter(u => u.role === 'tenant');
      }

      if (tenants.length === 0) {
        tenantSelect.innerHTML = '<option value="">No registered residents found</option>';
      } else {
        tenantSelect.innerHTML = `
          <option value="">-- Choose a tenant --</option>
          ${tenants.map(t => `<option value="${t.id}">${t.name} (${t.email})</option>`).join('')}
        `;
      }
    }
  }

  // Handle Form Submission
  if (leaseModalForm) {
    leaseModalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError();

      const propSelect = document.getElementById('lease-property-id');
      const tenantSelect = document.getElementById('lease-tenant-id');
      const startInput = document.getElementById('lease-start-date');
      const endInput = document.getElementById('lease-end-date');
      const rentInput = document.getElementById('lease-monthly-rent');
      const depositInput = document.getElementById('lease-deposit');
      const statusSelect = document.getElementById('lease-status');

      const propertyId = propSelect ? propSelect.value : '';
      const tenantId = tenantSelect ? tenantSelect.value : '';
      const startDate = startInput ? startInput.value : '';
      const endDate = endInput ? endInput.value : '';
      const monthlyRent = rentInput ? Number(rentInput.value) : 0;
      const securityDeposit = depositInput ? Number(depositInput.value) : 0;
      const status = statusSelect ? statusSelect.value : 'Active';

      // Validations
      if (!propertyId) {
        showError('Please select a property for this lease.');
        if (propSelect) propSelect.focus();
        return;
      }

      if (!tenantId) {
        showError('Please select a resident / tenant.');
        if (tenantSelect) tenantSelect.focus();
        return;
      }

      if (!startDate) {
        showError('Please specify the lease start date.');
        if (startInput) startInput.focus();
        return;
      }

      if (!endDate) {
        showError('Please specify the lease end date.');
        if (endInput) endInput.focus();
        return;
      }

      // Ensure end date is after start date
      if (new Date(endDate) <= new Date(startDate)) {
        showError('Lease end date must be strictly after the start date.');
        if (endInput) endInput.focus();
        return;
      }

      if (!monthlyRent || monthlyRent <= 0 || isNaN(monthlyRent)) {
        showError('Please enter a valid monthly rent amount greater than 0.');
        if (rentInput) rentInput.focus();
        return;
      }

      if (securityDeposit < 0 || isNaN(securityDeposit)) {
        showError('Security deposit cannot be negative.');
        if (depositInput) depositInput.focus();
        return;
      }

      // Check for duplicate active lease on same property if creating an Active lease
      if (status.toLowerCase() === 'active') {
        const existingActive = typeof LeaseService !== 'undefined' ? LeaseService.getByPropertyId(propertyId) : null;
        if (existingActive) {
          showError('This property already has an active lease agreement (' + existingActive.id + '). Please terminate the previous lease first or choose another unit.');
          return;
        }
      }

      // Create lease via LeaseService
      const newLease = LeaseService.create({
        propertyId,
        tenantId,
        startDate,
        endDate,
        monthlyRent,
        securityDeposit,
        status
      });

      if (!newLease) {
        showError('Failed to create lease agreement. Please try again.');
        return;
      }

      if (typeof Toast !== 'undefined') {
        Toast.success('Lease agreement created successfully! Property occupancy updated.');
      }

      if (typeof Modal !== 'undefined') {
        Modal.close('lease-modal');
      }

      loadLeases();
    });
  }

  function loadLeases() {
    if (!tableContainer) return;

    let leases = LeaseService.getAll({
      status: currentFilterStatus,
      search: searchQuery
    });

    if (leases.length === 0) {
      tableContainer.innerHTML = `
        <div style="padding: var(--space-12) var(--space-4); text-align: center;" class="table-empty-state">
          <div class="empty-icon" style="margin-bottom: var(--space-3); color: var(--color-text-muted);">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <h3 style="font-size: var(--font-size-lg); font-weight: 600; margin-bottom: var(--space-2);">No Lease Agreements Found</h3>
          <p style="color: var(--color-text-secondary); max-width: 440px; margin: 0 auto;">
            No lease agreements match your current filter. Click "+ Create New Lease" to initiate a tenancy contract.
          </p>
        </div>
      `;
      return;
    }

    const enriched = leases.map(l => typeof LeaseService.enrich === 'function' ? LeaseService.enrich(l) : l);

    tableContainer.innerHTML = Table.render({
      columns: [
        { 
          label: 'Property', 
          key: 'property', 
          render: r => `
            <div>
              <strong>${r.property ? r.property.title : 'Unit'}</strong>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">${r.property ? r.property.city : ''}</div>
            </div>
          ` 
        },
        { 
          label: 'Resident', 
          key: 'tenant', 
          render: r => `
            <div>
              <strong>${r.tenant ? r.tenant.name : 'Resident'}</strong>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">${r.tenant ? r.tenant.email : ''}</div>
            </div>
          ` 
        },
        { 
          label: 'Monthly Rent', 
          key: 'monthlyRent', 
          render: r => `<span style="font-weight: 700; color: var(--color-text-primary);">${Formatters.currency(r.monthlyRent)}/mo</span>` 
        },
        { 
          label: 'Security Deposit', 
          key: 'securityDeposit', 
          render: r => Formatters.currency(r.securityDeposit) 
        },
        { 
          label: 'Tenancy Term', 
          key: 'dates', 
          render: r => `
            <div>${Formatters.date(r.startDate)} <span style="color: var(--color-text-muted);">to</span> ${Formatters.date(r.endDate)}</div>
          ` 
        },
        { 
          label: 'Status', 
          key: 'status', 
          render: r => {
            const s = String(r.status).toLowerCase();
            const badgeClass = s === 'active' ? 'badge-success' : (s === 'upcoming' ? 'badge-primary' : 'badge-secondary');
            return `<span class="badge ${badgeClass}">${String(r.status).toUpperCase()}</span>`;
          } 
        },
        {
          label: 'Actions',
          key: 'actions',
          align: 'right',
          render: r => {
            const s = String(r.status).toLowerCase();
            if (s === 'active') {
              return `
                <button type="button" class="btn btn-secondary btn-sm terminate-lease-btn" data-id="${r.id}" data-prop="${r.propertyId}" data-title="${r.property?.title || 'Unit'}">
                  Terminate
                </button>
              `;
            }
            return '<span style="color: var(--color-text-muted); font-size: var(--font-size-xs);">Inactive</span>';
          }
        }
      ],
      data: enriched,
      emptyMessage: 'No lease agreements on record.'
    });

    // Bind Terminate Lease Buttons
    tableContainer.querySelectorAll('.terminate-lease-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title');
        if (confirm(`Are you sure you want to terminate this lease for "${title}"? The property status will automatically revert to Available.`)) {
          LeaseService.terminate(id);
          if (typeof Toast !== 'undefined') {
            Toast.info(`Lease agreement terminated. "${title}" is now Available.`);
          }
          loadLeases();
        }
      });
    });
  }
});
