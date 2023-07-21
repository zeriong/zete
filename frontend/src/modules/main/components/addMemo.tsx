import {CategoryIcon, CloseIcon, FillStarIcon, PlusIcon, StarIcon} from "../../../assets/vectors";
import React, {useEffect, useRef, useState} from "react";
import {useHandleQueryStr} from "../../../hooks/useHandleQueryStr";
import {
    handleTagInput,
    handleResizeHeight,
    handleAddTagSubmit,
    updateOrAddMemo,
    getGptRefillAt
} from "../../../common/libs";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {useHorizontalScroll} from "../../../hooks/useHorizontalScroll";
import {useForm} from "react-hook-form";
import {showAlert} from "../../../store/slices/alert.slice";
import {CreateMemoInput, Memo} from "../../../openapi/generated";
import {Api} from "../../../common/api";
import {deleteMemo} from "../../../store/slices/memo.slice";
import {dispatchGptAvailable, dispatchGptRefillAt} from "../../../store/slices/user.slice";

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
    const userState = useSelector((state: RootState) => state.user.data);

    const horizonScroll = useHorizontalScroll();

    const [isImportant, setIsImportant] = useState<boolean>(false);
    const [readyToMemo, setReadyToMemo] = useState<boolean | number>(0);
    const [openGPT, setOpenGPT] = useState(false);
    const [gptTextInput, setGptTextInput] = useState('');
    const [temporarySaveMemo, setTemporarySaveMemo] = useState<Memo>();
    const [isDone, setIsDone] = useState(false);
    const [memoId, setMemoId] = useState(0);
    const [gptLoading, setGptLoading] = useState(false);
    const [gptContent, setGptContent] = useState('');
    const [titleFocus, setTitleFocus] = useState(false);
    const [contentFocus, setContentFocus] = useState(false);
    const [waitText, setWaitText] = useState(false)

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
        updateOrAddMemo({
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
    }

    // 타이핑 자동 업데이트 핸들러
    const handleAutoUpdateRequest = () => {
        updateOrAddMemo({
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
    }

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
            typingTimout.current = setTimeout(() => handleAutoUpdateRequest(), 3000);
        }
    }

    const deleteTag = (tagName) => {
        const tags = form.getValues('tags');
        if (tags) form.setValue('tags', tags.filter(tag => tag.tagName !== tagName));
    }

    const handleGptTextarea = (e) => {
        handleResizeHeight(gptTextareaRef);
        setGptTextInput(e.target.value);
    }

    const requestGpt = () => {
        if (userState.gptAvailable === 0) return showAlert('질문가능 횟수가 초과하였습니다, 매일 자정이 지나면 충전됩니다.');
        setGptLoading(true);
        Api.openAi.createCompletion({ content: gptTextInput })
            .then((res) => {
                /* gpt 3.5 turbo 특성상 요청이 매우느리고 연속요청에 에러를 발생시키기 때문에 요청에러방지,
                   사용자경험을 높이기 위해 요청을 받은 후 setWaitText를 통해 "답변이 거의 완성되었어요!" 문구를 띄움 */
                setWaitText(true);

                setTimeout(() => {
                    setWaitText(false);
                    setGptLoading(false);
                }, 7000);

                if (!res.data.success) return showAlert(res.data.error);
                if (res.data.message) return showAlert(res.data.message);
                if (res.data.resGpt) {
                    dispatchGptAvailable(res.data.gptAvailable);
                    setGptContent(res.data.resGpt);
                }
            })
            .catch((e) => {
                setGptLoading(false);
                console.log(e);
                showAlert('Chat-GPT 서버에 접속할 수 없습니다.');
            });
    }

    const handleGptSubmit = () => {
        if (gptTextInput === '') showAlert('GPT: 대화내용을 입력해주세요');
        else requestGpt();
        setGptTextInput('');
        gptTextareaRef.current.style.height = 'auto';
    }


    const handleKeydownForGptSubmit = (e) => {
        if (e.shiftKey && e.key === 'Enter') handleResizeHeight(gptTextareaRef);
        else if (e.key === 'Enter') {
            e.preventDefault();
            handleGptSubmit();
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

    const handleTryGptAvailable = (gptRefillAt) => {
        Api.user.tryGptAvailableRefill({ gptRefillAt })
            .then((res) => {
                const data = res.data
                if (data.success) {
                    dispatchGptAvailable(data.gptAvailable);
                    dispatchGptRefillAt(data.gptRefillAt);
                }
            }).catch(e => console.log(e));
    }

    /* gptOpen 일때 db에서 받아온 날짜비교하여 통신결정
       (initState가 null이기 때문에 최초에 반드시 1회 요청) */
    useEffect(() => {
        if (openGPT) {
            const gptRefillAt = getGptRefillAt();

            if (userState.gptRefillAt !== gptRefillAt) {
                handleTryGptAvailable(gptRefillAt);
            }
        }
    }, [openGPT]);

    useEffect(() => {
        if (!gptLoading && !titleFocus && !contentFocus) {
            gptTextareaRef.current.focus();
        }
    }, [gptLoading])

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
                                    onFocus={() => setTitleFocus(true)}
                                    onBlur={() => setTitleFocus(false)}
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
                                onFocus={() => setContentFocus(true)}
                                onBlur={() => setContentFocus(false)}
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
                                                onClick={() => deleteTag(tag.tagName)}
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
                    <div className='relative grow text-start text-zete-dark-500 bg-white overflow-hidden rounded-[8px] p-8px bg-opacity-80'>
                        <div className='relative text-center bg-zete-gpt-500 rounded-[8px] py-4px mb-4px'>
                            <span className='text-zete-gpt-black font-bold'>
                                Chat GPT
                            </span>
                            <div className='absolute top-1/2 -translate-y-1/2 text-13 right-13px text-white font-semibold'>
                                질문 가능 횟수:
                                <span>
                                    {` ${userState.gptAvailable}`}
                                </span>
                            </div>
                        </div>
                        <div className='overflow-auto max-h-[calc(100%-84px)] memo-custom-vertical-scroll'>
                            {
                                (!gptLoading && gptContent === '') ?
                                    (
                                        // 응답받은 gpt-content가 없고 로딩이 아닌경우
                                        <>
                                            <p className='mb-12px'>궁금한 것이 있다면 GPT에게 물어보세요!</p>
                                            표준어를 사용해주세요!<br/>
                                            줄임말이나 신조어를 사용하면<br/>
                                            원하는 답변을 얻지 못할 수 있어요.<br/>
                                            {`< 참고사항 >`}<br/>
                                            1. gpt에게 물어볼 수 있는 횟수는 한 계정당 10번 물어볼 수 있어요.<br/>
                                            2. 하나의 질문에 한번의 답변만 할 수 있어요. (대화형식 불가)
                                        </>
                                    ) : gptLoading ? (
                                        // 답변 응답을 받는중인 경우 ( 로딩중 )
                                        <>
                                            {
                                                waitText ? '답변이 거의 완성되었어요!' :
                                                'gpt가 답변을 준비하고 있어요.'
                                            }
                                        </>
                                    ) : gptContent !== '' && (
                                        // 답변을 받은 경우
                                        <>
                                            {gptContent}
                                        </>
                                    )
                            }
                        </div>
                    </div>
                    <article
                        className='flex items-center justify-between absolute bottom-10px p-8px bg-white shadow-1xl rounded-[12px] w-[calc(100%-20px)]
                        border border-zete-light-gray-500 left-1/2 -translate-x-1/2 shadow-2xl'
                    >
                        <div className='relative flex items-center memo-custom-scroll overflow-auto max-h-[88px] w-[calc(100%-42px)]'>
                            <textarea
                                ref={gptTextareaRef}
                                maxLength={500}
                                onChange={handleGptTextarea}
                                onKeyDown={handleKeydownForGptSubmit}
                                value={gptTextInput}
                                rows={1}
                                disabled={gptLoading}
                                placeholder='GPT에게 물어보세요! ( Shift + Enter 줄바꿈 )'
                                className='resize-none bg-transparent placeholder:text-zete-gray-500 font-light placeholder:text-14 w-full h-fit'
                            />
                        </div>
                        <button
                            type='button'
                            onClick={handleGptSubmit}
                            className='absolute right-10px px-4px bg-zete-gpt-200 text-white whitespace-nowrap h-fit text-15'
                        >
                            전송
                        </button>
                    </article>
                </div>
            </article>
        </div>
    )
}