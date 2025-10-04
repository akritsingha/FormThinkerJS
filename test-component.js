// Test if the component is actually a React component
const React = require('react');

// Test CommonJS import
const FormThinkerDefault = require('./dist/index.js').default;
const { FormThinker } = require('./dist/index.js');

console.log('=== Component Analysis ===');

console.log('Default import type:', typeof FormThinkerDefault);
console.log('Named import type:', typeof FormThinker);
console.log('Are they equal?', FormThinkerDefault === FormThinker);

console.log('\n=== Default Component ===');
console.log('Is function?', typeof FormThinkerDefault === 'function');
console.log('proto:', FormThinkerDefault.__proto__ ? FormThinkerDefault.__proto__.constructor.name : 'no proto');
if (FormThinkerDefault.displayName) {
  console.log('displayName:', FormThinkerDefault.displayName);
}
if (FormThinkerDefault.name) {
  console.log('name:', FormThinkerDefault.name);
}

console.log('\n=== Named Component ===');
console.log('Is function?', typeof FormThinker === 'function');
console.log('proto:', FormThinker.__proto__ ? FormThinker.__proto__.constructor.name : 'no proto');
if (FormThinker.displayName) {
  console.log('displayName:', FormThinker.displayName);
}
if (FormThinker.name) {
  console.log('name:', FormThinker.name);
}

// Test if it's a valid React component
try {
  const props = { schema: {}, data: {}, setData: () => {} };
  console.log('\n=== React Component Test ===');
  console.log('Can call with props?', typeof FormThinkerDefault(props) === 'object');
} catch (e) {
  console.log('Component call error:', e.message);
}

// Test all exports
const allExports = require('./dist/index.js');
console.log('\n=== All Exports Details ===');
Object.keys(allExports).forEach(key => {
  const exportValue = allExports[key];
  console.log(`${key}: type=${typeof exportValue}, name=${exportValue.name || 'undefined'}`);
});
