/**
 * RentEase - Maintenance Service
 * Manages maintenance requests, ticket status lifecycle, and priority tracking.
 */

const MaintenanceService = {
  /**
   * Retrieves all maintenance requests
   * @returns {Array}
   */
  getAll() {
    const raw = Storage.get(STORAGE_KEYS.MAINTENANCE, []);
    return raw.map(r => {
      let st = r.status || 'Open';
      if (st.toLowerCase() === 'pending' || st.toLowerCase() === 'open') st = 'Open';
      else if (st.toLowerCase() === 'in_progress' || st.toLowerCase() === 'in progress') st = 'In Progress';
      else if (st.toLowerCase() === 'resolved') st = 'Resolved';
      return { ...r, status: st };
    });
  },

  /**
   * Retrieves a single maintenance request by ID
   * @param {string} id 
   * @returns {Object|null}
   */
  getById(id) {
    const requests = this.getAll();
    return requests.find(r => r.id === id) || null;
  },

  /**
   * Retrieves all requests for a specific tenant
   * @param {string} tenantId 
   * @returns {Array}
   */
  getByTenantId(tenantId) {
    const requests = this.getAll();
    return requests.filter(r => r.tenantId === tenantId);
  },

  /**
   * Retrieves all requests for a specific property
   * @param {string} propertyId 
   * @returns {Array}
   */
  getByPropertyId(propertyId) {
    const requests = this.getAll();
    return requests.filter(r => r.propertyId === propertyId);
  },

  /**
   * Creates a new maintenance ticket
   * @param {Object} data 
   * @returns {Object} Created ticket
   */
  create(data) {
    const raw = Storage.get(STORAGE_KEYS.MAINTENANCE, []);

    let status = data.status || 'Open';
    if (status.toLowerCase() === 'pending' || status.toLowerCase() === 'open') status = 'Open';
    else if (status.toLowerCase() === 'in_progress' || status.toLowerCase() === 'in progress') status = 'In Progress';
    else if (status.toLowerCase() === 'resolved') status = 'Resolved';

    let priority = data.priority || 'Medium';
    if (priority.toLowerCase() === 'low') priority = 'Low';
    else if (priority.toLowerCase() === 'medium') priority = 'Medium';
    else if (priority.toLowerCase() === 'high') priority = 'High';
    else if (priority.toLowerCase() === 'urgent') priority = 'Urgent';

    const newRequest = {
      id: (typeof Helpers !== 'undefined' && Helpers.generateId) ? Helpers.generateId('mnt') : ('mnt_' + Date.now()),
      propertyId: data.propertyId,
      tenantId: data.tenantId,
      title: data.title.trim(),
      description: data.description.trim(),
      priority: priority,
      status: status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    raw.unshift(newRequest);
    Storage.set(STORAGE_KEYS.MAINTENANCE, raw);
    return newRequest;
  },

  /**
   * Updates an existing maintenance request
   * @param {string} id 
   * @param {Object} updates 
   * @returns {Object|null}
   */
  update(id, updates) {
    const raw = Storage.get(STORAGE_KEYS.MAINTENANCE, []);
    const index = raw.findIndex(r => r.id === id);
    if (index === -1) return null;

    let normalizedUpdates = { ...updates };
    if (normalizedUpdates.status) {
      let st = normalizedUpdates.status;
      if (st.toLowerCase() === 'pending' || st.toLowerCase() === 'open') normalizedUpdates.status = 'Open';
      else if (st.toLowerCase() === 'in_progress' || st.toLowerCase() === 'in progress') normalizedUpdates.status = 'In Progress';
      else if (st.toLowerCase() === 'resolved') normalizedUpdates.status = 'Resolved';
    }

    raw[index] = {
      ...raw[index],
      ...normalizedUpdates,
      updatedAt: new Date().toISOString()
    };

    Storage.set(STORAGE_KEYS.MAINTENANCE, raw);
    return raw[index];
  },

  /**
   * Deletes a maintenance request
   * @param {string} id 
   * @returns {boolean}
   */
  delete(id) {
    const requests = this.getAll();
    const filtered = requests.filter(r => r.id !== id);
    if (filtered.length === requests.length) return false;

    Storage.set(STORAGE_KEYS.MAINTENANCE, filtered);
    return true;
  },

  /**
   * Enriches a maintenance request with property and tenant details
   * @param {Object} request 
   * @returns {Object}
   */
  enrich(request) {
    if (!request) return null;
    const property = PropertyService.getById(request.propertyId);
    const tenant = TenantService.getById(request.tenantId);

    return {
      ...request,
      property: property || { title: 'Unknown Property', address: 'N/A' },
      tenant: tenant || { name: 'Unknown Tenant', email: 'N/A' }
    };
  }
};

MaintenanceService.createRequest = function(data) {
  const req = this.create(data);
  return { success: !!req, request: req };
};
MaintenanceService.updateStatus = function(id, status) {
  const req = this.update(id, { status });
  return { success: !!req, request: req };
};
MaintenanceService.getAllRequests = function() {
  return this.getAll();
};

if (typeof window !== 'undefined') {
  window.RentEase = window.RentEase || {};
  window.RentEase.maintenanceService = MaintenanceService;
  window.MaintenanceService = MaintenanceService;
}

if (typeof global !== 'undefined') {
  global.MaintenanceService = MaintenanceService;
  if (typeof window !== 'undefined') {
    window.RentEase = window.RentEase || {};
    window.RentEase.maintenanceService = MaintenanceService;
  }
}
