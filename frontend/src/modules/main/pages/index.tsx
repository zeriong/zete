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
import {ApiLib} from "../../../common/libs/api.lib";
import {
    ADD_MEMO,
    CHANGE_IMPORTANT,
    RESET_MEMOS,
    SET_DATA,
    SET_IMPORTANT_LENGTH,
    SET_MEMO
} from "../../../store/slices/memo.slice";

export const MemoMain = () => {
    const divObsRef = useRef(null);
    const loadEndRef = useRef(false); // 모든 데이터로드시 true
    const preventRef = useRef(true); // obs 중복방지
    const limit = useRef<number>(5);
    const offset = useRef<number>(0);
    const obsRef = useRef<IntersectionObserver>(null);

    const [masonryCols,setMasonryCols] = useState<{}>({})
    const [currentMemoId,setCurrentMemoId] = useState<number>(0);
    const [isReset,setIsReset] = useState<boolean>(false);
    const [retryObs,setRetryObs] = useState<boolean>(false);

    const { loading } = useSelector((state: RootState) => (state.user));
    const { data } = useSelector((state: RootState) => state.memo);
    const { menuStr, cateStr, tagStr, searchParams, setSearchParams } = useHandleQueryStr();

    const horizonScroll = useHorizontalScroll();
    const dispatch = useDispatch();

    useEffect(()=> { //옵저버 생성
        console.log('옵저버!!')
        obsRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !loadEndRef.current && preventRef.current) {
                console.log('옵저버 핸들러실행')
                preventRef.current = false;
                getMemo();
            }
        }, { threshold : 0.2 });
        if(divObsRef.current) obsRef.current.observe(divObsRef.current);
        return () => { obsRef.current.disconnect(); }
    }, [retryObs])

    const handleLoadMore = () => offset.current += limit.current;

    useEffect(() => {
        obsRef.current.disconnect();

        if (!isReset) {
            console.log('url 변경')
            dispatch(RESET_MEMOS());
            offset.current = 0;
            setIsReset(true);
            loadEndRef.current = false;
        }
    },[searchParams])

    useEffect(() => {
        if (isReset) {
            console.log('리셋!')
            preventRef.current = true;
            setRetryObs(!retryObs);
            setIsReset(false);
        }
    },[isReset])

    const getMemo = () => {
        (async () => {
            await ApiLib().memo.scrollPagination({
                offset: offset.current,
                limit: limit.current,
                cateStr,
                tagStr,
                menuStr,
            })
                .then((res) => {
                    if (res.data.success) {
                        if (res.data.memos.length < limit.current) {
                            loadEndRef.current = true;
                        }
                        handleLoadMore();
                            console.log(res.data.memos,'데이터 들어왔다~~~~~~~~~~~~~~~~~~~')
                            if (res.data.memos.length === limit.current) {
                                setRetryObs(!retryObs);
                            }
                            preventRef.current = true;
                            const setMemoType = res.data.memos.map((memos) => ({
                                ...memos,
                                important: memos.important,
                                updateAt: new Date(memos.updateAt).valueOf(),
                            }));

                            dispatch(SET_MEMO(setMemoType));
                    } else {
                        console.log(res.data.error)
                    }
                })
                .catch(e => console.log(e))
        })()
    }

    const memoModifier = (memoId) => {
        setCurrentMemoId(memoId)
        searchParams.set('modal', 'memoModify');
        setSearchParams(searchParams);
    }

    const importantModifier = (memoId:number) => {
        console.log(memoId)
        ApiLib().memo.changeImportant({memoId})
            .then((res) => {
                if (res.data.success) {
                    const importantMemoLength = Number(res.data.importantMemoLength);
                    console.log(res.data.importantMemoLength)
                    dispatch(SET_IMPORTANT_LENGTH(importantMemoLength));

                    const changedList = data.memos.map(memo => {
                        if (memo.memoId === memoId) return {...memo, important: memo.important !== true};
                        return memo;
                    })

                    dispatch(CHANGE_IMPORTANT(changedList));
                } else { console.log(res.data.error) }
            })
    };

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
                        handleLoadMore()
                        getMemo();
                        console.log(offset)
                    }}
                >
                    test
                </div>
                <CustomScroller>
                    <section className='relative top-0 flex gap-28px w-full p-16px browser-width-900px:p-30px'>
                        <div className='absolute left-30px top-30px mb-16px browser-width-900px:mb-30px z-20'>
                            <AddMemo/>
                        </div>
                        <Masonry
                            key={subUniqueKey()}
                            breakpointCols={masonryCols}
                            className='my-masonry-grid flex gap-x-16px browser-width-900px:gap-x-30px w-full browser-width-900px:w-auto'
                            columnClassName='my-masonry-grid_column'
                        >
                            <div className='mb-16px browser-width-900px:mb-30px browser-width-900px:w-[300px] min-h-[234px]'/>
                            {data.memos &&
                                data.memos?.map((val) => {
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
                                                    <SavedMemoMenuPopover memoId={val.memoId}/>
                                                </div>
                                            </div>
                                            <button
                                                type='button'
                                                className='absolute top-18px right-20px'
                                                onClick={() => { importantModifier(val.memoId); }}
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
                    <div className='relative w-full h-1px bg-blue-500'>
                        <div ref={divObsRef} className='absolute left-0 bottom-0 w-1px h-[500px] bg-red-500'/>
                    </div>
                </CustomScroller>
            </>
        )
    )
}
