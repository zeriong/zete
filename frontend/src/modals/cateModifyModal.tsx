import React, {Fragment, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {CatePlusIcon, DeleteIcon, FillCategoryIcon, ModifyIcon} from "../components/vectors";
import {useDispatch, useSelector} from "react-redux";
import {DELETE_CATE, SET_CATE} from "../store/slices/memo.slice";
import {RootState} from "../store";
import CustomScroller from "../components/customScroller";
import {setData} from "../utile";

export const CateModifyModal = () => {
    const [isShow, setIsShow] = useState(false);
    const [isAgreeShow, setIsAgreeShow] = useState(false);
    const [cateValue, setCateValue] = useState('');
    const [getCateId, setGetCateId] = useState(0);

    const dispatch = useDispatch();

    const { tableArr } = useSelector((state: RootState) => state.memo);

    const cateValChange = (e: React.ChangeEvent<HTMLInputElement>) => setCateValue(e.currentTarget.value);
    const handleDelete = () => {
        setIsAgreeShow(false);
        deleteCate(getCateId);
    }

    const deleteCate = (memoId: number) => {
        dispatch(DELETE_CATE(memoId));
        setData();
    }

    const addCate = (e: any) => {
        const cateList = tableArr.categories.map((cate) => cate.cateName);
        e.preventDefault();
        if (cateList.find((list) => list === cateValue)) {
            return alert('중복된 카테고리');
        }
        dispatch(SET_CATE({ cateName: cateValue }));
        setData();

        setCateValue('');
    }

    useEffect(() => {
    },[])

    return (
        <>
            <button
                onClick={() => setIsShow(true)}
                type='button'
                className='flex w-full justify-between items-center px-10px py-8px rounded-[5px] mt-4px h-42px'
            >
                <div className='flex justify-start items-center w-full font-light transition-all duration-150'>
                    <ModifyIcon className='mr-10px'/>
                    <span>{
                        tableArr.categories.length !== 0 ?
                        '카테고리 수정' : '카테고리 추가'
                    }</span>
                </div>
            </button>
            <Transition appear show={isShow} as={Fragment}>
                <Dialog as="div" className="relative z-30" onClose={() => setIsShow(false)}>
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
                            onClick={() => {
                                setCateValue('');
                            }}
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
                                <Dialog.Panel className="w-[300px] relative transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all">
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
                                                                onChange={cateValChange}
                                                                value={cateValue}
                                                                className='placeholder:text-zete-dark-300 placeholder:font-thin pb-5px border-b border-zete-memo-border text-zete-dark-300 w-full'
                                                            />
                                                        </>
                                                        <button type='submit' className='flex justify-center items-center rounded-full p-2px ml-8px hover:bg-zete-light-gray-200'>
                                                            <CatePlusIcon className='fill-zete-dark-100'/>
                                                        </button>
                                                    </form>
                                                    <form
                                                        onSubmit={(e)=> {
                                                            e.preventDefault()
                                                        }}
                                                        className='py-20px'
                                                    >
                                                        <ul className='text-zete-dark-200 grid gap-16px'>
                                                            {tableArr['categories']?.map((val,idx) => {
                                                                return (
                                                                    <li key={idx} className='flex'>
                                                                        <>
                                                                            <FillCategoryIcon className='relative -left-3px fill-zete-dark-100 mr-10px'/>
                                                                        </>
                                                                        <p className='font-medium w-full'>
                                                                            {val.cateName}
                                                                        </p>
                                                                        <button
                                                                            type='button'
                                                                            className='relative group p-6px rounded-full hover:bg-zete-light-gray-200 -right-2px'
                                                                            onClick={() => {
                                                                                setGetCateId(val.cateId);
                                                                                setIsAgreeShow(true);
                                                                            }}
                                                                        >
                                                                            <DeleteIcon className='fill-zete-dark-100 group-hover:fill-black'/>
                                                                        </button>
                                                                    </li>
                                                                )
                                                            })}
                                                        </ul>
                                                    </form>
                                                </div>
                                            </div>
                                        </CustomScroller>
                                    </div>
                                    <div className="w-full flex justify-end p-1 py-16px pr-14px border-t border-zete-memo-border">
                                        <button
                                            type='button'
                                            onClick={(e) => {
                                                setIsShow(false);
                                                addCate(e);
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
                <Dialog as="div" className="relative z-40" onClose={() => setIsAgreeShow(false)}>
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