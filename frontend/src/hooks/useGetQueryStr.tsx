import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";

export const useGetQueryStr = () => {
    const [cateStr, setCateStr] = useState<any>('');
    const [tagStr, setTagStr] = useState<any>('');
    const [searchParams, setSearchParams] = useSearchParams();

    const getQueryStr = () => {
        const cate = searchParams.get('cate');
        const tag = searchParams.get('tag');
        setCateStr(cate);
        setTagStr(tag);
    }

    useEffect(() => {
        getQueryStr()
    }, [searchParams]);

    return {cateStr, tagStr, setSearchParams}
};