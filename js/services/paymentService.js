/**
 * RentEase Payment Service
 * Tracks rent payments, status updates, and tenant-restricted payment history.
 */

const paymentService = {
  getStorage() {
    return window.RentEase?.storage || (typeof storage !== 'undefined' ? storage : Storage);
  },

  getKeys() {
    return window.RentEase?.CONSTANTS?.STORAGE_KEYS || (typeof STORAGE_KEYS !== 'undefined' ? STORAGE_KEYS : {
      PAYMENTS: 'rentEase_payments',
      LEASES: 'rentEase_leases',
      PROPERTIES: 'rentEase_properties',
      USERS: 'rentEase_users'
    });
  },

  getAll(filters = {}) {
    let payments = this.getStorage().getAll(this.getKeys().PAYMENTS);
    const leases = this.getStorage().getAll(this.getKeys().LEASES);
    const properties = this.getStorage().getAll(this.getKeys().PROPERTIES);
    const users = this.getStorage().getAll(this.getKeys().USERS);

    let enriched = payments.map((payment) => {
      // Normalize status to 'Paid', 'Pending', 'Overdue'
      let st = payment.status || 'Pending';
      const sLower = String(st).toLowerCase();
      if (sLower === 'paid') st = 'Paid';
      else if (sLower === 'overdue') st = 'Overdue';
      else st = 'Pending';

      const lease = leases.find((l) => l.id === payment.leaseId) || null;
      const tenant = users.find((u) => u.id === payment.tenantId) || null;
      let property = null;
      if (lease) {
        property = properties.find((p) => p.id === lease.propertyId) || null;
      }
      return {
        ...payment,
        status: st,
        lease,
        tenant: tenant || { name: 'Unknown Resident', email: 'N/A' },
        property: property || { title: 'Unknown Unit', address: 'N/A' }
      };
    });

    if (filters.tenantId) {
      enriched = enriched.filter((p) => p.tenantId === filters.tenantId);
    }

    if (filters.status && filters.status !== 'All') {
      const fLower = String(filters.status).toLowerCase();
      enriched = enriched.filter((p) => String(p.status).toLowerCase() === fLower);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      enriched = enriched.filter(
        (p) =>
          (p.tenant && p.tenant.name.toLowerCase().includes(q)) ||
          (p.property && p.property.title.toLowerCase().includes(q))
      );
    }

    // Sort by dueDate descending
    enriched.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));

    return enriched;
  },

  getById(id) {
    if (!id) return null;
    const payments = this.getAll();
    return payments.find((p) => p.id === id) || null;
  },

  getByTenantId(tenantId) {
    if (!tenantId) return [];
    // Strict domain rule: invoices/payments must belong to the tenant's active lease
    const lease = typeof LeaseService !== 'undefined' ? LeaseService.getByTenantId(tenantId) : null;
    if (!lease) return [];
    return this.getAll({ tenantId }).filter((p) => p.leaseId === lease.id);
  },

  createPayment(data) {
    const { leaseId, tenantId, amount, dueDate, paidDate = null, status = 'Pending' } = data;

    if (!leaseId) return { success: false, error: 'Lease is required.' };
    if (!tenantId) return { success: false, error: 'Tenant is required.' };
    if (!dueDate) return { success: false, error: 'Due date is required.' };
    if (Number(amount) <= 0 || isNaN(Number(amount))) {
      return { success: false, error: 'Amount must be a positive number.' };
    }

    const helpers = (typeof Helpers !== 'undefined' ? Helpers : (window.RentEase?.helpers || { generateId: () => 'pay_' + Date.now() }));
    const normalizedStatus = String(status).toLowerCase() === 'paid' ? 'Paid' : (String(status).toLowerCase() === 'overdue' ? 'Overdue' : 'Pending');

    const newPayment = {
      id: helpers.generateId('pay'),
      leaseId,
      tenantId,
      amount: Number(amount),
      dueDate,
      paidDate: normalizedStatus === 'Paid' ? (paidDate || new Date().toISOString().split('T')[0]) : null,
      status: normalizedStatus,
      createdAt: new Date().toISOString()
    };

    this.getStorage().insert(this.getKeys().PAYMENTS, newPayment);
    return { success: true, payment: newPayment };
  },

  updateStatus(id, newStatus, paidDate = null) {
    const existing = this.getStorage().getById(this.getKeys().PAYMENTS, id);
    if (!existing) return { success: false, error: 'Payment not found.' };

    const normalizedStatus = String(newStatus).toLowerCase() === 'paid' ? 'Paid' : (String(newStatus).toLowerCase() === 'overdue' ? 'Overdue' : 'Pending');

    const updates = {
      status: normalizedStatus,
      paidDate: normalizedStatus === 'Paid' ? (paidDate || new Date().toISOString().split('T')[0]) : null
    };

    const updated = this.getStorage().update(this.getKeys().PAYMENTS, id, updates);
    return { success: true, payment: updated };
  },

  update(id, updates) {
    const existing = this.getStorage().getById(this.getKeys().PAYMENTS, id);
    if (!existing) return { success: false, error: 'Payment not found.' };

    let normalizedUpdates = { ...updates };
    if (updates.status) {
      const sLower = String(updates.status).toLowerCase();
      normalizedUpdates.status = sLower === 'paid' ? 'Paid' : (sLower === 'overdue' ? 'Overdue' : 'Pending');
      if (normalizedUpdates.status === 'Paid' && !normalizedUpdates.paidDate) {
        normalizedUpdates.paidDate = new Date().toISOString().split('T')[0];
      }
    }

    const updated = this.getStorage().update(this.getKeys().PAYMENTS, id, normalizedUpdates);
    return { success: true, payment: updated };
  },

  recordTenantPayment(id) {
    return this.updateStatus(id, 'Paid', new Date().toISOString().split('T')[0]);
  },

  markAsPaid(id) {
    return this.updateStatus(id, 'Paid', new Date().toISOString().split('T')[0]);
  },

  create(data) {
    const res = this.createPayment(data);
    return res.success ? res.payment : null;
  },

  enrich(payment) {
    if (!payment) return null;
    if (payment.tenant && payment.property) return payment;

    const leases = this.getStorage().getAll(this.getKeys().LEASES);
    const properties = this.getStorage().getAll(this.getKeys().PROPERTIES);
    const users = this.getStorage().getAll(this.getKeys().USERS);

    const lease = leases.find((l) => l.id === payment.leaseId) || null;
    const tenant = users.find((u) => u.id === payment.tenantId) || null;
    let property = null;
    if (lease) {
      property = properties.find((p) => p.id === lease.propertyId) || null;
    }

    return {
      ...payment,
      lease,
      tenant: tenant || { name: 'Unknown Resident', email: 'N/A' },
      property: property || { title: 'Unknown Unit', address: 'N/A' }
    };
  },

  getStats(tenantId = null) {
    const payments = this.getAll(tenantId ? { tenantId } : {});
    const totalCount = payments.length;
    const paidCount = payments.filter((p) => String(p.status).toLowerCase() === 'paid').length;
    const pendingCount = payments.filter((p) => String(p.status).toLowerCase() === 'pending').length;
    const overdueCount = payments.filter((p) => String(p.status).toLowerCase() === 'overdue').length;

    const totalCollected = payments
      .filter((p) => String(p.status).toLowerCase() === 'paid')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const pendingAmount = payments
      .filter((p) => String(p.status).toLowerCase() === 'pending' || String(p.status).toLowerCase() === 'overdue')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    return {
      totalCount,
      paidCount,
      pendingCount,
      overdueCount,
      totalCollected,
      pendingAmount
    };
  }
};

const PaymentService = paymentService;

if (typeof window !== 'undefined') {
  window.RentEase = window.RentEase || {};
  window.RentEase.paymentService = paymentService;
  window.PaymentService = paymentService;
  window.paymentService = paymentService;
}

if (typeof global !== 'undefined') {
  global.PaymentService = paymentService;
  global.paymentService = paymentService;
  if (typeof window !== 'undefined') {
    window.RentEase = window.RentEase || {};
    window.RentEase.paymentService = paymentService;
  }
}
