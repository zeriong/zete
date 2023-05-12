import React, {Fragment, useEffect, useRef, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {useHandleQueryStr} from "../../../../hooks/useHandleQueryStr";
import {
    CategoryIcon,
    CheckIcon,
    CloseIcon,
    FillStarIcon,
    PlusIcon,
    SearchIcon,
    StarIcon,
    StickerMemoIcon
} from "../../../../assets/vectors";
import {handleInputChange, handleResizeHeight, uniqueKey} from "../../../../common/libs/common.lib";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {useHorizontalScroll} from "../../../../hooks/useHorizontalScroll";
import {showAlert} from "../../../../store/slices/alert.slice";
import {loadAsideData, refreshMemos} from "../../../../store/slices/memo.slice";
import {useForm} from "react-hook-form";
import {Memos, UpdateMemoInput} from "../../../../openapi";
import {Api} from "../../../../common/libs/api";

export const MemoModifyModal = ({ memoId }: { memoId:number }) => {
    const memoTextarea = useRef<HTMLTextAreaElement>(null);
    const titleTextarea = useRef<HTMLTextAreaElement>(null);
    const tagsInput = useRef<HTMLInputElement>(null);
    const tagsRef = useRef([]);

    const { data } = useSelector((state:RootState) => state.memo);
    const {
        searchParams,
        setSearchParams,
        cateQueryStr,
        tagQueryStr,
        menuQueryStr,
        modalQueryStr,
    } = useHandleQueryStr();

    const dispatch = useDispatch();
    const horizonScroll = useHorizontalScroll();

    const [isShow, setIsShow] = useState<boolean>(false);
    const [isImportant, setIsImportant] = useState<boolean>(false);

    const form = useForm<UpdateMemoInput>();
    const cateIdForm = useForm<{ cateId: string }>();

    const closeModal = () => {
        searchParams.delete('modal');
        setSearchParams(searchParams);
    }

    const dataRefresh = () => {
        refreshMemos({
            offset: 0,
            limit: data.memos.length,
            search: '',
            menuQueryStr,
            tagQueryStr,
            cateQueryStr: Number(cateQueryStr),
        });
        loadAsideData();
    }

    const handleImportant = () => setIsImportant(!isImportant);

    const memoModifier = () => {
        closeModal();
        if (!form.getValues('memo.title') && !form.getValues('memo.content')) {
            dataRefresh();
            return showAlert('제목이나 내용을 입력하지 않아 수정이 취소되었습니다.');
        }

        let targetMemo = data.memos.find(memo => memo.id === memoId);
        const leftTags = data.cate.filter(cate => cate.tag);
        console.log(targetMemo,'바뀌기 전~~~~~~~~!!~~~~~~~~!!')
        if (targetMemo.cateId === null) {
            targetMemo = { ...targetMemo, tag: [] };
        }
        console.log(targetMemo,'바뀐지 체크!!~~~~~~~~!!')

        // Api().memo.update({...form.getValues()})
        //     .then((res)=>{
        //         if (res.data.success) {
        //             dataRefresh();
        //         } else {
        //             showAlert(res.data.error);
        //         }
        //     }).catch(e => console.log(e));
    }

    const handleAddTagFormSubmit = (e) => {
        e.preventDefault();
        const input = e.target[0];
        const tags = form.getValues('memo.tag') || [];

        const exists = tags.find(tag => tag.tagName === input.value);
        if (!exists) {
            form.setValue('memo.tag', [ ...tags, { tagName: input.value } ]);
            input.value = ''
        } else {
            showAlert('이미 존재하는 태그명 입니다.', 'error')
        }
    }

    const handleDeleteTag = (tagName) => {
        const tags = form.getValues('memo.tag');
        if (tags) {
            form.setValue('memo.tag', tags.filter(tag => tag.tagName !== tagName))
        }
    }

    useEffect(() => {
        if (modalQueryStr) {
            const targetMemo = data.memos.find(find => find.id === memoId);
            if (targetMemo) {
                const tags = targetMemo.tag.map(tag => ({ tagName: tag.tagName }));
                form.setValue('memo.tag', tags);
                form.setValue('memo.title', targetMemo.title);
                form.setValue('memo.content', targetMemo.content);
                setIsShow(true);
                setIsImportant(targetMemo.important);
            } else {
                closeModal();
            }
        } else {
            setIsShow(false);
        }
    },[modalQueryStr])

    return (
        <Transition appear show={isShow} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-40"
                onClose={memoModifier}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-40" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div
                        className="close-modal-background
                        flex min-h-full items-center justify-center p-4 text-center"
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all rounded-[5px]">
                                <article
                                    className='relative min-w-0 w-[300px] browser-width-900px:w-[400px] flex flex-col justify-between
                                    border border-zete-light-gray-500 rounded-[8px] px-18px pb-10px pt-12px min-h-[212px] h-fit bg-zete-primary-200 memo-shadow'
                                >
                                    <div className='w-full h-full flex flex-col min-h-[212px]'>
                                        <div className='w-full h-full'>
                                            <div className='flex justify-between items-center pb-8px border-b border-zete-memo-border h-full'>
                                                <textarea
                                                    {...form.register('memo.title', {
                                                        required: false,
                                                        maxLength: 64,
                                                    })}
                                                    rows={1}
                                                    placeholder='제목'
                                                    className='resize-none w-full pr-6px max-h-[80px] bg-transparent text-zete-gray-500 placeholder:text-zete-gray-500 font-light placeholder:text-15 memo-custom-scroll'
                                                />
                                                {
                                                    menuQueryStr ? <FillStarIcon/> :
                                                        isImportant ? (
                                                            <FillStarIcon onClick={handleImportant}/>
                                                        ) : (
                                                            <StarIcon onClick={handleImportant}/>
                                                        )
                                                }
                                            </div>
                                            <div className='h-full w-full pt-9px'>
                                                <textarea
                                                    {...form.register('memo.content', {
                                                        required: false,
                                                        maxLength: 65535,
                                                    })}
                                                    rows={1}
                                                    placeholder='메모 작성...'
                                                    className='resize-none h-[280px] w-full bg-transparent text-zete-gray-500 placeholder:text-zete-gray-500 font-light placeholder:text-15 memo-custom-scroll'
                                                />
                                            </div>
                                        </div>
                                        <label htmlFor='modifyMemo' className='w-full h-full grow'/>
                                        <div className='w-full h-full'>
                                            <div ref={horizonScroll} className='flex w-full h-full relative border-b border-zete-memo-border pb-8px overflow-y-hidden memo-custom-vertical-scroll'>
                                                {form.watch('memo.tag')?.map((tag, idx) => (
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
                                                <div className='h-full w-full text-zete-dark-400'>
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
                                            </div>
                                            <div className='flex justify-between items-center pt-10px'>
                                                <div className='flex items-center border border-zete-memo-border rounded-md px-2 py-1'>
                                                    <CategoryIcon className='w-18px opacity-75 mr-0.5'/>
                                                    <select
                                                        {...cateIdForm.register('cateId', { required: true })}
                                                        className='w-[130px] text-[13px] text-gray-500 bg-transparent'
                                                    >
                                                        <option value={0}>전체메모</option>
                                                        {data.cate.map((cate, idx) => (
                                                            <option key={idx} value={cate.id}>
                                                                {cate.cateName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}