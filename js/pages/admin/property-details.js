/**
 * RentEase - Admin Property Details Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!AuthService.requireAuth(ROLES.ADMIN)) return;

  Navbar.render('#app-header');
  Sidebar.render('#app-sidebar', 'properties');

  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get('id');

  if (!propertyId) {
    Toast.error('No property ID specified.');
    setTimeout(() => { window.location.href = 'properties.html'; }, 1000);
    return;
  }

  const property = PropertyService.getById(propertyId);
  if (!property) {
    Toast.error('Property not found.');
    setTimeout(() => { window.location.href = 'properties.html'; }, 1000);
    return;
  }

  renderPropertyDetails(property);
  renderActiveLease(propertyId);
  renderMaintenanceHistory(propertyId);
  bindActions(property);

  function renderPropertyDetails(p) {
    const elTitle = document.getElementById('prop-title-display');
    const elAddress = document.getElementById('prop-address-display');
    const elRent = document.getElementById('prop-rent-display');
    const elType = document.getElementById('prop-type-display');
    const elBeds = document.getElementById('prop-beds-display');
    const elBaths = document.getElementById('prop-baths-display');
    const elStatus = document.getElementById('prop-status-display');
    const elImage = document.getElementById('prop-image-display');
    const elAmenities = document.getElementById('prop-amenities-display');

    if (elTitle) elTitle.textContent = p.title;
    if (elAddress) elAddress.textContent = `${p.address}, ${p.city}`;
    if (elRent) elRent.textContent = Formatters.currency(p.rent);
    if (elType) elType.textContent = p.type;
    if (elBeds) elBeds.textContent = p.bedrooms;
    if (elBaths) elBaths.textContent = p.bathrooms;
    if (elStatus) {
      elStatus.textContent = p.status.toUpperCase();
      elStatus.className = `badge ${p.status === 'occupied' ? 'badge-success' : (p.status === 'vacant' ? 'badge-primary' : 'badge-warning')}`;
    }
    if (elImage) {
      elImage.src = p.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80';
    }
    if (elAmenities && p.amenities) {
      elAmenities.innerHTML = p.amenities.map(a => `<span class="badge badge-secondary" style="margin-right: 4px; margin-bottom: 4px;">${a}</span>`).join('');
    }
  }

  function renderActiveLease(pId) {
    const container = document.getElementById('active-lease-container');
    if (!container) return;

    const lease = LeaseService.getByPropertyId(pId);
    if (!lease) {
      container.innerHTML = `
        <div class="table-empty-state">
          <div class="empty-icon" style="margin-bottom: var(--space-3); color: var(--color-text-muted);">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div class="empty-title">No Active Lease</div>
          <div class="empty-desc">This unit is currently vacant or unleased.</div>
        </div>
      `;
      return;
    }

    const tenant = TenantService.getById(lease.tenantId);
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div style="font-weight: 600; font-size: var(--font-base);">${tenant ? tenant.name : 'Unknown Resident'}</div>
          <div style="font-size: var(--font-sm); color: var(--color-gray-600);">${tenant ? tenant.email : ''}</div>
          <div style="font-size: var(--font-sm); color: var(--color-gray-600); margin-top: 4px;">
            Term: ${Formatters.date(lease.startDate)} to ${Formatters.date(lease.endDate)}
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: var(--font-lg); font-weight: 700; color: var(--color-primary);">${Formatters.currency(lease.monthlyRent)}/mo</div>
          <span class="badge badge-success">ACTIVE LEASE</span>
        </div>
      </div>
    `;
  }

  function renderMaintenanceHistory(pId) {
    const container = document.getElementById('prop-maintenance-history');
    if (!container) return;

    const tickets = MaintenanceService.getByPropertyId(pId);
    if (tickets.length === 0) {
      container.innerHTML = '<div class="table-empty-state"><div class="empty-desc">No service requests for this unit.</div></div>';
      return;
    }

    container.innerHTML = Table.render({
      columns: [
        { label: 'Issue', key: 'title', render: r => `<strong>${r.title}</strong>` },
        { label: 'Priority', key: 'priority', render: r => `<span class="badge badge-warning">${r.priority.toUpperCase()}</span>` },
        { label: 'Status', key: 'status', render: r => `<span class="badge badge-info">${r.status.toUpperCase()}</span>` },
        { label: 'Date', key: 'createdAt', render: r => Formatters.date(r.createdAt) }
      ],
      data: tickets
    });
  }

  function bindActions(p) {
    const deleteBtn = document.getElementById('delete-property-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
          PropertyService.delete(p.id);
          Toast.success('Property deleted.');
          setTimeout(() => { window.location.href = 'properties.html'; }, 500);
        }
      });
    }
  }
});

