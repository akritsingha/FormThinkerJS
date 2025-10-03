import React, { memo, useState, useCallback, useRef, useEffect } from 'react'

const Range = memo(({ 
    label, 
    value, 
    description,
    onChange, 
    fieldpath, 
    schema,
    min = 0, 
    max = 100, 
    step = 1, 
    disabled = false,
    showValue = true 
}) => {
    const [localValue, setLocalValue] = useState(value ?? min);

    useEffect(() => {
        setLocalValue(value ?? min);
    }, [value, min]);

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

    const handleRangeChange = (e) => {
        const newVal = parseFloat(e.target.value);
        setLocalValue(newVal);
        debouncedOutput(newVal);
    };

    return (
        <div className='w-full p-2'>
            <div className='flex justify-between items-center mb-2'>
                {schema?.description && <span className='text-gray-400 text-sm'>{schema?.description}</span>}
                {showValue && (
                    <span className='text-sm font-medium text-black border-[0.5px] border-neutral-400 px-2 py-1 rounded'>
                        {localValue}
                    </span>
                )}
            </div>
            <div className='relative'>
                <input 
                    type="range" 
                    min={min}
                    max={max}
                    step={step}
                    value={localValue}
                    onChange={handleRangeChange}
                    disabled={disabled}
                    className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider'
                    style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((localValue - min) / (max - min)) * 100}%, #e5e7eb ${((localValue - min) / (max - min)) * 100}%, #e5e7eb 100%)`
                    }}
                />
                <div className='flex justify-between text-xs text-gray-500 mt-1'>
                    <span>{min}</span>
                    <span>{max}</span>
                </div>
            </div>
        </div>
    )
})

export default Range
