import {useEffect, useRef, useState} from 'react';

export const useWindowResize = () => {
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const updateSize = () => {
            if (timerRef.current != null) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            if (timerRef.current == null) {
                timerRef.current = setTimeout(() => {
                    setSize({ width: window.innerWidth, height: window.innerHeight });
                }, 300);
            }
        };

        window.addEventListener('resize', updateSize);
        updateSize();

        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return size;
}
