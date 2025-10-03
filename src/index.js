import { lazy } from 'react';

// Main FormThinker component
export const FormThinker = lazy(() => import('./aFormRenderer'));

// Additional components
export const FormWidget = lazy(() => import('./bFormWidget'));
export const FormHeader = lazy(() => import('./cFormHeader'));
export const FormHeaderPill = lazy(() => import('./dFormHeaderPill'));
export const FormPlayGround = lazy(() => import('./cFormPlayGround'));

// Field components
export * from './Fields';

// Default export
export default FormThinker;
