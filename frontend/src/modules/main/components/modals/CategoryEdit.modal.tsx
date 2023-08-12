import React, {Fragment, useEffect, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {CatePlusIcon, DeleteIcon, FillCategoryIcon, ModifyIcon} from '../../../../assets/vectors';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store';
import CustomScroller from '../../../../common/components/customScroller';
import {showAlert} from '../../../../store/alert/alert.actions';
import {ConfirmButton} from '../../../../common/components/ConfirmButton';
import {createCategoryAction, deleteCategoryAction, getCategoriesAction, updateCategoryAction} from '../../../../store/memo/memo.actions';
import {CoreOutput} from '../../../../openapi/generated';

export const CategoryEditModal = (props: { buttonText: string }) => {
    const [isShow, setIsShow] = useState(false);
    const [createInputValue, setCreateInputValue] = useState('');
    const [updateInputValues, setUpdateInputValues] = useState<{ [key: number]: string }>({});

    const dispatch = useDispatch<AppDispatch>();
    const { cate } = useSelector((state: RootState) => state.memo);

    const openModal = () => setIsShow(true);

    const closeModal = () => {
        // input 초기화
        setCreateInputValue('');
        setIsShow(false);
    }

    // 카테고리 생성 submit
    const createCategorySubmit = (e) => {
        e.preventDefault();
        if (createInputValue) {
            // 카테고리 생성
            dispatch(createCategoryAction({ name: createInputValue }));
            // input 초기화
            setCreateInputValue('');
        }
    }

    // 카테고리 업데이트 submit
    const updateCategorySubmit = (id: number, prevVal: string, input: any) => {
        const val = input.value;
        // 입력 값이 있고 기존 값과 다르다면
        if (val && val.length > 1 && val !== prevVal) {
            dispatch(updateCategoryAction({ id: id, name: val })).then((value) => {
                const data = value.payload as CoreOutput;
                // 업데이트 실패시 원래 값으로 되돌림
                if (!data.success) {
                    input.value = prevVal;
                    showAlert(data.error);
                }
            });
        }
    }

    // 모달 오픈시 카테고리 목록 갱신
    useEffect(() => {
        if (isShow) dispatch(getCategoriesAction());
        // 업데이트 관리용 input values 초기화
        setUpdateInputValues({});
    },[isShow]);

    return (
        <>
            <button
                type='button'
                onClick={ openModal }
                className='flex w-full justify-between items-center px-[10px] py-[8px] rounded-[5px] mt-[4px] h-[42px]'
            >
                <div className='flex justify-start items-center w-full font-light transition-all duration-150'>
                    <ModifyIcon className='mr-[10px]'/>
                    <span>
                        { props.buttonText }
                    </span>
                </div>
            </button>
            <Transition appear show={ isShow } as={ Fragment }>
                <Dialog
                    as='div'
                    className='relative z-30'
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
                        <div className='fixed inset-0 bg-black bg-opacity-40'/>
                    </Transition.Child>
                    <div className='fixed inset-0'>
                        <div className='close-modal-background flex min-h-full items-center justify-center p-[16px] text-center'>
                            <Transition.Child
                                as={Fragment}
                                enter='ease-out duration-300'
                                enterFrom='opacity-0 scale-95'
                                enterTo='opacity-100 scale-100'
                                leave='ease-in duration-200'
                                leaveFrom='opacity-100 scale-100'
                                leaveTo='opacity-0 scale-95'
                            >
                                <Dialog.Panel className='w-[300px] relative transform overflow-hidden bg-white text-left shadow-xl'>
                                    <div className='relative h-[430px] w-full p-[16px]'>
                                        <CustomScroller>
                                            <p className='text-zete-dark-400'>
                                                카테고리 추가/수정
                                            </p>
                                            <div className='py-[16px] px-[8px] text-[15px]'>
                                                <form
                                                    onSubmit={ createCategorySubmit }
                                                    className='flex items-center'
                                                >
                                                    <ModifyIcon className='min-w-[22px] mr-[16px]'/>
                                                    <input
                                                        placeholder='새 카테고리 만들기'
                                                        onChange={ (event) => setCreateInputValue(event.target.value) }
                                                        value={ createInputValue }
                                                        className='placeholder:text-zete-dark-300 placeholder:font-thin pb-[5px] border-b border-zete-memo-border
                                                        text-zete-dark-300 w-full'
                                                    />
                                                    <button
                                                        type='submit'
                                                        className='flex justify-center items-center rounded-full p-[2px] ml-[8px] hover:bg-zete-light-gray-200'
                                                    >
                                                        <CatePlusIcon className='fill-zete-dark-100'/>
                                                    </button>
                                                </form>
                                                <ul className='text-zete-dark-200 grid gap-[16px] py-[20px]'>
                                                    {cate.list?.map((memo, idx) => (
                                                        <li key={ idx }>
                                                            <form
                                                                onSubmit={(event) => {
                                                                    event.preventDefault()
                                                                    const input = event.target[0];
                                                                    updateCategorySubmit(memo.id, memo.name, input);
                                                                }}
                                                                onBlur={(event) => {
                                                                    const input = event.target;
                                                                    updateCategorySubmit(memo.id, memo.name, input);
                                                                }}
                                                                className='flex items-center'
                                                            >
                                                                <FillCategoryIcon className='relative -left-[3px] fill-zete-dark-100 mr-[10px]'/>
                                                                <input
                                                                    placeholder='카테고리 이름을 입력해주세요.'
                                                                    value={ updateInputValues[memo.id] || memo.name }
                                                                    onChange={(event) => {
                                                                        const value = event.target.value
                                                                        setUpdateInputValues((state) => {
                                                                            state[memo.id] = value;
                                                                            return { ...state }
                                                                        })
                                                                    }}
                                                                    className='font-medium w-full flex items-center'
                                                                />
                                                                <ConfirmButton
                                                                    options={{
                                                                        subject: `'${ memo.name }'를 삭제하시겠습니까?`,
                                                                        subtitle: '카테고리가 삭제되면 하위 메모가<br/>모두 삭제됩니다.',
                                                                        confirmText: '삭제',
                                                                        isNegative: true,
                                                                        confirmCallback: () => dispatch(deleteCategoryAction({ id: memo.id })),
                                                                    }}
                                                                    className='relative group p-[6px] rounded-full hover:bg-zete-light-gray-200 -right-[2px]'
                                                                >
                                                                    <DeleteIcon className='fill-zete-dark-100 group-hover:fill-black'/>
                                                                </ConfirmButton>
                                                            </form>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </CustomScroller>
                                    </div>
                                    <div className='w-full flex justify-end p-[4px] py-[16px] pr-[14px] border-t border-zete-memo-border'>
                                        <button
                                            type='button'
                                            onClick={ closeModal }
                                            className='text-[15px] font-normal text-zete-dark-500 py-[8px] px-[22px] hover:bg-zete-light-gray-200 rounded-[4px]'
                                        >
                                            완료
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}