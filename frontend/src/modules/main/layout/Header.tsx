import React from 'react';
import {UserProfileMenuPopover} from '../components/popovers/UserProfileMenu.popover';
import {useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';
import {SearchMemo} from '../components/SearchMemo';
import {toggleSideNavReducer} from '../../../store/layout/layout.slice';
import {HamburgerMenuIcon} from '../../../common/components/Icons';

export const Header = () => {
    const dispatch = useDispatch();

    return (
        <header className='flex fixed h-[46px] items-center w-full z-30 transition-all ease-in-out duration-300 bg-white border-b border-gray-300/80 py-[10px]'>
            <div className='flex relative items-center justify-between px-[16px] side-menu-md:px-[10px] w-full'>
                <div className='flex items-center'>
                    <button
                        type='button'
                        onClick={ () => dispatch(toggleSideNavReducer()) }
                        className='ease-in-out duration-300 block side-menu-md:hidden mr-[14px] h-full'
                    >
                        <HamburgerMenuIcon height={20}/>
                    </button>
                    {/*브랜드마크*/}
                    <div className='w-[26px] h-[26px] bg-primary rounded-[4px] mr-[10px]'/>
                    <Link
                        to='/memo'
                        className='flex relative justify-start items-center text-[17px] font-medium transition-all duration-300 h-full'
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