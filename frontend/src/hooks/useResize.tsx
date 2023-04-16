import {useEffect, useRef, useState} from "react";

export const useResize = () => {
    const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
    let timer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {

        const updateSize = () => {
            if (timer.current != null) {
                clearTimeout(timer.current);
                timer.current = null;
            }
            if (timer.current == null) {
                timer.current = setTimeout(() => {
                    setSize([window.innerWidth, window.innerHeight]);
                }, 100);
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