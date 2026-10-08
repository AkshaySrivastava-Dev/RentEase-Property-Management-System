/**
 * RentEase - Admin Maintenance Controller
 * Allows property managers to view all maintenance requests, search/filter, and update status (Open -> In Progress -> Resolved).
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure seed data is initialized
  if (typeof SeedData !== 'undefined' && SeedData.init) {
    SeedData.init();
  }

  // Route Guard
  if (typeof AuthService !== 'undefined' && !AuthService.requireAuth(ROLES.ADMIN)) {
    return;
  }

  // Navigation mounts
  if (typeof Navbar !== 'undefined') Navbar.render('#navbar-container');
  if (typeof Sidebar !== 'undefined') Sidebar.render('#sidebar-container', 'maintenance');

  const container = document.getElementById('maintenance-table-container');
  const statusFilterSelect = document.getElementById('filter-maint-status') || 
                             document.getElementById('maintenance-filter-status');
  const priorityFilterSelect = document.getElementById('filter-maint-priority');
  const searchInput = document.getElementById('maint-search-input');

  loadMaintenance();

  if (statusFilterSelect) {
    statusFilterSelect.addEventListener('change', () => loadMaintenance());
  }

  if (priorityFilterSelect) {
    priorityFilterSelect.addEventListener('change', () => loadMaintenance());
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => loadMaintenance());
  }

  function loadMaintenance() {
    if (!container) return;

    let tickets = typeof MaintenanceService !== 'undefined' ? MaintenanceService.getAll() : [];

    // Filter by Status
    const statusVal = statusFilterSelect ? statusFilterSelect.value : 'All';
    if (statusVal && statusVal !== 'All') {
      tickets = tickets.filter(t => {
        const s = String(t.status).toLowerCase();
        const f = statusVal.toLowerCase();
        if (f === 'open') return s === 'open' || s === 'pending';
        if (f === 'in progress') return s === 'in progress' || s === 'in_progress';
        if (f === 'resolved') return s === 'resolved';
        return s === f;
      });
    }

    // Filter by Priority
    const priorityVal = priorityFilterSelect ? priorityFilterSelect.value : 'All';
    if (priorityVal && priorityVal !== 'All') {
      tickets = tickets.filter(t => String(t.priority).toLowerCase() === priorityVal.toLowerCase());
    }

    // Filter by Search
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (query) {
      tickets = tickets.filter(t => {
        const enriched = typeof MaintenanceService.enrich === 'function' ? MaintenanceService.enrich(t) : t;
        const titleMatch = t.title && t.title.toLowerCase().includes(query);
        const descMatch = t.description && t.description.toLowerCase().includes(query);
        const tenantMatch = enriched.tenant && enriched.tenant.name.toLowerCase().includes(query);
        const propMatch = enriched.property && enriched.property.title.toLowerCase().includes(query);
        return titleMatch || descMatch || tenantMatch || propMatch;
      });
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
              <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: 4px; max-width: 360px; line-height: 1.4;">
                ${r.description}
              </div>
            </div>
          ` 
        },
        { 
          label: 'Property & Resident', 
          key: 'property', 
          render: r => `
            <div>
              <div style="font-weight: 500; font-size: var(--font-size-sm);">${r.property ? r.property.title : 'Unassigned'}</div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">Resident: ${r.tenant ? r.tenant.name : 'Unknown'}</div>
            </div>
          ` 
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
          label: 'Current Status', 
          key: 'status', 
          render: r => {
            const s = String(r.status).toLowerCase();
            const badgeClass = s === 'resolved' ? 'badge-success' : (s === 'in progress' || s === 'in_progress' ? 'badge-info' : 'badge-warning');
            return `<span class="badge ${badgeClass}"><span class="badge-dot"></span>${r.status}</span>`;
          } 
        },
        { 
          label: 'Reported', 
          key: 'createdAt', 
          render: r => Formatters.relativeTime(r.createdAt) 
        },
        {
          label: 'Change Status',
          key: 'actions',
          align: 'right',
          render: r => {
            const currentStatus = String(r.status);
            const isOpen = currentStatus.toLowerCase() === 'open' || currentStatus.toLowerCase() === 'pending';
            const isInProg = currentStatus.toLowerCase() === 'in progress' || currentStatus.toLowerCase() === 'in_progress';
            const isResolved = currentStatus.toLowerCase() === 'resolved';

            return `
              <select class="form-control form-control-sm status-update-dropdown" data-id="${r.id}" style="width: auto; display: inline-block; font-size: var(--font-size-xs); padding: 4px 8px;">
                <option value="Open" ${isOpen ? 'selected' : ''}>Open</option>
                <option value="In Progress" ${isInProg ? 'selected' : ''}>In Progress</option>
                <option value="Resolved" ${isResolved ? 'selected' : ''}>Resolved</option>
              </select>
            `;
          }
        }
      ],
      data: enriched,
      emptyMessage: 'No maintenance requests match the selected filters.'
    });

    // Bind status update event listeners
    container.querySelectorAll('.status-update-dropdown').forEach(dropdown => {
      dropdown.addEventListener('change', (e) => {
        const ticketId = e.target.getAttribute('data-id');
        const updatedStatus = e.target.value;

        MaintenanceService.update(ticketId, { 
          status: updatedStatus,
          updatedAt: new Date().toISOString()
        });

        if (typeof Toast !== 'undefined') {
          Toast.success(`Ticket status updated to "${updatedStatus}".`);
        }

        // Re-render table with new state
        loadMaintenance();
      });
    });
  }
});
