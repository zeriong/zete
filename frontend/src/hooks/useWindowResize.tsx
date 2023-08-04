import {useEffect, useRef, useState} from 'react';

export const useWindowResize = () => {
    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })

    let timer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {

        const updateSize = () => {
            if (timer.current != null) {
                clearTimeout(timer.current);
                timer.current = null;
            }
            if (timer.current == null) {
                timer.current = setTimeout(() => {
                    setSize({ width: window.innerWidth, height: window.innerHeight });
                }, 300);
            }
        };

        window.addEventListener('resize', updateSize);
        updateSize();

        return () => {
            window.removeEventListener('resize', updateSize);
        }
    }, []);

    return size;
}
