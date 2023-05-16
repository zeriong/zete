import React, {useCallback, useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {AddMemo} from "../components/addMemo";
import Masonry from "react-masonry-css";
import CustomScroller from "../../../common/components/customScroller";
import {useHandleQueryStr} from "../../../hooks/useHandleQueryStr";
import * as DOMPurify from "dompurify";
import {FillStarIcon, StarIcon} from "../../../assets/vectors";
import {useHorizontalScroll} from "../../../hooks/useHorizontalScroll";
import {MemoModifyModal} from "../components/modals/memoModify.modal";
import {SavedMemoMenuPopover} from "../components/popovers/savedMemoMenu.popover";
import {
    importantConverter,
    refreshMemos,
    refreshTargetMemo
} from "../../../store/slices/memo.slice";
import {useCloneDivObserver, usePaginationObservers} from "../../../hooks/useObservers";

export const MemoMain = () => {
    const intervalRef = useRef<NodeJS.Timeout>(null);

    const [masonryCols,setMasonryCols] = useState<{}>({});
    const [currentMemoId,setCurrentMemoId] = useState<number>(0);

    const { loading } = useSelector((state: RootState) => (state.user));
    const { data } = useSelector((state: RootState) => state.memo);
    const { paginationDivObsRef } = usePaginationObservers();
    const { cloneRef, cloneMainRef } = useCloneDivObserver();
    const {
        modalQueryStr,
        menuQueryStr,
        searchParams,
        cateQueryStr,
        tagQueryStr,
        setSearchParams
    } = useHandleQueryStr();

    const horizonScroll = useHorizontalScroll();

    const handleInterval = () => {
        intervalRef.current = setInterval(() => {
            console.log('20분경과, 데이터 최신화');
            refreshMemos({
                offset: 0,
                limit: data.memos.length,
                search: '',
                menuQueryStr,
                tagQueryStr,
                cateQueryStr: Number(cateQueryStr) || null,
            })
            // 1200000ms = 20min
        },1200000);
    }

    const memoModifier = (memoId) => {
        setCurrentMemoId(memoId);
        searchParams.set('modal', 'memoModify');
        setSearchParams(searchParams);
        refreshTargetMemo(memoId);
    }

    const convertCols = (n:number) => {
        if (!data.memos) return
        if (menuQueryStr) {
            if (n > data.memos.length) return data.memos.length;
            if (n < data.memos.length) return n;
        }
        if (n > data.memos.length+1) return data.memos.length+1;
        if (n < data.memos.length+1) return n;
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
    },[convertCols]);

    useEffect(()=> {
        masonryCallBack();
    },[data.memos, masonryCallBack]);

    // 20분마다 데이터 최신화
    useEffect(() => {
        if (modalQueryStr) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        } else {
            clearInterval(intervalRef.current);
            handleInterval();
        }
    },[searchParams, data]);

    return (
        loading ? (<div className="flex h-full items-center justify-center">로딩중...</div>) : (
            <CustomScroller>
                <section className='relative top-0 flex gap-28px w-full p-16px browser-width-900px:p-30px'>
                    {!menuQueryStr && (
                        <div ref={cloneRef} className='absolute left-16px top-16px mb-16px mb-16px browser-width-900px:mb-30px browser-width-900px:left-30px browser-width-900px:top-30px z-20'>
                            <AddMemo/>
                        </div>
                    )}
                    <Masonry
                        breakpointCols={masonryCols}
                        className='my-masonry-grid flex gap-x-16px browser-width-900px:gap-x-30px w-full browser-width-900px:w-auto'
                        columnClassName='my-masonry-grid_column'
                    >
                        {!menuQueryStr && (
                            <div ref={cloneMainRef} className='mb-16px w-full browser-width-900px:mb-30px browser-width-900px:w-[300px] min-h-[234px]'/>
                        )}
                        {data.memos?.map((memo) => (
                            <div
                                key={memo.id}
                                className='relative'
                            >
                                <div
                                    className='mb-16px browser-width-900px:mb-30px flex rounded-[8px] memo-shadow'
                                    onClick={() => memoModifier(memo.id)}
                                >
                                    <article
                                        className='relative min-w-0 w-full browser-width-900px:w-[300px] flex flex-col justify-between border
                                        border-zete-light-gray-500 rounded-[8px] p-20px min-h-[212px] bg-zete-primary-200'
                                    >
                                        <p
                                            className='text-zete-gray-500 font-light text-18 text-start w-full mb-20px pr-30px'
                                            dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(memo.title)}}
                                        />
                                        <div className='items-end h-full w-full line-clamp-[14]'>
                                            <p
                                                className='text-start text-zete-gray-500 font-light h-full w-full max-h-[336px]'
                                                dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(memo.content)}}
                                            />
                                        </div>
                                        <div className='flex w-full items-center pt-16px pr-26px'>
                                            <div ref={horizonScroll} className='flex w-full h-full relative py-4px overflow-y-hidden memo-custom-vertical-scroll'>
                                                {memo.tag?.map((tag, idx) => (
                                                    <div key={idx} className='flex items-center px-9px py-1px mr-4px rounded-[4px] bg-black bg-opacity-10 cursor-default'>
                                                        <span className='font-light text-11 text-zete-dark-400 whitespace-nowrap'>
                                                            {tag.tagName}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </article>
                                    <div className='absolute bottom-16px right-21px '>
                                        <SavedMemoMenuPopover memoId={memo.id}/>
                                    </div>
                                </div>
                                <button
                                    type='button'
                                    className='absolute top-18px right-20px'
                                    onClick={() => importantConverter(memo.id)}
                                >
                                    {memo.important ? <FillStarIcon/> : <StarIcon/>}
                                </button>
                            </div>
                        ))}
                    </Masonry>
                    <>
                        <MemoModifyModal memoId={currentMemoId}/>
                    </>
                </section>
                <div className='relative w-full h-1px'>
                    <div ref={paginationDivObsRef} className='absolute left-0 bottom-0 w-1px h-[500px]'/>
                </div>
            </CustomScroller>
        )
    )
}
