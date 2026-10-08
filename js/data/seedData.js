/**
 * RentEase - Initial Seed Data & Relational Schema
 * Provides comprehensive demo datasets for properties, users, leases, payments, tickets, and messages.
 * Enforces strict relational consistency across the domain model.
 */

const SEED_USERS = [
  {
    id: 'usr_admin_1',
    name: 'Sarah Jenkins',
    email: 'admin@rentease.demo',
    password: 'admin123',
    role: ROLES.ADMIN,
    phone: '(555) 019-2834',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-01-01T08:00:00.000Z'
  },
  {
    id: 'usr_tenant_1',
    name: 'Priya Patel',
    email: 'tenant@rentease.demo',
    password: 'tenant123',
    role: ROLES.TENANT,
    phone: '(555) 438-9102',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-01-15T10:00:00.000Z'
  },
  {
    id: 'usr_tenant_amit',
    name: 'Amit Sharma',
    email: 'amit@rentease.demo',
    password: 'tenant123',
    role: ROLES.TENANT,
    phone: '(555) 782-3490',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-02-01T09:30:00.000Z'
  },
  {
    id: 'usr_tenant_sneha',
    name: 'Sneha Rao',
    email: 'sneha@rentease.demo',
    password: 'tenant123',
    role: ROLES.TENANT,
    phone: '(555) 329-8471',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-02-10T11:00:00.000Z'
  },
  {
    id: 'usr_tenant_vikram',
    name: 'Vikram Malhotra',
    email: 'vikram@rentease.demo',
    password: 'tenant123',
    role: ROLES.TENANT,
    phone: '(555) 901-4428',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-02-15T14:20:00.000Z'
  },
  {
    id: 'usr_tenant_3',
    name: 'Marcus Brody',
    email: 'marcus.brody@example.com',
    password: 'password123',
    role: ROLES.TENANT,
    phone: '(555) 612-4981',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-02-18T11:15:00.000Z'
  }
];

const SEED_PROPERTIES = [
  {
    id: 'prop_1',
    title: 'The Grand View Residences #402',
    address: '742 Evergreen Terrace, Apt 402',
    city: 'Springfield',
    type: 'Apartment',
    rent: 2450,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['In-unit Washer/Dryer', 'Balcony', 'Covered Parking', 'Fitness Center', 'Pet Friendly'],
    status: 'Occupied',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
    createdAt: '2025-01-05T08:00:00.000Z'
  },
  {
    id: 'prop_2',
    title: 'Pinecrest Modern Townhome #12',
    address: '1204 Pinecrest Blvd',
    city: 'Seattle',
    type: 'Townhouse',
    rent: 3200,
    bedrooms: 3,
    bathrooms: 2.5,
    amenities: ['Private Backyard', '2-Car Garage', 'Central AC', 'Smart Thermostat', 'Dishwasher'],
    status: 'Occupied',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    createdAt: '2025-01-10T09:30:00.000Z'
  },
  {
    id: 'prop_3',
    title: 'Skyline Lofts Penthouse B',
    address: '88 Harbor Point Way, Unit 18B',
    city: 'San Francisco',
    type: 'Condo',
    rent: 4100,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['Floor-to-Ceiling Windows', 'Concierge Service', 'Rooftop Pool', 'EV Charging', 'Hardwood Floors'],
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
    createdAt: '2025-01-20T14:00:00.000Z'
  },
  {
    id: 'prop_4',
    title: 'Oakwood Suburban Single Family',
    address: '439 Maple Ridge Rd',
    city: 'Austin',
    type: 'Single Family',
    rent: 2800,
    bedrooms: 4,
    bathrooms: 3,
    amenities: ['Fenced Yard', 'Fireplace', 'Modern Kitchen', 'Basement Storage', 'Pet Friendly'],
    status: 'Occupied',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
    createdAt: '2025-02-01T11:00:00.000Z'
  },
  {
    id: 'prop_5',
    title: 'Urban Studio at Metro Central',
    address: '310 Commercial St, #509',
    city: 'Portland',
    type: 'Studio',
    rent: 1650,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['Transit Accessible', 'Bike Storage', 'High-Speed Fiber', 'Package Locker'],
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80',
    createdAt: '2025-02-12T16:20:00.000Z'
  }
];

const SEED_LEASES = [
  {
    id: 'lse_1',
    propertyId: 'prop_1',
    tenantId: 'usr_tenant_1',
    startDate: '2025-02-01',
    endDate: '2026-01-31',
    monthlyRent: 2450,
    securityDeposit: 2450,
    status: 'Active',
    createdAt: '2025-01-25T10:00:00.000Z'
  },
  {
    id: 'lse_2',
    propertyId: 'prop_2',
    tenantId: 'usr_tenant_amit',
    startDate: '2025-02-15',
    endDate: '2026-02-14',
    monthlyRent: 3200,
    securityDeposit: 3200,
    status: 'Active',
    createdAt: '2025-02-01T14:30:00.000Z'
  },
  {
    id: 'lse_3',
    propertyId: 'prop_4',
    tenantId: 'usr_tenant_sneha',
    startDate: '2025-03-01',
    endDate: '2026-02-28',
    monthlyRent: 2800,
    securityDeposit: 2800,
    status: 'Active',
    createdAt: '2025-02-15T09:00:00.000Z'
  }
];

const SEED_PAYMENTS = [
  // Payments for Priya Patel (usr_tenant_1) on lse_1 (rent 2450)
  {
    id: 'pay_1',
    leaseId: 'lse_1',
    tenantId: 'usr_tenant_1',
    amount: 2450,
    dueDate: '2025-02-01',
    paidDate: '2025-02-01T11:20:00.000Z',
    status: 'Paid',
    createdAt: '2025-01-25T10:00:00.000Z'
  },
  {
    id: 'pay_2',
    leaseId: 'lse_1',
    tenantId: 'usr_tenant_1',
    amount: 2450,
    dueDate: '2025-03-01',
    paidDate: '2025-03-02T14:45:00.000Z',
    status: 'Paid',
    createdAt: '2025-02-25T10:00:00.000Z'
  },
  {
    id: 'pay_3',
    leaseId: 'lse_1',
    tenantId: 'usr_tenant_1',
    amount: 2450,
    dueDate: '2025-04-01',
    paidDate: null,
    status: 'Pending',
    createdAt: '2025-03-25T10:00:00.000Z'
  },
  // Payments for Amit Sharma (usr_tenant_amit) on lse_2 (rent 3200)
  {
    id: 'pay_amit_1',
    leaseId: 'lse_2',
    tenantId: 'usr_tenant_amit',
    amount: 3200,
    dueDate: '2025-02-15',
    paidDate: '2025-02-15T09:00:00.000Z',
    status: 'Paid',
    createdAt: '2025-02-01T10:00:00.000Z'
  },
  {
    id: 'pay_amit_2',
    leaseId: 'lse_2',
    tenantId: 'usr_tenant_amit',
    amount: 3200,
    dueDate: '2025-03-15',
    paidDate: null,
    status: 'Pending',
    createdAt: '2025-03-01T10:00:00.000Z'
  },
  // Payments for Sneha Rao (usr_tenant_sneha) on lse_3 (rent 2800)
  {
    id: 'pay_sneha_1',
    leaseId: 'lse_3',
    tenantId: 'usr_tenant_sneha',
    amount: 2800,
    dueDate: '2025-03-01',
    paidDate: '2025-03-01T10:00:00.000Z',
    status: 'Paid',
    createdAt: '2025-02-20T10:00:00.000Z'
  },
  {
    id: 'pay_sneha_2',
    leaseId: 'lse_3',
    tenantId: 'usr_tenant_sneha',
    amount: 2800,
    dueDate: '2025-04-01',
    paidDate: null,
    status: 'Pending',
    createdAt: '2025-03-20T10:00:00.000Z'
  }
];

const SEED_MAINTENANCE = [
  {
    id: 'mnt_1',
    propertyId: 'prop_1',
    tenantId: 'usr_tenant_1',
    title: 'Kitchen sink faucet dripping constantly',
    description: 'The hot water knob seems loose and water drips every few seconds even when turned tight.',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2025-03-12T08:30:00.000Z',
    updatedAt: '2025-03-13T10:15:00.000Z'
  },
  {
    id: 'mnt_2',
    propertyId: 'prop_1',
    tenantId: 'usr_tenant_1',
    title: 'HVAC filter replacement reminder',
    description: 'Quarterly air filter replacement requested for allergen control.',
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2025-02-15T11:00:00.000Z',
    updatedAt: '2025-02-16T14:20:00.000Z'
  },
  {
    id: 'mnt_3',
    propertyId: 'prop_2',
    tenantId: 'usr_tenant_amit',
    title: 'Water heater not reaching full heat',
    description: 'Morning showers are lukewarm. Water pressure is fine but heating element may need inspection.',
    priority: 'High',
    status: 'Open',
    createdAt: '2025-03-20T16:45:00.000Z',
    updatedAt: '2025-03-20T16:45:00.000Z'
  },
  {
    id: 'mnt_4',
    propertyId: 'prop_4',
    tenantId: 'usr_tenant_sneha',
    title: 'Garden Sprinkler Timer Malfunction',
    description: 'The front lawn sprinkler system activates at incorrect intervals during the night.',
    priority: 'Low',
    status: 'Open',
    createdAt: '2025-03-22T09:15:00.000Z',
    updatedAt: '2025-03-22T09:15:00.000Z'
  }
];

const SEED_MESSAGES = [
  {
    id: 'msg_1',
    senderId: 'usr_admin_1',
    receiverId: 'usr_tenant_1',
    content: 'Welcome to The Grand View Residences, Priya! Please let me know if you need assistance settling in.',
    read: true,
    createdAt: '2025-02-01T12:00:00.000Z'
  },
  {
    id: 'msg_2',
    senderId: 'usr_tenant_1',
    receiverId: 'usr_admin_1',
    content: 'Thank you Sarah! Everything is great so far, we love the view.',
    read: true,
    createdAt: '2025-02-01T13:40:00.000Z'
  },
  {
    id: 'msg_3',
    senderId: 'usr_tenant_1',
    receiverId: 'usr_admin_1',
    content: 'Hi Sarah, I submitted a quick maintenance request regarding the kitchen faucet dripping.',
    read: true,
    createdAt: '2025-03-12T08:35:00.000Z'
  },
  {
    id: 'msg_4',
    senderId: 'usr_admin_1',
    receiverId: 'usr_tenant_1',
    content: 'Got it! Our plumber has been dispatched and should arrive Thursday morning between 9am-11am.',
    read: false,
    createdAt: '2025-03-13T10:18:00.000Z'
  },
  {
    id: 'msg_amit_1',
    senderId: 'usr_admin_1',
    receiverId: 'usr_tenant_amit',
    content: 'Welcome to Pinecrest Modern Townhome, Amit! Please reach out if you have any questions.',
    read: true,
    createdAt: '2025-02-15T12:00:00.000Z'
  },
  {
    id: 'msg_amit_2',
    senderId: 'usr_tenant_amit',
    receiverId: 'usr_admin_1',
    content: 'Hi Sarah, thank you! Everything looks great so far.',
    read: true,
    createdAt: '2025-02-16T10:00:00.000Z'
  },
  {
    id: 'msg_sneha_1',
    senderId: 'usr_admin_1',
    receiverId: 'usr_tenant_sneha',
    content: 'Welcome to Oakwood Suburban, Sneha! Trash pickup is every Tuesday morning.',
    read: true,
    createdAt: '2025-03-01T12:00:00.000Z'
  },
  {
    id: 'msg_sneha_2',
    senderId: 'usr_tenant_sneha',
    receiverId: 'usr_admin_1',
    content: 'Thank you Sarah for the information!',
    read: true,
    createdAt: '2025-03-01T14:10:00.000Z'
  },
  {
    id: 'msg_vikram_1',
    senderId: 'usr_admin_1',
    receiverId: 'usr_tenant_vikram',
    content: 'Welcome to RentEase, Vikram! We are currently processing your application for upcoming units.',
    read: true,
    createdAt: '2025-02-16T09:00:00.000Z'
  }
];

const SeedData = {
  /**
   * Initializes local storage with demo seeds, performing self-healing schema reconciliation
   */
  init() {
    // 1. Reconcile Users
    let users = Storage.get(STORAGE_KEYS.USERS, []);
    if (!users || users.length === 0) {
      users = [...SEED_USERS];
    } else {
      SEED_USERS.forEach(su => {
        const idx = users.findIndex(u => u.email.toLowerCase() === su.email.toLowerCase() || u.id === su.id);
        if (idx === -1) {
          users.push(su);
        } else {
          users[idx].id = su.id;
          users[idx].role = su.role;
          users[idx].email = su.email;
          users[idx].password = su.password;
          users[idx].name = su.name;
          if (su.avatar) users[idx].avatar = su.avatar;
          if (su.phone) users[idx].phone = su.phone;
        }
      });
    }
    Storage.set(STORAGE_KEYS.USERS, users);

    // 2. Reconcile Properties
    let properties = Storage.get(STORAGE_KEYS.PROPERTIES, []);
    if (!properties || properties.length === 0) {
      properties = [...SEED_PROPERTIES];
    } else {
      SEED_PROPERTIES.forEach(sp => {
        const idx = properties.findIndex(p => p.id === sp.id);
        if (idx === -1) {
          properties.push(sp);
        } else {
          properties[idx].title = sp.title;
          properties[idx].address = sp.address;
          properties[idx].city = sp.city;
          properties[idx].type = sp.type;
          properties[idx].rent = sp.rent;
          properties[idx].bedrooms = sp.bedrooms;
          properties[idx].bathrooms = sp.bathrooms;
          properties[idx].amenities = sp.amenities;
          properties[idx].status = sp.status;
          if (sp.image) properties[idx].image = sp.image;
        }
      });
    }
    Storage.set(STORAGE_KEYS.PROPERTIES, properties);

    // 3. Reconcile Leases (Source of truth for tenant-property relationships)
    let leases = Storage.get(STORAGE_KEYS.LEASES, []);
    if (!leases || leases.length === 0) {
      leases = [...SEED_LEASES];
    } else {
      SEED_LEASES.forEach(sl => {
        const idx = leases.findIndex(l => l.id === sl.id || (l.tenantId === sl.tenantId && String(l.status).toLowerCase() === 'active'));
        if (idx === -1) {
          leases.push(sl);
        } else {
          leases[idx].id = sl.id;
          leases[idx].propertyId = sl.propertyId;
          leases[idx].tenantId = sl.tenantId;
          leases[idx].monthlyRent = sl.monthlyRent;
          leases[idx].securityDeposit = sl.securityDeposit;
          leases[idx].startDate = sl.startDate;
          leases[idx].endDate = sl.endDate;
          leases[idx].status = sl.status;
        }
      });
      // Ensure prospective/unassigned tenants have NO leases
      leases = leases.filter(l => l.tenantId !== 'usr_tenant_vikram');
    }
    Storage.set(STORAGE_KEYS.LEASES, leases);

    // 4. Reconcile Payments (Every payment MUST belong to an active lease)
    let payments = Storage.get(STORAGE_KEYS.PAYMENTS, []);
    if (!payments || payments.length === 0) {
      payments = [...SEED_PAYMENTS];
    } else {
      // Remove orphan payments for Vikram or payments referencing non-existent leases
      payments = payments.filter(p => {
        if (p.tenantId === 'usr_tenant_vikram') return false;
        return leases.some(l => l.id === p.leaseId && l.tenantId === p.tenantId);
      });

      SEED_PAYMENTS.forEach(sp => {
        const idx = payments.findIndex(p => p.id === sp.id);
        if (idx === -1) {
          payments.push(sp);
        } else {
          payments[idx].leaseId = sp.leaseId;
          payments[idx].tenantId = sp.tenantId;
          payments[idx].amount = sp.amount;
          payments[idx].dueDate = sp.dueDate;
        }
      });
    }
    Storage.set(STORAGE_KEYS.PAYMENTS, payments);

    // 5. Reconcile Maintenance (Linked to tenant and assigned property)
    let maint = Storage.get(STORAGE_KEYS.MAINTENANCE, []);
    if (!maint || maint.length === 0) {
      maint = [...SEED_MAINTENANCE];
    } else {
      SEED_MAINTENANCE.forEach(sm => {
        const idx = maint.findIndex(m => m.id === sm.id);
        if (idx === -1) {
          maint.push(sm);
        } else {
          maint[idx].propertyId = sm.propertyId;
          maint[idx].tenantId = sm.tenantId;
          maint[idx].title = sm.title;
        }
      });
      // Align any user-created tickets with the tenant's actual assigned property
      maint.forEach(m => {
        if (m.tenantId === 'usr_tenant_1' && (!m.propertyId || m.propertyId !== 'prop_1')) {
          m.propertyId = 'prop_1';
        }
        if (m.tenantId === 'usr_tenant_amit' && (!m.propertyId || m.propertyId !== 'prop_2')) {
          m.propertyId = 'prop_2';
        }
        if (m.tenantId === 'usr_tenant_sneha' && (!m.propertyId || m.propertyId !== 'prop_4')) {
          m.propertyId = 'prop_4';
        }
      });
      // Filter out any invalid tickets for Vikram
      maint = maint.filter(m => m.tenantId !== 'usr_tenant_vikram');
    }
    Storage.set(STORAGE_KEYS.MAINTENANCE, maint);

    // 6. Reconcile Messages
    let msgs = Storage.get(STORAGE_KEYS.MESSAGES, []);
    if (!msgs || msgs.length === 0) {
      msgs = [...SEED_MESSAGES];
    } else {
      SEED_MESSAGES.forEach(sm => {
        if (!msgs.some(m => m.id === sm.id)) {
          msgs.push(sm);
        }
      });
    }
    Storage.set(STORAGE_KEYS.MESSAGES, msgs);

    // 7. Align Active Session if already authenticated
    const cur = Storage.get(STORAGE_KEYS.CURRENT_USER, null);
    if (cur && cur.email) {
      const matched = users.find(u => u.email.toLowerCase() === cur.email.toLowerCase());
      if (matched && (cur.id !== matched.id || cur.role !== matched.role || cur.name !== matched.name)) {
        Storage.set(STORAGE_KEYS.CURRENT_USER, {
          id: matched.id,
          name: matched.name,
          email: matched.email,
          role: matched.role,
          phone: matched.phone || '',
          avatar: matched.avatar || '',
          createdAt: matched.createdAt
        });
      }
    }
  },

  /**
   * Forces a reset of all storage keys back to canonical demo seeds
   */
  reset() {
    Storage.set(STORAGE_KEYS.USERS, SEED_USERS);
    Storage.set(STORAGE_KEYS.PROPERTIES, SEED_PROPERTIES);
    Storage.set(STORAGE_KEYS.LEASES, SEED_LEASES);
    Storage.set(STORAGE_KEYS.PAYMENTS, SEED_PAYMENTS);
    Storage.set(STORAGE_KEYS.MAINTENANCE, SEED_MAINTENANCE);
    Storage.set(STORAGE_KEYS.MESSAGES, SEED_MESSAGES);
    Storage.remove(STORAGE_KEYS.CURRENT_USER);
  }
};

SeedData.initSeedData = SeedData.init;

if (typeof window !== 'undefined') {
  window.RentEase = window.RentEase || {};
  window.RentEase.seedData = SeedData;
  window.SeedData = SeedData;
}
if (typeof global !== 'undefined') {
  global.SeedData = SeedData;
  if (typeof window !== 'undefined') {
    window.RentEase = window.RentEase || {};
    window.RentEase.seedData = SeedData;
  }
}
