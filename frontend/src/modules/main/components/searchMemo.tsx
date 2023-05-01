import {SearchIcon} from "../../../assets/vectors";
import React from "react";
import {useInput} from "../../../hooks/useInput";

export const SearchMemo = () => {
    const {useInputValue, valueReset, inputOnChange} = useInput('')
    const onSubmit = (e) => {
        e.preventDefault();
        valueReset()
    }
    return (
        <form
            onSubmit={onSubmit}
            className='flex items-center flex-row-reverse md:flex-row w-[186px] md:w-[260px] px-10px py-4px text-14 md:border md:border-zete-light-gray-500
             bg-zete-md-placeHolder md:bg-white rounded-[4px]'
        >
            <>
                <SearchIcon className='absolute md:relative md:h-18px md:mr-8px'/>
            </>
            <div className='w-full'>
                <input
                    onChange={inputOnChange}
                    placeholder='메모검색'
                    className='placeholder:italic placeholder:text-zete-placeHolder placeholder:font-light w-full bg-transparent pr-20px md:pr-0'
                    value={useInputValue}
                />
            </div>
        </form>
    )
}