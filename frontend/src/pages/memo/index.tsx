import React, {memo, useEffect, useMemo, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {AddMemo} from "../../components/memoContent";
import Masonry from "react-masonry-css";
import CustomScroller from "../../components/customScroller";
import {useHandleQueryStr} from "../../hooks/useHandleQueryStr";
import * as DOMPurify from "dompurify";
import {FillStarIcon, StarIcon, ThreeDotMenuIcon} from "../../components/vectors";
import {setData, subUniqueKey} from "../../utile";
import {DELETE_MEMO} from "../../store/slices/memo.slice";
import {all} from "axios";
import {useResize} from "../../hooks/useResize";

export const MemoMain = () => {
    const currentCate = useRef<any[]>(null)

    const [masonryCols,setMasonryCols] = useState({})
    const [existCate,setExistCate] = useState(false);

    const { loading } = useSelector((state: RootState) => (state.user));
    const { data, tableArr } = useSelector((state: RootState) => (state.memo));
    const { cateStr, tagStr } = useHandleQueryStr();
    
    const resize = useResize();

    const dispatch = useDispatch();

    const currentData = useMemo(() => {
        if (data[0]) {
            const allMemos = data.map(val => val.memos);
            const currentCate = data.filter(data => data.cateName === cateStr).map(data => data.memos);
            const importantMemos = allMemos.flatMap(memos => memos.filter((memo => memo.important)))
            console.log('메모안에 데이타',importantMemos)

            if (!cateStr && !tagStr) {
                return allMemos.flat()
            } else if (cateStr === 'important') {
                return importantMemos.flat()
            } else if (cateStr && !tagStr) {
                return currentCate.flat()
            }
        }
    },[data, cateStr, tagStr])

    const convertCols = (n:number) => {
        if (!currentData) return
        if (cateStr === 'important' || !cateStr ) {
            if (n > currentData.length) return currentData.length;
            else return n;
        } else if ( cateStr ) {
            if (n > currentData.length+1) return currentData.length+1;
            else return n;
        }
    }

    const deleteMemo = (memoId: number) => {
        dispatch(DELETE_MEMO(memoId));
        setData();
    }

    useEffect(()=> {
        setMasonryCols({
            default: convertCols(7),
            2544: convertCols(6),
            2222: convertCols(5),
            1888: convertCols(4),
            1566: convertCols(3),
            1234: convertCols(2),
            900: convertCols(1),
            767: convertCols(2),
            610: convertCols(1),
        })
    },[data, resize, cateStr, tagStr])

    useEffect(() => {
        const cateList = tableArr.categories.map((cate) => cate.cateName);
        if (cateList.find((list) => list === cateStr)) {
            setExistCate(true);
        } else {
            setExistCate(false);
        }
    },[tagStr,cateStr, tableArr])

    return (
        loading ? (<div className="flex h-full items-center justify-center">로딩중...</div>) : (
            <CustomScroller>
                <section className='flex gap-28px w-full min-h-full p-16px browser-width-900px:p-30px'>
                    <Masonry
                        key={subUniqueKey()}
                        breakpointCols={masonryCols}
                        className='my-masonry-grid flex gap-x-16px browser-width-900px:gap-x-30px w-full h-full browser-width-900px:w-auto'
                        columnClassName='my-masonry-grid_column'
                    >
                        {existCate && (
                            cateStr !== 'important' &&
                            cateStr && (
                                <div className='mb-16px browser-width-900px:mb-30px'>
                                    <AddMemo/>
                                </div>
                            ))
                        }
                        {currentData &&
                            currentData?.map((val) => {
                                let cleanContent = DOMPurify.sanitize(val.content);
                                console.log('우효~')
                                return (
                                    <div key={val.memoId} className='mb-16px browser-width-900px:mb-30px flex'>
                                        <article
                                            className='relative min-w-0 w-full browser-width-900px:min-w-[300px] flex flex-col justify-between border
                                            border-zete-light-gray-500 rounded-[8px] p-20px min-h-[212px] bg-zete-primary-200'
                                        >
                                            <div className='flex flex-col h-full w-full'>
                                                <div className='w-full flex justify-between mb-20px'>
                                                    <p className='text-zete-gray-500 font-light'>
                                                        {val.title}
                                                    </p>
                                                    {val.important ? <FillStarIcon/> : <StarIcon/>}
                                                </div>
                                                <div className='items-end h-full w-full line-clamp-[14]'>
                                                    <p
                                                        className='text-start text-zete-gray-500 font-light h-full w-full max-h-[336px]'
                                                        dangerouslySetInnerHTML={{__html: cleanContent}}
                                                    />
                                                </div>
                                                <div className='flex w-full items-center pt-16px'>
                                                    {/*<div className='flex w-full gap-8px overflow-x-auto'>*/}
                                                    {/*    {val.tags && val.tags.map((val, idx) => {*/}
                                                    {/*        return (*/}
                                                    {/*            <div*/}
                                                    {/*                key={idx}*/}
                                                    {/*                className='flex items-center px-9px py-1px rounded-[4px] bg-black bg-opacity-10 cursor-default'*/}
                                                    {/*            >*/}
                                                    {/*            <span className='font-light text-11 text-zete-dark-400'>*/}
                                                    {/*                {val}*/}
                                                    {/*            </span>*/}
                                                    {/*            </div>*/}
                                                    {/*        )*/}
                                                    {/*    })}*/}
                                                    {/*</div>*/}
                                                    <div className='flex items-center pl-2px h-24px w-24px' onClick={()=> deleteMemo(val.memoId)}>
                                                        <ThreeDotMenuIcon/>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                )
                        })}
                    </Masonry>
                </section>
            </CustomScroller>
        )
    )
}
