import { memo, useState, useCallback, useRef, useEffect } from 'react'

const Options = memo(({ 
    label, 
    options = [], 
    value, 
    schema,
    onChange, 
    fieldpath, 
    disabled = false,
    orientation = 'horizontal' // 'vertical' or 'horizontal'
}) => {
    const [localValue, setLocalValue] = useState(value ?? '');
    const {description} = schema;
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

    const handleOptionChange = (optionValue) => {
        setLocalValue(optionValue);
        debouncedOutput(optionValue);
    };

    const containerClass = orientation === 'horizontal' 
        ? 'flex flex-wrap gap-2' 
        : 'space-y-2';

    return (
        <div className='w-full p-2 flex flex-col gap-2'>
            {description && <span className='text-gray-400 text-sm'>{description}</span>}
            <div className={containerClass}>
                {options.map((option, index) => (
                    <label key={index} className={`flex items-center gap-2 cursor-pointer px-4 py-2 border-[0.5px] rounded-lg border-neutral-400 hover:shadow-lg hover:scale-[1.06] transition-all duration-300 
                    ${localValue === option.value ? 'bg-[#5874f5] text-white': disabled ?  'text-neutral-400' : 'text-black'}
                    `}>
                        <input 
                            type="radio" 
                            name={fieldpath}
                            value={option.value}
                            checked={localValue === option.value}
                            onChange={() => handleOptionChange(option.value)}
                            disabled={disabled}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 hidden'
                        />
                        <span>
                            {option.label}
                        </span>
                        
                    </label>
                ))}
            </div>
        </div>
    )
})

export default Options
