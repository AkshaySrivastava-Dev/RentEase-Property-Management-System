/**
 * RentEase Tenant Service
 * Manages tenant records (users with role === 'tenant') and relationship with properties.
 */

const tenantService = {
  getStorage() {
    return window.RentEase?.storage || storage;
  },

  getKeys() {
    return window.RentEase?.CONSTANTS?.STORAGE_KEYS || STORAGE_KEYS;
  },

  getAll(filters = {}) {
    const users = this.getStorage().getAll(this.getKeys().USERS);
    let tenants = users.filter((u) => u.role === 'tenant');

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      tenants = tenants.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          (t.phone && t.phone.toLowerCase().includes(q))
      );
    }

    // Attach active lease and property info
    const leases = this.getStorage().getAll(this.getKeys().LEASES);
    const properties = this.getStorage().getAll(this.getKeys().PROPERTIES);

    return tenants.map((tenant) => {
      const activeLease = leases.find((l) => l.tenantId === tenant.id && String(l.status).toLowerCase() === 'active');
      let property = null;
      if (activeLease) {
        property = properties.find((p) => p.id === activeLease.propertyId) || null;
      }
      return {
        ...tenant,
        lease: activeLease || null,
        activeLease: activeLease || null,
        property: property || null,
        assignedProperty: property || null
      };
    });
  },

  getById(id) {
    if (!id) return null;
    const users = this.getStorage().getAll(this.getKeys().USERS);
    const tenant = users.find((u) => u.id === id && u.role === 'tenant');
    if (!tenant) return null;

    const leases = this.getStorage().getAll(this.getKeys().LEASES);
    const properties = this.getStorage().getAll(this.getKeys().PROPERTIES);
    const tenantLeases = leases.filter((l) => l.tenantId === tenant.id);
    const activeLease = tenantLeases.find((l) => String(l.status).toLowerCase() === 'active');
    const property = activeLease ? properties.find((p) => p.id === activeLease.propertyId) : null;

    return {
      ...tenant,
      leases: tenantLeases,
      activeLease: activeLease || null,
      assignedProperty: property || null
    };
  },

  createTenant({ name, email, phone = '', password = 'tenant123' }) {
    return window.RentEase.authService.signup({
      name,
      email,
      password,
      role: 'tenant',
      phone
    });
  },

  updateTenant(id, { name, email, phone }) {
    const users = this.getStorage().getAll(this.getKeys().USERS);
    const index = users.findIndex((u) => u.id === id && u.role === 'tenant');
    if (index === -1) {
      return { success: false, error: 'Tenant not found.' };
    }

    if (name && !name.trim()) {
      return { success: false, error: 'Name cannot be empty.' };
    }
    if (email && !window.RentEase.validators.isValidEmail(email)) {
      return { success: false, error: 'Please provide a valid email.' };
    }

    // Check email uniqueness if email changed
    if (email && email.toLowerCase() !== users[index].email.toLowerCase()) {
      const existing = users.find(
        (u) => u.id !== id && u.email.toLowerCase() === email.toLowerCase().trim()
      );
      if (existing) {
        return { success: false, error: 'Email already used by another account.' };
      }
    }

    const updated = this.getStorage().update(this.getKeys().USERS, id, {
      ...(name && { name: name.trim() }),
      ...(email && { email: email.trim().toLowerCase() }),
      ...(phone !== undefined && { phone: phone.trim() })
    });

    return { success: true, tenant: updated };
  },

  deleteTenant(id) {
    const existing = this.getById(id);
    if (!existing) {
      return { success: false, error: 'Tenant not found.' };
    }
    if (existing.activeLease) {
      return {
        success: false,
        error: 'Cannot remove tenant with an active lease. Terminate or reassign the lease first.'
      };
    }

    this.getStorage().delete(this.getKeys().USERS, id);
    return { success: true };
  }
};

tenantService.create = function(data) {
  return this.createTenant(data);
};
tenantService.enrich = function(tenant) {
  if (!tenant) return null;
  if (tenant.property && tenant.lease) return tenant;
  const leases = this.getStorage().getAll(this.getKeys().LEASES);
  const properties = this.getStorage().getAll(this.getKeys().PROPERTIES);
  const activeLease = leases.find((l) => l.tenantId === tenant.id && String(l.status).toLowerCase() === 'active');
  const property = activeLease ? properties.find((p) => p.id === activeLease.propertyId) : null;
  return {
    ...tenant,
    lease: activeLease || null,
    activeLease: activeLease || null,
    property: property || null,
    assignedProperty: property || null
  };
};

const TenantService = tenantService;

if (typeof window !== 'undefined') {
  window.RentEase = window.RentEase || {};
  window.RentEase.tenantService = tenantService;
  window.TenantService = tenantService;
  window.tenantService = tenantService;
}

if (typeof global !== 'undefined') {
  global.TenantService = tenantService;
  global.tenantService = tenantService;
  if (typeof window !== 'undefined') {
    window.RentEase = window.RentEase || {};
    window.RentEase.tenantService = tenantService;
  }
}
