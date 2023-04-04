import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {sendMyProfile} from "../../store/slices/user.slice";
import {AppDispatch, RootState} from "../../store";
import {Outlet, useSearchParams} from "react-router-dom";
import {Header} from "./header";
import {Aside} from "./aside";
import {Alert} from "../../components/alert";
import {TagIcon} from "../../components/vectors";

export const MemoLayout = () => {
    const { loading } = useSelector((state: RootState) => (state.user));
    const { showMenu } = useSelector((state: RootState) => (state.changedMenu));
    const dispatch = useDispatch<AppDispatch>();

    const [searchParams] = useSearchParams();
    const [queryStr, setQueryStr] = useState('');

    const getQueryStr = () => setQueryStr(searchParams.get('search')); // url 쿼리를 넣어줌 (쿼리에 따른 active 변화)

    useEffect(()=>{
        getQueryStr();
    },[searchParams])

    useEffect(() => {
        dispatch(sendMyProfile());
    }, [dispatch])

    return ( loading ? (<div className="flex h-full items-center justify-center">로딩중...</div>) : (
        <>
            <Header/>
            <Aside/>
            <main
                className={`${showMenu ? "pl-[300px] max-md:pl-0" : "pl-0"}
                flex relative flex-col justify-center h-full text-center items-center pt-headerHeight
                overflow-auto duration-300 ease-in-out`}
            >
                <Alert/>
                <div className='w-full h-full flex relative pt-headerHeight transform'>
                    <header className="flex fixed top-0 h-headerHeight items-center w-full z-30 ease-in-out duration-300 bg-white border-b border-zete-light-gray-400 pl-20px">
                        <TagIcon strokeClassName='fill-zete-tagBlack' svgClassName='w-17px h-16px mr-10px'/>
                        <span>{queryStr}</span>
                    </header>
                    <div className='w-full h-full flex items-center justify-center bg-zete-light-gray-100'>
                        <Outlet/>
                    </div>
                </div>
            </main>
        </>
        )
    )
};