import React, {useEffect, useState} from 'react';
import {Outlet} from 'react-router-dom';
import {HomeNav} from './Navigation';
import {SuccessSignupModal} from '../../../common/components/modals/SuccessSignup.modal';
import {SignUpModal} from '../../../common/components/modals/SignUpModal';
import {SignInModal} from '../../../common/components/modals/SignInModal';
import {setShowSideNavReducer} from '../../../store/layout/layout.slice';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {useWindowResize} from '../../../hooks/useWindowResize';
import CustomScroller from '../../../common/components/customScroller';

export const HomeLayout = () => {
    const [modalControl, setModalControl] = useState(false);

    const dispatch = useDispatch();
    const layoutState = useSelector((state: RootState) => state.layout);

    const windowResize = useWindowResize();

    // 브라우저사이즈 변화에 따른 사이드 네비게이션 활성화
    useEffect(() => {
        if (windowResize.width > 767) {
            if (layoutState.isShowSideNav) dispatch(setShowSideNavReducer(false));
        }
    },[windowResize]);

    return (
        <>
            <HomeNav/>
            <main className='flex w-full h-full pt-[48px] md:pt-[60px] md:min-w-[1100px]'>
                <CustomScroller autoHide={ false }>
                    <Outlet/>
                </CustomScroller>
            </main>
            <SuccessSignupModal isShow={ modalControl } setIsShow={ setModalControl }/>
            <SignUpModal successControl={ setModalControl }/>
            <SignInModal/>
        </>
    )
}