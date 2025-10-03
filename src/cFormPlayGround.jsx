import React, {memo, useState, Suspense, useMemo} from 'react'
import { 
    Input, 
    Checkbox, 
    MultipleCheckbox, 
    Range, 
    Options, 
    SelectBox, 
    ColorPalette, 
    ArrayInput, 
    RichTextEditor,
    ArrayOfObject,
    withWrapper
} from './Fields';
import { FormWidget } from '.';

const FormPlayGround = memo(({
    schema,
    value,
    nested,
    onChange,
    activeTab,
    fieldpath = '',
}) => {
    const {type = '', inherit='', description=''} = schema || {};

    const updatedPath = [...fieldpath, activeTab];

    // Memoize HOC components to prevent re-creation on every render
    const MemoizedComponents = useMemo(() => ({
        InputHOC: withWrapper(Input),
        CheckboxHOC: withWrapper(Checkbox),
        MultipleCheckboxHOC: withWrapper(MultipleCheckbox),
        RangeHOC: withWrapper(Range),
        OptionsHOC: withWrapper(Options),
        SelectBoxHOC: withWrapper(SelectBox),
        ColorPaletteHOC: withWrapper(ColorPalette),
        ArrayInputHOC: withWrapper(ArrayInput),
        RichTextEditorHOC: withWrapper(RichTextEditor),
        ArrayOfObjectHOC: withWrapper(ArrayOfObject),
    }), []);

    
    const RenderComp = (type, value, schema) => {
        const { format = '', enum: enumValues = [], minimum = 0, maximum = 100, multipleOf = 1, properties = {} } = schema || {};
        
        // Handle different field types and formats
        switch (type) {
            case "string":
                // Handle different string formats
                switch (format) {
                    case "variants":
                        // Radio buttons for enum values
                        return (
                            <MemoizedComponents.OptionsHOC
                                fieldpath={updatedPath}
                                label={activeTab}
                                options={enumValues.map(val => ({ label: val, value: val }))}
                                value={value}
                                schema={schema}
                                onChange={onChange}
                            />
                        );
                    case "color":
                        // Color picker
                        return (
                            <MemoizedComponents.ColorPaletteHOC
                                fieldpath={updatedPath}
                                label={activeTab}
                                schema={schema}
                                value={value}
                                onChange={onChange}
                            />
                        );

                    case "richText":
                        // Rich text editor
                        return (
                            <MemoizedComponents.RichTextEditorHOC
                                fieldpath={updatedPath}
                                label={activeTab}
                                value={value}
                                onChange={onChange}
                                schema={schema}
                                placeholder={description}
                            />
                        );
                    case "array":
                        // Array input for string arrays
                        return (
                            <MemoizedComponents.ArrayInputHOC
                                fieldpath={updatedPath}
                                label={activeTab}
                                value={value || []}
                                schema={schema}
                                onChange={onChange}
                                placeholder={description}
                            />
                        );
                    default:
                        // Regular text input
                        return (
                            <MemoizedComponents.InputHOC
                                fieldpath={updatedPath}
                                type="text"
                                schema={schema}
                                label={activeTab}
                                placeHolder={description}
                                value={value}
                                onChange={onChange}
                            />
                        );
                }

            case "number":
                // Handle different number formats
                switch (format) {
                    case "range":
                        // Range slider
                        return (
                            <MemoizedComponents.RangeHOC
                                fieldpath={updatedPath}
                                label={activeTab}
                                value={value || 0}
                                onChange={onChange}
                                min={minimum}
                                schema={schema}
                                max={maximum}
                                step={multipleOf}
                                showValue={true}
                            />
                        );
                    default:
                        // Regular number input
                        return (
                            <MemoizedComponents.InputHOC
                                fieldpath={updatedPath}
                                type="number"
                                label={activeTab}
                                placeHolder={description}
                                value={value}
                                schema={schema}
                                onChange={onChange}
                            />
                        );
                }

            case "boolean":
                // Checkbox for boolean values
                return (
                    <MemoizedComponents.CheckboxHOC
                        fieldpath={updatedPath}
                        label={activeTab}
                        schema={schema}
                        value={value}
                        onChange={onChange}
                    />
                );

            case "array":
                // Handle array types
                if (schema.items && schema.items.type === "string") {
                    // String array
                    return (
                        <MemoizedComponents.ArrayInputHOC
                            fieldpath={updatedPath}
                            label={activeTab}
                            value={value || []}
                            schema={schema}
                            onChange={onChange}
                            placeholder={description}
                        />
                    );
                } else if (schema.items && schema.items.enum) {
                    // Multiple checkbox for enum arrays
                    return (
                        <MemoizedComponents.MultipleCheckboxHOC
                            fieldpath={updatedPath}
                            label={activeTab}
                            schema={schema}
                            options={schema.items.enum.map(val => ({ label: val, value: val }))}
                            value={value || []}
                            onChange={onChange}
                        />
                    );
                } else if (schema.items && schema.items.type === "object") {
                    // Array of objects
                    return (
                        <MemoizedComponents.ArrayOfObjectHOC
                            fieldpath={updatedPath}
                            label={activeTab}
                            schema={schema}
                            value={value || []}
                            onChange={onChange}
                            itemSchema={schema.items}
                        />
                    );
                } else {
                    // Generic array input
                    return (
                        <MemoizedComponents.ArrayInputHOC
                            fieldpath={updatedPath}
                            label={activeTab}
                            schema={schema}
                            value={value || []}
                            onChange={onChange}
                            placeholder={description}
                        />
                    );
                }

            case "object":
                // Nested object - use FormWidget
                return (
                    <FormWidget
                        schema={schema}
                        formData={value}
                        nested={nested + 1}
                        onChange={onChange}
                        fieldpath={updatedPath}
                    />
                );

            case "select":
                // Select dropdown
                return (
                    <MemoizedComponents.SelectBoxHOC
                        fieldpath={updatedPath}
                        label={activeTab}
                        options={enumValues.map(val => ({ label: val, value: val }))}
                        value={value}
                        schema={schema}
                        onChange={onChange}
                        placeholder={description}
                    />
                );

            case "error":
                // Error state
                return (
                    <div className="p-4 text-red-500 border border-red-200 rounded bg-red-50">
                        Error: {description || 'Invalid field configuration'}
                    </div>
                );

            default:
                // Fallback for unknown types
                return (
                    <div className="p-4 text-gray-500 border border-gray-200 rounded bg-gray-50">
                        <div className="font-medium">Unknown field type: {type}</div>
                        <div className="text-sm mt-1">{description}</div>
                        <div className="text-xs mt-2 text-gray-400">
                            Available types: string, number, boolean, object, array, select
                        </div>
                    </div>
                );
        }
    }


    return (
        <div className='w-full'>
            <div className='rounded-lg '>
            <Suspense fallback={
                <div className="flex items-center justify-center">
                    <div className="animate-pulse bg-gray-200 h-full p-6 w-full rounded-lg flex items-center justify-center">Loading</div>
                </div>
            }>
                {RenderComp(type, value, schema)}
            </Suspense>
            </div>
        </div>
    )
})

export default FormPlayGround