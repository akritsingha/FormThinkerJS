// Test ES6 import syntax
import('./dist/index.esm.js').then(exports => {
  console.log('ES6 imports test:');
  console.log('Default export:', typeof exports.default);
  console.log('FormThinker named export:', typeof exports.FormThinker);
  console.log('Both are same:', exports.default === exports.FormThinker);
  console.log('All exports:', Object.keys(exports));
  
  if (exports.default && typeof exports.default === 'function') {
    console.log('Default component displayName:', exports.default.displayName);
  }
  if (exports.FormThinker && typeof exports.FormThinker === 'function') {
    console.log('Named component displayName:', exports.FormThinker.displayName);
  }
}).catch(err => {
  console.log('Import error:', err.message);
});
