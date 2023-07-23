import {Link, useSearchParams} from "react-router-dom";
import {sendLogout} from "../../../store/slices/auth.slice";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {sendMyProfile} from "../../../store/slices/user.slice";
import {GiHamburgerMenu} from "@react-icons/all-files/gi/GiHamburgerMenu";
import {useHandleQueryStr} from "../../../hooks/useHandleQueryStr";

export const Header = ()=> {
    const { name } = useSelector((state: RootState) => state.user.data);
    const { searchParams, setSearchParams } = useHandleQueryStr();

    const [openMenu, setOpenMenu]= useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const { isLoggedIn } = useSelector((state: RootState) => state.auth);

    const menuNames: { name: string, to: string }[] = [
        { name: "서비스", to: "/service" },
        { name: "기능안내", to: "/guide" },
        { name: "고객사례", to: "/userExp" },
        { name: "요금안내", to: "/payNotice" },
        { name: "공지사항", to: "/notice" },
    ];

    const mobileSideBarButtonStyle = "flex ml-12px w-full text-orange-500 hover:scale-110 ease-in-out " +
        "duration-150 p-4px hover:text-orange-900";
    const mobileHeaderButtonStyle = "w-100px flex justify-center cursor-pointer rounded-[16px] p-4px ";

    const toggleMenu = () => setOpenMenu(!openMenu);
    const closeMenu = () => setOpenMenu(false);

    const openSignInModal = () => {
        searchParams.set("modal","sign-in");
        setSearchParams(searchParams);
    }

    const openSignUpModal = () => {
        searchParams.set("modal","sign-up");
        setSearchParams(searchParams);
    }

    const dispatchLogout = () => {
        dispatch(sendLogout());
    }

    const handleLogout = () => {
        dispatchLogout();
        closeMenu();
    }

    const handleResize = () => {
        if (window.innerWidth > 767) closeMenu();
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize);

        if (isLoggedIn) dispatch(sendMyProfile());

        return () => window.removeEventListener("resize", handleResize);
    }, [isLoggedIn]);

    return (
        <header
            className="flex justify-between max-lg:h-48px max-lg:px-20px items-center px-40px py-12px border-b border-gray-300
            whitespace-nowrap fixed bg-white w-full z-30"
        >
            <section
                onClick={ closeMenu }
                className={`transition-all ease-in-out fixed w-full h-full bg-black opacity-0 left-0 top-0 duration-300 z-30
                ${openMenu ? "opacity-50 visible" : "opacity-0 invisible"}`}
            />
            <Link to="/" className="font-bold max-lg:text-lg text-[20px] mr-48px">
                Zete!
            </Link>
            <section
                className={`max-lg:fixed max-lg:h-full max-lg:bg-orange-50 max-lg:w-[260px] max-lg:bottom-0
                max-lg:p-28px max-lg:flex-col max-lg:ease-in-out max-lg:duration-300 flex gap-32px justify-start w-full z-30
                ${openMenu ? "right-0" : "-right-full"}`}
            >
                <div className="max-lg:block hidden font-bold border-b border-b-orange-200 pb-20px pl-8px">
                    <div className="text-xl mb-8px text-gray-700">{ isLoggedIn ? `${name}님` : "로그인해주세요." }</div>
                    {isLoggedIn ? (
                            <>
                                <Link to="memo" className="flex ml-12px w-full text-orange-700 hover:scale-110 ease-in-out duration-150 py-4px px-8px hover:text-orange-900">
                                    Let's Keep!
                                </Link>
                                <button
                                    type="button"
                                    className={ mobileSideBarButtonStyle }
                                    onClick={ handleLogout }
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className={ mobileSideBarButtonStyle }
                                    onClick={ openSignInModal }
                                >
                                    로그인
                                </button>
                                <button
                                    type="button"
                                    onClick={ openSignUpModal }
                                    className={ mobileSideBarButtonStyle }
                                >
                                    회원가입
                                </button>
                            </>
                        )
                    }
                </div>
                <div className="flex max-lg:flex-col gap-32px max-lg:gap-20px text-lg font-bold justify-start w-full text-gray-700 ">
                    {menuNames.map((menu, idx) => (
                        <Link
                            key={ idx }
                            to={ menu.to }
                            onClick={ closeMenu }
                            className="justify-start hover:scale-105 hover:text-orange-800 ease-in-out duration-150"
                        >
                            { menu.name }
                        </Link>
                    ))}
                </div>
                <button
                    className={`flex justify-center absolute text-lg font-bold bottom-20px bg-orange-600 w-[208px] rounded-[16px]
                    p-4px text-white hover:scale-110 hover:bg-orange-300 hover:text-black ease-in-out duration-150
                    ${ openMenu ? "block" : "hidden" }`}
                    onClick={ closeMenu }
                >
                    메뉴 숨기기
                </button>
            </section>
            {isLoggedIn ? (
                <section className="max-lg:hidden flex flex-row items-center">
                    <div className="text-[20px] font-bold text-gray-600 mr-16px">
                        { `${ name }님` }
                    </div>
                    <Link
                        to="memo"
                        className="flex justify-center cursor-pointer rounded-[16px] py-4px px-20px bg-orange-500 text-white mr-12px"
                    >
                        Let's Zete!
                    </Link>
                    <button
                        type="button"
                        onClick={ handleLogout }
                        className={ mobileHeaderButtonStyle + "border border-gray-500" }
                    >
                        로그아웃
                    </button>
                </section>
            ) : (
                <section className="max-lg:invisible flex gap-16px items-center m-auto font-medium ">
                    <div
                        onClick={ openSignInModal }
                        className={ mobileHeaderButtonStyle + "border border-gray-500" }
                    >
                        로그인하기
                    </div>
                    <div
                        onClick={ openSignUpModal }
                        className={ mobileHeaderButtonStyle + "bg-orange-500 text-white" }
                    >
                        회원가입
                    </div>
                </section>
            )}
            <button
                type="button"
                onClick={ toggleMenu }
                className="bg-white p-6px rounded-lg border border-gray-200 left-12px hidden max-lg:block"
            >
                <GiHamburgerMenu size="20" color="#f97316"/>
            </button>
        </header>
    )
}