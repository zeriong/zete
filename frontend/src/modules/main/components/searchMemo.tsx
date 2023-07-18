import {SearchIcon} from "../../../assets/vectors";
import React, {useEffect, useRef, useState} from "react";
import {useHandleQueryStr} from "../../../hooks/useHandleQueryStr";
import {resetSearch, setSearch} from "../../../api/content";

export const SearchMemo = () => {
    const timeout = useRef<NodeJS.Timeout>(null);

    const [searchVal, setSearchVal] = useState('');

    const { searchParams } = useHandleQueryStr();

    const onSubmit = (e) => {
        e.preventDefault();
        setSearch(searchVal);
    }
    const onChange = (e) => setSearchVal(e.target.value);

    useEffect(() => {
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => setSearch(searchVal), 300);
    },[searchVal]);

    useEffect(() => {
        setSearchVal('');
        resetSearch();
    },[searchParams]);

    return (
        <form
            onSubmit={onSubmit}
            className='flex items-center flex-row-reverse md:flex-row w-[186px] md:w-[260px] px-10px py-4px text-14 md:border md:border-zete-light-gray-500
            bg-zete-md-placeHolder md:bg-white rounded-[4px]'
        >
            <SearchIcon className='absolute md:relative md:h-18px md:mr-8px'/>
            <input
                onChange={onChange}
                placeholder='메모검색'
                className='placeholder:italic placeholder:text-zete-placeHolder placeholder:font-light w-full bg-transparent pr-20px md:pr-0'
                value={searchVal}
            />
        </form>
    )
}