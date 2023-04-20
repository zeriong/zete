import {Dialog, Popover, Transition} from "@headlessui/react";
import React, {Fragment, useRef, useState} from "react";
import {DeleteIcon, EditIcon, ThreeDotMenuIcon} from "../components/vectors";
import {DELETE_MEMO} from "../store/slices/memo.slice";
import {setData} from "../utile";
import {useDispatch} from "react-redux";

export const SavedMemoMenuPopov = ({ memoId }: { memoId: number }) => {
    const deleteButtonRef = useRef(null)

    const dispatch= useDispatch();

    const [delAgree, setDelAgree] = useState(false);

    const areYouSure = (event) => {
        event.stopPropagation();
        setDelAgree(true);
    }

    const deleteMemo = (event) => {
        event.stopPropagation();
        setDelAgree(true);
        dispatch(DELETE_MEMO(memoId));
        setData();
    }

    return (
        <>
            <Popover className="relative h-fit">
                {({open, close}) => {
                    return <>
                        <Popover.Button
                            className={`${open && 'bg-black bg-opacity-10'}
                        hover:bg-black hover:bg-opacity-10 p-1px rounded-full w-26px h-26px`}
                        >
                            <ThreeDotMenuIcon className='fill-zete-dark-200 cursor-pointer'/>
                        </Popover.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel className="absolute z-10 mt-3 left-0 bottom-[130%] px-0 w-[150px]">
                                <ul className="relative bg-white py-6px text-14 font-normal text-start text-zete-dark-300 cursor-default overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 whitespace-nowrap">
                                    <li className='flex items-center cursor-pointer py-5px px-12px hover:bg-black hover:bg-opacity-5'>
                                        <>
                                            <EditIcon className='fill-zete-dark-100 mr-6px w-18px h-18px'/>
                                        </>
                                        <p>
                                            메모수정
                                        </p>
                                    </li>
                                    <li
                                        className='flex items-center cursor-pointer py-5px px-12px hover:bg-black hover:bg-opacity-5'
                                        onClick={areYouSure}
                                    >
                                        <>
                                            <DeleteIcon className='fill-zete-dark-100 mr-6px w-18px h-18px'/>
                                        </>
                                        <p>
                                            메모삭제
                                        </p>
                                    </li>
                                </ul>
                            </Popover.Panel>
                        </Transition>
                    </>
                }}
            </Popover>
            <Transition appear show={delAgree} as={Fragment}>
                <Dialog
                    as="div"
                    static
                    className="relative z-40"
                    onClose={() => {
                        setDelAgree(false);
                    }}
                    open={delAgree}
                    initialFocus={deleteButtonRef}
                    onClick={(e) => e.stopPropagation()}
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
                                <Dialog.Panel className="relative w-[350px] transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all rounded-[5px]">
                                    <article className='p-16px font-light text-15 text-zete-dark-500'>
                                        <h1 className='mb-10px'>
                                            해당메모를 삭제하시겠습니까?
                                        </h1>
                                        <p>
                                            계속하시려면
                                            <span className='mr-2px text-blue-500 font-normal'> 삭제</span>
                                            를 눌러주세요.
                                        </p>
                                    </article>
                                    <div className="w-full text-15 font-normal flex justify-end p-1 pb-16px pr-14px">
                                        <button
                                            type='button'
                                            onClick={() => setDelAgree(false)}
                                            className='text-zete-dark-500 py-6px px-16px hover:bg-zete-light-gray-200 rounded-[4px] mr-8px'
                                        >
                                            취소
                                        </button>
                                        <button
                                            ref={deleteButtonRef}
                                            type='button'
                                            onClick={deleteMemo}
                                            className='text-blue-500 py-6px px-16px hover:bg-zete-light-gray-200 rounded-[4px]'
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