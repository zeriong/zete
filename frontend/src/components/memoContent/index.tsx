import {CheckIcon, FillStarIcon, PlusIcon, SearchIcon, StarIcon, StickerMemoIcon, ThreeDotMenuIcon} from "../vectors";
import React, {useEffect, useRef, useState} from "react";
import {useGetQueryStr} from "../../hooks/useGetQueryStr";
import {handleResizeHeight} from "../../utile";
import {useDispatch} from "react-redux";
import {SET_MEMO} from "../../store/slices/memo.slice";

export const AddMemo = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => {
    const memoTextarea = useRef<HTMLTextAreaElement>(null);
    const titleTextarea = useRef<HTMLTextAreaElement>(null);
    const tagsRef = useRef([]);

    const { cateStr, tagStr } = useGetQueryStr();
    const dispatch = useDispatch();

    const [memoValue, setMemoValue] = useState('');
    const [titleValue, setTitleValue] = useState('');
    const [isImportant, setIsImportant] = useState(false);

    const memoAutoResize = (e) => {
        handleResizeHeight(memoTextarea);
        setMemoValue(e.currentTarget.value);
    }
    const titleAutoResize = (e) => {
        handleResizeHeight(titleTextarea);
        setTitleValue(e.currentTarget.value);
    }
    const importantHandler = () => setIsImportant(!isImportant);

    const addMemo = () => {
        const content = memoValue.replace(/\n/g, '<br/>'); // innerHTML해주기 위함
        const tags = tagsRef.current.filter((item)=> item !== null); // 태그가 없는경우 null item제거
        const date = new Date()

        const newData = {
            id: Number(Date.now() +
                String(date.getDate()) +
                String(date.getMonth())),
            important: isImportant,
            title: titleValue,
            content,
            tags, // 키와 키값이 같으므로 tags: tags, => tags,
            cate: cateStr,
        }


        dispatch(SET_MEMO({
            cateStr,
            newData,
        }));

        setMemoValue('');
        setTitleValue('');
        memoTextarea.current.style.height = 'auto';
        titleTextarea.current.style.height = 'auto';
    }

    useEffect(() => {
        if (cateStr === 'important') setIsImportant(true);
        else setIsImportant(false);

        if (tagStr) tagsRef.current[0] = tagStr; // 첫번째 배열에 쿼리에 적힌 테그추가
    },[cateStr, tagStr])

    return (
        <article {...props} className='relative min-w-0 w-full browser-width-900px:min-w-[300px] flex flex-col justify-between border border-zete-light-gray-500 rounded-[8px] px-18px pb-10px pt-12px min-h-[212px] h-fit bg-zete-primary-200'>
            <div className='w-full h-full'>
                <div className='flex justify-between items-center pb-8px border-b border-zete-memo-border h-full'>
                    <textarea
                        ref={titleTextarea}
                        rows={1}
                        value={titleValue}
                        onChange={titleAutoResize}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                memoTextarea.current.focus();
                            }
                        }}
                        placeholder='제목'
                        className='resize-none w-full pr-6px max-h-[80px] bg-transparent text-zete-gray-500 placeholder:text-zete-gray-500 font-light placeholder:text-15'
                    />
                    {
                        cateStr === 'important' ? <FillStarIcon/> :
                            isImportant ? (
                                <FillStarIcon onClick={importantHandler}/>
                            ) : (
                                <StarIcon onClick={importantHandler}/>
                            )
                    }
                </div>
                <div className='h-full w-full pt-9px'>
                    <textarea
                        id='memo'
                        ref={memoTextarea}
                        rows={1}
                        value={memoValue}
                        onInput={memoAutoResize}
                        placeholder='메모 작성...'
                        className='resize-none max-h-[300px] w-full bg-transparent text-zete-gray-500 placeholder:text-zete-gray-500 font-light placeholder:text-15 memo-custom-scroll'
                    />
                </div>
            </div>
            <label htmlFor='memo' className='w-full h-full grow'/>
            <div>
                <div className='flex w-full border-b border-zete-memo-border pb-8px'>
                    {
                        (cateStr === 'important') ? '' :
                            cateStr === null ? '' :
                                !tagStr ? '' :
                                    <div className='flex items-center px-9px py-1px rounded-[4px] bg-black bg-opacity-10 cursor-default'>
                                        <span className='font-light text-11 text-zete-dark-400'>
                                            {tagStr}
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
                        <SearchIcon className='cursor-pointer' onClick={() => console.log(memoValue)}/>
                    </div>
                    <div onClick={addMemo}>
                        <PlusIcon className='cursor-pointer'/>
                    </div>
                </div>
            </div>
        </article>
    )
}