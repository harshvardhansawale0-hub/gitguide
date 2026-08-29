// ============================================================
// Test script for theme toggle button and mobile animation fix
// ============================================================
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Testing Theme Toggle Fix ---');

// 1. Check CSS file for key fixes
const css = fs.readFileSync(path.join(__dirname, '../css/style.css'), 'utf8');

// Check that .theme-toggle hover rotation is guarded by hover/pointer media query
assert.ok(
    css.includes('@media (hover: hover) and (pointer: fine)'),
    'CSS must guard hover rotation with @media (hover: hover) and (pointer: fine)'
);

// Check that hover rotation targets the icon, NOT the button container
assert.ok(
    css.includes('.theme-toggle:hover .theme-toggle-icon'),
    'Hover rotation must target .theme-toggle-icon'
);

// Check that mobile .navbar-links .theme-toggle has transform: none
assert.ok(
    css.includes('.navbar-links .theme-toggle') && css.includes('transform: none !important'),
    'Mobile theme-toggle must have transform: none !important to prevent stuck rotation'
);

// Check that hardcoded ::after content is removed
assert.ok(
    !css.includes(".navbar-links .theme-toggle::after"),
    'CSS should not have hardcoded .navbar-links .theme-toggle::after pseudo-element'
);

// Check that keyframes animation exists
assert.ok(
    css.includes('@keyframes themeIconSpin'),
    'CSS must define @keyframes themeIconSpin'
);

console.log('✓ CSS validation passed.');

// 2. Check JavaScript logic in script.js
const js = fs.readFileSync(path.join(__dirname, '../js/script.js'), 'utf8');

// Ensure only one initTheme definition exists
const initThemeMatches = js.match(/function\s+initTheme\s*\(/g);
assert.strictEqual(
    initThemeMatches ? initThemeMatches.length : 0,
    1,
    'There should be exactly one initTheme function definition in script.js'
);

// Ensure theme-toggle has icon and text spans
assert.ok(
    js.includes('class="theme-toggle-icon"') && js.includes('class="theme-toggle-text"'),
    'Navigation markup must contain theme-toggle-icon and theme-toggle-text'
);

// Ensure blur() is called to clear mobile sticky focus
assert.ok(
    js.includes('toggleBtn.blur()'),
    'toggleBtn.blur() must be called to clear mobile sticky focus/hover'
);

console.log('✓ JS validation passed.');
console.log('--- ALL THEME TOGGLE TESTS PASSED SUCCESSFULLY! ---');
