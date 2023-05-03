import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {sendMyProfile} from "../../../store/slices/user.slice";
import {AppDispatch, RootState} from "../../../store";
import {Outlet} from "react-router-dom";
import {Header} from "./header";
import {Aside} from "./aside";
import {CategoryIcon, TagIcon} from "../../../assets/vectors";
import {useHandleQueryStr} from "../../../hooks/useHandleQueryStr";
import {SearchMemo} from "../components/searchMemo";
export const MemoLayout = () => {
    const { loading } = useSelector((state: RootState) => (state.user));
    const { showMenu } = useSelector((state: RootState) => (state.changedMenu));
    const { cate } = useSelector((state: RootState) => (state.memo.data));
    const { cateQueryStr, menuQueryStr, searchParams } = useHandleQueryStr()

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(sendMyProfile());
    }, [dispatch])

    const categoryName = useMemo(() => {
        if (!cateQueryStr && !menuQueryStr) {
            return "전체메모";
        } else if (menuQueryStr) {
            return "중요메모";
        } else {
            const matchCate = cate.find((cate) => Number(cate.cateId) === Number(cateQueryStr)).cateName
            if (matchCate) {
                return matchCate;
            }
            return '카테고리가 존재하지않습니다.'
        }
    }, [searchParams, cate])

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
                            <CategoryIcon className='w-20px mr-10px'/>
                            {categoryName}
                        </div>
                        <div className='block md:hidden pr-16px'>
                            <SearchMemo/>
                        </div>
                    </header>
                    <div className='w-full h-full bg-zete-light-gray-100'>
                        <Outlet/>
                    </div>
                </div>
            </main>
        </>
        )
    )
};