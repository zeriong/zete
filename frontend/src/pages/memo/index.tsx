import React, {memo, useEffect, useState} from "react";
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

export const MemoMain = () => {
    const [masonryCols,setMasonryCols] = useState({})
    const [existCate,setExistCate] = useState(false);

    const { loading } = useSelector((state: RootState) => (state.user));
    const { data, tableArr } = useSelector((state: RootState) => (state.memo));
    const { cateStr, tagStr } = useHandleQueryStr();

    const dispatch = useDispatch();

    const convertCols = (n:number) => {
        if (!data || !data['memos']) return
        if (cateStr === 'important' || !cateStr ) {
            if (n > data['memos'].length) return data['memos'].length;
            else return n;
        } else if ( cateStr ) {
            if (n > data['memos'].length+1) return data['memos'].length+1;
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
    },[data])

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
                        {data['memos'] &&
                            data['memos']?.map((val) => {
                                let cleanContent = DOMPurify.sanitize(val.content);
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
                                                    <div className='flex w-full gap-8px overflow-x-auto'>
                                                        {val.tags.map((val, idx) => {
                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    className='flex items-center px-9px py-1px rounded-[4px] bg-black bg-opacity-10 cursor-default'
                                                                >
                                                                <span className='font-light text-11 text-zete-dark-400'>
                                                                    {val}
                                                                </span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
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
