// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";

export const useGetQueryStr = () => {
    const [queryStr, setQueryStr] = useState<any>('');
    const [searchParams] = useSearchParams();

    const getQueryStr = () => {
        const searchStr = searchParams.get('search');

        if (searchStr) setQueryStr(searchStr);
        else setQueryStr(searchStr)
    }

    useEffect(() => {
        getQueryStr()
    }, [searchParams]);

    return queryStr
};