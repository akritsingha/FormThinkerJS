import React, {memo, useCallback, useRef} from 'react'
import FormWidget from './bFormWidget.jsx';
import { produce } from 'immer';

const FormThinker = memo(({
    schema,
    data,
    setData,
    throttle = 300
}) => {    
    const throttleTimeoutRef = useRef(null);
    const pendingUpdateRef = useRef(null);

    const handleChange = useCallback((fieldPath, fieldValue, remove=false)=>{
        const pathArray = Array.isArray(fieldPath) ? fieldPath : [fieldPath];

        // Store the latest update
        pendingUpdateRef.current = { pathArray, fieldValue, remove };

        // Clear existing timeout
        if (throttleTimeoutRef.current) {
            clearTimeout(throttleTimeoutRef.current);
        }

        // Set new timeout
        throttleTimeoutRef.current = setTimeout(() => {
            const update = pendingUpdateRef.current;
            if (update) {
                setData(prev => produce(prev, draft => {
                    let current = draft;
                    if (update.remove) {
                        // Remove the key from the data
                        for (let i = 0; i < update.pathArray.length - 1; i++) {
                            const key = update.pathArray[i];
                            if (current[key] === undefined || current[key] === null) {
                                return; // Key doesn't exist, nothing to remove
                            }
                            current = current[key];
                        }
                        // Delete the final key
                        delete current[update.pathArray[update.pathArray.length - 1]];
                        update.pathArray.pop();

                        let condition = update.pathArray.length > 0;
                        while (condition){
                            let current = draft;
                            for (let i = 0; i < update.pathArray.length - 1; i++) {
                                const key = update.pathArray[i];
                                if (current[key] === undefined || current[key] === null) {
                                    return; // Key doesn't exist, nothing to remove
                                }
                                current = current[key];
                            }
                            const obj = current[update.pathArray[update.pathArray.length - 1]];
                            if(obj && typeof obj === 'object' && Object.keys(obj).length === 0){
                                delete current[update.pathArray[update.pathArray.length - 1]];
                                update.pathArray.pop();
                                if(update.pathArray.length === 0){
                                     
                                }
                            }else{
                                condition = false;
                            }
                        }
                    } else {
                        // Set the value (existing logic)
                        for (let i = 0; i < update.pathArray.length - 1; i++) {
                            const key = update.pathArray[i];
                            if (current[key] === undefined || current[key] === null || typeof current[key] !== 'object' || Array.isArray(current[key])) {
                                current[key] = {};
                            }
                            current = current[key];
                        }
                        current[update.pathArray[update.pathArray.length - 1]] = update.fieldValue;
                    }
                }));
                pendingUpdateRef.current = null;
            }
        }, throttle);
    }, [throttle, setData])
    
	const textClass = 'text-xs text-black';
    return (
		<div className={`w-full ${textClass}`}>
			<div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 mt-[10px]">
				<FormWidget nested={0} schema={schema} formData={data} setData={setData} onChange={handleChange}/>
			</div>
		</div>
    )
})

export default FormThinker