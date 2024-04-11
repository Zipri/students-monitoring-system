import { useEffect, useRef } from 'react';

const useDebouncedCallback = <A extends any[]>(
    callback: (...args: A) => void,
    wait: number
) => {
    const argsRef = useRef<A>();
    const timeout = useRef<ReturnType<typeof setTimeout>>();

    const cleanup = () => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
    };

    useEffect(() => cleanup, []);

    const debouncedCallback = (...args: A) => {
        argsRef.current = args;

        cleanup();

        timeout.current = setTimeout(() => {
            if (argsRef.current) {
                callback(...argsRef.current);
            }
        }, wait);
    };

    return debouncedCallback;
};

export default useDebouncedCallback;
