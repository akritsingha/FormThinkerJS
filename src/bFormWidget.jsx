import React, {memo, useState, Suspense, useMemo, useEffect} from 'react'
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



    // const {title} = tabSchema;

    return (
        <div>
            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-8 rounded mb-2"></div>}>
                <FormHeader nested={nested} schema={properties} tabs={tabs} activeTab={activeTab} value={formData} setActiveTab={setActiveTab}/>
            </Suspense>
            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded"></div>}>
                <FormPlayGround nested={nested} schema={tabSchema} value={tabValue} activeTab={activeTab} onChange={onChange} fieldpath={fieldpath} />
            </Suspense>
        </div>
    )
})

export default FormWidget