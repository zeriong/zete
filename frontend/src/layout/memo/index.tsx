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

    const dummy = {
        cateId: null,
        title: 'd',
        content: '오우야',
        important: true,
        tags: ['태그', '완'],
    }

    const cateDummy = {
        cateName: 'd'
    }

    const createMemoTest = () => {
        Api().memo.createMemo({...dummy})
            .then(res => console.log(res))
            .catch(e => console.log(e))
    }

    const [testVal, setTestVal] = useState('');
    const [resData, setResData] = useState<any>();

    const testSubmit = (e) => {
        e.preventDefault();
        Api().memo.createCate({
            cateName: testVal
        })
            .then((res) => {
                console.log(res);
                setResData(res.data.cate);
                setTestVal('');
            })
            .catch(e => alert(e))
    }

    const data = [
        {cateId: 25, cateName: '8'},
        {cateId: 26, cateName: 'asdfd'},
        {cateId: 27, cateName: '바꿈'},
        {cateId: 28, cateName: '애도바꿈'},
    ]

    const cateUpdateTest = () => {
        Api().memo.updateManyCate({data})
            .then(res => console.log(res))
            .catch(e => console.log(e))
    }

    const cateDeleteTest = () => {
        Api().memo.deleteCate({
            cateId: 25
        }).then(res => console.log(res))
            .catch(e => console.log(e))
    }

    return ( loading ? (<div className="flex h-full items-center justify-center">로딩중...</div>) : (
        <>
            <Header/>
            <Aside/>
            <main
                className={`${showMenu ? "pl-asideWidth max-md:pl-0" : "pl-0"}
                flex relative flex-col justify-center h-full text-center items-center pt-headerHeight
                overflow-auto duration-300 ease-in-out`}
            >
                <div className='w-full h-full flex relative pt-headerHeight transform'>
                    <header className="flex fixed top-0 h-headerHeight items-center justify-between w-full z-30 ease-in-out duration-300 bg-white border-b border-zete-light-gray-400 pl-16px md:pl-20px">
                        <div className='flex items-center'>
                            <>
                                {/*테스트 테스트 테스트 테스트테스트 테스트테스트 테스트테스트 테스트*/}

                                <button
                                    type='button'
                                    className='fixed left-1/2 top-1/2 bg-blue-500 text-black p-30px -translate-y-1/2 -translate-x-1/2'
                                    onClick={createMemoTest}
                                >
                                    Test Button
                                </button>
                                <form
                                    className='fixed left-1/2 top-1/4 bg-blue-500 text-black p-30px -translate-y-1/2 -translate-x-1/2'
                                    onSubmit={testSubmit}
                                >
                                    <input placeholder='여기에 입력해라' value={testVal} onChange={(e) => setTestVal(e.target.value)} className='text-20 border'/>
                                </form>
                                <div className='fixed left-1/2 bg-gray-400'>
                                    Test Area
                                    {resData && resData?.map((cate, idx) => {
                                        return (
                                            <li key={idx}>
                                                {cate.cateName}
                                            </li>
                                        )
                                    })}
                                </div>

                                {/*테스트 테스트 테스트 테스트테스트 테스트테스트 테스트테스트 테스트*/}
                            </>
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