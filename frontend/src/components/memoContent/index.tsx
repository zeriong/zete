import {CheckIcon, PlusIcon, SearchIcon, StarIcon, StickerMemoIcon, ThreeDotMenuIcon} from "../vectors";
import React, {useRef, useState} from "react";
import {useGetQueryStr} from "../../hooks/useGetQueryStr";
import {handleResizeHeight} from "../../utile";

export const AddMemo = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => {
    const queryStr = useGetQueryStr();

    const [memoValue, setMemoValue] = useState('');
    const [titleValue, setTitleValue] = useState('');

    const memoTextarea = useRef<HTMLTextAreaElement>(null);
    const titleTextarea = useRef<HTMLTextAreaElement>(null);

    const memoAutoResize = (e) => {
        handleResizeHeight(memoTextarea);
        setMemoValue(e.currentTarget.value);
    }
    const titleAutoResize = (e) => {
        handleResizeHeight(titleTextarea);
        setTitleValue(e.currentTarget.value);
    }

    const test = () => {
        console.log('test')
    }

    return (
        <article {...props} className='relative min-w-0 w-full browser-width-900px:min-w-[300px] flex flex-col justify-between border border-zete-light-gray-500 rounded-[8px] px-18px pb-10px pt-12px min-h-[212px] h-fit bg-zete-primary-200'>
            <div>
                <div className='flex justify-between pb-8px border-b border-zete-memo-border'>
                            <textarea
                                ref={titleTextarea}
                                rows={1}
                                value={titleValue}
                                onChange={titleAutoResize}
                                placeholder='제목'
                                className='resize-none w-full pr-6px max-h-[80px] bg-transparent text-zete-gray-500 placeholder:text-zete-gray-500 font-light placeholder:text-15'
                            />
                    <StarIcon className=''/>
                </div>
                <div className='h-full pt-9px'>
                            <textarea
                                ref={memoTextarea}
                                rows={1}
                                value={memoValue}
                                onChange={memoAutoResize}
                                placeholder='메모 작성...'
                                className='resize-none max-h-[300px] w-full bg-transparent text-zete-gray-500 placeholder:text-zete-gray-500 font-light placeholder:text-15'
                            />
                </div>
            </div>
            <div>
                <div className='flex w-full border-b border-zete-memo-border pb-8px'>
                    {
                        (queryStr === 'important') ? '' :
                            queryStr === null ? '' :
                                <div className='flex items-center px-9px py-1px rounded-[4px] bg-black bg-opacity-10 cursor-default'>
                                            <span className='font-light text-11 text-zete-dark-400'>
                                                {queryStr}
                                            </span>
                                </div>
                    }
                </div>
                <div className='flex justify-between items-center pt-10px'>
                    <div className='flex gap-10px items-center'>
                        <div className='bg-zete-primary-300 p-5px rounded-[4px]'>
                            <StickerMemoIcon className='cursor-pointer'/>
                        </div>
                        <CheckIcon className='cursor-pointer'/>
                        <SearchIcon className='cursor-pointer'/>
                    </div>
                    <div onClick={test}>
                        <PlusIcon className='cursor-pointer'/>
                    </div>
                </div>
            </div>
        </article>
    )
}

export const SavedMemo = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => {
    return (
        <article {...props} className='relative min-w-0 w-full browser-width-900px:min-w-[300px] flex flex-col justify-between border border-zete-light-gray-500 rounded-[8px] p-20px min-h-[212px] h-fit bg-zete-primary-200'>
            <div>
                <div className='w-full flex justify-between mb-20px'>
                    <h1 className='text-zete-gray-500 font-light'>
                        테스트메모 123123
                    </h1>
                    <StarIcon/>
                </div>
                <h2 className='text-start text-zete-gray-500 font-light'>
                    테스트메모 2134234234234<br/>
                    2342333333333333333333333333<br/>
                    33333333333333333<br/>
                    234<br/>
                    234<br/>
                    234<br/>
                    234<br/>
                    234<br/>
                    234<br/>
                    234<br/>
                    234<br/>
                    1111111111111111111111<br/>
                </h2>
                <div className='flex items-center pt-20px'>
                    <div className='flex w-full gap-8px overflow-x-auto'>
                        <div className='flex items-center px-9px py-1px rounded-[4px] bg-black bg-opacity-10 cursor-default'>
                                    <span className='font-light text-11 text-zete-dark-400'>
                                        React
                                    </span>
                        </div>
                        <div className='flex items-center px-9px py-1px rounded-[4px] bg-black bg-opacity-10 cursor-default'>
                                    <span className='font-light text-11 text-zete-dark-400'>
                                        Nodejs
                                    </span>
                        </div>
                    </div>
                    <div className='pl-2px'>
                        <ThreeDotMenuIcon/>
                    </div>
                </div>
            </div>
        </article>
    )
}