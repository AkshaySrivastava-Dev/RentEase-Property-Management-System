/**
 * RentEase - Tenant Maintenance Controller
 * Handles reporting maintenance issues, submitting tickets, and tracking resolution status with tenant isolation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure seed data is initialized
  if (typeof SeedData !== 'undefined' && SeedData.init) {
    SeedData.init();
  }

  // Route Guard
  if (typeof AuthService !== 'undefined' && !AuthService.requireAuth(ROLES.TENANT)) {
    return;
  }

  // Navigation mounts
  if (typeof Navbar !== 'undefined') Navbar.render('#navbar-container');
  if (typeof Sidebar !== 'undefined') Sidebar.render('#sidebar-container', 'maintenance');

  const tenant = typeof AuthService !== 'undefined' ? AuthService.getCurrentUser() : null;
  if (!tenant) return;

  const container = document.getElementById('tenant-tickets-table-container') || 
                    document.getElementById('tenant-maintenance-table');
  const requestBtn = document.getElementById('btn-new-ticket') || 
                     document.getElementById('new-maintenance-btn');
  const modalForm = document.getElementById('maintenance-form');
  const filterStatusSelect = document.getElementById('filter-tenant-maint-status');
  const searchInput = document.getElementById('tenant-maint-search');
  const errorAlert = document.getElementById('maint-error-alert');

  // Resolve assigned property
  const lease = typeof LeaseService !== 'undefined' ? LeaseService.getByTenantId(tenant.id) : null;
  let assignedProperty = null;
  if (lease && typeof PropertyService !== 'undefined') {
    assignedProperty = PropertyService.getById(lease.propertyId);
  }

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

  // 1. Initial Load of Tenant's Tickets
  loadRequests();

  // 1b. Handle quick action parameter (?action=new)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('action') === 'new') {
    setTimeout(() => {
      if (requestBtn) requestBtn.click();
    }, 100);
  }

  // 2. Filter & Search listeners
  if (filterStatusSelect) {
    filterStatusSelect.addEventListener('change', () => loadRequests());
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => loadRequests());
  }

  // 3. Open New Ticket Modal
  if (requestBtn) {
    requestBtn.addEventListener('click', () => {
      clearError();
      if (modalForm) modalForm.reset();

      // Pre-fill assigned property fields
      const propTitleInput = document.getElementById('maint-property-title');
      const propIdInput = document.getElementById('maint-property-id');

      if (propTitleInput) {
        propTitleInput.value = assignedProperty ? assignedProperty.title : 'General Rental Unit';
      }
      if (propIdInput) {
        propIdInput.value = assignedProperty ? assignedProperty.id : (lease ? lease.propertyId : 'prop_1');
      }

      if (typeof Modal !== 'undefined') {
        Modal.open('maintenance-modal');
      }
    });
  }

  // 4. Submit New Ticket Handler
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError();

      const titleInput = document.getElementById('maint-title');
      const descInput = document.getElementById('maint-description');
      const prioritySelect = document.getElementById('maint-priority');
      const propIdInput = document.getElementById('maint-property-id');

      const title = titleInput ? titleInput.value.trim() : '';
      const description = descInput ? descInput.value.trim() : '';
      const priority = prioritySelect ? prioritySelect.value : 'Medium';
      const propertyId = assignedProperty ? assignedProperty.id : (lease ? lease.propertyId : null);

      if (!propertyId) {
        showError('No active rental unit is assigned to your account. Maintenance cannot be reported without an active tenancy.');
        return;
      }

      // Validation
      if (!title) {
        showError('Please enter a title for the issue.');
        if (titleInput) titleInput.focus();
        return;
      }

      if (!description) {
        showError('Please describe the problem so our repair team can assist.');
        if (descInput) descInput.focus();
        return;
      }

      // Create ticket via MaintenanceService (Initial status: "Open")
      const created = MaintenanceService.create({
        propertyId: propertyId,
        tenantId: tenant.id,
        title: title,
        description: description,
        priority: priority,
        status: 'Open'
      });

      if (typeof Toast !== 'undefined') {
        Toast.success('Maintenance ticket submitted successfully!');
      }

      if (typeof Modal !== 'undefined') {
        Modal.close('maintenance-modal');
      }

      // Refresh list immediately
      loadRequests();
    });
  }

  // 5. Render Tenant Tickets (Strict Tenant Isolation)
  function loadRequests() {
    if (!container) return;

    // Strict Tenant Isolation: only query tickets belonging to this tenant
    let tickets = MaintenanceService.getByTenantId(tenant.id);

    // Apply status filter
    const statusFilter = filterStatusSelect ? filterStatusSelect.value : 'All';
    if (statusFilter && statusFilter !== 'All') {
      tickets = tickets.filter(t => String(t.status).toLowerCase() === statusFilter.toLowerCase());
    }

    // Apply search filter
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (query) {
      tickets = tickets.filter(t => 
        (t.title && t.title.toLowerCase().includes(query)) ||
        (t.description && t.description.toLowerCase().includes(query))
      );
    }

    const enriched = tickets.map(t => typeof MaintenanceService.enrich === 'function' ? MaintenanceService.enrich(t) : t);

    container.innerHTML = Table.render({
      columns: [
        { 
          label: 'Issue & Description', 
          key: 'title', 
          render: r => `
            <div>
              <strong style="color: var(--color-text-primary); font-size: var(--font-size-sm);">${r.title}</strong>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: 4px; max-width: 420px; line-height: 1.4;">
                ${r.description}
              </div>
            </div>
          ` 
        },
        { 
          label: 'Unit', 
          key: 'property', 
          render: r => r.property ? r.property.title : 'Rental Home' 
        },
        { 
          label: 'Priority', 
          key: 'priority', 
          render: r => {
            const p = String(r.priority).toLowerCase();
            const badgeClass = (p === 'urgent' || p === 'high') ? 'badge-danger' : (p === 'medium' ? 'badge-warning' : 'badge-secondary');
            return `<span class="badge ${badgeClass}">${String(r.priority).toUpperCase()}</span>`;
          } 
        },
        { 
          label: 'Status', 
          key: 'status', 
          render: r => {
            const s = String(r.status).toLowerCase();
            const badgeClass = s === 'resolved' ? 'badge-success' : (s === 'in progress' || s === 'in_progress' ? 'badge-info' : 'badge-warning');
            return `<span class="badge ${badgeClass}"><span class="badge-dot"></span>${r.status}</span>`;
          } 
        },
        { 
          label: 'Date Reported', 
          key: 'createdAt', 
          render: r => Formatters.relativeTime(r.createdAt) 
        }
      ],
      data: enriched,
      emptyMessage: 'No maintenance tickets on record. Everything is running smoothly!'
    });
  }
});
