import React, { useState, memo, useMemo, useEffect } from 'react'
import classNames from 'classnames';
import ViewportTab from './ViewportTab';
import { RiRefreshLine } from "react-icons/ri";

// Constants
const DEVICE_SEPARATOR = '|-|D|-|';
const DEVICE_TYPES = {
  MOBILE: 'mobile',
  TABLET: 'tab',
  DESKTOP: 'desktop'
};
const DEFAULT_DEVICE = DEVICE_TYPES.MOBILE;

/**
 * Higher-Order Component that wraps form fields with device-specific functionality
 * Allows fields to have different values for mobile, tablet, and desktop viewports
 */
const withWrapper = (WrappedComponent) => {
  const WrappedComponentWithProps = memo(function WrappedComponentWithProps(props) {
    const { value, onChange, fieldpath } = props;
    const { viewPortSupport } = props?.schema || {};
    
    // Parse device-specific values from the combined string
    const parseDeviceValues = (value) => {
      if (!value || typeof value !== 'string' || !value.includes(DEVICE_SEPARATOR)) {
        return null;
      }
      return value.split(DEVICE_SEPARATOR);
    };
    
    const deviceValueArray = parseDeviceValues(value);
    
    // Extract individual device values
    const getDeviceValue = (index) => {
      return deviceValueArray && deviceValueArray[index] !== undefined 
        ? deviceValueArray[index] 
        : '';
    };
    
    const initialMobileValue = getDeviceValue(0);
    const initialTabletValue = getDeviceValue(1);
    const initialDesktopValue = getDeviceValue(2);
    
    const [deviceValues, setDeviceValues] = useState([
      initialMobileValue, 
      initialTabletValue, 
      initialDesktopValue
    ]);
  
    // Check if value has content
    const hasValue = () => {
      return value !== '' && value !== undefined && value !== null;
    };

    // Check if value contains device-specific data
    const isDeviceSpecificValue = useMemo(() => {
      return typeof value === 'string' && value.includes(DEVICE_SEPARATOR);
    }, [value]);

    const [isDeviceSupportEnabled, setIsDeviceSupportEnabled] = useState(isDeviceSpecificValue);
    const [activeDeviceType, setActiveDeviceType] = useState(DEFAULT_DEVICE);


    // Update device values when device support or value changes
    useEffect(() => {
      if (isDeviceSupportEnabled && deviceValueArray) {
        setDeviceValues([initialMobileValue, initialTabletValue, initialDesktopValue]);
      } else if (!isDeviceSupportEnabled) {
        setDeviceValues(['', '', '']);
      }
    }, [isDeviceSupportEnabled, value]);


    // CSS classes for device indicators
    const deviceIndicatorClass = classNames('rounded-xs', {
      'bg-green-400': isDeviceSupportEnabled,
      'bg-red-400': !isDeviceSupportEnabled,
    });

    const activeDeviceIndicatorClass = classNames('rounded-xs', {
      'bg-green-700': isDeviceSupportEnabled,
      'bg-red-400': !isDeviceSupportEnabled,
    });

    // Handle reset button click
    const handleResetClick = () => {
      const confirmed = window.confirm(
        "Field Data will be blank if you uncheck it. Are you sure you don't want to use the data?"
      );
      if (!confirmed) {
        return;
      }
      onChange(fieldpath, '', true);
      setIsDeviceSupportEnabled(false);
    };

    // Handle value changes for device-specific fields
    const handleDeviceValueChange = (fieldPath, newValue) => {
      const updatedDeviceValues = [...deviceValues];
      
      if (activeDeviceType === DEVICE_TYPES.MOBILE) {
        updatedDeviceValues[0] = newValue;
      } else if (activeDeviceType === DEVICE_TYPES.TABLET) {
        updatedDeviceValues[1] = newValue;
      } else if (activeDeviceType === DEVICE_TYPES.DESKTOP) {
        updatedDeviceValues[2] = newValue;
      }
      
      setDeviceValues(updatedDeviceValues);
      const combinedValue = updatedDeviceValues.join(DEVICE_SEPARATOR);
      onChange(fieldPath, combinedValue);
    };

    // Determine which change handler to use
    const handleChange = isDeviceSupportEnabled ? handleDeviceValueChange : onChange;
    
    // Get the current value to display based on active device
    const getCurrentValue = () => {
      if (!isDeviceSupportEnabled) {
        return value;
      }
      
      switch (activeDeviceType) {
        case DEVICE_TYPES.MOBILE:
          return deviceValues[0];
        case DEVICE_TYPES.TABLET:
          return deviceValues[1];
        case DEVICE_TYPES.DESKTOP:
          return deviceValues[2];
        default:
          return value;
      }
    };
    
    const currentValue = getCurrentValue();
    return (
      <div className='relative'>
        {/* Header with viewport controls and reset button */}
        <div className='flex justify-between'>
          {viewPortSupport && (
            <ViewportTab
              viewPortSupport={viewPortSupport}
              isEmpty={hasValue}
              isDevice={isDeviceSpecificValue} 
              deviceSupport={isDeviceSupportEnabled}
              setDeviceSupport={setIsDeviceSupportEnabled}
              activeDevice={activeDeviceType}
              setActiveDevice={setActiveDeviceType}
              deviceClass={deviceIndicatorClass}
              activeDeviceClass={activeDeviceIndicatorClass}
            />
          )}
          <div></div>
          <button
            className='bg-black rounded-l-lg h-[24px] w-[24px] p-1 hover:opacity-80 transition-opacity'
            style={{background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'}}
            onClick={handleResetClick}
            aria-label="Reset field value"
          >
            <RiRefreshLine className='text-white w-full h-full'/>
          </button>
        </div>

        {/* Wrapped form component */}
        <WrappedComponent {...props} onChange={handleChange} value={currentValue} />
    
        {/* Device-specific value display panel */}
        {isDeviceSupportEnabled && (
          <div className='px-3 pt-3'>
            <div className='shadow-[0_-5px_10px_rgba(0,0,0,0.25)] rounded-t-xl'>
              {/* Mobile device row */}
              <div onClick={() => setActiveDeviceType(DEVICE_TYPES.MOBILE)} className={`flex justify-between items-center p-2 cursor-pointer transition-colors ${
                    !deviceValues[0] ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'
                  } ${!deviceValues[0] ? 'text-red-600 font-medium' : ''}
                  `}>
                <div className='flex gap-2 items-center' >
                  <div className={`w-3 h-5 ${
                    isDeviceSupportEnabled && activeDeviceType === DEVICE_TYPES.MOBILE 
                      ? activeDeviceIndicatorClass 
                      : deviceIndicatorClass
                  }`}></div>
                  <span>Mobile</span>
                </div>
                {deviceValues[0] || 'Empty'}
              </div>
              
              {/* Tablet device row */}

              <div onClick={() => setActiveDeviceType(DEVICE_TYPES.TABLET)} className={`flex justify-between items-center p-2 cursor-pointer transition-colors ${
                    !deviceValues[1] ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'
                  } ${!deviceValues[1] ? 'text-red-600 font-medium' : ''}
                  `}>
                <div className='flex gap-2 items-center' >
                  <div className={`w-3 h-5 ${
                    isDeviceSupportEnabled && activeDeviceType === DEVICE_TYPES.TABLET 
                      ? activeDeviceIndicatorClass 
                      : deviceIndicatorClass
                  }`}></div>
                  <span>Tab</span>
                </div>
                {deviceValues[1] || 'Empty'}
              </div>
              {/* Desktop device row */}
              
              <div onClick={() => setActiveDeviceType(DEVICE_TYPES.DESKTOP)} className={`flex justify-between items-center p-2 cursor-pointer transition-colors ${
                    !deviceValues[2] ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'
                  } ${!deviceValues[2] ? 'text-red-600 font-medium' : ''}
                  `}>
                <div className='flex gap-2 items-center' >
                  <div className={`w-3 h-5 ${
                    isDeviceSupportEnabled && activeDeviceType === DEVICE_TYPES.DESKTOP 
                      ? activeDeviceIndicatorClass 
                      : deviceIndicatorClass
                  }`}></div>
                  <span>Desktop</span>
                </div>
                {deviceValues[2] || 'Empty'}
              </div>
            </div>
          </div>
        )} 

        
      </div>
    )
  });

  // Set display name for better debugging
  WrappedComponentWithProps.displayName = `withWrapper(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
  return WrappedComponentWithProps;
}

export default withWrapper