import { Popover, Transition} from "@headlessui/react";
import React, {Fragment, useState} from "react";
import {DeleteIcon, EditIcon, ThreeDotMenuIcon} from "../../../../assets/vectors";
import {ConfirmButton} from "../../../../common/components/ConfirmButton";
import {RootState} from "../../../../store";
import {useSelector} from "react-redux";
import {useHandleQueryStr} from "../../../../hooks/useHandleQueryStr";
import {deleteMemo, refreshMemos} from "../../../../store/slices/memo.slice";

export const SavedMemoMenuPopover = ({ memoId }: { memoId: number }) => {
    const { menuQueryStr, tagQueryStr, cateQueryStr } = useHandleQueryStr();
    const { data } = useSelector((state: RootState) => state.memo);

    const [isOpen, setIsOpen] = useState(false);

    const handleDeleteMemo = () => {
        deleteMemo(memoId);
        refreshMemos({
            offset: 0,
            limit: data.memos.length,
            search: '',
            menuQueryStr,
            tagQueryStr,
            cateQueryStr: Number(cateQueryStr) || null,
        });
    }

    const handleConfirmModal = (event) => {
        event.stopPropagation();
        setIsOpen(true);
    }

    return (
        <>
            <Popover className="relative h-fit">
                {({open, close}) => {
                    return <>
                        <Popover.Button className={`${open && 'bg-black bg-opacity-10'} hover:bg-black hover:bg-opacity-10 p-1px rounded-full w-26px h-26px`}>
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
                            <Popover.Panel className="absolute z-10 mt-3 right-0 bottom-[130%] px-0 w-[150px]" static>
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
                                        onClick={handleConfirmModal}
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
            <ConfirmButton
                options={{
                    setForeignSetOpen: setIsOpen,
                    foreignSetOpen: isOpen,
                    subject: `메모를 삭제하시겠습니까?`,
                    subtitle: "메모를 삭제하시면 다시 되돌릴 수 없습니다.",
                    confirmText: "삭제",
                    isNegative: true,
                    confirmCallback: handleDeleteMemo,
                }}
                className='absolute z-50'
            >
                <></>
            </ConfirmButton>
        </>

    )
}