import {CategoryIcon, CloseIcon, FillStarIcon, PlusIcon, StarIcon} from '../../../assets/vectors';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store';
import {useForm} from 'react-hook-form';
import {showAlert} from '../../../store/alert/alert.slice';
import {CreateMemoInput, Memo} from '../../../openapi/generated';
import {setDynamicInputWidth, setDynamicTextareaHeight} from '../../../libs/common.lib';
import {useSearchParams} from 'react-router-dom';
import {deleteMemoTag, getCategoryId, handleAddMemoTagSubmit, handleFormSubmit} from '../../../libs/memo.lib';
import {useOutsideClick} from '../../../hooks/useOutsideClick';
import {AskAI} from './AskAI';
import {HorizontalScroll} from '../../../common/components/HorizontalScroll';
import {Api} from '../../../openapi/api';
import {saveMemoReducer} from '../../../store/memo/memo.slice';
import {getCategories} from '../../../store/memo/memo.actions';

export const AddMemo = () => {
    const panelRef = useRef<HTMLDivElement>(null);
    const savedMemo = useRef<Memo | null>(null);
    const saveDelayTimer = useRef<NodeJS.Timeout | null>(null);
    const isSavingMemo = useRef(false);

    const [searchParams] = useSearchParams();
    const [formMode, setFormMode] = useState<'idle' | 'edit' | 'askAI'>('idle');

    const dispatch = useDispatch<AppDispatch>()
    const memoState = useSelector((state: RootState) => state.memo);

    const form = useForm<CreateMemoInput>({ mode: 'onSubmit' });

    // 초기화
    const resetForm = () => {
        form.reset({
            title: '',
            content: '',
            isImportant: false,
            tags: [],
            cateId: getCategoryId(searchParams),
        })
        savedMemo.current = null;
    }

    // 메모 저장
    const saveMemo = async () => {
        const data = form.getValues();
        isSavingMemo.current = true;
        // 신규입력
        if (!savedMemo.current) {
            // 입력된 내용이 있다면 생성
            if (data.title?.length > 0 || data.content?.length > 0) {
                try {
                    const res = await Api.memo.createMemo(data);
                    if (res.data.success) savedMemo.current = res.data.savedMemo;
                    else showAlert(res.data.error);
                } catch (e) {
                    showAlert('메모 저장에 실패하였습니다.');
                }
            }
        } else {
            // 내용이 있는 경우 저장
            if (data.title?.length > 0 || data.content?.length > 0) {
                try {
                    const res = await Api.memo.updateMemo({ ...data, id: savedMemo.current.id });
                    if (res.data.success) savedMemo.current = res.data.savedMemo;
                    else showAlert(res.data.error);
                } catch (e) {
                    showAlert('메모 저장에 실패하였습니다.');
                }
            } else {
                // 저장된 아이디가 존재하지만 내용이 비워진 경우 삭제
                try {
                    const res = await Api.memo.deleteMemo({id: savedMemo.current.id});
                    if (res.data.success) savedMemo.current = null;
                    else showAlert('삭제된 메모입니다.');
                } catch (e) {
                    console.log('메모 삭제 실패, 실패사유: ',e);
                }
            }
        }
        isSavingMemo.current = false
    }

    // 메모 저장 시도
    const tryMemoSave = () => {
        if (saveDelayTimer.current != null) {
            clearTimeout(saveDelayTimer.current);
            saveDelayTimer.current = null;
        }
        // 내용이 있는경우 idle일때 저장하기 때문에 3초로 통신주기를 줄임
        if (saveDelayTimer.current == null) {
            saveDelayTimer.current = setTimeout( async () => {
                if (isSavingMemo.current) tryMemoSave();  // 저장중이라면 연기
                else await saveMemo();  // 저장
            }, 3000);
        }
    };

    // 입력폼 이외 영역 클릭 감지
    useOutsideClick(panelRef, () => setFormMode('idle'));

    // 폼 입력 감지
    useEffect(() => {
        const subscription = form.watch((data, { name, type }) => {
            // 특정 항목이 입력될 경우
            if (name) tryMemoSave();
        });
        return () => subscription.unsubscribe();
    }, [form.watch]);

    //
    useEffect(() => {
        // 대기 모드로 변경시 폼 초기화
        if (formMode === 'idle') {
            (async () => {
                const data = form.getValues();
                // idle일때 timeout 삭제하여 이중통신 방지
                clearTimeout(saveDelayTimer.current);
                saveDelayTimer.current = null;
                // 메모 내용이 존재하는경우 메모 즉시저장
                if (data.title?.length > 0 || data.content?.length > 0) {
                    await saveMemo();
                    // 생성한 메모 카테고리가 현재 카테고리와 같거나 전체메모인 경우만 메모 렌더링
                    if (Number(searchParams.get('cate')) === data.cateId || !searchParams.get('cate')) {
                        dispatch(saveMemoReducer(savedMemo.current));
                    }
                    // 카테고리 최신화
                    dispatch(getCategories());
                }
                resetForm();
            })();
        }
    }, [formMode]);

    useEffect(() => {
        // url 변경시 변경된 카테고리 아이디 지정
        form.setValue('cateId', getCategoryId(searchParams));
    }, [searchParams]);

    return (
        <article
            ref={ panelRef }
            id='add_memo_panel'
            className='relative w-full max-w-[500px]'
        >
            <section
                className={`flex flex-col transition-all duration-300 px-[18px] pb-[10px] pt-[12px] memo-shadow
                    ${formMode === 'askAI' ? 'rounded-t-[8px] bg-white border-t-[10px] border-x-[10px] border-zete-gpt-100'
                    : 'border border-zete-light-gray-500 rounded-[8px] bg-zete-primary-200'}`}
            >
                <form onSubmit={ handleFormSubmit } className='w-full'>
                    {formMode !== 'idle' && (
                        <div className='flex justify-between items-center overflow-hidden pb-[16px]'>
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
                    )}
                    <div className='flex items-center'>
                        <textarea
                            {...form.register('content', {
                                required: false,
                                maxLength: 65535,
                                onChange: (event) => {
                                    setDynamicTextareaHeight(event.target);
                                }
                            })}
                            onFocus={() => {
                                // 대기 상태라면 입력 모드로 전환
                                if (formMode === 'idle') setFormMode('edit');
                            }}
                            tabIndex={ 2 }
                            rows={ 1 }
                            placeholder='메모 작성...'
                            className={`resize-none max-h-[300px] w-full bg-transparent text-zete-gray-500 placeholder:text-zete-gray-500
                            font-light placeholder:text-[15px] memo-custom-scroll ${ formMode === 'idle' ? '!h-[24px]' : 'pb-[30px]' /* 입력창의 하단 여유를 만들기 위한 padding  */ }`}
                        />
                        {formMode === 'idle' && (
                            <button
                                type='button'
                                className={`w-[130px] text-[12px] rounded-[8px] font-normal text-white border-2 border-zete-gpt-200 bg-zete-gpt-500 py-[4px] px-[8px]`}
                                onClick={ () => setFormMode('askAI') }
                            >
                                AI에게 질문하기
                            </button>
                        )}
                    </div>
                </form>
                {formMode !== 'idle' && (
                    <div className='w-full'>
                        <HorizontalScroll>
                            <div className='flex w-full h-full relative pt-[8px] pb-[9px] overflow-y-hidden'>
                                {form.watch('tags')?.map((tag, idx) => (
                                    <div key={ idx } className='relative flex items-center pl-[9px] pr-[21px] py-[1px] mr-[4px] rounded-[4px] bg-black/10 cursor-default'>
                                        <span className='font-light text-[11px] text-zete-dark-400 whitespace-nowrap'>
                                            { tag.name }
                                        </span>
                                        <button
                                            onClick={ () => deleteMemoTag(form, tag.name) }
                                            className='absolute right-[2px] group rounded-full grid place-content-center hover:bg-zete-dark-300 hover:bg-opacity-50 w-[14px] h-[14px]'
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
                        <div className='relative flex justify-between items-center pt-[10px]'>
                            <div className='flex items-center'>
                                <div className='flex items-center border border-zete-memo-border rounded-md px-[8px] py-[4px]'>
                                    <CategoryIcon className='w-[18px] opacity-75 mr-0.5'/>
                                    <select
                                        { ...form.register('cateId', { required: true }) }
                                        className='w-[130px] text-[13px] text-gray-500 bg-transparent'
                                    >
                                        <option value={ 0 }>
                                            전체메모
                                        </option>
                                        {memoState.cate.list.map((cate, idx) => (
                                            <option key={ idx } value={ cate.id }>
                                                { cate.name }
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type='button'
                                    className={`text-[12px] rounded-[8px] font-normal text-white border-2 border-zete-gpt-200 py-[4px] px-[8px] ml-[20px]
                                                ${ formMode === 'askAI' ? 'bg-zete-gpt-100' : 'bg-zete-gpt-500' } `}
                                    onClick={ () => setFormMode(formMode === 'askAI' ? 'edit' : 'askAI') }
                                >
                                    AI에게 질문하기
                                </button>
                            </div>
                            <button type='button' onClick={ () => setFormMode('idle') }>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </section>
            <AskAI isShow={ formMode === 'askAI' } memoForm={ form }/>
        </article>
    )
}
