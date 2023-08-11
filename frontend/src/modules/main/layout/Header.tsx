import React from 'react';
import {UserProfileMenuPopover} from '../components/popovers/UserProfileMenu.popover';
import {useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';
import {BarsMenuIcon} from '../../../assets/vectors';
import {SearchMemo} from '../components/SearchMemo';
import {toggleSideNavReducer} from '../../../store/layout/layout.slice';

export const Header = () => {
    const dispatch = useDispatch();

    return (
        <header className='flex fixed h-[46px] items-center w-full z-30 ease-in-out duration-300 bg-white border-b border-zete-light-gray-400 py-10px'>
            <div className='flex relative items-center justify-between pr-10px md:px-10px w-full'>
                <div className='flex items-center'>
                    <button
                        type='button'
                        onClick={ () => dispatch(toggleSideNavReducer()) }
                        className='ease-in-out duration-300 mr-7px md:hidden p-10px h-full'
                    >
                        <BarsMenuIcon/>
                    </button>
                    <div className='w-26px h-26px bg-brand rounded-[4px] mr-10px'/>
                    <Link
                        to='/memo'
                        className='flex relative justify-start items-center text-17 font-medium transition-all duration-300 h-full'
                    >
                        ZETE
                    </Link>
                </div>
                <div className='hidden md:block'>
                    <SearchMemo/>
                </div>
                <div className='relative flex justify-end z-50'>
                    <UserProfileMenuPopover/>
                </div>
            </div>
        </header>
    )
}