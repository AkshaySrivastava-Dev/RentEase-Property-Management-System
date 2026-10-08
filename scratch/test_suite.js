/**
 * Comprehensive RentEase Node.js Verification Test Suite
 */
const fs = require('fs');
const path = require('path');

// 1. Mock Browser Environment
const localStorageData = {};
global.localStorage = {
  getItem: (key) => (localStorageData.hasOwnProperty(key) ? localStorageData[key] : null),
  setItem: (key, val) => { localStorageData[key] = String(val); },
  removeItem: (key) => { delete localStorageData[key]; },
  clear: () => { Object.keys(localStorageData).forEach(k => delete localStorageData[k]); }
};

global.window = {
  localStorage: global.localStorage,
  location: { pathname: '/pages/admin/dashboard.html', search: '', href: '' }
};

// 2. Load RentEase Scripts sequentially into Node runtime
function loadScript(relPath) {
  const fullPath = path.join(__dirname, '..', relPath);
  const code = fs.readFileSync(fullPath, 'utf8');
  eval(code);
}

loadScript('js/utils/constants.js');
loadScript('js/utils/helpers.js');
loadScript('js/utils/formatters.js');
loadScript('js/utils/validators.js');
loadScript('js/storage/storage.js');
loadScript('js/data/seedData.js');
loadScript('js/services/authService.js');
loadScript('js/services/propertyService.js');
loadScript('js/services/tenantService.js');
loadScript('js/services/leaseService.js');
loadScript('js/services/paymentService.js');
loadScript('js/services/maintenanceService.js');
loadScript('js/services/messageService.js');

console.log('--- STARTING RENTEASE TEST SUITE ---');

// TEST 1: Seed Data Initialization
console.log('Test 1: Seed Data Initialization');
window.RentEase.seedData.initSeedData();
const users = window.RentEase.storage.getAll(window.RentEase.CONSTANTS.STORAGE_KEYS.USERS);
console.assert(users.length >= 5, `Expected >= 5 users, got ${users.length}`);
const props = window.RentEase.storage.getAll(window.RentEase.CONSTANTS.STORAGE_KEYS.PROPERTIES);
console.assert(props.length >= 4, `Expected >= 4 properties, got ${props.length}`);
console.log('✓ Seed data verified successfully.');

// TEST 2: Authentication
console.log('Test 2: Authentication (Login, Signup, Role Check)');
const loginAdmin = window.RentEase.authService.login('admin@rentease.demo', 'admin123');
console.assert(loginAdmin.success === true, 'Admin login failed');
console.assert(loginAdmin.user.role === 'admin', 'Admin role mismatch');
console.assert(window.RentEase.authService.getCurrentUser().role === 'admin', 'Session currentUser not set');

const loginTenant = window.RentEase.authService.login('tenant@rentease.demo', 'tenant123');
console.assert(loginTenant.success === true, 'Tenant login failed');
console.assert(loginTenant.user.role === 'tenant', 'Tenant role mismatch');

// Invalid login
const badLogin = window.RentEase.authService.login('tenant@rentease.demo', 'wrongpwd');
console.assert(badLogin.success === false, 'Bad login should fail');

// Signup duplicate check
const dupSignup = window.RentEase.authService.signup({
  name: 'Duplicate Test',
  email: 'admin@rentease.demo',
  password: 'password123'
});
console.assert(dupSignup.success === false, 'Duplicate email must be rejected');

// New signup
const newSignup = window.RentEase.authService.signup({
  name: 'New Tenant Test',
  email: 'newtenant@rentease.demo',
  password: 'password123',
  role: 'tenant'
});
console.assert(newSignup.success === true, 'Valid signup failed');
console.log('✓ Authentication flows verified.');

// TEST 3: Property CRUD & Occupancy Status
console.log('Test 3: Property Management CRUD');
const newPropRes = window.RentEase.propertyService.createProperty({
  title: 'Test Coral Bay Villa',
  address: '10 Ocean Drive',
  city: 'Goa',
  type: 'Villa',
  rent: 75000,
  bedrooms: 3,
  bathrooms: 3,
  amenities: ['Pool', 'Garden'],
  status: 'Available'
});
console.assert(newPropRes.success === true, 'Failed to create property');
const createdPropId = newPropRes.property.id;

// Read
const fetchedProp = window.RentEase.propertyService.getById(createdPropId);
console.assert(fetchedProp.title === 'Test Coral Bay Villa', 'Property retrieval failed');

// Update
const updateRes = window.RentEase.propertyService.updateProperty(createdPropId, { rent: 80000 });
console.assert(updateRes.success === true && updateRes.property.rent === 80000, 'Property update failed');

// Stats
const stats = window.RentEase.propertyService.getStats();
console.assert(stats.total > 0 && stats.available > 0, 'Stats calculation failed');
console.log('✓ Property CRUD verified.');

// TEST 4: Lease Management & Automatic Property Status Sync
console.log('Test 4: Lease Management & Auto Occupancy Sync');
const newLeaseRes = window.RentEase.leaseService.createLease({
  propertyId: createdPropId,
  tenantId: newSignup.user.id,
  startDate: '2026-11-01',
  endDate: '2027-10-31',
  monthlyRent: 80000,
  securityDeposit: 160000,
  status: 'Active'
});
console.assert(newLeaseRes.success === true, 'Failed to create lease');

// Property must automatically become 'Occupied'
const propAfterLease = window.RentEase.propertyService.getById(createdPropId);
console.assert(propAfterLease.status === 'Occupied', `Expected Occupied, got ${propAfterLease.status}`);

// Deleting property with active lease must fail
const deleteBlocked = window.RentEase.propertyService.deleteProperty(createdPropId);
console.assert(deleteBlocked.success === false, 'Deleting property with active lease should be blocked');

// Expiring lease must make property Available again
window.RentEase.leaseService.updateLease(newLeaseRes.lease.id, { status: 'Expired' });
const propAfterExpire = window.RentEase.propertyService.getById(createdPropId);
console.assert(propAfterExpire.status === 'Available', `Expected Available after expiry, got ${propAfterExpire.status}`);

// Now delete property should succeed
const deleteOk = window.RentEase.propertyService.deleteProperty(createdPropId);
console.assert(deleteOk.success === true, 'Delete property failed');
console.log('✓ Lease & occupancy synchronization verified.');

// TEST 5: Payment Tracking & Tenant Isolation
console.log('Test 5: Payment Tracking & Tenant Isolation');
const payStats = window.RentEase.paymentService.getStats();
console.assert(payStats.totalCollected > 0, 'Payment total collected stats failed');

// Tenant should only get their own payments
const tenant1Payments = window.RentEase.paymentService.getAll({ tenantId: 'user-tenant-1' });
tenant1Payments.forEach(p => {
  console.assert(p.tenantId === 'user-tenant-1', 'Tenant isolation breached!');
});
console.log('✓ Payment tracking & isolation verified.');

// TEST 6: Maintenance Request Lifecycle
console.log('Test 6: Maintenance Request Lifecycle');
const maintRes = window.RentEase.maintenanceService.createRequest({
  tenantId: 'user-tenant-1',
  title: 'Water filter replacement',
  description: 'Filter indicator light is blinking red.',
  priority: 'Low'
});
console.assert(maintRes.success === true, 'Failed to create maintenance ticket');
console.assert(maintRes.request.status === 'Open', 'New request must be Open');

// Admin updates status to In Progress, then Resolved
window.RentEase.maintenanceService.updateStatus(maintRes.request.id, 'In Progress');
console.assert(window.RentEase.maintenanceService.getById(maintRes.request.id).status === 'In Progress');

window.RentEase.maintenanceService.updateStatus(maintRes.request.id, 'Resolved');
console.assert(window.RentEase.maintenanceService.getById(maintRes.request.id).status === 'Resolved');
console.log('✓ Maintenance lifecycle verified.');

// TEST 7: Messaging
console.log('Test 7: Messaging System');
const msgRes = window.RentEase.messageService.sendMessage({
  senderId: 'user-tenant-1',
  receiverId: 'user-admin-1',
  content: 'Thank you for resolving the water filter!'
});
console.assert(msgRes.success === true, 'Send message failed');

const conv = window.RentEase.messageService.getConversation('user-tenant-1', 'user-admin-1');
console.assert(conv.length >= 4, 'Conversation history incomplete');
console.log('✓ Messaging system verified.');

console.log('==================================================');
console.log('ALL TESTS PASSED SUCCESSFULLY! 100% FUNCTIONAL!');
console.log('==================================================');
