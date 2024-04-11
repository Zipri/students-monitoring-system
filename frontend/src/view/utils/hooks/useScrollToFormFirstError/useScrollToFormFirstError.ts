import { RefObject, useEffect } from 'react';

import { FieldErrors } from 'react-hook-form';

const useScrollToFormFirstError = (
    errors: FieldErrors<Record<string, any>>,
    formRef: RefObject<HTMLFormElement>,
    submitCount: number
) => {
    useEffect(() => {
        const errorsValues = Object.values(errors);
        if (errorsValues.length > 0) {
            const formElement = formRef.current;
            if (formElement) {
                formElement
                    // @ts-expect-error
                    .querySelector(`#${errorsValues[0].ref.name}`)
                    ?.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }
        }
    }, [submitCount]);
};

export default useScrollToFormFirstError;
