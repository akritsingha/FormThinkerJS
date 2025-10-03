import { memo, useState, useCallback, useRef, useEffect } from 'react'

const MultipleCheckbox = memo(({ label, description, options = [], value = [], onChange, fieldpath, disabled = false }) => {
    const [localValue, setLocalValue] = useState(value ?? []);

    useEffect(() => {
        setLocalValue(value ?? []);
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

    const handleCheckboxChange = (optionValue, isChecked) => {
        let newValue;
        if (isChecked) {
            newValue = [...localValue, optionValue];
        } else {
            newValue = localValue.filter(item => item !== optionValue);
        }
        setLocalValue(newValue);
        debouncedOutput(newValue);
    };

    return (
        <div className='w-full'>
            {/* <div className='mb-2 text-gray-700'>{label}</div> */}
            {description && <span className='text-gray-700'>{description}</span>}
            <div className='space-y-2'>
                {options.map((option, index) => (
                    <label key={index} className='flex items-center gap-2 cursor-pointer'>
                        <input 
                            type="checkbox" 
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2' 
                            checked={localValue.includes(option.value)}
                            onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                            disabled={disabled}
                        />
                        <span className={disabled ? 'text-gray-400' : 'text-gray-700'}>
                            {option.label}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    )
})

export default MultipleCheckbox
