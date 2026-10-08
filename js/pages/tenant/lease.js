/**
 * RentEase - Tenant Lease Details Controller
 * Displays the verified tenancy agreement for the authenticated tenant.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Guard route for Tenant role
  if (typeof AuthService !== 'undefined' && !AuthService.requireAuth(ROLES.TENANT)) {
    return;
  }

  // Render navigation components
  if (typeof Navbar !== 'undefined') Navbar.render('#navbar-container');
  if (typeof Sidebar !== 'undefined') Sidebar.render('#sidebar-container', 'lease');

  const tenant = typeof AuthService !== 'undefined' ? AuthService.getCurrentUser() : null;
  if (!tenant) return;

  const container = document.getElementById('tenant-lease-container');
  if (!container) return;

  const lease = typeof LeaseService !== 'undefined' ? LeaseService.getByTenantId(tenant.id) : null;

  if (!lease) {
    container.innerHTML = `
      <div class="card" style="padding: var(--space-12) var(--space-6); text-align: center; max-width: 720px; margin: 0 auto;">
        <div class="empty-icon" style="margin-bottom: var(--space-3); color: var(--color-text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        <h2 style="font-size: var(--font-size-xl); font-weight: 700; margin-bottom: var(--space-2);">No Active Lease Agreement</h2>
        <p style="color: var(--color-text-secondary); max-width: 440px; margin: 0 auto var(--space-6);">
          There is no lease agreement currently on record for your resident account. Please contact the management office to register your contract.
        </p>
        <a href="messages.html" class="btn btn-primary">Contact Property Manager</a>
      </div>
    `;
    return;
  }

  const property = typeof PropertyService !== 'undefined' ? PropertyService.getById(lease.propertyId) : null;
  const s = String(lease.status).toLowerCase();
  const badgeClass = s === 'active' ? 'badge-success' : (s === 'upcoming' ? 'badge-primary' : 'badge-warning');

  container.innerHTML = `
    <div class="card" style="max-width: 840px; margin: 0 auto; overflow: hidden;">
      <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-6);">
        <div>
          <h2 class="card-title" style="font-size: var(--font-size-xl); margin-bottom: 4px;">Residential Tenancy Agreement</h2>
          <span style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">Agreement ID: <strong>${lease.id}</strong></span>
        </div>
        <span class="badge ${badgeClass}" style="font-size: 0.8rem; padding: 6px 14px;">${String(lease.status).toUpperCase()} LEASE</span>
      </div>

      <div class="card-body" style="padding: var(--space-8);">
        <!-- Premises Info Block -->
        <div style="background: var(--color-surface-hover); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-5); margin-bottom: var(--space-6);">
          <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 4px;">
            Leased Property Premises
          </div>
          <div style="font-size: var(--font-size-lg); font-weight: 700; color: var(--color-text-primary); margin-bottom: 2px;">
            ${property ? property.title : 'Assigned Residence'}
          </div>
          <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); display: flex; align-items: center; gap: 6px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            ${property ? `${property.address}, ${property.city}` : 'Address on file with management'}
          </div>
        </div>

        <!-- Agreement Terms Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-5); margin-bottom: var(--space-8);">
          <div style="border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4);">
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Tenant / Resident</div>
            <div style="font-size: var(--font-size-base); font-weight: 700; color: var(--color-text-primary);">${tenant.name}</div>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">${tenant.email}</div>
          </div>

          <div style="border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4);">
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Monthly Rent</div>
            <div style="font-size: var(--font-size-xl); font-weight: 700; color: var(--color-primary);">${Formatters.currency(lease.monthlyRent)}</div>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">Due on the 1st of each month</div>
          </div>

          <div style="border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4);">
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Security Deposit</div>
            <div style="font-size: var(--font-size-xl); font-weight: 700; color: var(--color-text-primary);">${Formatters.currency(lease.securityDeposit)}</div>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">Held in escrow</div>
          </div>

          <div style="border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4);">
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Lease Duration</div>
            <div style="font-size: var(--font-size-base); font-weight: 700; color: var(--color-text-primary);">
              ${Formatters.date(lease.startDate)} — ${Formatters.date(lease.endDate)}
            </div>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">Fixed term tenancy</div>
          </div>
        </div>

        <!-- Tenancy Rules and Conditions -->
        <div style="border-top: 1px solid var(--color-border); padding-top: var(--space-6); margin-bottom: var(--space-6);">
          <h4 style="font-size: var(--font-size-base); font-weight: 600; margin-bottom: var(--space-3); color: var(--color-text-primary);">
            Key Tenancy Conditions & Guidelines
          </h4>
          <ul style="font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.7; padding-left: 20px;">
            <li>Rent must be settled by the due date each month through the RentEase resident portal.</li>
            <li>All repair and maintenance issues should be logged via the online maintenance system.</li>
            <li>Standard quiet hours are maintained between 10:00 PM and 7:00 AM daily.</li>
            <li>Subletting without written permission from the property manager is strictly prohibited.</li>
          </ul>
        </div>

        <div style="display: flex; gap: var(--space-4); border-top: 1px solid var(--color-border); padding-top: var(--space-6);">
          <a href="payments.html" class="btn btn-primary">View Rent Ledger & Invoices</a>
          <a href="property.html" class="btn btn-secondary">My Home Specifications</a>
        </div>
      </div>
    </div>
  `;
});
