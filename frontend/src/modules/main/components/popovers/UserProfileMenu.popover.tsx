import React from 'react';
import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store';
import {LogoutIcon, ProfileIcon, UserIcon} from '../../../../assets/vectors';
import {logoutAction} from '../../../../store/auth/auth.actions';

interface IMenuList {
    name: string;
    icon: JSX.Element;
    path: string;
    function?: any;
}

export const UserProfileMenuPopover = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, data } = useSelector((state: RootState) => state.user);

    const menuList: IMenuList[] = [
        {
            name: '나의 회원정보',
            icon: <ProfileIcon/>,
            path: 'profile',
        },
        {
            name: '로그아웃',
            icon: <LogoutIcon/>,
            path: '/',
            function: () => dispatch(logoutAction()),
        },
    ];

    const listOnClick = (item, close) => {
        if (item.function) item.function();
        close();
    }

    return (loading && !data.name) ? <div className='flex h-full items-center justify-center'>로딩중...</div> :
        <div className='w-auto max-w-sm'>
            <Popover className='relative h-28px z-50'>
                {({ open, close }) => (
                    <>
                        <Popover.Button
                            className={`
                                ${open ? '' : 'text-opacity-90'}
                                group inline-flex items-center rounded-md text-base font-medium text-white hover:text-opacity-100`}
                        >
                            <UserIcon/>
                        </Popover.Button>
                        <Transition
                            as={Fragment}
                            enter='transition ease-out duration-200'
                            enterFrom='opacity-0 translate-y-1'
                            enterTo='opacity-100 translate-y-0'
                            leave='transition ease-in duration-150'
                            leaveFrom='opacity-100 translate-y-0'
                            leaveTo='opacity-0 translate-y-1'
                        >
                            <Popover.Panel className='absolute mt-[12px] w-[160px] pc:w-[180px] right-0 px-0 shadow-lg rounded-[8px] overflow-hidden border border-black/10'>
                                <div className='relative bg-white p-[12px] '>
                                    <p className='text-lg font-medium text-zete-dark p-[4px] mb-[4px] cursor-default'>
                                        {data.name}
                                    </p>
                                    {menuList.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            onClick={ () => listOnClick(item, close) }
                                            className='flex items-center rounded-[8px] h-[48px] transition duration-150 ease-in-out whitespace-nowrap hover:bg-orange-100'
                                        >
                                            <div className='flex items-center justify-center h-[32px] pc:h-[48px] w-[36px] text-white'>
                                                {item.icon}
                                            </div>
                                            <div className='ml-[8px]'>
                                                <p className='text-[14px] font-medium text-gray-900'>
                                                    {item.name}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </div>
}
