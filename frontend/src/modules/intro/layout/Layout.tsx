import React, {useEffect, useState} from 'react';
import {Outlet} from 'react-router-dom';
import {HomeNav} from './Navigation';
import {SuccessSignupModal} from '../../../common/components/modals/SuccessSignup.modal';
import {SignupModal} from '../../../common/components/modals/Signup.modal';
import {SigninModal} from '../../../common/components/modals/Signin.modal';
import {setShowSideNavReducer} from '../../../store/layout/layout.slice';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {useWindowResize} from '../../../hooks/useWindowResize';

export const HomeLayout = () => {
    const [modalControl, setModalControl] = useState(false);

    const dispatch = useDispatch();
    const { isShowSideNav } = useSelector((state: RootState) => state.layout);

    const windowResize = useWindowResize();

    // 사이즈 변화에 따른 사이드 네비게이션 활성화
    useEffect(() => {
        if (windowResize.width <= 900) {
            if (isShowSideNav) dispatch(setShowSideNavReducer(false));
        } else {
            if (!isShowSideNav) dispatch(setShowSideNavReducer(true));
        }
    },[windowResize]);

    return (
        <>
            <HomeNav/>
            <main className='flex w-full h-full overflow-auto pt-[60px] max-md:pt-[48px]'>
                <Outlet/>
            </main>
            <SuccessSignupModal isShow={ modalControl } setIsShow={ setModalControl }/>
            <SignupModal successControl={ setModalControl }/>
            <SigninModal/>
        </>
    )
};