import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";

export const useHandleQueryStr = () => {
    const [cateStr, setCateStr] = useState<any>('');
    const [tagStr, setTagStr] = useState<any>('');
    const [menuStr, setMenuStr] = useState<any>('');
    const [searchParams, setSearchParams] = useSearchParams();

    const getQueryStr = () => {
        const cate = searchParams.get('cate');
        const tag = searchParams.get('tag');
        const menu = searchParams.get('menu');
        setMenuStr(menu);
        setCateStr(cate);
        setTagStr(tag);
    }

    useEffect(() => {
        getQueryStr();
    }, [searchParams]);

    return { menuStr, cateStr, tagStr, searchParams, setSearchParams}
};