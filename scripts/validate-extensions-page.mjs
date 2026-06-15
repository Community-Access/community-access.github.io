import fs from 'node:fs';

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

let failed = false;
function check(condition, message) {
  if (!condition) {
    console.error(message);
    failed = true;
  }
}

check(fs.existsSync('extensions.html'), 'extensions.html must exist');
check(fs.existsSync('extensions.js'), 'extensions.js must exist');

if (fs.existsSync('extensions.html')) {
  const html = read('extensions.html');
  check(html.includes('<h1>Accessibility Agents Extension Marketplace</h1>'), 'extensions.html must have the marketplace h1');
  check(html.includes('id="extension-search"'), 'extensions.html must include search input');
  check(html.includes('id="domain-filter"'), 'extensions.html must include domain filter');
  check(html.includes('id="status-filter"'), 'extensions.html must include status filter');
  check(html.includes('id="extension-detail"'), 'extensions.html must include detail region');
  check(html.includes('extensions.js'), 'extensions.html must load extensions.js');
}

if (fs.existsSync('extensions.js')) {
  const js = read('extensions.js');
  check(js.includes('accessibility-agents-marketplace/main/marketplace.json'), 'extensions.js must fetch marketplace catalog from GitHub');
  check(js.includes('renderExtensionDetail'), 'extensions.js must render extension detail view');
  check(js.includes('domain-filter'), 'extensions.js must wire domain filter');
  check(js.includes('status-filter'), 'extensions.js must wire status filter');
  check(js.includes('extension-search'), 'extensions.js must wire search');
}

if (fs.existsSync('index.html')) {
  check(read('index.html').includes('extensions.html'), 'index.html must link to extensions.html');
}

if (failed) process.exit(1);
console.log('Extensions marketplace page validation passed.');
