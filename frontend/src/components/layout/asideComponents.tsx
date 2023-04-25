import {Link} from "react-router-dom";
import {AllIcon, CategoryIcon, StarIcon, TagIcon} from "../vectors";
import React, {useEffect, useMemo, useState} from "react";
import {useHandleQueryStr} from "../../hooks/useHandleQueryStr";
import {Category, Data, TableData} from "../../store/slices/constants";
import {match} from "assert";


interface SetCateProps {
    matchData?: Data[];
    tableData?: TableData;
    data?: Data[];
    cate?: Category;
}

export const MainMemoList: React.FC<SetCateProps> = (props: SetCateProps) => {
    const { tableData } = props;
    const { cateStr, menuStr } = useHandleQueryStr()

    const [selected, setSelected] = useState(1);

    useEffect(() => {
        if (!cateStr && !menuStr) return setSelected(1);
        if (menuStr) {
            return setSelected(2);
        } else { return setSelected(0); }
    },[cateStr, menuStr])

    return (
        <div className="flex flex-col font-bold gap-4px">
            {
                tableData &&
                <>
                    <Link
                        to={{pathname: '/memo'}}
                        className={`flex justify-between items-center hover:bg-zete-light-gray-200 rounded-[5px] p-10px group
                         ${selected === 1 && 'bg-zete-light-gray-200'}`}
                    >
                        <div className='flex justify-start items-center w-full font-light transition-all duration-150'>
                            <>
                                <AllIcon className='mr-14px w-20px'/>
                            </>
                            <span>전체메모</span>
                        </div>
                        <div
                            className={`rounded-full text-zete-dark-100 py-2px px-8px text-12 group-hover:bg-white font-medium
                            ${selected === 1 ? 'bg-white' : 'bg-zete-light-gray-300'}`}
                        >
                            <span className='relative bottom-1px'>
                                {tableData.memos.length}
                            </span>
                        </div>
                    </Link>
                    <Link
                        to={{ pathname: '/memo', search: 'menu=important' }}
                        type="button"
                        className={`flex justify-between items-center hover:bg-zete-light-gray-200 rounded-[5px] p-10px group
                        ${selected === 2 && 'bg-zete-light-gray-200'}`}
                    >
                        <div className='flex justify-start items-center w-full font-light transition-all duration-150'>
                            <>
                                <StarIcon className='mr-14px w-20px'/>
                            </>
                            <span>중요메모</span>
                        </div>
                        <div
                            className={`rounded-full text-zete-dark-100 py-2px px-8px text-12 group-hover:bg-white font-medium
                            ${selected === 2 ? 'bg-white' : 'bg-zete-light-gray-300'}`}
                        >
                            <span className='relative bottom-1px'>
                                {tableData.memos.filter(memo => memo.important === true).length}
                            </span>
                        </div>
                    </Link>
                </>
            }
        </div>
    )
}

export const CategoryList: React.FC<SetCateProps> = (props: SetCateProps) => {
    const { matchData, cate, tableData } = props;
    const { setSearchParams, tagStr, cateStr } = useHandleQueryStr();

    const [isOpen, setIsOpen] = useState(false);

    const tagParamsHandler = (tagName: string) => {
        setSearchParams((prev) => {
            prev.set('tag', tagName);
            return prev;
        });
    }

    const currentTags = useMemo(() => {
        const findTags = tableData.tags
            .filter(tags => tags.cateId === cate.cateId)
            .map(tags => tags.tagName);
        const setTags = new Set(...findTags);

        return Array.from(setTags)
    },[matchData])

    useEffect(() => {
        if (cateStr === cate.cateName) {
            setIsOpen(true);
        } else { setIsOpen(false) }
    },[cateStr])

    console.log('호ㅇ오오오오잇',currentTags)

    return (
        <div
            className={`font-bold group rounded-[5px] hover:bg-zete-light-gray-200
                    ${isOpen ? 'bg-zete-light-gray-200' : 'bg-white'}`}
        >
            <div className='flex flex-col justify-center'>
                <button
                    type='button'
                    className='flex w-full justify-between items-center p-10px hover:bg-zete-light-gray-200 rounded-[5px]'
                    onClick={() => setSearchParams({ cate: cate.cateName })}
                >
                    <div className='flex justify-start items-center w-full font-light transition-all duration-150'>
                        <>
                            <CategoryIcon className='mr-10px'/>
                        </>
                        <span>
                            {cate.cateName}
                        </span>
                    </div>
                    <div
                        className={`rounded-full text-zete-dark-100 py-2px px-8px text-12 font-medium
                        ${isOpen ? 'bg-white' : 'group-hover:bg-white bg-zete-light-gray-300'}`}
                    >
                        <span className='relative bottom-1px'>
                            {tableData.memos.filter(memos => memos.cateId === cate.cateId).length}
                        </span>
                    </div>
                </button>
                <div className={`${isOpen ? 'px-12px pb-12px' : 'p-0'}`}>
                    {
                        currentTags && (
                            (currentTags.length !== 0) ? (
                                currentTags.map((tagName, idx) => {
                                    return (
                                        <div
                                            key={idx}
                                            className={`overflow-hidden font-light text-13 transition-all duration-300 
                                            ${isOpen ? 'max-h-[200px] mt-6px' : 'h-[0vh] p-0 m-0'}`}
                                        >
                                            <button
                                                type='button'
                                                className={`flex w-full h-fit py-8px pl-16px rounded-[5px] mb-1px hover:bg-zete-light-gray-500
                                                ${tagStr === tagName && 'bg-zete-light-gray-500'}`}
                                                onClick={() => tagParamsHandler(tagName)}
                                            >
                                                <>
                                                    <TagIcon svgClassName='w-14px mr-8px' strokeClassName='fill-zete-dark-200'/>
                                                </>
                                                <span>
                                                    {tagName}
                                                </span>
                                            </button>
                                        </div>
                                    )
                                })
                            ) : (
                                <button
                                    className={`flex overflow-hidden items-center font-light text-13 transition-all duration-300 cursor-default 
                                    ${isOpen ? 'max-h-[200px] px-12px' : 'h-[0vh] p-0'}`}
                                >
                                    <div className='flex w-full h-fit py-8px justify-center rounded-[5px] mb-1px'>
                                        <>
                                            <TagIcon svgClassName='w-14px mr-8px' strokeClassName='fill-zete-dark-100'/>
                                        </>
                                        <span className='font-normal text-zete-scroll-gray'>
                                            메모에 태그를 추가해주세요
                                        </span>
                                    </div>
                                </button>
                            )
                        )
                    }
                </div>
            </div>
        </div>
    )
}