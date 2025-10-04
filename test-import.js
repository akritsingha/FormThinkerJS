// Test different import methods
console.log('Testing imports...');

// Test 1: Default import
try {
  const FormThinkerDefault = require('./dist/index.js').default;
  console.log('Default import:', typeof FormThinkerDefault);
  console.log('Default component name:', FormThinkerDefault.name);
} catch (e) {
  console.log('Default import error:', e.message);
}

// Test 2: Named import
try {
  const { FormThinker } = require('./dist/index.js');
  console.log('Named import:', typeof FormThinker);
  console.log('Named component name:', FormThinker.name);
} catch (e) {
  console.log('Named import error:', e.message);
}

// Test 3: All exports
try {
  const allExports = require('./dist/index.js');
  console.log('All exports:', Object.keys(allExports));
} catch (e) {
  console.log('All exports error:', e.message);
}
