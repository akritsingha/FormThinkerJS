import React, { useState, memo } from 'react'
import classNames from 'classnames';

const ViewportTab = memo(({
    viewPortSupport,
    deviceSupport,
    setDeviceSupport,
    activeDevice,
    setActiveDevice,
    deviceClass,
    activeDeviceClass,
}) => {

    console.log('ViewportTab rendering -')
    

    


  return (
    <div>
        {viewPortSupport && 
        <div className={`rounded-r-2xl pr-3 flex gap-2 ${deviceSupport ? 'bg-green-200' : 'bg-red-200'} `}>
          <label className={`flex items-center pr-3 gap-2 rounded-r-2xl text-white ${deviceSupport ? 'bg-green-300' : 'bg-red-300'} `}>
              <span className={`p-2 rounded-r-2xl text-white ${deviceSupport ? 'bg-green-400' : 'bg-red-400'} `}>Device Support</span>
              <input 
                type="checkbox" 
                className='w-4 h-4 hidden' 
                checked={deviceSupport} 
                onChange={()=>setDeviceSupport(prev => !prev)}
              />
              {!deviceSupport ? <span>On </span> :
              <span>Off</span>}
          </label>
          <div className='flex items-center justify-center gap-2'>
            <div className={`w-3 h-5 ${activeDevice === 'mobile' ? activeDeviceClass: deviceClass}`} onClick={()=>deviceSupport && setActiveDevice('mobile')}></div>
            <div className={`w-4 h-4 ${activeDevice === 'tab' ? activeDeviceClass: deviceClass}`} onClick={()=>deviceSupport && setActiveDevice('tab')}></div>
            <div className={`w-5 h-3  ${activeDevice === 'desktop' ? activeDeviceClass: deviceClass}`} onClick={()=>deviceSupport && setActiveDevice('desktop')}></div>
            <div className={` ${deviceSupport ? 'text-green-600' : 'text-red-600'}`}>{activeDevice}</div>    
          </div>
          
        </div>
        }
    </div>
  )
}, (prev, next)=>{
  return (
    prev.viewPortSupport === next.viewPortSupport &&
    prev.isEmpty === next.isEmpty &&
    prev.isDevice === next.isDevice
  )
})

export default ViewportTab