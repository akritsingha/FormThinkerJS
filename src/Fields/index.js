import { lazy } from 'react';

export {default as withWrapper} from './withWrapper';
export const Input = lazy(() => import('./Input'));
export const Checkbox = lazy(() => import('./Checkbox'));
export const MultipleCheckbox = lazy(() => import('./MultipleCheckbox'));
export const Range = lazy(() => import('./Range'));
export const Options = lazy(() => import('./Options'));
export const SelectBox = lazy(() => import('./SelectBox'));
export const ColorPalette = lazy(() => import('./ColorPalette'));
export const ArrayInput = lazy(() => import('./ArrayInput'));
export const RichTextEditor = lazy(() => import('./RichTextEditor'));
export const ArrayOfObject = lazy(() => import('./ArrayOfObject'));
