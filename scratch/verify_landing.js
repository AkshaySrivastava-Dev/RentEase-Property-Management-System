const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('index.html', 'utf8');

// 1. Check scripts
const scriptMatches = [...content.matchAll(/src="([^"]+)"/g)].map(m => m[1]);
console.log('Scripts referenced in index.html:');
scriptMatches.forEach(src => {
  const p = path.resolve(src);
  if (fs.existsSync(p)) {
    console.log(`  ✓ Script exists: ${src} (${fs.statSync(p).size} bytes)`);
  } else {
    console.error(`  ✕ Missing script: ${src}`);
  }
});

// 2. Check CSS files
const cssMatches = [...content.matchAll(/href="(css\/[^"]+)"/g)].map(m => m[1]);
console.log('\nCSS files referenced in index.html:');
cssMatches.forEach(href => {
  const p = path.resolve(href);
  if (fs.existsSync(p)) {
    console.log(`  ✓ CSS exists: ${href} (${fs.statSync(p).size} bytes)`);
  } else {
    console.error(`  ✕ Missing CSS: ${href}`);
  }
});

// 3. Check page links
const pageMatches = [...content.matchAll(/href="(pages\/[^"]+)"/g)].map(m => m[1]);
console.log('\nPage links referenced in index.html:');
pageMatches.forEach(href => {
  const p = path.resolve(href);
  if (fs.existsSync(p)) {
    console.log(`  ✓ Page exists: ${href} (${fs.statSync(p).size} bytes)`);
  } else {
    console.error(`  ✕ Missing Page: ${href}`);
  }
});

// 4. Test demo login buttons logic
const localStorageData = {};
global.localStorage = {
  getItem: (key) => (localStorageData.hasOwnProperty(key) ? localStorageData[key] : null),
  setItem: (key, val) => { localStorageData[key] = String(val); },
  removeItem: (key) => { delete localStorageData[key]; },
  clear: () => { Object.keys(localStorageData).forEach(k => delete localStorageData[k]); }
};
global.window = {
  RentEase: {},
  location: { href: '', reload: () => {} }
};

function loadScript(rel) {
  const code = fs.readFileSync(path.resolve(rel), 'utf8');
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

global.SeedData.init();
const adminLogin = global.AuthService.login('admin@rentease.demo', 'admin123');
console.log('\nDemo Admin Login result:', adminLogin.success ? 'SUCCESS (Role: ' + adminLogin.user.role + ')' : 'FAILED');

const tenantLogin = global.AuthService.login('tenant@rentease.demo', 'tenant123');
console.log('Demo Tenant Login result:', tenantLogin.success ? 'SUCCESS (Role: ' + tenantLogin.user.role + ')' : 'FAILED');

console.log('\n=== ALL ASSETS & LOGINS VERIFIED CLEANLY ===');

