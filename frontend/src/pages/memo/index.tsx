import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {AddMemo} from "../../components/memoContent";
import Masonry from "react-masonry-css";
import CustomScroller from "../../components/customScroller";
import {useHandleQueryStr} from "../../hooks/useHandleQueryStr";
import * as DOMPurify from "dompurify";
import {FillStarIcon, StarIcon} from "../../components/vectors";
import {setData, subUniqueKey} from "../../utile";
import {CHANGE_IMPORTANT} from "../../store/slices/memo.slice";
import {useHorizontalScroll} from "../../hooks/useHorizontalScroll";
import {MemoModifyModal} from "../../modals/memoModifyModal";
import {SavedMemoMenuPopov} from "../../popovers/savedMemoMenuPopov";

export const MemoMain = () => {
    const [masonryCols,setMasonryCols] = useState<{}>({})
    const [currentMemoId,setCurrentMemoId] = useState<number>(0);

    const { loading } = useSelector((state: RootState) => (state.user));
    const { data, tableData } = useSelector((state: RootState) => (state.memo));
    const { menuStr, cateStr, tagStr, searchParams, setSearchParams } = useHandleQueryStr();

    const horizonScroll = useHorizontalScroll();
    const dispatch = useDispatch();

    const currentData = useMemo(() => {
        const allMemos = data.flat().flatMap(obj => obj.memos);
        const findCurrentCateName = tableData.categories.filter(cate => cateStr === cate.cateName) || [];
        let currentCateId = null;

        if (findCurrentCateName.length !== 0) currentCateId = findCurrentCateName[0].cateId;

        const currentCate = data.flat().filter(data => data.cateId === currentCateId).map(data => data.memos);
        const importantMemos = allMemos.filter((memo => memo.important));
        const tagFilterMemos = currentCate.flatMap(cate => cate.filter(memo => memo.tags.some(tag => tag.tagName === tagStr)));

        if (!cateStr && !tagStr && !menuStr) return allMemos.flat();
        if (menuStr) return importantMemos.flat();
        if (cateStr && !tagStr) return currentCate.flat();
        if (tagStr) return tagFilterMemos.flat();
        },[data, cateStr, tagStr, menuStr])

    const memoModifier = (memoId) => {
        setCurrentMemoId(memoId)
        searchParams.set('modal', 'memoModify');
        setSearchParams(searchParams);
    }

    const importantModifier = (memoId:number) => {
        dispatch(CHANGE_IMPORTANT(memoId));
        setData();
    };

    const convertCols = (n:number) => {
        if (!currentData) return
        if (n > currentData.length+1) return currentData.length+1;
        if (n < currentData.length+1) return n
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
    },[currentData])

    useEffect(()=> {
        masonryCallBack();
    },[masonryCallBack])

    return (
        loading ? (<div className="flex h-full items-center justify-center">로딩중...</div>) : (
            <CustomScroller>
                <section className='relative flex gap-28px w-full min-h-full p-16px browser-width-900px:p-30px'>
                    {/*<div*/}
                    {/*    className='p-30px fixed left-1/2 top-1/2 bg-black text-white'*/}
                    {/*    onClick={() => {*/}
                    {/*    console.log(tableData)*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    test*/}
                    {/*</div>*/}
                    <div className='absolute left-30px top-30px mb-16px browser-width-900px:mb-30px z-20'>
                        <AddMemo/>
                    </div>
                    <Masonry
                        key={subUniqueKey()}
                        breakpointCols={masonryCols}
                        className='my-masonry-grid flex gap-x-16px browser-width-900px:gap-x-30px w-full h-full browser-width-900px:w-auto'
                        columnClassName='my-masonry-grid_column'
                    >
                        <div className='mb-16px browser-width-900px:mb-30px browser-width-900px:w-[300px] min-h-[234px]'/>
                        {currentData &&
                            currentData?.map((val) => {
                                let cleanContent = DOMPurify.sanitize(val.content);
                                return (
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
                                                            dangerouslySetInnerHTML={{__html: cleanContent}}
                                                        />
                                                    </div>
                                                    <div className='flex w-full items-center pt-16px pr-26px'>
                                                        <div ref={horizonScroll} className='flex w-full h-full relative py-4px overflow-y-hidden memo-custom-vertical-scroll'>
                                                            {
                                                                val.tags.map((val, idx) => {
                                                                    return (
                                                                        <div key={idx} className='flex items-center px-9px py-1px mr-4px rounded-[4px] bg-black bg-opacity-10 cursor-default'>
                                                                            <span className='font-light text-11 text-zete-dark-400 whitespace-nowrap'>
                                                                                {val.tagName}
                                                                            </span>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                            <div className='absolute bottom-16px right-21px '>
                                                <SavedMemoMenuPopov memoId={val.memoId}/>
                                            </div>
                                        </div>
                                        <button
                                            type='button'
                                            className='absolute top-18px right-20px'
                                            onClick={() => {
                                                importantModifier(val.memoId);
                                            }}
                                        >
                                            {val.important ? <FillStarIcon/> : <StarIcon/>}
                                        </button>
                                    </div>
                                )
                        })}
                    </Masonry>
                    <>
                        <MemoModifyModal memoId={currentMemoId}/>
                    </>
                </section>
            </CustomScroller>
        )
    )
}
