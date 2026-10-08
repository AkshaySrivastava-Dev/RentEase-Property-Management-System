/**
 * RentEase - Admin Tenants Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!AuthService.requireAuth(ROLES.ADMIN)) return;

  Navbar.render('#app-header');
  Sidebar.render('#app-sidebar', 'tenants');

  const container = document.getElementById('tenants-table-container');
  const addBtn = document.getElementById('add-tenant-btn');
  const tenantModalForm = document.getElementById('tenant-form');

  loadTenants();

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      if (tenantModalForm) tenantModalForm.reset();
      Modal.open('tenant-modal');
    });
  }

  if (tenantModalForm) {
    tenantModalForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('tenant-name').value.trim();
      const email = document.getElementById('tenant-email').value.trim();
      const phone = document.getElementById('tenant-phone').value.trim();
      const password = document.getElementById('tenant-password').value || 'tenant123';

      if (!name || !email) {
        Toast.error('Please enter name and email.');
        return;
      }

      const res = TenantService.create({ name, email, phone, password });
      if (res.success) {
        Toast.success('Tenant added successfully!');
        Modal.close('tenant-modal');
        loadTenants();
      } else {
        Toast.error(res.message);
      }
    });
  }

  function loadTenants() {
    if (!container) return;

    const tenants = TenantService.getAll();
    const enriched = tenants.map(t => TenantService.enrich(t));

    container.innerHTML = Table.render({
      columns: [
        { 
          label: 'Resident', 
          key: 'name', 
          render: r => `
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="${r.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(r.name)}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" alt="" />
              <div>
                <strong>${r.name}</strong>
                <div style="font-size: var(--font-xs); color: var(--color-gray-500);">${r.email}</div>
              </div>
            </div>
          ` 
        },
        { label: 'Phone', key: 'phone', render: r => r.phone || '—' },
        { 
          label: 'Current Home', 
          key: 'lease', 
          render: r => r.property ? r.property.title : '<span class="badge badge-secondary">No Active Lease</span>' 
        },
        { 
          label: 'Lease Status', 
          key: 'leaseStatus', 
          render: r => r.lease ? '<span class="badge badge-success">ACTIVE</span>' : '—' 
        },
        {
          label: 'Actions',
          key: 'actions',
          align: 'right',
          render: r => `
            <a href="messages.html?tenantId=${r.id}" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 6px;" title="Message resident">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Message
            </a>
          `
        }
      ],
      data: enriched,
      emptyMessage: 'No registered tenants yet.'
    });
  }
});

