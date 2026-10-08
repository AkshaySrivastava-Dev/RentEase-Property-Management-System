const fs = require('fs');
const path = require('path');

let errors = 0;

function checkHtmlFile(htmlRelPath) {
  const content = fs.readFileSync(htmlRelPath, 'utf8');
  const dir = path.dirname(htmlRelPath);
  
  // Find stylesheets
  const cssMatches = content.match(/href=["']([^"']+\.css)["']/g) || [];
  for (const m of cssMatches) {
    const cssRel = m.match(/href=["']([^"']+)["']/)[1];
    const resolved = path.resolve(dir, cssRel);
    if (!fs.existsSync(resolved)) {
      console.error('MISSING CSS in', htmlRelPath, ':', cssRel);
      errors++;
    }
  }

  // Find scripts
  const jsMatches = content.match(/src=["']([^"']+\.js)["']/g) || [];
  for (const m of jsMatches) {
    const jsRel = m.match(/src=["']([^"']+)["']/)[1];
    const resolved = path.resolve(dir, jsRel);
    if (!fs.existsSync(resolved)) {
      console.error('MISSING JS in', htmlRelPath, ':', jsRel);
      errors++;
    }
  }
}

const htmlFiles = [
  'index.html',
  'pages/login.html',
  'pages/signup.html',
  'pages/admin/dashboard.html',
  'pages/admin/properties.html',
  'pages/admin/property-details.html',
  'pages/admin/tenants.html',
  'pages/admin/leases.html',
  'pages/admin/payments.html',
  'pages/admin/maintenance.html',
  'pages/admin/messages.html',
  'pages/tenant/dashboard.html',
  'pages/tenant/property.html',
  'pages/tenant/lease.html',
  'pages/tenant/payments.html',
  'pages/tenant/maintenance.html',
  'pages/tenant/messages.html'
];

htmlFiles.forEach(f => checkHtmlFile(f));
if (errors === 0) {
  console.log('SUCCESS: All CSS and JS asset links in all 17 HTML files exist and resolve perfectly.');
} else {
  console.error(`FAILED: Found ${errors} missing asset references.`);
}

