
import {memo} from 'react'
import { RiResetLeftLine } from "react-icons/ri";

const FormHeaderPill = memo(({
    name,
    active,
    marked = true,
    setActiveTab,
    nested,
    title
}) => {
    const pillClass = 'relative px-4 py-2 rounded-b-lg cursor-pointer transition-colors duration-150 flex gap-1 items-center justify-center'

    return (
        <div
        style={active ? {background: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(139, 92, 246))'} : {}}
        className={`whitespace-nowrap ${active ? 'bg-black text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-50'} ${pillClass}`} onClick={()=>setActiveTab(name)}>
            {title || name}
            {marked ? <div className="w-2 h-2 bg-green-500 rounded-full border border-white shadow-sm"></div> : ''}
        </div>
    )
})

export default FormHeaderPill