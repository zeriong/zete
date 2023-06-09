import {CategoryIcon, CloseIcon, FillStarIcon, PlusIcon, StarIcon} from "../../../assets/vectors";
import React, {useEffect, useRef, useState} from "react";
import {useHandleQueryStr} from "../../../hooks/useHandleQueryStr";
import {handleInputChange, handleResizeHeight} from "../../../common/libs/common.lib";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {useHorizontalScroll} from "../../../hooks/useHorizontalScroll";
import {Api} from "../../../common/libs/api";
import {useForm} from "react-hook-form";
import {showAlert} from "../../../store/slices/alert.slice";
import {CreateMemoInput} from "../../../openapi";
import {ADD_MEMO} from "../../../store/slices/memo.slice";

export const AddMemo = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => {
    const memoTextarea = useRef<HTMLTextAreaElement>(null);
    const titleTextarea = useRef<HTMLTextAreaElement>(null);
    const tagsInput = useRef<HTMLInputElement>(null);

    const { cateQueryStr, tagQueryStr, searchParams } = useHandleQueryStr();
    const { cate } = useSelector((state: RootState) => state.memo.data);

    const dispatch = useDispatch();
    const horizonScroll = useHorizontalScroll();

    const [isImportant, setIsImportant] = useState<boolean>(false);

    const form = useForm<CreateMemoInput>({ mode: 'onBlur' });

    // const { ref: titleRef } = form.register('title');
    // const { ref: contentRef } = form.register('content');

    const handleImportant = () => setIsImportant(!isImportant);

    // const handleKeyDown = (e) => {
    //     if (e.shiftKey && e.key === 'Enter') {
    //         const startPos = e.target.selectionStart;
    //         const endPos = e.target.selectionEnd;
    //         const value = e.target.value;
    //         e.target.value = value.substring(0, startPos) + '\n' + value.substring(endPos, value.length);
    //         e.target.selectionStart = startPos + 1;
    //         e.target.selectionEnd = startPos + 1;
    //         e.preventDefault();
    //     } else if (e.key === 'Enter') {
    //         memoTextarea.current.focus();
    //         e.preventDefault();
    //     }
    //     handleResizeHeight(titleTextarea);
    // }

    const handleAddMemoAction = () => {
        if (!form.getValues('content') && !form.getValues('content')) {
            showAlert('메모를 작성해주세요');
            return
        }

        const replaceMemoContent: CreateMemoInput = {
            ...form.getValues(),
            title: form.getValues('title').replace(/\n/g, '<br/>'),
            content: form.getValues('content').replace(/\n/g, '<br/>'),
        }

        Api().memo.createMemo({...replaceMemoContent, important: isImportant})
            .then((res) => {
                if (res.data.success) {
                    console.log('메모추가데이터',res.data)
                    if (Number(res.data.savedMemo.cateId) === Number(cateQueryStr) || cateQueryStr === null) {
                        dispatch(ADD_MEMO({...res.data.savedMemo}));
                    }

                    form.reset({ title: '', content: '', cateId: Number(cateQueryStr) || 0, tags: [] });
                    setIsImportant(false);
                    // memoTextarea.current.style.height = 'auto';
                    // titleTextarea.current.style.height = 'auto';
                } else {
                    showAlert(res.data.error);
                    console.log(res.data.error);
                }
            })
            .catch(e => console.log(e));
    }

    const handleAddTagFormSubmit = (e) => {
        e.preventDefault();
        const input = e.target[0];
        const tags = form.getValues('tags') || [];

        const exists = tags.find(tag => tag.tagName === input.value);
        if (!exists) {
            form.setValue('tags', [ ...tags, { tagName: input.value } ]);
            input.value = '';
        } else {
            showAlert('이미 존재하는 태그명 입니다.');
        }
    }

    const handleDeleteTag = (tagName) => {
        const tags = form.getValues('tags');
        if (tags) {
            form.setValue('tags', tags.filter(tag => tag.tagName !== tagName));
        }
    }

    useEffect(() => {
        form.setValue('cateId', cateQueryStr ? Number(cateQueryStr) : 0);
        form.setValue('tags', tagQueryStr ? [ { tagName: tagQueryStr } ] : []);
    },[searchParams]);

    return (
        <article
            {...props}
            className='relative min-w-0 w-full browser-width-900px:w-[300px] min-h-[212px] h-fit flex flex-col justify-between
            border border-zete-light-gray-500 rounded-[8px] px-18px pb-10px pt-12px bg-zete-primary-200 memo-shadow'
        >
            <div className='w-full h-full flex flex-col min-h-[212px]'>
                <div className='w-full h-full'>
                    <div className='flex justify-between items-center pb-8px border-b border-zete-memo-border h-full'>
                        <textarea
                            // ref={titleTextarea}
                            {...form.register('title', {
                                required: false,
                                maxLength: 64,
                                onChange: () => handleResizeHeight(titleTextarea),
                            })}
                            // onKeyDown={handleKeyDown}
                            rows={1}
                            placeholder='제목'
                            className='resize-none w-full pr-6px max-h-[80px] bg-transparent text-zete-gray-500 placeholder:text-zete-gray-500 font-light placeholder:text-15 memo-custom-scroll'
                        />
                        <button type='button' onClick={handleImportant}>
                            {isImportant ? <FillStarIcon/> : <StarIcon/>}
                        </button>
                    </div>
                    <textarea
                        // ref={handleMemoTextRef}
                        {...form.register('content', {
                            required: false,
                            maxLength: 65535,
                            onChange: () => handleResizeHeight(memoTextarea)
                        })}
                        rows={1}
                        placeholder='메모 작성...'
                        className='pt-9px resize-none max-h-[300px] w-full bg-transparent text-zete-gray-500 placeholder:text-zete-gray-500 font-light placeholder:text-15 memo-custom-scroll'
                    />
                </div>
                <div /*onClick={() => memoTextarea.current.focus()}*/ className='w-full h-full grow'/>
                <div className='w-full h-full'>
                    <div ref={horizonScroll} className='flex w-full h-full relative border-b border-zete-memo-border pb-8px overflow-y-hidden memo-custom-vertical-scroll'>
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
                            onSubmit={handleAddTagFormSubmit}
                        >
                            <input
                                ref={tagsInput}
                                onChange={() => handleInputChange(tagsInput)}
                                placeholder='태그추가'
                                className='min-w-[50px] w-50px px-2px placeholder:text-zete-placeHolder bg-transparent whitespace-nowrap'
                            />
                            <button type='submit' className='relative w-14px h-14px grid place-content-center'>
                                <PlusIcon svgClassName='w-9px' strokeClassName='fill-black'/>
                            </button>
                        </form>
                    </div>
                    <div className='flex justify-between items-center pt-10px'>
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
                        <div onClick={handleAddMemoAction}>
                            <PlusIcon svgClassName='cursor-pointer'/>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}