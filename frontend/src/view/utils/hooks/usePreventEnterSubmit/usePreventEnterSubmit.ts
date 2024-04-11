import { useEffect, RefObject } from 'react';

const usePreventEnterSubmit = (formRef: RefObject<HTMLFormElement>) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.key === 'Enter' &&
                event.target instanceof HTMLInputElement
            ) {
                event.preventDefault();
            }
        };

        const form = formRef.current;
        form?.addEventListener('keydown', handleKeyDown);

        return () => {
            form?.removeEventListener('keydown', handleKeyDown);
        };
    }, [formRef]);
};

export default usePreventEnterSubmit;
