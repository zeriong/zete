import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {AddMemo} from "../components/addMemo";
import Masonry from "react-masonry-css";
import CustomScroller from "../../../common/components/customScroller";
import {useHandleQueryStr} from "../../../hooks/useHandleQueryStr";
import * as DOMPurify from "dompurify";
import {FillStarIcon, StarIcon} from "../../../assets/vectors";
import {subUniqueKey} from "../../../common/libs/common.lib";
import {useHorizontalScroll} from "../../../hooks/useHorizontalScroll";
import {MemoModifyModal} from "../components/modals/memoModifyModal";
import {SavedMemoMenuPopover} from "../components/popovers/savedMemoMenuPopover";
import {importantConverter} from "../../../store/slices/memo.slice";
import {useCloneDivObserver, usePaginationObservers} from "../../../hooks/useObservers";

export const MemoMain = () => {
    const [masonryCols,setMasonryCols] = useState<{}>({})
    const [currentMemoId,setCurrentMemoId] = useState<number>(0);

    const { loading } = useSelector((state: RootState) => (state.user));
    const { data } = useSelector((state: RootState) => state.memo);
    const { menuQueryStr, searchParams, setSearchParams } = useHandleQueryStr();
    const { paginationDivObsRef } = usePaginationObservers();
    const { cloneMainRef, cloneRef } = useCloneDivObserver()

    const horizonScroll = useHorizontalScroll();

    const memoModifier = (memoId) => {
        setCurrentMemoId(memoId)
        searchParams.set('modal', 'memoModify');
        setSearchParams(searchParams);
    }

    const convertCols = (n:number) => {
        if (!data.memos) return
        if (n > data.memos.length+1) return data.memos.length+1;
        if (n < data.memos.length+1) return n
        else return n;
    }

    const masonryCallBack = useCallback(() => {
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
    },[data.memos])

    useEffect(()=> {
        masonryCallBack();
    },[masonryCallBack])

    return (
        loading ? (<div className="flex h-full items-center justify-center">로딩중...</div>) : (
            <>
                <div
                    className='p-30px fixed left-1/2 top-1/2 bg-black text-white z-50'
                    onClick={() => {
                        console.log(data)
                    }}
                >
                    show redux
                </div>
                <CustomScroller>
                    <section className='relative top-0 flex gap-28px w-full p-16px browser-width-900px:p-30px'>
                        {!menuQueryStr && (
                            <div ref={cloneMainRef} className='absolute left-30px top-30px mb-16px browser-width-900px:mb-30px z-20'>
                                <AddMemo/>
                            </div>
                        )}
                        <Masonry
                            key={subUniqueKey()}
                            breakpointCols={masonryCols}
                            className='my-masonry-grid flex gap-x-16px browser-width-900px:gap-x-30px w-full browser-width-900px:w-auto'
                            columnClassName='my-masonry-grid_column'
                        >
                            {!menuQueryStr && (
                                <div ref={cloneRef} className='mb-16px browser-width-900px:mb-30px browser-width-900px:w-[300px] min-h-[234px]'/>
                            )}
                            {data.memos &&
                                data.memos?.map((val) => (
                                    <div
                                        key={val.memoId}
                                        className='relative'
                                    >
                                        <div
                                            className='mb-16px browser-width-900px:mb-30px flex rounded-[8px] memo-shadow'
                                            onClick={() => memoModifier(val.memoId)}
                                        >
                                            <article
                                                className='relative min-w-0 w-full browser-width-900px:w-[300px] flex flex-col justify-between border
                                                border-zete-light-gray-500 rounded-[8px] p-20px min-h-[212px] bg-zete-primary-200'
                                            >
                                                <div className='flex flex-col h-full w-full'>
                                                    <div className='w-full mb-20px pr-30px'>
                                                        <p className='text-zete-gray-500 font-light text-start'>
                                                            {val.title}
                                                        </p>
                                                    </div>
                                                    <div className='items-end h-full w-full line-clamp-[14]'>
                                                        <p
                                                            className='text-start text-zete-gray-500 font-light h-full w-full max-h-[336px]'
                                                            dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(val.content)}}
                                                        />
                                                    </div>
                                                    <div className='flex w-full items-center pt-16px pr-26px'>
                                                        <div ref={horizonScroll} className='flex w-full h-full relative py-4px overflow-y-hidden memo-custom-vertical-scroll'>
                                                            {val.tags.map((val, idx) => (
                                                                <div key={idx} className='flex items-center px-9px py-1px mr-4px rounded-[4px] bg-black bg-opacity-10 cursor-default'>
                                                                        <span className='font-light text-11 text-zete-dark-400 whitespace-nowrap'>
                                                                            {val.tagName}
                                                                        </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                            <div className='absolute bottom-16px right-21px '>
                                                <SavedMemoMenuPopover memoId={val.memoId}/>
                                            </div>
                                        </div>
                                        <button
                                            type='button'
                                            className='absolute top-18px right-20px'
                                            onClick={() => importantConverter(val.memoId)}
                                        >
                                            {val.important ? <FillStarIcon/> : <StarIcon/>}
                                        </button>
                                    </div>
                                ))}
                        </Masonry>
                        <>
                            <MemoModifyModal memoId={currentMemoId}/>
                        </>
                    </section>
                    <div className='relative w-full h-1px bg-blue-500'>
                        <div ref={paginationDivObsRef} className='absolute left-0 bottom-0 w-1px h-[500px] bg-red-500'/>
                    </div>
                </CustomScroller>
            </>
        )
    )
}
