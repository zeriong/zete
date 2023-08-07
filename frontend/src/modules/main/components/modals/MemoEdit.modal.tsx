import React, {Fragment, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store';
import {useForm} from 'react-hook-form';
import {CreateMemoInput, Memo} from '../../../../openapi/generated';
import {useSearchParams} from 'react-router-dom';
import {Dialog, Transition} from '@headlessui/react';
import {CategoryIcon, CloseIcon, FillStarIcon, PlusIcon, StarIcon} from '../../../../assets/vectors';
import {setDynamicInputWidth} from '../../../../libs/common.lib';
import {showAlert} from '../../../../store/alert/alert.slice';
import {Api} from '../../../../openapi/api';
import {handleAddMemoTagSubmit, loadMemoList} from '../../../../libs/memo.lib';
import {HorizontalScroll} from '../../../../common/components/HorizontalScroll';

export const MemoEditModal = () => {
    const savedMemo = useRef<Memo | null>(null);
    const saveDelayTimer = useRef<NodeJS.Timeout | null>(null);
    const isSavingMemo = useRef(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const [isShow, setIsShow] = useState<boolean>(false);

    const dispatch = useDispatch<AppDispatch>();
    const memoState = useSelector((state:RootState) => state.memo);

    const form = useForm<CreateMemoInput>({ mode: 'onSubmit' });

    const closeModal = async () => {
        searchParams.delete('view');
        setSearchParams(searchParams);

    }

    // 메모 수정
    const updateMemo = async () => {
        clearTimeout(saveDelayTimer.current);
        saveDelayTimer.current = null;

        const data = form.getValues();
        isSavingMemo.current = true;
        // 내용이 있는 경우 저장
        if (data.title?.length > 0 || data.content?.length > 0) {
            try {
                const res = await Api.memo.updateMemo({ ...data, id: savedMemo.current.id });
                if (res.data.success) savedMemo.current = res.data.savedMemo;
                else showAlert(res.data.error);
            } catch (e) {
                showAlert('메모 수정에 실패하였습니다.');
                loadMemoList(dispatch, searchParams, true);
            }
        }
        isSavingMemo.current = false;
    }

    // 메모 수정 시도
    const tryUpdateMemo = () => {
        if (saveDelayTimer.current != null) {
            clearTimeout(saveDelayTimer.current);
            saveDelayTimer.current = null;
        }
        if (saveDelayTimer.current == null) {
            saveDelayTimer.current = setTimeout(async () => {
                if (isSavingMemo.current) tryUpdateMemo();  // 저장중이라면 연기
                else await updateMemo();  // 저장
            }, 3000);
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        // 제목에서 enter 시 내용으로 이동
        const input = event.target[2];
        input.focus();
    };

    // 폼 입력 감지
    useEffect(() => {
        const subscription = form.watch((data, { name, type }) => {
            // 특정 항목이 입력될 경우
            if (name) tryUpdateMemo();
        });
        return () => subscription.unsubscribe();
    }, [form.watch]);

    // 메모수정 모달 벨류세팅
    useEffect(() => {
        const memoId = Number(searchParams.get('view'));

        if (memoId) {
            setIsShow(true);
            const targetMemo = memoState.memo.list.find(find => find.id === memoId);
            if (targetMemo) {
                // 데이터 요청해서 받은 데이터를 기반으로 정리
                (async () => {
                    const res = await Api.memo.getMemo({ id: memoId });
                    if (res.data.success) {
                        const memo = res.data.memo;
                        savedMemo.current = memo;
                        form.setValue('title', memo.title);
                        form.setValue('content', memo.content);
                        form.setValue('cateId', memo.cateId);
                        form.setValue('tags', memo.tags);
                        form.setValue('isImportant', memo.isImportant);
                    } else {
                        showAlert('존재하지 않는 메모입니다.');
                    }

                })();
            }
            else closeModal();
        }
        else setIsShow(false);
    },[searchParams]);

    return (
        <Transition appear show={ isShow } as={ Fragment }>
            <Dialog
                as='div'
                className='relative z-40'
                onClose={ () => {
                    // handleUpdate(false);
                    closeModal();
                } }
            >
                <Transition.Child
                    as={ Fragment }
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <div className='fixed inset-0 bg-black bg-opacity-40' />
                </Transition.Child>
                <div className='fixed inset-0 overflow-y-auto'>
                    <div
                        className='close-modal-background
                        flex min-h-full items-center justify-center p-4 text-center'
                    >
                        <Transition.Child
                            as={ Fragment }
                            enter='ease-out duration-300'
                            enterFrom='opacity-0 scale-95'
                            enterTo='opacity-100 scale-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100 scale-100'
                            leaveTo='opacity-0 scale-95'
                        >
                            <Dialog.Panel className='relative transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all rounded-[5px]'>
                                <article
                                    className='relative min-w-0 w-[300px] browser-width-900px:w-[400px] flex flex-col justify-between
                                    border border-zete-light-gray-500 rounded-[8px] px-[18px] pb-[10px] pt-[12px] min-h-[212px] h-fit bg-zete-primary-200 memo-shadow'
                                >
                                    <div className='w-full h-full flex flex-col min-h-[212px]'>
                                        <form onSubmit={ handleFormSubmit } className='w-full h-full'>
                                            <div className='flex justify-between items-center pb-[8px] border-b border-zete-memo-border h-full'>
                                                <input
                                                    {...form.register('title', {
                                                        required: false,
                                                        maxLength: 255,
                                                    })}
                                                    tabIndex={ 1 }
                                                    placeholder='제목'
                                                    className='resize-none w-full pr-[6px] max-h-[80px] bg-transparent text-zete-gray-500 placeholder:text-zete-gray-500
                                                    font-light placeholder:text-[15px] memo-custom-scroll'
                                                />
                                                <button
                                                    type='button'
                                                    onClick={ () => form.setValue('isImportant', !form.getValues('isImportant')) }
                                                >
                                                    { form.watch('isImportant') ? <FillStarIcon/> : <StarIcon/> }
                                                </button>
                                            </div>
                                            <div className='h-full w-full pt-[9px]'>
                                                <textarea
                                                    {...form.register('content', {
                                                        required: false,
                                                        maxLength: 65535,
                                                    })}
                                                    rows={ 1 }
                                                    placeholder='메모 작성...'
                                                    className='resize-none h-[280px] w-full bg-transparent text-zete-gray-500 placeholder:text-zete-gray-500
                                                    font-light placeholder:text-[15px] memo-custom-scroll'
                                                />
                                            </div>
                                        </form>
                                        <div className='w-full'>
                                            <HorizontalScroll>
                                                <div className='flex w-full h-full relative pb-[8px] overflow-y-hidden'>
                                                    {form.watch('tags')?.map((tag, idx) => (
                                                        <div key={ idx } className='relative flex items-center pl-[9px] pr-[21px] py-[1px] mr-[4px] rounded-[4px] bg-black bg-opacity-10 cursor-default'>
                                                        <span className='font-light text-[11px] text-zete-dark-400 whitespace-nowrap'>
                                                            { tag.name }
                                                        </span>
                                                            <button
                                                                type='button'
                                                                // onClick={ () => deleteTag(tag.name) }
                                                                className='absolute right-[2px] group rounded-full grid place-content-center hover:bg-zete-dark-300
                                                            hover:bg-opacity-50 w-[14px] h-[14px]'
                                                            >
                                                                <CloseIcon className='w-[10px] fill-zete-dark-400 group-hover:fill-white'/>
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <form
                                                        onSubmit={ (event) => {
                                                            handleAddMemoTagSubmit(event, form);
                                                            setDynamicInputWidth(event.target[0]);
                                                        }}
                                                        className='relative flex items-center text-zete-dark-400 text-[12px]'
                                                    >
                                                        <input
                                                            onChange={ (event) => setDynamicInputWidth(event.target) }
                                                            placeholder='태그추가'
                                                            className='min-w-[50px] w-[50px] px-[2px] placeholder:text-zete-placeHolder bg-transparent whitespace-nowrap'
                                                        />
                                                        <button type='submit' className='relative w-[14px] h-[14px] grid place-content-center'>
                                                            <PlusIcon svgClassName='w-[9px]' strokeClassName='fill-black'/>
                                                        </button>
                                                    </form>
                                                </div>
                                            </HorizontalScroll>
                                            <div className='flex justify-between items-center pt-[10px] border-t border-zete-memo-border'>
                                                <div className='flex items-center border border-zete-memo-border rounded-md px-2 py-1'>
                                                    <CategoryIcon className='w-[18px] opacity-75 mr-0.5'/>
                                                    <select
                                                        {...form.register('cateId', { required: true })}
                                                        className='w-[130px] text-[13px] text-gray-500 bg-transparent'
                                                    >
                                                        <option value={0}>전체메모</option>
                                                        {memoState.cate.list.map((cate, idx) => (
                                                            <option key={ idx } value={ cate.id }>
                                                                { cate.name }
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