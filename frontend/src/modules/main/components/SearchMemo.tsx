import {SearchIcon} from '../../../assets/vectors';
import React from 'react';
import {useSearchParams} from 'react-router-dom';
import {useForm} from 'react-hook-form';

export const SearchMemo = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const form = useForm<{ search?: string }>()

    const search = (text) => {
        if (text && text.length > 1) {
            searchParams.set('search', encodeURI(text));
            setSearchParams(searchParams);
        } else if (searchParams.has('search')) {
            searchParams.delete('search')
            setSearchParams(searchParams);
        }
    }

    const handleSubmit = form.handleSubmit(async data => search(data.search));

    return (
        <form
            onSubmit={ handleSubmit }
            onBlur={handleSubmit}
            className='flex items-center flex-row-reverse md:flex-row w-[186px] md:w-[260px] px-10px py-4px text-14 md:border md:border-zete-light-gray-500
            bg-zete-md-placeHolder md:bg-white rounded-[4px]'
        >
            <SearchIcon className='absolute md:relative md:h-18px md:mr-8px'/>
            <input
                {...form.register('search', {
                    maxLength: 16,
                })}
                placeholder='메모검색'
                className='placeholder:italic placeholder:text-zete-placeHolder placeholder:font-light w-full bg-transparent pr-20px md:pr-0'
            />
        </form>
    )
}