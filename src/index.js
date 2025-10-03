import { lazy } from 'react';

// Main FormThinker component
export const FormThinker = lazy(() => import('./aFormRenderer.jsx'));

// Additional components
export const FormWidget = lazy(() => import('./bFormWidget.jsx'));
export const FormHeader = lazy(() => import('./cFormHeader.jsx'));
export const FormHeaderPill = lazy(() => import('./dFormHeaderPill.jsx'));
export const FormPlayGround = lazy(() => import('./cFormPlayGround.jsx'));

// Field components
export * from './Fields';

// Default export
export default FormThinker;
