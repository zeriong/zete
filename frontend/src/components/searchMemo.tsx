import {SearchIcon} from "./vectors";
import React from "react";

export const SearchMemo = () => {
    return (
        <form
            className='flex items-center w-[260px] px-10px py-4px text-14 border border-zete-light-gray-500 rounded-[4px]'
        >
            <>
                <SearchIcon className='h-18px mr-8px'/>
            </>
            <div>
                <input
                    placeholder='메모검색'
                    className='placeholder:italic placeholder:text-zete-placeHolder'
                />
            </div>
        </form>
    )
}