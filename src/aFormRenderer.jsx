import React, { memo, useCallback, useMemo, useEffect } from 'react';
import FormWidget from './bFormWidget.jsx';
import { produce } from 'immer';
import throttleFn from 'lodash.throttle';

const FormThinker = memo(({
  schema,
  data,
  setData,
  throttleMs = 300, // renamed to avoid colliding with lodash.throttle
}) => {

  // Throttled wrapper that accepts a functional updater
  const throttledSetData = useMemo(() => {
    const t = throttleFn(
      (updater) => setData(updater),
      throttleMs,
      { leading: false, trailing: true }
    );
    return t;
  }, [setData, throttleMs]);

  // Cancel on unmount
  useEffect(() => () => throttledSetData.cancel(), [throttledSetData]);

  const handleChange = useCallback((fieldPath, fieldValue, remove = false) => {
    const pathArray = Array.isArray(fieldPath) ? [...fieldPath] : [fieldPath];

    throttledSetData(prev => produce(prev, draft => {
      let current = draft;

      if (remove) {
        // Walk to parent
        for (let i = 0; i < pathArray.length - 1; i++) {
          const key = pathArray[i];
          if (current[key] === undefined || current[key] === null) return;
          current = current[key];
        }
        // Delete final key
        delete current[pathArray[pathArray.length - 1]];
        pathArray.pop();

        // Bubble up and delete now-empty parent objects
        let condition = pathArray.length > 0;
        while (condition) {
          let cur = draft;
          for (let i = 0; i < pathArray.length - 1; i++) {
            const key = pathArray[i];
            if (cur[key] === undefined || cur[key] === null) return;
            cur = cur[key];
          }
          const obj = cur[pathArray[pathArray.length - 1]];
          if (obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length === 0) {
            delete cur[pathArray[pathArray.length - 1]];
            pathArray.pop();
            if (pathArray.length === 0) break;
          } else {
            condition = false;
          }
        }
      } else {
        // Ensure nested objects exist, then set the value
        for (let i = 0; i < pathArray.length - 1; i++) {
          const key = pathArray[i];
          if (
            current[key] === undefined ||
            current[key] === null ||
            typeof current[key] !== 'object' ||
            Array.isArray(current[key])
          ) {
            current[key] = {};
          }
          current = current[key];
        }
        current[pathArray[pathArray.length - 1]] = fieldValue;
      }
    }));
  }, [throttledSetData]);

  const textClass = 'text-xs text-black';

  return (
    <div className={`w-full ${textClass}`}>
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 mt-[10px]">
        <FormWidget
          nested={0}
          schema={schema}
          formData={data}
          setData={setData}          // keep if child needs direct access
          onChange={handleChange}     // throttled updates go through here
        />
      </div>
    </div>
  );
});

FormThinker.displayName = 'FormThinker';

export default FormThinker;
