import { memo, useState, useCallback, useRef, useEffect } from 'react'

const ColorPalette = memo(({ 
    label, 
    value, 
    onChange, 
    fieldpath, 
    schema,
    disabled = false,
    showInput = true,
    predefinedColors = [
        '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
        '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
        '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000'
    ]
}) => {
    const [localValue, setLocalValue] = useState(value ?? '#000000');

    useEffect(() => {
        setLocalValue(value ?? '#000000');
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

    const handleColorChange = (color) => {
        setLocalValue(color);
        debouncedOutput(color);
    };

    const handleInputChange = (e) => {
        const color = e.target.value;
        setLocalValue(color);
        debouncedOutput(color);
    };

    return (
        <div className='w-full p-2 flex flex-col gap-2'>
            {schema?.description && <span className='text-gray-400 text-sm'>{schema?.description}</span>}
            {/* Color Preview */}
            <div className='mb-3 flex items-center gap-3'>
                {/* <div 
                    className='w-8 h-8 border-2 border-gray-300 rounded-md shadow-sm'
                    style={{ backgroundColor: localValue }}
                ></div> */}
                {showInput && (
                    <input
                        type="color"
                        value={localValue}
                        onChange={handleInputChange}
                        disabled={disabled}
                        className='w-8 h-8 border border-gray-300 cursor-pointer disabled:cursor-not-allowed'
                    />
                )}
                <span className='text-sm font-mono text-gray-600'>{localValue}</span>
            </div>

            {/* Predefined Colors Grid */}
            <div className='flex flex-wrap gap-2'>
                {predefinedColors.map((color, index) => (
                    <button
                        key={index}
                        onClick={() => handleColorChange(color)}
                        disabled={disabled}
                        className={`w-7 h-7 rounded-full shadow-lg  transition-all hover:scale-110 disabled:cursor-not-allowed ${
                            localValue === color 
                                ? 'border-blue-500 ring-2 ring-blue-500' 
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                ))}
            </div>
        </div>
    )
})

export default ColorPalette
