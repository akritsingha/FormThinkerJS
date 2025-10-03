import {memo, useCallback} from 'react'
import { FormWidget } from './export';
import { produce } from 'immer';

const FormThinker = memo(({
    schema,
    data,
    setData
}) => {    
    const handleChange = useCallback((fieldPath, fieldValue, remove=false)=>{
        const pathArray = Array.isArray(fieldPath) ? fieldPath : [fieldPath];

        setData(prev => produce(prev, draft => {
            let current = draft;
            if (remove) {
                // Remove the key from the data
                for (let i = 0; i < pathArray.length - 1; i++) {
                    const key = pathArray[i];
                    if (current[key] === undefined || current[key] === null) {
                        return; // Key doesn't exist, nothing to remove
                    }
                    current = current[key];
                }
                // Delete the final key
                delete current[pathArray[pathArray.length - 1]];
                pathArray.pop();

                let condition = pathArray.length > 0;
                while (condition){
                    let current = draft;
                    for (let i = 0; i < pathArray.length - 1; i++) {
                        const key = pathArray[i];
                        if (current[key] === undefined || current[key] === null) {
                            return; // Key doesn't exist, nothing to remove
                        }
                        current = current[key];
                    }
                    const obj = current[pathArray[pathArray.length - 1]];
                    if(obj && typeof obj === 'object' && Object.keys(obj).length === 0){
                        delete current[pathArray[pathArray.length - 1]];
                        pathArray.pop();
                        if(pathArray.length === 0){
                             
                        }
                    }else{
                        condition = false;
                    }
                }
            } else {
                // Set the value (existing logic)
                for (let i = 0; i < pathArray.length - 1; i++) {
                    const key = pathArray[i];
                    if (current[key] === undefined || current[key] === null || typeof current[key] !== 'object' || Array.isArray(current[key])) {
                        current[key] = {};
                    }
                    current = current[key];
                }
                current[pathArray[pathArray.length - 1]] = fieldValue;
            }
        }));
    }, [])
    
	const textClass = 'text-xs text-black';
    return (
		<div className={`w-full ${textClass}`}>
			<div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5">
				<FormWidget nested={0} schema={schema} formData={data} setData={setData} onChange={handleChange}/>
			</div>
		</div>
    )
})

export default FormThinker