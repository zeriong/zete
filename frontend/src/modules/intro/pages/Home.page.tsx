import React, {useState} from 'react';
import {SuccessSignupModal} from '../../../common/components/modals/SuccessSignup.modal';
import {SignupModal} from '../../../common/components/modals/Signup.modal';
import {SigninModal} from '../../../common/components/modals/Signin.modal';
import {Link, useSearchParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import memoImg from '../../../assets/scroll-g6570d2351_1920.png';

export const Home = ()=> {
    const [searchParams, setSearchParams] = useSearchParams();
    const [modalControl, setModalControl] = useState(false);

    const { isLoggedIn } = useSelector((state: RootState) => state.auth);
    const { data } = useSelector((state: RootState) => state.user);

    const openSignInModal = () => {
        searchParams.set('modal','sign-in');
        setSearchParams(searchParams);
    }

    const openSignUpModal = () => {
        searchParams.set('modal','sign-up');
        setSearchParams(searchParams);
    }

    return (
        <>
            <div className='flex h-full w-full py-[100px] max-md:py-0'>
                <div
                    className='flex flex-col m-auto p-[60px] font-bold text-[48px] text-gray-800 max-md:z-20 max-md:text-center max-md:p-0'
                >
                    <div className='mt-[40px] text-[48px] text-gray-800 flex flex-col w-[376px]'>
                        <span className='max-md:text-[36px]'>
                            깔끔한 기록을 위한
                        </span>
                        <h1 className='max-md:text-[36px] mt-[12px]'>
                            메모 서비스
                            <span className='ml-[16px] font-extrabold'>
                                Zete!
                            </span>
                        </h1>
                    </div>
                    {isLoggedIn ? (
                        <div className='flex flex-col mt-[40px]'>
                            <h1 className='flex text-[26px] font-bold justify-center'>
                                { `어서오세요! ${data.name}님` }
                            </h1>
                            <Link to='memo' className='text-[30px] font-bold flex py-[8px] px-[20px] items-center bg-orange-500
                                rounded-[16px] justify-center mt-[32px] cursor-pointer text-white'>
                                Let's Zete!
                            </Link>
                        </div>
                    ) : (
                        <h1 className='text-[26px] font-medium mt-[80px]'>
                            자주 잊는 계획이나 일정관리, 정산관리 등<br/>
                            다양한 메모를 좀 더 깔끔하게 정리하세요.<br/>
                            가입하고 무료로 시작하세요.
                        </h1>
                    )}
                    {!isLoggedIn &&
                        <div className='flex flex-row text-[30px] mt-[40px]'>
                            <button
                                type='button'
                                onClick={ openSignInModal }
                                className='mt-[20px] w-[180px] py-[8px] flex justify-center border border-gray-500 bg-white
                                    mb-[12px] cursor-pointer text-[22px] items-center mr-[24px] rounded-[16px]'
                            >
                                로그인하기
                            </button>
                            <button
                                type='button'
                                onClick={ openSignUpModal }
                                className='mt-[20px] w-[180px] py-[8px] flex justify-center mb-[12px] cursor-pointer text-[22px]
                                    items-center bg-orange-500 rounded-[16px] text-white'
                            >
                                회원가입
                            </button>
                        </div>
                    }
                </div>
                <figure
                    className='flex items-center w-1/2 max-md:fixed max-md:opacity-50 max-md:w-full
                        z-10 h-full font-bold text-[48px] text-gray-800 max-md:top-0'
                >
                    <img
                        className='flex m-auto max-md:h-[400px] max-md:p-0 h-full p-[40px]'
                        src={ memoImg }
                        alt={ '' }
                    />
                </figure>
            </div>
            <SuccessSignupModal isShow={ modalControl } setIsShow={ setModalControl }/>
            <SignupModal successControl={ setModalControl }/>
            <SigninModal/>
        </>
    )
};