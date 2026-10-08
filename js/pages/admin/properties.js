/**
 * RentEase - Admin Properties Controller
 * Manages properties listing, filtering, search, and property creation modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Guard route for Admin role
  if (typeof AuthService !== 'undefined' && !AuthService.requireAuth(ROLES.ADMIN)) {
    return;
  }

  // Render navigation components
  if (typeof Navbar !== 'undefined') Navbar.render('#navbar-container');
  if (typeof Sidebar !== 'undefined') Sidebar.render('#sidebar-container', 'properties');

  let currentFilterStatus = 'All';
  let currentFilterType = 'All';
  let searchQuery = '';

  const propertyGrid = document.getElementById('properties-grid-container') || document.getElementById('properties-grid');
  const searchInput = document.getElementById('property-search-input') || document.getElementById('property-search');
  const statusFilter = document.getElementById('filter-property-status') || document.getElementById('property-status-filter');
  const typeFilter = document.getElementById('filter-property-type') || document.getElementById('property-type-filter');
  const addPropBtn = document.getElementById('btn-add-property') || document.getElementById('add-property-btn');
  const propModalForm = document.getElementById('property-form');
  const propErrorAlert = document.getElementById('prop-error-alert');

  loadProperties();

  // Bind Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      loadProperties();
    });
  }

  // Bind Status Filter
  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      currentFilterStatus = e.target.value;
      loadProperties();
    });
  }

  // Bind Type Filter
  if (typeFilter) {
    typeFilter.addEventListener('change', (e) => {
      currentFilterType = e.target.value;
      loadProperties();
    });
  }

  // Bind Add Property Button to open modal
  if (addPropBtn) {
    addPropBtn.addEventListener('click', () => {
      openAddPropertyModal();
    });
  }

  function openAddPropertyModal() {
    if (propModalForm) propModalForm.reset();
    clearError();

    const idField = document.getElementById('prop-id');
    if (idField) idField.value = '';

    const modalTitle = document.getElementById('property-modal-title');
    if (modalTitle) modalTitle.textContent = 'Add New Rental Property';

    const statusField = document.getElementById('prop-status');
    if (statusField) statusField.value = 'Available';

    const bedsField = document.getElementById('prop-beds');
    if (bedsField) bedsField.value = '2';

    const bathsField = document.getElementById('prop-baths');
    if (bathsField) bathsField.value = '2';

    const submitBtn = document.getElementById('btn-submit-property');
    if (submitBtn) submitBtn.textContent = 'Add Property';

    if (typeof Modal !== 'undefined') {
      Modal.open('property-modal');
    }
  }

  function showError(msg) {
    if (propErrorAlert) {
      propErrorAlert.textContent = msg;
      propErrorAlert.style.display = 'block';
    }
    if (typeof Toast !== 'undefined') {
      Toast.error(msg);
    }
  }

  function clearError() {
    if (propErrorAlert) {
      propErrorAlert.textContent = '';
      propErrorAlert.style.display = 'none';
    }
  }

  // Handle Form Submission
  if (propModalForm) {
    propModalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError();

      const id = document.getElementById('prop-id') ? document.getElementById('prop-id').value : '';
      const titleInput = document.getElementById('prop-title');
      const addressInput = document.getElementById('prop-address');
      const cityInput = document.getElementById('prop-city');
      const typeInput = document.getElementById('prop-type');
      const rentInput = document.getElementById('prop-rent');
      const bedsInput = document.getElementById('prop-beds');
      const bathsInput = document.getElementById('prop-baths');
      const statusInput = document.getElementById('prop-status');
      const imageInput = document.getElementById('prop-image');
      const amenitiesInput = document.getElementById('prop-amenities');

      const title = titleInput ? titleInput.value.trim() : '';
      const address = addressInput ? addressInput.value.trim() : '';
      const city = cityInput ? cityInput.value.trim() : '';
      const type = typeInput ? typeInput.value : 'Apartment';
      const rent = rentInput ? Number(rentInput.value) : 0;
      const bedrooms = bedsInput ? Number(bedsInput.value) : 1;
      const bathrooms = bathsInput ? Number(bathsInput.value) : 1;
      const status = statusInput ? statusInput.value : 'Available';
      const image = imageInput ? imageInput.value.trim() : '';
      const amenitiesStr = amenitiesInput ? amenitiesInput.value : '';
      const amenities = amenitiesStr ? amenitiesStr.split(',').map(s => s.trim()).filter(Boolean) : [];

      // Validation
      if (!title) {
        showError('Property title is required.');
        if (titleInput) titleInput.focus();
        return;
      }

      if (!address) {
        showError('Street address is required.');
        if (addressInput) addressInput.focus();
        return;
      }

      if (!city) {
        showError('City is required.');
        if (cityInput) cityInput.focus();
        return;
      }

      if (!rent || rent <= 0 || isNaN(rent)) {
        showError('Please enter a valid monthly rent amount greater than 0.');
        if (rentInput) rentInput.focus();
        return;
      }

      const propertyPayload = {
        title,
        address,
        city,
        type,
        rent,
        bedrooms: Math.max(0, bedrooms),
        bathrooms: Math.max(1, bathrooms),
        status,
        amenities,
        image
      };

      if (id) {
        // Update existing property
        PropertyService.update(id, propertyPayload);
        if (typeof Toast !== 'undefined') Toast.success('Property updated successfully!');
      } else {
        // Create new property
        const created = PropertyService.create(propertyPayload);
        if (!created) {
          showError('Failed to create property. Please try again.');
          return;
        }
        if (typeof Toast !== 'undefined') Toast.success(`"${created.title}" added to portfolio!`);
      }

      // Close modal and refresh portfolio grid
      if (typeof Modal !== 'undefined') {
        Modal.close('property-modal');
      }

      loadProperties();
    });
  }

  function loadProperties() {
    if (!propertyGrid) return;

    let list = PropertyService.getAll({
      status: currentFilterStatus,
      type: currentFilterType,
      search: searchQuery
    });

    if (list.length === 0) {
      propertyGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: var(--space-12) var(--space-4); text-align: center;" class="table-empty-state">
          <div class="empty-icon" style="margin-bottom: var(--space-3); color: var(--color-text-muted);">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 21h18"/><path d="M19 21v-4"/><path d="M19 13V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"/><path d="M9 7h2"/><path d="M9 11h2"/><path d="M9 15h2"/><path d="M13 7h2"/><path d="M13 11h2"/><path d="M13 15h2"/>
            </svg>
          </div>
          <h3 style="font-size: var(--font-size-lg); font-weight: 600; margin-bottom: var(--space-2);">No Properties Found</h3>
          <p style="color: var(--color-text-secondary); max-width: 440px; margin: 0 auto var(--space-4);">
            No properties match your current search or filter criteria. You can clear filters or add a new property.
          </p>
          <button type="button" class="btn btn-secondary btn-sm" id="btn-clear-prop-filters">Clear All Filters</button>
        </div>
      `;

      const clearBtn = document.getElementById('btn-clear-prop-filters');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          if (statusFilter) statusFilter.value = 'All';
          if (typeFilter) typeFilter.value = 'All';
          searchQuery = '';
          currentFilterStatus = 'All';
          currentFilterType = 'All';
          loadProperties();
        });
      }
      return;
    }

    const defaultPropertyImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80';

    propertyGrid.innerHTML = list.map(p => {
      const s = String(p.status).toLowerCase();
      const badgeClass = (s === 'occupied') ? 'badge-success' : ((s === 'available' || s === 'vacant') ? 'badge-primary' : 'badge-warning');
      const statusLabel = (s === 'occupied') ? 'Occupied' : ((s === 'available' || s === 'vacant') ? 'Available' : 'Maintenance');

      const amenitiesHtml = (p.amenities && p.amenities.length > 0)
        ? `<div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 12px;">
            ${p.amenities.slice(0, 3).map(a => `<span style="font-size: 0.7rem; background: var(--color-surface-hover); padding: 2px 6px; border-radius: var(--radius-sm); color: var(--color-text-secondary);">${a}</span>`).join('')}
            ${p.amenities.length > 3 ? `<span style="font-size: 0.7rem; color: var(--color-text-muted);">+${p.amenities.length - 3}</span>` : ''}
          </div>`
        : '';

      return `
        <div class="card property-card" style="display: flex; flex-direction: column; overflow: hidden;">
          <div style="position: relative; height: 180px; overflow: hidden; background: var(--color-surface-hover);">
            <img src="${p.image || defaultPropertyImage}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='${defaultPropertyImage}'" />
            <span class="badge ${badgeClass}" style="position: absolute; top: 12px; right: 12px; box-shadow: var(--shadow-sm);">${statusLabel}</span>
          </div>
          <div class="card-body" style="flex: 1; display: flex; flex-direction: column; padding: var(--space-5);">
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em;">
              ${p.type || 'Property'} • ${p.city || 'Location'}
            </div>
            <h3 style="font-size: var(--font-size-base); font-weight: 600; margin: 6px 0 4px; line-height: 1.3;">${p.title}</h3>
            <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: 12px;">${p.address}</p>

            <div style="display: flex; gap: 14px; font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: 12px;">
              <span style="display: inline-flex; align-items: center; gap: 4px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
                ${p.bedrooms || 1} Beds
              </span>
              <span style="display: inline-flex; align-items: center; gap: 4px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-1C4.67 2.5 4 3.17 4 4v17h16V4c0-.83-.67-1.5-1.5-1.5a1.5 1.5 0 0 0-1 1L15 6"/><path d="M4 14h16"/></svg>
                ${p.bathrooms || 1} Baths
              </span>
            </div>

            ${amenitiesHtml}

            <div style="margin-top: auto; display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--color-border);">
              <div>
                <span style="font-size: var(--font-size-lg); font-weight: 700; color: var(--color-text-primary);">${Formatters.currency(p.rent)}</span>
                <span style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">/mo</span>
              </div>
              <button type="button" class="btn btn-secondary btn-sm edit-prop-btn" data-id="${p.id}">Edit</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bind Edit Buttons
    propertyGrid.querySelectorAll('.edit-prop-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const p = PropertyService.getById(id);
        if (!p) return;

        openAddPropertyModal();

        const idField = document.getElementById('prop-id');
        if (idField) idField.value = p.id;

        const modalTitle = document.getElementById('property-modal-title');
        if (modalTitle) modalTitle.textContent = 'Edit Rental Property';

        const titleInput = document.getElementById('prop-title');
        if (titleInput) titleInput.value = p.title;

        const addrInput = document.getElementById('prop-address');
        if (addrInput) addrInput.value = p.address;

        const cityInput = document.getElementById('prop-city');
        if (cityInput) cityInput.value = p.city;

        const typeInput = document.getElementById('prop-type');
        if (typeInput) typeInput.value = p.type;

        const rentInput = document.getElementById('prop-rent');
        if (rentInput) rentInput.value = p.rent;

        const bedsInput = document.getElementById('prop-beds');
        if (bedsInput) bedsInput.value = p.bedrooms;

        const bathsInput = document.getElementById('prop-baths');
        if (bathsInput) bathsInput.value = p.bathrooms;

        const statusInput = document.getElementById('prop-status');
        if (statusInput) statusInput.value = p.status;

        const imageInput = document.getElementById('prop-image');
        if (imageInput) imageInput.value = p.image || '';

        const amenitiesInput = document.getElementById('prop-amenities');
        if (amenitiesInput) amenitiesInput.value = Array.isArray(p.amenities) ? p.amenities.join(', ') : '';

        const submitBtn = document.getElementById('btn-submit-property');
        if (submitBtn) submitBtn.textContent = 'Save Changes';
      });
    });
  }
});
