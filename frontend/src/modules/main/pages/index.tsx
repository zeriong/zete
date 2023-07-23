import React, {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {AddMemo} from "../components/addMemo";
import Masonry from "react-masonry-css";
import {useHandleQueryStr} from "../../../hooks/useHandleQueryStr";
import * as DOMPurify from "dompurify";
import {FillStarIcon, StarIcon} from "../../../assets/vectors";
import {useHorizontalScroll} from "../../../hooks/useHorizontalScroll";
import {MemoModifyModal} from "../components/modals/memoModify.modal";
import {SavedMemoMenuPopover} from "../components/popovers/savedMemoMenu.popover";
import {usePaginationObservers} from "../../../hooks/useObservers";
import {importantConverter, refreshMemos, refreshTargetMemo} from "../../../store/slices/memo.slice";

export const MemoMain = () => {
    const intervalRef = useRef<NodeJS.Timeout>(null);

    const [masonryCols] = useState({
        default: 7,
        2544: 6,
        2222: 5,
        1888: 4,
        1566: 3,
        1234: 2,
        900: 1,
        767: 2,
        610: 1,
    });

    const [currentMemoId,setCurrentMemoId] = useState<number>(0);

    const { loading } = useSelector((state: RootState) => (state.user));
    const { data } = useSelector((state: RootState) => state.memo);
    const { paginationDivObsRef } = usePaginationObservers();
    const {
        modalQueryStr,
        menuQueryStr,
        searchParams,
        cateQueryStr,
        tagQueryStr,
        setSearchParams,
    } = useHandleQueryStr();

    const horizonScroll = useHorizontalScroll();

    const handleInterval = () => {
        intervalRef.current = setInterval(() => {
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
        loading ? <div className="flex h-full items-center justify-center">로딩중...</div> : (
            <>
                <section className='relative top-0 gap-28px w-full p-16px browser-width-900px:p-30px'>
                    {!menuQueryStr && (
                        <div className='relative flex justify-center mt-6px mb-22px browser-width-900px:mb-30px browser-width-900px:mt-0'>
                            <AddMemo/>
                        </div>
                    )}
                    <Masonry
                        breakpointCols={masonryCols}
                        className='my-masonry-grid flex justify-center gap-x-16px browser-width-900px:gap-x-30px w-full browser-width-900px:w-auto'
                        columnClassName='my-masonry-grid_column'
                    >
                        {data.memos?.map((memo) => (
                            <div
                                key={memo.id}
                                className='relative w-full'
                            >
                                <div
                                    className='mb-16px w-full browser-width-900px:w-[300px] browser-width-900px:mb-30px flex rounded-[8px] memo-shadow'
                                    onClick={() => memoModifier(memo.id)}
                                >
                                    <article
                                        className='relative flex flex-col justify-between border w-full
                                        border-zete-light-gray-500 rounded-[8px] px-18px py-14px min-h-[212px] bg-zete-primary-200'
                                    >
                                        {memo.title ? (
                                            <p
                                                className='text-zete-gray-500 font-light text-20 text-start w-full mb-10px pr-30px'
                                                dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(memo.title)}}
                                            />
                                        ) : (
                                            <p className='min-h-[30px] w-full mb-10px pr-30px'/>
                                        )}
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
                                    <div className='absolute bottom-10px right-18px'>
                                        <SavedMemoMenuPopover memoId={memo.id}/>
                                    </div>
                                </div>
                                <button
                                    type='button'
                                    className='absolute top-13px right-14px'
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
            </>
        )
    )
}
