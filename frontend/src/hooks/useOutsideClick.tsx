import {useEffect} from 'react';

export const useOutsideClick = (ref, callback) => {
    useEffect(() => {
        const handleOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                callback();
            }
        }
        document.addEventListener('mousedown', handleOutside);
        document.addEventListener('touchstart', handleOutside);

        return () => {
            document.removeEventListener('mousedown', handleOutside);
            document.removeEventListener('touchstart', handleOutside);
        };
    },[]);
}