import {CategoryIcon, CloseIcon, DeleteIcon, FillStarIcon, PlusIcon, StarIcon} from "../../../assets/vectors";
import React, {useEffect, useRef, useState} from "react";
import {useHandleQueryStr} from "../../../hooks/useHandleQueryStr";
import {handleTagInput, handleResizeHeight, handleAddTagSubmit} from "../../../common/libs";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {useHorizontalScroll} from "../../../hooks/useHorizontalScroll";
import {Api} from "../../../api";
import {useForm} from "react-hook-form";
import {showAlert} from "../../../store/slices/alert.slice";
import {CreateMemoInput, Memo} from "../../../openapi/generated";
import {ADD_MEMO} from "../../../store/slices/memo.slice";
import {deleteMemo, handleUpdateOrAddMemo} from "../../../api/content";

export const AddMemo = () => {
    const contentTextarea = useRef<HTMLTextAreaElement>(null);
    const titleTextarea = useRef<HTMLTextAreaElement>(null);
    const tagsInput = useRef<HTMLInputElement>(null);
    const memoRef = useRef<HTMLElement>(null);
    const gptBtnRef = useRef<HTMLButtonElement>(null);
    const gptAreaRef = useRef<HTMLElement>(null);
    const gptTextareaRef = useRef<HTMLTextAreaElement>(null);
    const typingTimout = useRef<NodeJS.Timeout>(null);

    const { cateQueryStr, tagQueryStr, searchParams } = useHandleQueryStr();
    const { cate } = useSelector((state: RootState) => state.memo.data);

    const horizonScroll = useHorizontalScroll();

    const [isImportant, setIsImportant] = useState<boolean>(false);
    const [readyToMemo, setReadyToMemo] = useState<boolean | number>(0);
    const [openGPT, setOpenGPT] = useState(false);
    const [gptTextInput, setGptTextInput] = useState('');
    const [temporarySaveMemo, setTemporarySaveMemo] = useState<Memo>();
    const [isDone, setIsDone] = useState(false);
    const [memoId, setMemoId] = useState(0);

    const form = useForm<CreateMemoInput>({ mode: 'onBlur' });

    const { ref: titleRef, ...titleReg } = form.register('title', {
        required: false,
        maxLength: 64,
        onChange: () => {
            handleResizeHeight(titleTextarea)
            handleOnChangeUpdate();
        },
    });
    const { ref: contentRef, ...contentReg} = form.register('content', {
        required: false,
        maxLength: 65535,
        onChange: () => {
            handleOnChangeUpdate();
            handleResizeHeight(contentTextarea);
        },
    });

    const resetAddMemoForm = () => {
        form.reset({ title: '', content: '', cateId: Number(cateQueryStr) || 0, tags: [] });
        contentTextarea.current.style.height = 'auto';
        titleTextarea.current.style.height = 'auto';
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
            contentTextarea.current.focus();
            e.preventDefault();
        }
        handleResizeHeight(titleTextarea);
    }

    // 업데이트 핸들러
    const handleUpdate = () => {
        handleUpdateOrAddMemo({
            getTitle: form.getValues('title'),
            getContent: form.getValues('content'),
            getNewTags: form.getValues('tags'),
            getCateId: form.getValues('cateId'),
            memoId,
            autoReq: false,
            reqType: 'create',
            typingTimeout: typingTimout,
            isImportant,
            isDone,
            setIsDone,
            temporarySaveMemo,
            setTemporarySaveMemo,
        });
    };

    // 타이핑 자동 업데이트 핸들러
    const autoUpdateRequest = () => {
        handleUpdateOrAddMemo({
            getTitle: form.getValues('title'),
            getContent: form.getValues('content'),
            getNewTags: form.getValues('tags'),
            memoId,
            setMemoId,
            getCateId: form.getValues('cateId'),
            autoReq: true,
            reqType: 'create',
            typingTimeout: typingTimout,
            isImportant,
            isDone,
            setIsDone,
            temporarySaveMemo,
            setTemporarySaveMemo,
        });
    };

    const handleImportant = () => {
        handleOnChangeUpdate();
        setIsImportant(!isImportant);
    }

    const handleOnChangeUpdate = () => {
        if (typingTimout.current != null) {
            clearTimeout(typingTimout.current);
            typingTimout.current = null;
        }
        if (typingTimout.current === null) {
            typingTimout.current = setTimeout(() => autoUpdateRequest(), 3000);
        }
    };

    const handleDeleteTag = (tagName) => {
        const tags = form.getValues('tags');
        if (tags) form.setValue('tags', tags.filter(tag => tag.tagName !== tagName));
    }

    const handleGptTextarea = (e) => {
        handleResizeHeight(gptTextareaRef);
        setGptTextInput(e.target.value);
    }

    const handleGptSubmit = (e) => {
        if (e.shiftKey && e.key === 'Enter') {
            handleResizeHeight(gptTextareaRef);
        }
        else if (e.key === 'Enter') {
            if (e.target.value === '') showAlert('GPT: 대화내용을 입력해주세요')
            console.log('서브밋~');
            setGptTextInput('')
            gptTextareaRef.current.style.height = 'auto';
            e.preventDefault();
        }
    }

    const HandleMemoCancel = () => {
        resetAddMemoForm();
        if (memoId === 0) return;
        else {
            deleteMemo(memoId, 'create');
            setMemoId(0);
        }
    }

    useEffect(() => {
        form.setValue('cateId', cateQueryStr ? Number(cateQueryStr) : 0);
        form.setValue('tags', tagQueryStr ? [ { tagName: tagQueryStr } ] : []);
    },[searchParams]);

    useEffect(() => {
        const handleOutside = (e) => {
            if (memoRef.current && memoRef.current.contains(e.target)) {
                setReadyToMemo(true);
            }
            else if (gptBtnRef.current === e.target || gptAreaRef.current.contains(e.target)) return;
            else {
                setReadyToMemo(false);
                setOpenGPT(false);
            }
        }

        document.addEventListener('mousedown', handleOutside);

        return () => document.removeEventListener('mousedown', handleOutside);
    },[]);

    useEffect(() => {
        if (readyToMemo === false) {
            handleUpdate();
            setIsImportant(false);
            resetAddMemoForm();
        }
    }, [readyToMemo]);

    const GptBtn = (props: { className?: string }) => {
        return (
            <button
                ref={gptBtnRef}
                type='button'
                onClick={() => setOpenGPT(!openGPT)}
                className={`text-12 rounded-[8px] font-normal text-white border-2 border-zete-gpt-200
                        py-4px px-8px ${openGPT ? 'bg-zete-gpt-100' : 'bg-zete-gpt-500'} ${props.className}`}
            >
                GPT Action
            </button>
        )
    }

    return (
        <div className='relative w-full browser-width-900px:w-[500px]'>
            <div className='relative min-w-0 h-fit'>
                <article
                    ref={memoRef}
                    className={`relative flex flex-col justify-between transition-all duration-300 px-18px pb-10px pt-12px memo-shadow
                    ${openGPT ? 'rounded-t-[8px] bg-white border-t-[10px] border-x-[10px] border-zete-gpt-100' : 'border border-zete-light-gray-500 rounded-[8px] bg-zete-primary-200'}`}
                >
                    <div className='relative w-full h-full flex flex-col'>
                        <div className='flex flex-col w-full h-full'>
                            <div
                                className={`flex justify-between items-center pb-0 overflow-hidden h-0
                                    ${readyToMemo && 'h-full pb-8px'}`}
                            >
                                <textarea
                                    ref={(e) => {
                                        titleRef(e);
                                        titleTextarea.current = e;
                                    }}
                                    {...titleReg}
                                    onKeyDown={handleKeyDown}
                                    rows={1}
                                    placeholder='제목'
                                    className='resize-none w-full pr-6px max-h-[80px] bg-transparent text-zete-gray-500 placeholder:text-zete-gray-500 font-light placeholder:text-15 memo-custom-scroll'
                                />
                                <button type='button' onClick={handleImportant}>
                                    {isImportant ? <FillStarIcon/> : <StarIcon/>}
                                </button>
                            </div>
                            <textarea
                                ref={(e) => {
                                    contentRef(e);
                                    contentTextarea.current = e;
                                }}
                                {...contentReg}
                                rows={1}
                                placeholder='메모 작성...'
                                className={`${readyToMemo ? 'pt-9px' : 'pt-0'} resize-none max-h-[300px] w-full bg-transparent text-zete-gray-500 placeholder:text-zete-gray-500 font-light placeholder:text-15 memo-custom-scroll`}
                            />
                        </div>
                        {readyToMemo === true &&
                            <div className='w-full h-full'>
                                <div onClick={() => contentTextarea.current.focus()} className='h-20px w-full'/>
                                <div ref={horizonScroll} className='flex w-full h-full relative pb-8px overflow-y-hidden memo-custom-vertical-scroll'>
                                    {form.watch('tags')?.map((tag, idx) => (
                                        <div key={idx} className='relative flex items-center pl-9px pr-21px py-1px mr-4px rounded-[4px] bg-black bg-opacity-10 cursor-default'>
                                            <span className='font-light text-11 text-zete-dark-400 whitespace-nowrap'>
                                                {tag.tagName}
                                            </span>
                                            <button
                                                className='absolute right-2px group rounded-full grid place-content-center hover:bg-zete-dark-300 hover:bg-opacity-50 w-14px h-14px'
                                                onClick={() => handleDeleteTag(tag.tagName)}
                                            >
                                                <CloseIcon className='w-10px fill-zete-dark-400 group-hover:fill-white'/>
                                            </button>
                                        </div>
                                    ))}
                                    <form
                                        className='relative flex items-center text-zete-dark-400 text-12'
                                        onSubmit={(e) => handleAddTagSubmit(e, form.getValues, form.setValue, 'tags')}
                                    >
                                        <input
                                            ref={tagsInput}
                                            onChange={() => handleTagInput(tagsInput)}
                                            placeholder='태그추가'
                                            className='min-w-[50px] w-50px px-2px placeholder:text-zete-placeHolder bg-transparent whitespace-nowrap'
                                        />
                                        <button type='submit' className='relative w-14px h-14px grid place-content-center'>
                                            <PlusIcon svgClassName='w-9px' strokeClassName='fill-black'/>
                                        </button>
                                    </form>
                                </div>
                                <div className='relative flex justify-between items-center pt-10px'>
                                    <div className='flex items-center'>
                                        <div className='flex items-center border border-zete-memo-border rounded-md px-2 py-1'>
                                            <CategoryIcon className='w-18px opacity-75 mr-0.5'/>
                                            <select
                                                {...form.register('cateId', { required: true })}
                                                className='w-[130px] text-[13px] text-gray-500 bg-transparent'
                                            >
                                                <option value={0}>전체메모</option>
                                                {cate.map((cate, idx) => (
                                                    <option key={idx} value={cate.id}>
                                                        {cate.cateName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <>
                                            <GptBtn className='ml-20px'/>
                                        </>
                                    </div>
                                    <button type='button' className='' onClick={HandleMemoCancel}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </article>
            </div>
            {!readyToMemo &&
                <GptBtn className={`absolute right-18px ${openGPT ? 'top-[calc(50%-10px)] -translate-[calc(50%-10px)]' : 'top-1/2 -translate-y-1/2'}`}/>
            }
            <article
                ref={gptAreaRef}
                className={`flex flex-col absolute transition-all duration-300 w-full bg-zete-gpt-100 h-0 rounded-b-[8px] overflow-hidden z-50 shadow-2xl
                ${openGPT && 'h-[400px] p-10px'}`}
            >
                <div className='flex flex-col relative w-full h-full'>
                    <h1 className='grow text-start text-zete-dark-500 pb-60px bg-white rounded-[8px] p-8px bg-opacity-80'>
                        쥐피티 떠드는 공간
                    </h1>
                    <div
                        className='flex items-center justify-between absolute bottom-10px p-8px bg-white shadow-1xl rounded-[12px] max-h-[88px] w-[calc(100%-20px)]
                        border border-zete-light-gray-500 left-1/2 -translate-x-1/2 shadow-2xl'
                    >
                        <textarea
                            ref={gptTextareaRef}
                            maxLength={3500}
                            onChange={handleGptTextarea}
                            onKeyDown={handleGptSubmit}
                            value={gptTextInput}
                            rows={1}
                            placeholder='GPT에게 물어보세요! ( Shift + Enter 줄바꿈 )'
                            className='resize-none bg-transparent overflow-auto placeholder:text-zete-gray-500 font-light placeholder:text-14
                            memo-custom-scroll w-full h-fit'
                        />
                        <button
                            type='button'
                            className='px-4px bg-zete-gpt-200 text-white ml-10px whitespace-nowrap h-fit text-15'
                        >
                            전송
                        </button>
                    </div>
                </div>
            </article>
        </div>
    )
}