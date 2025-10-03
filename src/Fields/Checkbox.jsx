import { memo, useState, useCallback, useRef, useEffect } from 'react'

const Checkbox = memo(({ schema, label, value, onChange, fieldpath, disabled = false }) => {
    const [localValue, setLocalValue] = useState(value ?? false);

    const {title, description} = schema || {};
    useEffect(() => {
        setLocalValue(value ?? false);
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

    const handleCheckboxChange = (e) => {
        const newVal = e.target.checked;
        setLocalValue(newVal);
        debouncedOutput(newVal);
    };

    return (
        <label className='w-full flex items-center gap-2 cursor-pointer p-2'>
            <input 
                type="checkbox" 
                className='w-4 h-4' 
                checked={localValue} 
                onChange={handleCheckboxChange}
                disabled={disabled}
            />
           {description && <span className={disabled ? 'text-gray-400' : 'text-gray-700'}>{description}</span>}
        </label>
    )
})

export default Checkbox
