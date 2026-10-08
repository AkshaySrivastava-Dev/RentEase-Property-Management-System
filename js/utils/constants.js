/**
 * RentEase Constants
 */
const STORAGE_KEYS = {
  USERS: 'rentEase_users',
  CURRENT_USER: 'rentEase_currentUser',
  PROPERTIES: 'rentEase_properties',
  LEASES: 'rentEase_leases',
  PAYMENTS: 'rentEase_payments',
  MAINTENANCE: 'rentEase_maintenanceRequests',
  MAINTENANCE_REQUESTS: 'rentEase_maintenanceRequests',
  MESSAGES: 'rentEase_messages'
};

const USER_ROLES = {
  ADMIN: 'admin',
  TENANT: 'tenant'
};

const ROLES = USER_ROLES;

const PROPERTY_STATUS = {
  AVAILABLE: 'vacant',
  VACANT: 'vacant',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance'
};

const PROPERTY_TYPES = [
  'Apartment',
  'Townhouse',
  'Condo',
  'Single Family',
  'Studio',
  'Villa',
  'Commercial'
];

const LEASE_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  UPCOMING: 'upcoming',
  TERMINATED: 'terminated'
};

const PAYMENT_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  OVERDUE: 'overdue'
};

const MAINTENANCE_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

const MAINTENANCE_STATUS = {
  PENDING: 'pending',
  OPEN: 'pending',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved'
};

// Browser / Node global attachment
if (typeof window !== 'undefined') {
  window.RentEase = window.RentEase || {};
  window.RentEase.CONSTANTS = {
    STORAGE_KEYS,
    USER_ROLES,
    ROLES,
    PROPERTY_STATUS,
    PROPERTY_TYPES,
    LEASE_STATUS,
    PAYMENT_STATUS,
    MAINTENANCE_PRIORITY,
    MAINTENANCE_STATUS
  };
}

if (typeof global !== 'undefined') {
  global.STORAGE_KEYS = STORAGE_KEYS;
  global.USER_ROLES = USER_ROLES;
  global.ROLES = ROLES;
  global.PROPERTY_STATUS = PROPERTY_STATUS;
  global.PROPERTY_TYPES = PROPERTY_TYPES;
  global.LEASE_STATUS = LEASE_STATUS;
  global.PAYMENT_STATUS = PAYMENT_STATUS;
  global.MAINTENANCE_PRIORITY = MAINTENANCE_PRIORITY;
  global.MAINTENANCE_STATUS = MAINTENANCE_STATUS;
}
