import React, {Fragment, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store';
import {useForm} from 'react-hook-form';
import {Memo, UpdateMemoInput} from '../../../../openapi/generated';
import {useSearchParams} from 'react-router-dom';
import {Dialog, Transition} from '@headlessui/react';
import {CategoryIcon, CloseIcon, FillStarIcon, PlusIcon, StarIcon} from '../../../../assets/vectors';
import {setDynamicInputWidth} from '../../../../libs/common.lib';
import {showAlert} from '../../../../store/alert/alert.actions';
import {Api} from '../../../../openapi/api';
import {deleteMemoTag, addMemoTagSubmit, focusToContent, loadMemos} from '../../../../libs/memo.lib';
import {HorizontalScroll} from '../../../../common/components/HorizontalScroll';
import {updateMemoReducer} from '../../../../store/memo/memo.slice';
import {getCategoriesAction} from '../../../../store/memo/memo.actions';

export const MemoEditModal = () => {
    const savedMemo = useRef<Memo | null>(null);
    const saveDelayTimer = useRef<NodeJS.Timeout | null>(null);
    const getDelayTimer = useRef<NodeJS.Timeout | null>(null);
    const isSavingMemo = useRef(false);
    const isLoadingMemo = useRef(false);
    const requestMemoId = useRef(0);

    const [searchParams, setSearchParams] = useSearchParams();
    const [isShow, setIsShow] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const memoState = useSelector((state:RootState) => state.memo);

    const form = useForm<UpdateMemoInput>({ mode: 'onSubmit' });

    const closeModal = async () => {
        searchParams.delete('view');
        setSearchParams(searchParams);
        if (savedMemo.current) {
            await updateMemo();
            dispatch(updateMemoReducer(savedMemo.current));
        }
        form.reset();
        savedMemo.current = null;
    }

    // 메모 수정
    const updateMemo = async () => {
        clearTimeout(saveDelayTimer.current);
        saveDelayTimer.current = null;
        isSavingMemo.current = true;

        const data = form.getValues();
        const targetMemo = memoState.memo.list.find(memo => memo.id === requestMemoId.current);
        const diffTagLength = data.tags.length === 0 ? 0 : targetMemo.tags.filter(tag => data.tags.some(formTag => formTag.name === tag.name)).length;
        // 내용이 있고 변경사항이 있는 경우에만 요청
        if (data.title?.length === 0 && data.content?.length === 0) showAlert('입력내용이 존재하지 않아 마지막 내용을 저장합니다.');
        if (data.title === targetMemo.title && data.content === targetMemo.content && data.cateId === Number(targetMemo.cateId) &&
            targetMemo.tags.length === diffTagLength && targetMemo.isImportant === data.isImportant) return;

        try {
            const res = await Api.memo.updateMemo({ ...data, id: savedMemo.current.id });
            if (res.data.success) savedMemo.current = res.data.savedMemo;
            else showAlert(res.data.error);
            dispatch(getCategoriesAction());
        } catch (e) {
            showAlert('메모 수정에 실패하였습니다.');
            loadMemos(dispatch, searchParams, true);
            dispatch(getCategoriesAction());
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

    // 수정할 메모를 요청해서 받은 데이터를 기반으로 세팅
    const setModal = () => {
        (async () =>{
            console.log('셋메모 start')
            isLoadingMemo.current = true;
            const res = await Api.memo.getMemo({ id: requestMemoId.current });
            console.log(res.data)
            if (res.data.success) {
                const memo = res.data.memo;
                console.log('데이터',res.data)
                // 요청한 메모일 경우만 세팅 (지연로드 되는경우 대비)
                if (requestMemoId.current === Number(res.data.memo.id)) {
                    savedMemo.current = memo;
                    form.setValue('title', memo.title);
                    form.setValue('content', memo.content);
                    form.setValue('cateId', Number(memo.cateId));
                    form.setValue('tags', memo.tags);
                    form.setValue('isImportant', memo.isImportant);
                }
            } else {
                showAlert('존재하지 않는 메모입니다.');
                searchParams.delete('view');
                setSearchParams(searchParams);
                loadMemos(dispatch, searchParams, true);
                dispatch(getCategoriesAction());
            }
            isLoadingMemo.current = false;
        })()
    }

    // 모달 세팅 시도
    const trySetModal = () => {
        (async () => {
            if (getDelayTimer.current != null) {
                clearTimeout(getDelayTimer.current);
                getDelayTimer.current = null;
            }
            if (getDelayTimer.current == null) {
                // 데이터로드중이라면 연기 (메모수정이 완료 되지 않아도 세팅 연기)
                if (isLoadingMemo.current) {
                    getDelayTimer.current = setTimeout(() => {
                        trySetModal();
                    }, 500);
                } else { // 모달 세팅
                    await setModal();
                }
            }
        })()
    }

    // 메모수정 모달
    useEffect(() => {
        requestMemoId.current = Number(searchParams.get('view'));
        if (requestMemoId.current) {
            form.reset();
            setIsShow(true);
            trySetModal();
        } else {
            setIsShow(false);
        }
    },[searchParams]);

    // 폼 입력 감지
    useEffect(() => {
        const subscription = form.watch((data, { name, type }) => {
            // 특정 항목이 입력될 경우
            if (name) tryUpdateMemo();
        });
        return () => subscription.unsubscribe();
    }, [form.watch]);

    return (
        <Transition appear show={ isShow } as={ Fragment }>
            <Dialog
                as='div'
                className='relative z-40'
                onClose={ closeModal }
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
                                    className='relative min-w-0 w-[300px] pc:w-[400px] flex flex-col justify-between
                                    border border-zete-light-gray-500 rounded-[8px] px-[18px] pb-[10px] pt-[12px] min-h-[212px] h-fit bg-zete-primary-200 memo-shadow'
                                >
                                    <div className='w-full h-full flex flex-col min-h-[212px]'>
                                        <form onSubmit={ focusToContent } className='w-full h-full'>
                                            <div className='flex justify-between items-center pb-[8px] border-b border-zete-memo-border h-full'>
                                                <input
                                                    {...form.register('title', {
                                                        required: false,
                                                        maxLength: 255,
                                                    })}
                                                    disabled={ isLoadingMemo.current || !isShow }
                                                    tabIndex={ 1 }
                                                    placeholder={ isLoadingMemo.current || !isShow ? '' : '제목' }
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
                                            <div className='relative h-full w-full pt-[9px]'>
                                                {isLoadingMemo.current &&
                                                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20px] whitespace-nowrap font-bold text-zete-gray-500/80'>
                                                        메모를 불러오는 중입니다.
                                                    </div>
                                                }
                                                <textarea
                                                    {...form.register('content', {
                                                        required: false,
                                                        maxLength: 65535,
                                                    })}
                                                    disabled={ isLoadingMemo.current || !isShow }
                                                    rows={ 1 }
                                                    placeholder={ isLoadingMemo.current || !isShow ? '' : '메모 작성...' }
                                                    className='resize-none h-[280px] w-full bg-transparent text-zete-gray-500 placeholder:text-zete-gray-500
                                                    font-light placeholder:text-[15px] memo-custom-scroll'
                                                />
                                            </div>
                                        </form>
                                        <div className='w-full'>
                                            <HorizontalScroll>
                                                <div className='flex w-full h-full relative pb-[8px] overflow-y-hidden'>
                                                    {form.watch('tags')?.map((tag, idx) => (
                                                        <div key={ idx } className='relative flex items-center pl-[9px] pr-[21px] py-[1px] mr-[4px] rounded-[4px] bg-black/10 cursor-default'>
                                                            <span className='font-light text-[11px] text-zete-dark-400 whitespace-nowrap'>
                                                                { tag.name }
                                                            </span>
                                                            <button
                                                                type='button'
                                                                onClick={ () => deleteMemoTag(form, tag.name) }
                                                                className='absolute right-[2px] group rounded-full grid place-content-center hover:bg-zete-dark-300
                                                                hover:bg-opacity-50 w-[14px] h-[14px]'
                                                            >
                                                                <CloseIcon className='w-[10px] fill-zete-dark-400 group-hover:fill-white'/>
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <form
                                                        onSubmit={ (event) => {
                                                            addMemoTagSubmit(event, form);
                                                            setDynamicInputWidth(event.target[0]);
                                                        }}
                                                        className='relative flex items-center text-zete-dark-400 text-[12px]'
                                                    >
                                                        <input
                                                            onChange={ (event) => setDynamicInputWidth(event.target) }
                                                            disabled={ isLoadingMemo.current || !isShow }
                                                            placeholder={(isLoadingMemo.current || !isShow) ? '' : '태그추가'}
                                                            className='min-w-[50px] w-[50px] px-[2px] placeholder:text-zete-placeHolder bg-transparent whitespace-nowrap'
                                                        />
                                                        {(isLoadingMemo.current || !isShow) &&
                                                            <button type='submit' className='relative w-[14px] h-[14px] grid place-content-center'>
                                                                <PlusIcon svgClassName='w-[9px]' strokeClassName='fill-black'/>
                                                            </button>
                                                        }
                                                    </form>
                                                </div>
                                            </HorizontalScroll>
                                            <div className='flex justify-between items-center pt-[10px] border-t border-zete-memo-border'>
                                                <div className='flex items-center border border-zete-memo-border rounded-md px-[8px] py-[4px]'>
                                                    <CategoryIcon className='w-[18px] opacity-75 mr-[2px]'/>
                                                    <select
                                                        {...form.register('cateId', { required: true })}
                                                        disabled={ isLoadingMemo.current || !isShow }
                                                        className='w-[130px] text-[13px] text-gray-500 bg-transparent'
                                                    >
                                                        <option value={0}>
                                                            전체메모
                                                        </option>
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