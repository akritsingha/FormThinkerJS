import React from 'react';

// Simple test component
const SimpleComponent = ({ text }) => {
  return React.createElement('div', null, text);
};

SimpleComponent.displayName = 'SimpleComponent';

const MemoizedComponent = React.memo(SimpleComponent);
MemoizedComponent.displayName = 'MemoizedSimpleComponent';

// Test if this exports correctly
export default MemoizedComponent;
export { SimpleComponent, MemoizedComponent };
