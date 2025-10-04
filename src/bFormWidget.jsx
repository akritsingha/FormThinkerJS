import React, {memo, useState, Suspense, useMemo, useEffect, Activity} from 'react'
import FormHeader from './cFormHeader.jsx';
import FormPlayGround from './cFormPlayGround.jsx';

const FormWidget = memo(({
    schema,
    formData,
    onChange,
    fieldpath = '',
    nested
}) => {
    const {properties} = schema;
    
    const tabs = Object.keys(properties) || [];
    const [activeTab, setActiveTab] = useState('');

    // Update activeTab when tabs change
    useEffect(() => {
        if (tabs.length > 0 && (!activeTab || !tabs.includes(activeTab))) {
            setActiveTab(tabs[0]);
        }
    }, [tabs, activeTab]);

    const tabSchema = useMemo(()=>{
        return properties[activeTab] || {};
    },[activeTab, properties])

    // const tabValue = formData?.[activeTab] || {}
    const tabValue = useMemo(() => {
        return formData?.[activeTab] || undefined;
    }, [formData, activeTab]);



    // Activity-enhanced implementation for tab state preservation
    
    return (
        <div>
            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-8 rounded mb-2"></div>}>
                <FormHeader nested={nested} schema={properties} tabs={tabs} activeTab={activeTab} value={formData} setActiveTab={setActiveTab}/>
            </Suspense>
            
            {/* Activity-enhanced tab content for state preservation */}
            <div className="relative">
                {tabs.map(tab => {
                    const currentTabSchema = properties[tab] || {};
                    const currentTabValue = formData?.[tab];
                    
                    return (
                        <Activity 
                            key={tab} 
                            mode={activeTab === tab ? "visible" : "hidden"}
                            className="absolute top-0 left-0 w-full"
                        >
                            <Suspense fallback={
                                <div className="animate-pulse bg-gray-200 h-32 rounded"></div>
                            }>
                                <FormPlayGround 
                                    nested={nested} 
                                    schema={currentTabSchema} 
                                    value={currentTabValue} 
                                    activeTab={tab} 
                                    onChange={onChange} 
                                    fieldpath={fieldpath} 
                                />
                            </Suspense>
                        </Activity>
                    );
                })}
            </div>
        </div>
    )
})

export default FormWidget