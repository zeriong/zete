import React, {useEffect, useState} from "react";
import {SuccessSignupModal} from "../../../common/components/modals/SuccessSignupModal";
import {SignupModal} from "../../../common/components/modals/SignupModal";
import {SigninModal} from "../../../common/components/modals/SigninModal";
import {Link, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";

import {sendMyProfile} from "../../../store/slices/user.slice";

import memoImg from "../../../assets/scroll-g6570d2351_1920.png";

export const Home = ()=> {
    /** 쿼리세팅 */
    const [searchParams, setSearchParams] = useSearchParams();

    const setRouterQuery = (key: string, value:string) => {
        searchParams.set(key, value);
        setSearchParams(searchParams);
    };
    /** state management */
    const dispatch = useDispatch<AppDispatch>();
    const isLoggedIn = useSelector((state: RootState) => (state.auth.data.isLoggedIn));
    const { data: { name } } = useSelector((state: RootState) => (state.user));
    const [modalControl, setModalControl] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(sendMyProfile());
        }
    }, [])

    return (
        <>
                <div className="flex h-full w-full py-100px max-md:py-0">
                    <div
                        className="flex flex-col w-auto h-auto m-auto p-60px font-bold text-48 text-gray-800
                        max-md:z-20 max-md:text-center max-md:p-0"
                    >
                        <div className="mt-10 text-48 text-gray-800 flex flex-col w-[376px]">
                            <span className="max-md:text-36">깔끔한 기록을 위한</span>
                            <span className="max-md:text-36 mt-12px">메모 서비스</span>
                            <span className="font-extrabold">Zeriong Keep!</span>
                        </div>
                        {isLoggedIn ? (
                            <div className="flex flex-col mt-56px">
                                <div className="flex text-26 font-bold justify-center">
                                    {`어서오세요! ${name}님`}
                                </div>
                                <Link to="memo" className="text-30 font-bold flex py-8px px-20px items-center bg-orange-500
                                rounded-[16px] justify-center mt-32px cursor-pointer text-white">
                                    Let's Keep!
                                </Link>
                            </div>
                        ) : (
                            <div className="text-26 font-medium mt-80px">
                                자주 잊는 계획이나 일정관리, 정산관리 등<br/>
                                다양한 메모를 좀 더 깔끔하게 정리하세요.<br/>
                                가입하고 무료로 시작하세요.
                            </div>
                        )}
                        {
                            isLoggedIn ? (
                                <></>
                            ) : (
                                <div className="flex flex-row text-30 mt-40px">
                                    <span onClick={() => setRouterQuery("modal","sign-in")}
                                          className="mt-20px w-[180px] py-8px flex justify-center border border-gray-500 bg-white
                                          mb-12px cursor-pointer text-22 items-center mr-24px rounded-[16px]">
                                        로그인하기
                                    </span>
                                    <span onClick={() => setRouterQuery("modal","sign-up")}
                                          className="mt-20px w-[180px] py-8px flex justify-center mb-12px cursor-pointer text-22
                                           items-center bg-orange-500 rounded-2xl text-white">
                                        회원가입
                                    </span>
                                </div>
                            )
                        }
                    </div>
                    <figure
                        className="flex items-center w-1/2 max-md:fixed max-md:opacity-50 max-md:w-full
                        z-10 h-full font-bold text-48 text-gray-800 max-md:top-0"
                    >
                        <img
                            className="flex m-auto max-md:h-[400px] max-md:p-0 h-full w-auto p-40px"
                            src={memoImg}
                            alt={''}
                        />
                    </figure>
                </div>
            <SuccessSignupModal isShow={modalControl} setIsShow={setModalControl}/>
            <SignupModal successControl={setModalControl}/>
            <SigninModal/>
        </>
    );
};