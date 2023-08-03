import React from 'react';
import {MemoInfoPopover} from '../components/popovers/MemoInfo.popover';
import {useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';
import {toggleSideNav} from '../../../store/layout/layout.slice';
import {BarsMenuIcon} from '../../../assets/vectors';
import {SearchMemo} from '../components/SearchMemo';

export const MemoHeader = () => {
    const dispatch = useDispatch();
    const toggleMenu = () => dispatch(toggleSideNav());

    return (
            <header className='flex fixed h-headerHeight items-center w-full z-30 ease-in-out duration-300 bg-white border-b border-zete-light-gray-400 py-10px'>
                <div className='flex relative items-center justify-between pr-10px md:px-10px w-full'>
                    <div className='flex items-center'>
                        <button
                            type='button'
                            onClick={ toggleMenu }
                            className='ease-in-out duration-300 mr-7px md:hidden p-10px h-full'
                        >
                            <BarsMenuIcon/>
                        </button>
                        <div className='w-26px h-26px bg-primary-500 rounded-[4px] mr-10px'/>
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
                        <MemoInfoPopover/>
                    </div>
                </div>
            </header>
    )
}