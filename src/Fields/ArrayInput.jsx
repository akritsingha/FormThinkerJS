import React, { memo, useState, useCallback, useRef, useEffect } from 'react'

const ArrayInput = memo(({ 
    label, 
    value = [], 
    onChange, 
    fieldpath, 
    disabled = false,
    placeholder = "Enter value",
    addButtonText = "Add Item",
    removeButtonText = "Remove",
    inputType = "text",
    allowEmpty = false,
    maxItems = null,
    showIndex = true,
    allowReorder = true
}) => {
    const [localValue, setLocalValue] = useState(Array.isArray(value) ? value : []);

    useEffect(() => {
        setLocalValue(Array.isArray(value) ? value : []);
    }, [value]);

    const timeoutRef = useRef(null);

    // Proper debounce implementation with cleanup
    const debouncedOutput = useCallback((val) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            if (onChange) onChange(fieldpath, val);
        }, 300);
    }, [onChange, fieldpath]);

    // Cleanup timeout on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleItemChange = (index, newValue) => {
        if (!Array.isArray(localValue)) return;
        const newArray = [...localValue];
        newArray[index] = newValue;
        setLocalValue(newArray);
        debouncedOutput(newArray);
    };

    const handleAddItem = () => {
        if (!Array.isArray(localValue)) return;
        if (maxItems && localValue.length >= maxItems) return;
        const newArray = [...localValue, ''];
        setLocalValue(newArray);
        debouncedOutput(newArray);
    };

    const handleRemoveItem = (index) => {
        if (!Array.isArray(localValue)) return;
        const newArray = localValue.filter((_, i) => i !== index);
        setLocalValue(newArray);
        debouncedOutput(newArray);
    };

    const handleMoveUp = (index) => {
        if (!Array.isArray(localValue) || index === 0) return;
        const newArray = [...localValue];
        [newArray[index - 1], newArray[index]] = [newArray[index], newArray[index - 1]];
        setLocalValue(newArray);
        debouncedOutput(newArray);
    };

    const handleMoveDown = (index) => {
        if (!Array.isArray(localValue) || index === localValue.length - 1) return;
        const newArray = [...localValue];
        [newArray[index], newArray[index + 1]] = [newArray[index + 1], newArray[index]];
        setLocalValue(newArray);
        debouncedOutput(newArray);
    };

    const canAdd = !maxItems || (Array.isArray(localValue) && localValue.length < maxItems);
    const hasItems = Array.isArray(localValue) && localValue.length > 0;

    return (
        <div className='w-full'>
            <div className='flex justify-between items-center mb-3'>
                <span className='text-gray-700'>{label}</span>
                <span className='text-sm text-gray-500'>
                    {Array.isArray(localValue) ? localValue.length : 0} item{(Array.isArray(localValue) ? localValue.length : 0) !== 1 ? 's' : ''}
                    {maxItems && ` / ${maxItems}`}
                </span>
            </div>

            {/* Items List */}
            <div className='space-y-2 mb-3'>
                {Array.isArray(localValue) && localValue.map((item, index) => (
                    <div key={index} className='flex items-center gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50'>
                        {showIndex && (
                            <span className='text-xs font-medium text-gray-500 w-6 text-center'>
                                {index + 1}
                            </span>
                        )}
                        
                        <input
                            type={inputType}
                            value={item}
                            onChange={(e) => handleItemChange(index, e.target.value)}
                            placeholder={placeholder}
                            disabled={disabled}
                            className='flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed'
                        />

                        {/* Action Buttons */}
                        <div className='flex items-center gap-1'>
                            {allowReorder && (
                                <>
                                    <button
                                        onClick={() => handleMoveUp(index)}
                                        disabled={disabled || index === 0}
                                        className='p-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed'
                                        title="Move up"
                                    >
                                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 15l7-7 7 7' />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleMoveDown(index)}
                                        disabled={disabled || index === localValue.length - 1}
                                        className='p-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed'
                                        title="Move down"
                                    >
                                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                        </svg>
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => handleRemoveItem(index)}
                                disabled={disabled}
                                className='p-1 text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed'
                                title={removeButtonText}
                            >
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Button */}
            <button
                onClick={handleAddItem}
                disabled={disabled || !canAdd}
                className='w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors'
            >
                <div className='flex items-center justify-center gap-2'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                    </svg>
                    {addButtonText}
                </div>
            </button>

            {/* Empty State */}
            {!hasItems && (
                <div className='text-center py-4 text-gray-500 text-sm'>
                    No items added yet. Click the button above to add your first item.
                </div>
            )}

            {/* Max Items Warning */}
            {maxItems && Array.isArray(localValue) && localValue.length >= maxItems && (
                <div className='text-center py-2 text-amber-600 text-sm'>
                    Maximum {maxItems} items reached
                </div>
            )}
        </div>
    )
})

export default ArrayInput
