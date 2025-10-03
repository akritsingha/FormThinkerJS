
import {memo, useMemo} from 'react'
import { FormHeaderPill } from './export';

const FormHeader = memo(({
    tabs,
    activeTab,
    value,
    nested,
    schema,
    setActiveTab
}) => {
    return (
        <div className={`w-full sticky top-0 z-10 rounded-t-2xl pb-[15px] mt-[-10px] px-2`}
        style={{
            background: `color-mix(in oklab, oklab(${(100 - nested*2)/100} -0.00 -0.00) 100%, transparent)`,
            boxShadow: '0px -5px 5px #00000014'
        }}>
            <div className={`flex gap-2 overflow-x-auto rounded-t-2xl no-scrollbar px-2  scrollbar-hide`}>
            {/* <FormHeader/> */}
            {tabs && Array.isArray(tabs) && 
                tabs.map((item, index)=>{
                    const marked = value && (value[item] != undefined || value[item] != null) ? true : false;
                    return <FormHeaderPill nested={nested} key={item}
                    marked={marked} name={item} active={activeTab === item} 
                    title={schema?.[item]?.title}
                    setActiveTab={setActiveTab}/>
                })
            }
            </div>
        </div>
    )
})

export default FormHeader