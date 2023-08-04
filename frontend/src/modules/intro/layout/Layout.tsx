import React from 'react';
import {Outlet} from 'react-router-dom';
import {HomeNav} from './Navigation';

export const HomeLayout = ()=> {
    return (
        <>
            <HomeNav/>
            <main className='flex w-full h-full overflow-auto pt-[60px] max-md:pt-[48px]'>
                <Outlet/>
            </main>
        </>
    )
};