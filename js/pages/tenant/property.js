/**
 * RentEase - Tenant Property Details Controller
 * Displays the specific home assigned to the logged-in tenant with full amenities and lease details.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Guard route for Tenant role
  if (typeof AuthService !== 'undefined' && !AuthService.requireAuth(ROLES.TENANT)) {
    return;
  }

  // Render navigation components
  if (typeof Navbar !== 'undefined') Navbar.render('#navbar-container');
  if (typeof Sidebar !== 'undefined') Sidebar.render('#sidebar-container', 'property');

  const tenant = typeof AuthService !== 'undefined' ? AuthService.getCurrentUser() : null;
  if (!tenant) return;

  const container = document.getElementById('tenant-prop-details-container') || 
                    document.getElementById('tenant-property-container');
  if (!container) return;

  // Find active lease for the logged-in tenant
  const lease = typeof LeaseService !== 'undefined' ? LeaseService.getByTenantId(tenant.id) : null;

  if (!lease) {
    container.innerHTML = `
      <div class="card" style="padding: var(--space-12) var(--space-6); text-align: center; max-width: 720px; margin: 0 auto;">
        <div class="empty-icon" style="margin-bottom: var(--space-3); color: var(--color-text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <h2 style="font-size: var(--font-size-xl); font-weight: 700; margin-bottom: var(--space-2);">No Property Assigned</h2>
        <p style="color: var(--color-text-secondary); max-width: 440px; margin: 0 auto var(--space-6);">
          There is currently no active tenancy agreement linking your account to a property. Please contact the property management office to finalize your lease.
        </p>
        <a href="messages.html" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px;">
          <span>Contact Property Manager</span>
        </a>
      </div>
    `;
    return;
  }

  const property = typeof PropertyService !== 'undefined' ? PropertyService.getById(lease.propertyId) : null;

  if (!property) {
    container.innerHTML = `
      <div class="card" style="padding: var(--space-12) var(--space-6); text-align: center; max-width: 720px; margin: 0 auto;">
        <div class="empty-icon" style="margin-bottom: var(--space-3); color: var(--color-text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
          </svg>
        </div>
        <h2 style="font-size: var(--font-size-xl); font-weight: 700; margin-bottom: var(--space-2);">Unit Details Unavailable</h2>
        <p style="color: var(--color-text-secondary); max-width: 440px; margin: 0 auto;">
          The specifications for your assigned unit could not be retrieved. Please check back later.
        </p>
      </div>
    `;
    return;
  }

  const defaultPropertyImage = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80';

  const amenitiesList = (property.amenities && property.amenities.length > 0)
    ? property.amenities.map(a => `
        <span class="badge badge-secondary" style="font-size: var(--font-size-xs); padding: 8px 14px; border-radius: var(--radius-md); display: inline-flex; align-items: center; gap: 6px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-primary);"><polyline points="20 6 9 17 4 12"/></svg>
          ${a}
        </span>
      `).join('')
    : '<span style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">Standard residential fixtures included.</span>';

  container.innerHTML = `
    <div class="card" style="overflow: hidden; max-width: 900px; margin: 0 auto;">
      <div style="height: 320px; position: relative; background: var(--color-surface-hover); overflow: hidden;">
        <img src="${property.image || defaultPropertyImage}" alt="${property.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='${defaultPropertyImage}'" />
        <span class="badge badge-success" style="position: absolute; top: 16px; right: 16px; box-shadow: var(--shadow-md); padding: 6px 12px; font-size: 0.8rem;">
          MY ACTIVE RESIDENCE
        </span>
      </div>

      <div class="card-body" style="padding: var(--space-8);">
        <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 4px;">
          ${property.type} • ${property.city}
        </div>
        <h2 style="font-size: var(--font-size-2xl); font-weight: 700; margin-bottom: 6px; color: var(--color-text-primary);">
          ${property.title}
        </h2>
        <p style="font-size: var(--font-size-base); color: var(--color-text-secondary); margin-bottom: 24px; display: flex; align-items: center; gap: 6px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          ${property.address}, ${property.city}
        </p>

        <!-- Unit Stats Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-8);">
          <div style="background: var(--color-surface-hover); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4);">
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Monthly Rent</div>
            <div style="font-size: var(--font-size-xl); font-weight: 700; color: var(--color-primary);">${Formatters.currency(lease.monthlyRent)}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-secondary);">Per lease agreement</div>
          </div>

          <div style="background: var(--color-surface-hover); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4);">
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Bedrooms</div>
            <div style="font-size: var(--font-size-xl); font-weight: 700; color: var(--color-text-primary);">${property.bedrooms} Beds</div>
            <div style="font-size: 0.75rem; color: var(--color-text-secondary);">Master & Guest</div>
          </div>

          <div style="background: var(--color-surface-hover); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4);">
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Bathrooms</div>
            <div style="font-size: var(--font-size-xl); font-weight: 700; color: var(--color-text-primary);">${property.bathrooms} Baths</div>
            <div style="font-size: 0.75rem; color: var(--color-text-secondary);">Full baths</div>
          </div>

          <div style="background: var(--color-surface-hover); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4);">
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Tenancy Term</div>
            <div style="font-size: var(--font-size-base); font-weight: 700; color: var(--color-text-primary);">${Formatters.date(lease.startDate)}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-secondary);">Until ${Formatters.date(lease.endDate)}</div>
          </div>
        </div>

        <!-- Amenities Section -->
        <div style="margin-bottom: var(--space-8);">
          <h3 style="font-size: var(--font-size-lg); font-weight: 600; margin-bottom: var(--space-4); color: var(--color-text-primary);">
            Community & Unit Amenities
          </h3>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${amenitiesList}
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: var(--space-4); border-top: 1px solid var(--color-border); padding-top: var(--space-6);">
          <a href="maintenance.html?action=new" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
            <span>Request Maintenance</span>
          </a>
          <a href="lease.html" class="btn btn-secondary">View Lease Agreement</a>
          <a href="messages.html" class="btn btn-secondary">Message Property Manager</a>
        </div>
      </div>
    </div>
  `;
});
