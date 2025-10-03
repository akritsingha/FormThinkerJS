import { memo, useState, useCallback, useRef, useEffect } from 'react'

const FourInputs = memo(({ 
    label, 
    value = { top: '', right: '', bottom: '', left: '' }, 
    onChange, 
    fieldpath, 
    disabled = false,
    placeholders = { top: 'Top', right: 'Right', bottom: 'Bottom', left: 'Left' },
    inputType = 'text',
    showLabels = true
}) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
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

    const handleInputChange = (side, inputValue) => {
        const newValue = { ...localValue, [side]: inputValue };
        setLocalValue(newValue);
        debouncedOutput(newValue);
    };

    const InputComponent = ({ side, placeholder, value }) => (
        <input
            type={inputType}
            value={value}
            onChange={(e) => handleInputChange(side, e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className='w-full text-center border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed'
        />
    );

    return (
        <div className='w-full'>
            {label && <div className='mb-3 text-gray-700'>{label}</div>}
            
            <div className='relative w-48 h-48 mx-auto border-2 border-gray-300 rounded-lg bg-gray-50'>
                {/* Center box */}
                <div className='absolute inset-4 border border-gray-200 rounded bg-white flex items-center justify-center'>
                    <span className='text-xs text-gray-500 font-medium'>Box</span>
                </div>
                
                {/* Top Input */}
                <div className='absolute -top-8 left-1/2 transform -translate-x-1/2 w-16'>
                    {showLabels && <div className='text-xs text-center text-gray-600 mb-1'>Top</div>}
                    <InputComponent 
                        side="top" 
                        placeholder={placeholders.top} 
                        value={localValue.top} 
                    />
                </div>
                
                {/* Right Input */}
                <div className='absolute -right-8 top-1/2 transform -translate-y-1/2 w-16'>
                    {showLabels && <div className='text-xs text-center text-gray-600 mb-1'>Right</div>}
                    <InputComponent 
                        side="right" 
                        placeholder={placeholders.right} 
                        value={localValue.right} 
                    />
                </div>
                
                {/* Bottom Input */}
                <div className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-16'>
                    {showLabels && <div className='text-xs text-center text-gray-600 mb-1'>Bottom</div>}
                    <InputComponent 
                        side="bottom" 
                        placeholder={placeholders.bottom} 
                        value={localValue.bottom} 
                    />
                </div>
                
                {/* Left Input */}
                <div className='absolute -left-8 top-1/2 transform -translate-y-1/2 w-16'>
                    {showLabels && <div className='text-xs text-center text-gray-600 mb-1'>Left</div>}
                    <InputComponent 
                        side="left" 
                        placeholder={placeholders.left} 
                        value={localValue.left} 
                    />
                </div>
            </div>
            
            {/* Values Display */}
            <div className='mt-4 grid grid-cols-2 gap-2 text-xs'>
                <div className='flex justify-between'>
                    <span className='text-gray-600'>Top:</span>
                    <span className='font-mono'>{localValue.top || '0'}</span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-gray-600'>Right:</span>
                    <span className='font-mono'>{localValue.right || '0'}</span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-gray-600'>Bottom:</span>
                    <span className='font-mono'>{localValue.bottom || '0'}</span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-gray-600'>Left:</span>
                    <span className='font-mono'>{localValue.left || '0'}</span>
                </div>
            </div>
        </div>
    )
})

export default FourInputs
