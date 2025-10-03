import React, {memo, useState, useCallback, useRef, useEffect} from 'react'

const Input = memo(({ label, schema, placeHolder, value, onChange, fieldpath }) => {
    const [localValue, setLocalValue] = useState(value ?? '');

    useEffect(() => {
        setLocalValue(value ?? '');
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

    const handleInputChange = (e) => {
        const newVal = e.target.value;
        setLocalValue(newVal);
        debouncedOutput(newVal);
    };

    return (
        <label className='w-full p-2 flex flex-col gap-2'>
            {schema?.description && <span className='text-gray-400 text-sm'>{schema?.description}</span>}
            <input className='border-[0.5px] rounded-md py-2 px-2 w-full' value={localValue} onChange={handleInputChange}/>
        </label>
    )
})

export default Input