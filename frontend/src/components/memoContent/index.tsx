import {CheckIcon, CloseIcon, FillStarIcon, PlusIcon, SearchIcon, StarIcon, StickerMemoIcon} from "../vectors";
import React, {useEffect, useRef, useState} from "react";
import {useHandleQueryStr} from "../../hooks/useHandleQueryStr";
import {handleInputChange, handleResizeHeight, uniqueKey} from "../../utile";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {useHorizontalScroll} from "../../hooks/useHorizontalScroll";

export const AddMemo = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => {
    const memoTextarea = useRef<HTMLTextAreaElement>(null);
    const titleTextarea = useRef<HTMLTextAreaElement>(null);
    const tagsInput = useRef<HTMLInputElement>(null);
    const tagsRef = useRef([]);

    const { cateStr, tagStr, menuStr } = useHandleQueryStr();
    // const { tableData } = useSelector((state:RootState) => state.memo)

    const dispatch = useDispatch();
    const horizonScroll = useHorizontalScroll();

    const [memoValue, setMemoValue] = useState<string>('');
    const [titleValue, setTitleValue] = useState<string>('');
    const [tagValue, setTagValue] = useState<string>('');
    const [isImportant, setIsImportant] = useState<boolean>(false);
    const [tagNames, setTagNames] = useState<string[]>([]);
    const [selectedCateId, setSelectedCateId] = useState<number|'undefined'>('undefined');
    const [selectedCateName, setSelectedCateName] = useState<string>('');

    const memoAutoResize = (e) => {
        handleResizeHeight(memoTextarea);
        setMemoValue(e.currentTarget.value);
    }
    const titleAutoResize = (e) => {
        handleResizeHeight(titleTextarea);
        setTitleValue(e.currentTarget.value);
    }
    const tagsInputAutoResize = (e) => {
        setTagValue(e.currentTarget.value);
        handleInputChange(tagsInput);
    }


    const handleKeyDown = (e) => {
        if (e.shiftKey && e.key === 'Enter') {
            const startPos = e.target.selectionStart;
            const endPos = e.target.selectionEnd;
            const value = e.target.value;
            e.target.value = value.substring(0, startPos) + '\n' + value.substring(endPos, value.length);
            e.target.selectionStart = startPos + 1;
            e.target.selectionEnd = startPos + 1;
            e.preventDefault();
        } else if (e.key === 'Enter') {
            memoTextarea.current.focus();
            e.preventDefault();
        }
        handleResizeHeight(titleTextarea);
    }

    const importantHandler = () => setIsImportant(!isImportant);

    const addMemo = () => {
        if (!titleValue && !memoValue) {
            return alert('제목이나 내용을 입력해주세요.')
        }

        const content = memoValue.replace(/\n/g, '<br/>'); // innerHTML해주기 위함
        const categoryId = selectedCateId;
        
        const newData = {
            categoryId,
            important: isImportant,
            title: titleValue,
            content,
            tagNames, // 키와 키값이 같으므로 tags: tags, => tags,
        }

        // dispatch(ADD_MEMO(newData));
        // setData();
        setMemoValue('');
        setTitleValue('');

        memoTextarea.current.style.height = 'auto';
        titleTextarea.current.style.height = 'auto';
    }

    const addTags = (e: React.FormEvent<HTMLFormElement>) => {
        const validate = tagNames.filter(names => names === tagValue)
        e.preventDefault();
        setTagValue('');
        tagsInput.current.style.width = '50px';

        if (tagValue && validate.length === 0) {
            setTagNames(prev => [...prev, tagValue])
        }
    }

    const handleSelectChange = (event) => {
        if (event.target.value === '전체메모') {
            setSelectedCateName('전체메모');
            setSelectedCateId('undefined');
            return
        }
        // const selectedCate = tableData.categories.filter(cate => cate.cateName === event.target.value);
        // setSelectedCateId(selectedCate[0].cateId);
        // setSelectedCateName(selectedCate[0].cateName);
    }

    const deleteTag = (name) => {
        const filter = tagNames.filter(tagName => tagName !== name);
        setTagNames(filter)
    }

    useEffect(() => {
        if (tagStr) {
            tagsRef.current[0] = tagStr;
            setTagNames([tagStr])
        } // 첫번째 배열에 쿼리에 적힌 테그추가
        if (!tagStr) setTagNames([]);
    },[tagStr])

    useEffect(() => {
        let newSelectedCateId: number|'undefined' = 'undefined';
        let newSelectedCateName: string = '전체메모';

        if (menuStr) setIsImportant(true);
        else setIsImportant(false);

        if (cateStr) {
            // const defaultSelectedCate = tableData.categories.filter(cate => cate.cateName === cateStr)[0];
            // if (defaultSelectedCate) {
            //     newSelectedCateId = defaultSelectedCate.cateId;
            //     newSelectedCateName = defaultSelectedCate.cateName;
            // }
        }

        if ((!cateStr && !menuStr) || menuStr) {
            newSelectedCateId = 'undefined';
            newSelectedCateName = '전체메모';
        }

        setSelectedCateName(newSelectedCateName);
        setSelectedCateId(newSelectedCateId);
    },[cateStr, menuStr])

    return (
        <article
            {...props}
            className='relative min-w-0 w-full browser-width-900px:w-[300px] flex flex-col justify-between
            border border-zete-light-gray-500 rounded-[8px] px-18px pb-10px pt-12px min-h-[212px] h-fit bg-zete-primary-200 memo-shadow'
        >
            <div className='w-full h-full flex flex-col min-h-[212px]'>
                <div className='w-full h-full'>
                    <div className='flex justify-between items-center pb-8px border-b border-zete-memo-border h-full'>
                    <textarea
                        ref={titleTextarea}
                        rows={1}
                        value={titleValue}
                        onChange={titleAutoResize}
                        onKeyDown={handleKeyDown}
                        placeholder='제목'
                        className='resize-none w-full pr-6px max-h-[80px] bg-transparent text-zete-gray-500 placeholder:text-zete-gray-500 font-light placeholder:text-15 memo-custom-scroll'
                    />
                        {
                            menuStr ? <FillStarIcon/> :
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
                <div className='w-full h-full'>
                    <div ref={horizonScroll} className='flex w-full h-full relative border-b border-zete-memo-border pb-8px overflow-y-hidden memo-custom-vertical-scroll'>
                        {
                            tagNames.map((name, idx) => {
                                return name === tagStr ? (
                                    <div key={uniqueKey() + idx} className='relative flex items-center px-9px py-1px mr-4px rounded-[4px] bg-black bg-opacity-10 cursor-default'>
                                        <span className='font-light text-11 text-zete-dark-400 whitespace-nowrap'>
                                            {name}
                                        </span>
                                    </div>
                                    ) : (
                                    <div key={idx} className='relative flex items-center pl-9px pr-21px py-1px mr-4px rounded-[4px] bg-black bg-opacity-10 cursor-default'>
                                        <span className='font-light text-11 text-zete-dark-400 whitespace-nowrap'>
                                            {name}
                                        </span>
                                        <button
                                            className='absolute right-2px group rounded-full grid place-content-center hover:bg-zete-dark-300 hover:bg-opacity-50 w-14px h-14px'
                                            onClick={() => deleteTag(name)}
                                        >
                                            <CloseIcon className='w-10px fill-zete-dark-400 group-hover:fill-white'/>
                                        </button>
                                    </div>
                                )
                            })
                        }
                        <div className='h-full w-full text-zete-dark-400'>
                            <select
                                value={selectedCateName}
                                onChange={handleSelectChange}
                            >
                                <option>전체메모</option>
                                {
                                    // tableData.categories.map((cate, idx) => {
                                    //     return (
                                    //         <option key={uniqueKey() + idx}>
                                    //             {cate.cateName}
                                    //         </option>
                                    //     )
                                    // })
                                }
                            </select>
                            <form
                                className='relative flex items-center text-zete-dark-400 text-12'
                                onSubmit={addTags}
                            >
                                <input
                                    ref={tagsInput}
                                    value={tagValue}
                                    onChange={tagsInputAutoResize}
                                    placeholder='태그추가'
                                    className='min-w-[50px] w-50px px-2px placeholder:text-zete-placeHolder bg-transparent whitespace-nowrap'
                                />
                                <button type='submit' className='relative w-14px h-14px grid place-content-center'>
                                    <PlusIcon svgClassName='w-9px' strokeClassName='fill-black'/>
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className='flex justify-between items-center pt-10px'>
                        <div className='flex gap-10px items-center'>
                            <div className='bg-zete-primary-300 p-5px rounded-[4px]'>
                                <StickerMemoIcon className='cursor-pointer'/>
                            </div>
                            <CheckIcon className='cursor-pointer'/>
                            <SearchIcon className='cursor-pointer' onClick={() => {
                                console.log(tagNames)
                                console.log()
                            }}/>
                        </div>
                        <div onClick={addMemo}>
                            <PlusIcon svgClassName='cursor-pointer'/>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}