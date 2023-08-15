import {SearchIcon} from '../../../common/components/Icons';
import React, {useEffect} from 'react';
import {useSearchParams} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {showAlert} from '../../../store/alert/alert.actions';

export const SearchMemo = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const form = useForm<{ search?: string }>();

    const search = (text) => {
        if (text && text.length > 0) {
            searchParams.set('search', encodeURI(text));
            setSearchParams(searchParams);
        } else if (searchParams.has('search')) {
            searchParams.delete('search')
            setSearchParams(searchParams);
        }
    }

    const handleSubmit = form.handleSubmit(async data => search(data.search));

    useEffect(() => {
        if (form.formState.errors.search) showAlert('메모검색은 255자 까지 가능합니다.');
    },[form.formState.errors.search]);

    return (
        <form
            onSubmit={ handleSubmit }
            onBlur={ handleSubmit }
            className='flex items-center w-[170px] md:w-[240px] px-[10px] py-[4px] text-[14px] md:border md:border-gray-300
            bg-gray-100 md:bg-white rounded-[4px] ml-[10px] md:m-0'
        >
            <input
                {...form.register('search', {
                    required: false,
                    minLength: 1, maxLength: 255,
                })}
                placeholder='메모검색'
                className='placeholder:italic placeholder:text-gray-500/95 placeholder:font-light w-full bg-transparent md:pr-0'
            />
            <button
                type='submit'
                className='flex items-center pl-[6px]'
            >
                <SearchIcon/>
            </button>
        </form>
    )
}