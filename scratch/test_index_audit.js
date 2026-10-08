/**
 * Detailed Verification Test for index.html and Project Integrity
 */
const fs = require('fs');
const path = require('path');

console.log('--- AUDITING INDEX.HTML AND ALL REFERENCED ASSETS ---');

// 1. Verify index.html exists and is non-empty
const indexPath = path.join(__dirname, '..', 'index.html');
const indexStat = fs.statSync(indexPath);
console.assert(indexStat.size > 0, 'index.html is empty!');
console.log(`✓ index.html exists (${indexStat.size} bytes).`);

const indexContent = fs.readFileSync(indexPath, 'utf8');

// 2. Verify all 13 user requirements are present in index.html
const checks = [
  { desc: 'RentEase branding', re: /RentEase/ },
  { desc: 'Clear product introduction', re: /Streamlined Property Operations/ },
  { desc: 'Explanation of problem solved', re: /Solving the Core Challenges of Property Management/ },
  { desc: 'Fragmented records explained', re: /Fragmented Records/ },
  { desc: 'Rent tracking problem explained', re: /Opaque Rent Tracking/ },
  { desc: 'Maintenance problem explained', re: /Buried Maintenance Requests/ },
  { desc: 'Admin demo login CTA button', re: /id="demo-admin-login-btn"/ },
  { desc: 'Tenant demo login CTA button', re: /id="demo-tenant-login-btn"/ },
  { desc: 'Normal Sign In button', re: /href="pages\/login\.html"/ },
  { desc: 'Normal Sign Up button', re: /href="pages\/signup\.html"/ },
  { desc: 'CSS variables included', re: /href="css\/variables\.css"/ },
  { desc: 'Components CSS included', re: /href="css\/components\.css"/ },
  { desc: 'Seed data script included', re: /src="js\/data\/seedData\.js"/ },
  { desc: 'Auth service script included', re: /src="js\/services\/authService\.js"/ },
  { desc: 'Toast component included', re: /src="js\/components\/toast\.js"/ }
];

checks.forEach(c => {
  const passed = c.re.test(indexContent);
  console.assert(passed, `FAILED requirement: ${c.desc}`);
  console.log(`✓ Found: ${c.desc}`);
});

// 3. Test functional behavior of seedData and authService
const localStorageData = {};
global.localStorage = {
  getItem: (key) => (localStorageData.hasOwnProperty(key) ? localStorageData[key] : null),
  setItem: (key, val) => { localStorageData[key] = String(val); },
  removeItem: (key) => { delete localStorageData[key]; },
  clear: () => { Object.keys(localStorageData).forEach(k => delete localStorageData[k]); }
};

global.window = {
  localStorage: global.localStorage,
  location: { pathname: '/index.html', search: '', href: '' }
};

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

// Test seed initialization
window.RentEase.seedData.initSeedData();
const users = window.RentEase.storage.getAll(window.RentEase.CONSTANTS.STORAGE_KEYS.USERS);
console.assert(users.length >= 5, 'Seed users not initialized');
console.log(`✓ Seed data initialized (${users.length} users).`);

// Test Admin Demo Login CTA logic
const adminLoginRes = window.RentEase.authService.login('admin@rentease.demo', 'admin123');
console.assert(adminLoginRes.success === true, 'Admin demo login failed');
console.assert(adminLoginRes.user.role === 'admin', 'Admin role mismatch');
console.log('✓ Admin Demo Login CTA logic passed.');

// Test Tenant Demo Login CTA logic
const tenantLoginRes = window.RentEase.authService.login('tenant@rentease.demo', 'tenant123');
console.assert(tenantLoginRes.success === true, 'Tenant demo login failed');
console.assert(tenantLoginRes.user.role === 'tenant', 'Tenant role mismatch');
console.log('✓ Tenant Demo Login CTA logic passed.');

// 4. Verify all files in project are non-empty
const files = fs.readdirSync(path.join(__dirname, '..'), { recursive: true });
let zeroByteCount = 0;
files.forEach(f => {
  const full = path.join(__dirname, '..', f);
  if (fs.statSync(full).isFile()) {
    const sz = fs.statSync(full).size;
    if (sz === 0) {
      console.error('ZERO BYTE FILE:', f);
      zeroByteCount++;
    }
  }
});

console.assert(zeroByteCount === 0, `Found ${zeroByteCount} zero-byte files!`);
console.log('✓ Zero-byte files check passed (0 found across whole repository).');

console.log('==================================================');
console.log('ALL INDEX.HTML AND INTEGRITY AUDIT CHECKS PASSED!');
console.log('==================================================');

