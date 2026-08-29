// ============================================================
// Test script for search page responsiveness validation
// ============================================================
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Testing Search Page Responsiveness ---');

// 1. Validate search.html
const html = fs.readFileSync(path.join(__dirname, '../search.html'), 'utf8');

// Ensure hardcoded destructive inline styles are removed
assert.ok(
    !html.includes('style="padding: 8rem 0 4rem;"'),
    'Destructive inline padding on giant-search-section must be removed'
);

// Ensure mobile filter toggle button exists
assert.ok(
    html.includes('id="mobileFilterToggle"'),
    'Mobile filter toggle button (#mobileFilterToggle) must exist in search.html'
);

// Ensure search clear button exists
assert.ok(
    html.includes('id="clearSearchBtn"'),
    'Clear search button (#clearSearchBtn) must exist in search.html'
);

// Ensure popular searches exist
assert.ok(
    html.includes('id="popularSearches"'),
    'Popular searches (#popularSearches) must exist in search.html'
);

console.log('✓ search.html validation passed.');

// 2. Validate search.js
const searchJs = fs.readFileSync(path.join(__dirname, '../js/search.js'), 'utf8');

assert.ok(
    searchJs.includes('mobileFilterToggle'),
    'search.js must handle mobileFilterToggle'
);

assert.ok(
    searchJs.includes('clearSearchBtn'),
    'search.js must handle clearSearchBtn'
);

assert.ok(
    searchJs.includes('updateActiveFilterCount'),
    'search.js must update active filter count'
);

console.log('✓ search.js validation passed.');

// 3. Validate style.css responsive rules
const css = fs.readFileSync(path.join(__dirname, '../css/style.css'), 'utf8');

assert.ok(
    css.includes('.mobile-filter-bar'),
    'style.css must define .mobile-filter-bar'
);

assert.ok(
    css.includes('.search-sidebar.active'),
    'style.css must define .search-sidebar.active drawer styles'
);

assert.ok(
    css.includes('@keyframes filterDrawerSlide'),
    'style.css must define @keyframes filterDrawerSlide'
);

console.log('✓ style.css responsive validation passed.');
console.log('--- ALL SEARCH RESPONSIVENESS TESTS PASSED SUCCESSFULLY! ---');
