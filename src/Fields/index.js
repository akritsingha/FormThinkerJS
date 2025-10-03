import { lazy } from 'react';

export {default as withWrapper} from './withWrapper.jsx';
export const Input = lazy(() => import('./Input.jsx'));
export const Checkbox = lazy(() => import('./Checkbox.jsx'));
export const MultipleCheckbox = lazy(() => import('./MultipleCheckbox.jsx'));
export const Range = lazy(() => import('./Range.jsx'));
export const Options = lazy(() => import('./Options.jsx'));
export const SelectBox = lazy(() => import('./SelectBox.jsx'));
export const ColorPalette = lazy(() => import('./ColorPalette.jsx'));
export const ArrayInput = lazy(() => import('./ArrayInput.jsx'));
export const RichTextEditor = lazy(() => import('./RichTextEditor.jsx'));
export const ArrayOfObject = lazy(() => import('./ArrayOfObject.jsx'));
