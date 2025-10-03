import React, { memo, useState, useCallback, useRef, useEffect } from 'react'

const SelectBox = memo(({ 
    label, 
    options = [], 
    value, 
    onChange, 
    fieldpath, 
    disabled = false,
    placeholder = "Select an option",
    multiple = false
}) => {
    const [localValue, setLocalValue] = useState(value ?? (multiple ? [] : ''));

    useEffect(() => {
        setLocalValue(value ?? (multiple ? [] : ''));
    }, [value, multiple]);

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

    const handleSelectChange = (e) => {
        if (multiple) {
            const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
            setLocalValue(selectedValues);
            debouncedOutput(selectedValues);
        } else {
            const newVal = e.target.value;
            setLocalValue(newVal);
            debouncedOutput(newVal);
        }
    };

    return (
        <div className='w-full'>
            <div className='mb-2 text-gray-700'>{label}</div>
            <select 
                value={localValue}
                onChange={handleSelectChange}
                disabled={disabled}
                multiple={multiple}
                className='w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed'
            >
                {!multiple && <option value="">{placeholder}</option>}
                {options.map((option, index) => (
                    <option 
                        key={index} 
                        value={option.value}
                        disabled={option.disabled}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            {multiple && localValue.length > 0 && (
                <div className='mt-2 flex flex-wrap gap-1'>
                    {localValue.map((val, index) => {
                        const option = options.find(opt => opt.value === val);
                        return (
                            <span 
                                key={index}
                                className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
                            >
                                {option?.label || val}
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    )
})

export default SelectBox
