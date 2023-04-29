import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {sendMyProfile} from "../../store/slices/user.slice";
import {AppDispatch, RootState, store} from "../../store";
import {Outlet} from "react-router-dom";
import {Header} from "./header";
import {Aside} from "./aside";
import {Alert} from "../../components/common/alert";
import {TagIcon} from "../../components/vectors";
import {useHandleQueryStr} from "../../hooks/useHandleQueryStr";
import {SearchMemo} from "../../components/layout/searchMemo";
import axios from "axios";
import {Api} from "../../utile/api";

export const MemoLayout = () => {
    const { loading } = useSelector((state: RootState) => (state.user));
    const { showMenu } = useSelector((state: RootState) => (state.changedMenu));
    // const { tableData } = useSelector((state: RootState) => (state.memo));
    const { cateStr, tagStr, menuStr } = useHandleQueryStr()

    const [existCate,setExistCate] = useState(false);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(sendMyProfile());
    }, [dispatch])

    // useEffect(() => {
    //     const cateList = tableData.categories.map((cate) => cate.cateName);
    //     if (cateList.find((list) => list === cateStr)) {
    //         setExistCate(true);
    //     } else {
    //         setExistCate(false);
    //     }
    // },[tagStr,cateStr, tableData])

    return ( loading ? (<div className="flex h-full items-center justify-center">로딩중...</div>) : (
        <>
            <Header/>
            <Aside/>
            <main
                className={`${showMenu ? "pl-asideWidth max-md:pl-0" : "pl-0"}
                flex relative flex-col justify-center h-full text-center items-center pt-headerHeight
                overflow-auto duration-300 ease-in-out`}
            >
                <div className='w-full h-full flex relative pt-headerHeight'>
                    <header className="flex fixed top-headerHeight h-headerHeight items-center justify-between w-full z-30 ease-in-out duration-300 bg-white border-b border-zete-light-gray-400 pl-16px md:pl-20px">
                        <div className='flex items-center'>
                            <>
                                <TagIcon strokeClassName='fill-zete-tagBlack' svgClassName='w-17px h-16px mr-10px'/>
                            </>
                            {
                                existCate ? (
                                    <>
                                        <span>
                                            {menuStr ? '중요메모' :
                                                (!cateStr && !menuStr) ? '전체메모' : cateStr}
                                        </span>
                                        {
                                            tagStr && (
                                                <div className='flex'>
                                                    <p className='mx-8px'>
                                                        &gt;
                                                    </p>
                                                    {tagStr}
                                                </div>
                                            )
                                        }
                                    </>
                                ) : (menuStr || (!cateStr && !menuStr)) ? (
                                    <span>
                                        {menuStr ? '중요메모' :
                                            (!cateStr && !menuStr) ? '전체메모' : cateStr}
                                    </span>
                                ) : (
                                    <h1 className='text-zete-placeHolder'>
                                        카테고리가 존재하지않습니다.
                                    </h1>
                                )
                            }

                        </div>
                        <div className='block md:hidden pr-16px'>
                            <SearchMemo/>
                        </div>
                    </header>
                    <div className='w-full h-full bg-zete-light-gray-100 overflow-hidden'>
                        <Alert/>
                        <Outlet/>
                    </div>
                </div>
            </main>
        </>
        )
    )
};