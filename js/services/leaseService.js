/**
 * RentEase - Lease Service
 * Manages lease agreements, creation, status tracking, and tenant associations.
 */

const LeaseService = {
  /**
   * Returns all leases from storage
   * @returns {Array}
   */
  getAll(filters = {}) {
    let leases = Storage.get(STORAGE_KEYS.LEASES, []);
    leases = leases.map(l => {
      let st = l.status || 'Active';
      const sLower = String(st).toLowerCase();
      if (sLower === 'active') st = 'Active';
      else if (sLower === 'upcoming') st = 'Upcoming';
      else if (sLower === 'expired') st = 'Expired';
      else if (sLower === 'terminated') st = 'Terminated';
      return { ...l, status: st };
    });

    if (filters.status && filters.status !== 'All') {
      const fLower = String(filters.status).toLowerCase();
      leases = leases.filter(l => String(l.status).toLowerCase() === fLower);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      leases = leases.filter(l => {
        const enriched = this.enrich(l);
        return (
          (enriched.tenant && enriched.tenant.name.toLowerCase().includes(q)) ||
          (enriched.property && enriched.property.title.toLowerCase().includes(q))
        );
      });
    }

    return leases;
  },

  /**
   * Retrieves a single lease by ID
   * @param {string} id 
   * @returns {Object|null}
   */
  getById(id) {
    const leases = this.getAll();
    return leases.find(l => l.id === id) || null;
  },

  /**
   * Gets the active lease for a specific property
   * @param {string} propertyId 
   * @returns {Object|null}
   */
  getByPropertyId(propertyId) {
    const leases = this.getAll();
    return leases.find(l => l.propertyId === propertyId && String(l.status).toLowerCase() === 'active') || null;
  },

  /**
   * Gets the active lease for a specific tenant
   * @param {string} tenantId 
   * @returns {Object|null}
   */
  getByTenantId(tenantId) {
    const leases = this.getAll();
    return leases.find(l => l.tenantId === tenantId && String(l.status).toLowerCase() === 'active') || null;
  },

  /**
   * Gets all leases (past and present) for a tenant
   * @param {string} tenantId 
   * @returns {Array}
   */
  getAllByTenantId(tenantId) {
    const leases = this.getAll();
    return leases.filter(l => l.tenantId === tenantId);
  },

  /**
   * Creates a new lease agreement
   * @param {Object} leaseData 
   * @returns {Object} Created lease
   */
  create(leaseData) {
    const raw = Storage.get(STORAGE_KEYS.LEASES, []);
    let status = leaseData.status || 'Active';
    const sLower = String(status).toLowerCase();
    if (sLower === 'active') status = 'Active';
    else if (sLower === 'upcoming') status = 'Upcoming';
    else if (sLower === 'expired') status = 'Expired';
    else if (sLower === 'terminated') status = 'Terminated';

    const newLease = {
      id: (typeof Helpers !== 'undefined' && Helpers.generateId) ? Helpers.generateId('lse') : ('lse_' + Date.now()),
      propertyId: leaseData.propertyId,
      tenantId: leaseData.tenantId,
      startDate: leaseData.startDate,
      endDate: leaseData.endDate,
      monthlyRent: Number(leaseData.monthlyRent) || 0,
      securityDeposit: Number(leaseData.securityDeposit) || 0,
      status: status,
      createdAt: new Date().toISOString()
    };

    raw.unshift(newLease);
    Storage.set(STORAGE_KEYS.LEASES, raw);

    // Update associated property status to Occupied if lease is active
    if (status === 'Active') {
      PropertyService.update(newLease.propertyId, { status: 'Occupied' });
    }

    return newLease;
  },

  /**
   * Updates an existing lease
   * @param {string} id 
   * @param {Object} updates 
   * @returns {Object|null}
   */
  update(id, updates) {
    const raw = Storage.get(STORAGE_KEYS.LEASES, []);
    const index = raw.findIndex(l => l.id === id);
    if (index === -1) return null;

    let normalizedUpdates = { ...updates };
    if (normalizedUpdates.status) {
      const sLower = String(normalizedUpdates.status).toLowerCase();
      if (sLower === 'active') normalizedUpdates.status = 'Active';
      else if (sLower === 'upcoming') normalizedUpdates.status = 'Upcoming';
      else if (sLower === 'expired') normalizedUpdates.status = 'Expired';
      else if (sLower === 'terminated') normalizedUpdates.status = 'Terminated';
    }

    raw[index] = { ...raw[index], ...normalizedUpdates };
    Storage.set(STORAGE_KEYS.LEASES, raw);

    if (normalizedUpdates.status && ['expired', 'terminated'].includes(String(normalizedUpdates.status).toLowerCase())) {
      PropertyService.update(raw[index].propertyId, { status: 'Available' });
    } else if (normalizedUpdates.status === 'Active') {
      PropertyService.update(raw[index].propertyId, { status: 'Occupied' });
    }

    return raw[index];
  },

  /**
   * Terminates an active lease
   * @param {string} id 
   * @returns {boolean}
   */
  terminate(id) {
    const lease = this.getById(id);
    if (!lease) return false;

    this.update(id, { status: LEASE_STATUS.TERMINATED, terminatedAt: new Date().toISOString() });
    // Check if property should now be marked vacant
    PropertyService.update(lease.propertyId, { status: 'Available' });
    return true;
  },

  /**
   * Returns enriched lease object with joined property and tenant details
   * @param {Object} lease 
   * @returns {Object}
   */
  enrich(lease) {
    if (!lease) return null;
    const property = PropertyService.getById(lease.propertyId);
    const tenant = TenantService.getById(lease.tenantId);

    return {
      ...lease,
      property: property || { title: 'Unknown Property', address: 'N/A' },
      tenant: tenant || { name: 'Unknown Resident', email: 'N/A' }
    };
  }
};

LeaseService.createLease = function(data) {
  const l = this.create(data);
  return { success: !!l, lease: l };
};
LeaseService.getAllLeases = function() {
  return this.getAll();
};
LeaseService.updateLease = function(id, data) {
  const res = this.update(id, data);
  return { success: !!res, lease: res };
};
LeaseService.terminateLease = function(id) {
  return { success: this.terminate(id) };
};

if (typeof window !== 'undefined') {
  window.RentEase = window.RentEase || {};
  window.RentEase.leaseService = LeaseService;
  window.LeaseService = LeaseService;
}

if (typeof global !== 'undefined') {
  global.LeaseService = LeaseService;
  if (typeof window !== 'undefined') {
    window.RentEase = window.RentEase || {};
    window.RentEase.leaseService = LeaseService;
  }
}
