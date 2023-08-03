import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store';
import {sendMyProfile} from '../../../store/user/user.slice';
import {Outlet} from 'react-router-dom';
import {HomeNav} from './Navigation';

export const HomeLayout = ()=> {
    /** state management */
    const dispatch = useDispatch<AppDispatch>();
    const { isLoggedIn, loading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (isLoggedIn) dispatch(sendMyProfile());
    }, [dispatch]);

    return ( loading ? (<div className='flex h-full items-center justify-center'>로딩중...</div>) : (
        <>
            <HomeNav/>
            <main className='flex w-full h-full overflow-auto pt-60px max-md:pt-48px'>
                <Outlet/>
            </main>
        </>
        )
    );
};