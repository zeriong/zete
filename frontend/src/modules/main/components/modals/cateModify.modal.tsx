import React, {Fragment, useEffect, useRef, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {CatePlusIcon, DeleteIcon, FillCategoryIcon, ModifyIcon} from "../../../../assets/vectors";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store";
import CustomScroller from "../../../../common/components/customScroller";
import {ADD_CATE, createCategory, DELETE_CATE, memoSlice, UPDATE_CATE} from "../../../../store/slices/memo.slice";
import {Api} from "../../../../common/libs/api";
import {Categories} from "../../../../openapi";
import {showAlert} from "../../../../store/slices/alert.slice";

export const CateModifyModal = () => {
    const deleteButtonRef = useRef(null)

    const { cate } = useSelector((state: RootState) => state.memo.data);

    const [isShow, setIsShow] = useState(false);
    const [isAgreeShow, setIsAgreeShow] = useState<boolean>(false);
    const [addInputValues, setAddInputValues] = useState({ addCateName: '' });
    const [updateInputValues, setUpdateInputValues] = useState<{ [key: number]: string }>({});

    const dispatch = useDispatch();

    const closeModal = () => {
        setAddInputValues({ addCateName: '' })
        setIsShow(false)
    }

    // 카테고리 목록에 따른 input state 생성
    useEffect(() => {
        let values = {}
        cate.map((cate) => (
            values = { ...values, [cate.id]: cate.cateName }
        ));
        setUpdateInputValues(values)
    }, [cate])

    // 카테고리 생성 form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        createCategory({ cateName: addInputValues.addCateName })
        setAddInputValues({
            addCateName: ''
        })
    }

    // 카테고리 생성 input change
    const handleInputChange = (e) => {
        setAddInputValues({
            ...addInputValues,
            [e.target.name]: e.target.value,
        })
    }

    // 카테고리 업데이트 input submit
    const handleUpdateFormSubmit = (id: number, prevVal: string, input: any) => {
        const val = input.value
        if (val && val.length > 1 && val !== prevVal) {
            //console.log('handleUpdateFormSubmit - ', val)
            Api().memo.updateCategory({ cateId: id, cateName: val })
                .then((res) => {
                    if (res.data) {
                        if (res.data.success) {
                            dispatch(UPDATE_CATE({ cateId: id, cateName: val }))
                        } else {
                            // 입력 초기화
                            input.value = prevVal
                            showAlert(res.data.error)
                        }
                    }
                })
                .catch((e) => {
                    // 입력 초기화
                    input.value = prevVal
                    console.log('에러: ', e)
                    showAlert("카테고리 업데이트에 실패하였습니다.")
                })
        }
    }

    // 카테고리 업데이트 input change
    const handleUpdateInputChange = (id: number, value: string) => {
        setUpdateInputValues((state) => {
            state[id] = value
            return { ...state }
        })
    }

    useEffect(() => {
        if (isShow) {
            // 모달 오픈시 카테고리 목록 갱신
            loadMemoCategories()
        }
    },[isShow])

    return (
        <>
            <button
                onClick={() => {
                    setIsShow(true);
                }}
                type='button'
                className='flex w-full justify-between items-center px-10px py-8px rounded-[5px] mt-4px h-42px'
            >
                <div className='flex justify-start items-center w-full font-light transition-all duration-150'>
                    <ModifyIcon className='mr-10px'/>
                    <span>{
                        data.cate.length !== 0 ?
                        '카테고리 수정' : '카테고리 추가'
                    }</span>
                </div>
            </button>
            <Transition appear show={isShow} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-30"
                    onClose={closeModal}
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
                        <div className="fixed inset-0 bg-black bg-opacity-40"/>
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
                                <Dialog.Panel
                                    className="w-[300px] relative transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all">
                                    <div className='relative h-[430px] w-full'>
                                        <CustomScroller>
                                            <div className='p-16px w-full h-full'>
                                                <p className="text-zete-dark-400">
                                                    카테고리 수정
                                                </p>
                                                <div className='py-16px px-8px text-15'>
                                                    <form
                                                        onSubmit={addCate}
                                                        className='flex items-center'
                                                    >
                                                        <>
                                                            <ModifyIcon className='min-w-[22px] mr-16px'/>
                                                        </>
                                                        <>
                                                            <input
                                                                placeholder='새 카테고리 만들기'
                                                                onChange={addCateValChange}
                                                                value={addCateValue}
                                                                className='placeholder:text-zete-dark-300 placeholder:font-thin pb-5px border-b border-zete-memo-border text-zete-dark-300 w-full'
                                                            />
                                                        </>
                                                        <button type='submit'
                                                                className='flex justify-center items-center rounded-full p-2px ml-8px hover:bg-zete-light-gray-200'>
                                                            <CatePlusIcon className='fill-zete-dark-100'/>
                                                        </button>
                                                    </form>
                                                    <ul className='text-zete-dark-200 grid gap-16px py-20px'>
                                                        {newCateListNames?.map((val,idx) => {
                                                            const cateId = newCateList[idx].id;
                                                            return (
                                                                <li key={idx}>
                                                                    <form
                                                                        onSubmit={(event) => {
                                                                            updateOneCate({event, val, cateId});
                                                                        }}
                                                                        className='flex items-center'
                                                                    >
                                                                        <>
                                                                            <FillCategoryIcon className='relative -left-3px fill-zete-dark-100 mr-10px' onClick={() => console.log(newCateListNames)}/>
                                                                        </>
                                                                        <input
                                                                            placeholder='수정할 태그를 입력해주세요.'
                                                                            value={val}
                                                                            onChange={(event) => handleUpdateName(idx, event)}
                                                                            className='font-medium w-full flex items-center'
                                                                        />
                                                                        <button
                                                                            type='button'
                                                                            className='relative group p-6px rounded-full hover:bg-zete-light-gray-200 -right-2px'
                                                                            onClick={() => {
                                                                                setGetCateId(cateId)
                                                                                setIsAgreeShow(true);
                                                                            }}
                                                                        >
                                                                            <DeleteIcon className='fill-zete-dark-100 group-hover:fill-black'/>
                                                                        </button>
                                                                    </form>
                                                                </li>
                                                            )
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>
                                        </CustomScroller>
                                    </div>
                                    <div
                                        className="w-full flex justify-end p-1 py-16px pr-14px border-t border-zete-memo-border">
                                        <button
                                            type='button'
                                            onClick={(e) => {
                                                if (categories.some(cate => cate.cateName === addCateValue)) return alert('새 카테고리 이름이 기존 카테고리 이름과 중복됩니다.')
                                                addCate(e);
                                                updateManyCate();
                                            }}
                                            className='text-15 font-normal text-zete-dark-500 py-8px px-22px hover:bg-zete-light-gray-200 rounded-[4px]'
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
            <Transition appear show={isAgreeShow} as={Fragment}>
                <Dialog
                    as="div"
                    static
                    className="relative z-40"
                    onClose={() => setIsAgreeShow(false)}
                    open={isAgreeShow}
                    initialFocus={deleteButtonRef}
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
                        <div className="fixed inset-0 bg-black bg-opacity-40"/>
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
                                <Dialog.Panel
                                    className="relative transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all rounded-[5px]">
                                    <article className='p-16px font-light text-zete-dark-500'>
                                        <h1>
                                            카테고리를 삭제하면 카테고리에 존재하는 모든 메모가 삭제됩니다.
                                        </h1>
                                        <p>
                                            계속하시려면
                                            <span className='mr-2px text-blue-500 font-normal'> 삭제</span>
                                            를 눌러주세요.
                                        </p>
                                    </article>
                                    <div className="w-full flex justify-end p-1 py-16px pr-14px">
                                        <button
                                            type='button'
                                            onClick={() => setIsAgreeShow(false)}
                                            className='text-15 font-normal text-zete-dark-500 py-6px px-20px hover:bg-zete-light-gray-200 rounded-[4px] mr-12px'
                                        >
                                            취소
                                        </button>
                                        <button
                                            ref={deleteButtonRef}
                                            type='button'
                                            onClick={handleDelete}
                                            className='text-15 font-normal text-blue-500 py-6px px-20px hover:bg-zete-light-gray-200 rounded-[4px]'
                                        >
                                            삭제
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