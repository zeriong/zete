import React, {Fragment, ReactNode, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {FuncButton} from "./funcButton";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    options: {
        subject: string,
        subtitle?: string,
        confirmText: string,
        confirmCallback: any,
        isNegative?: boolean
        isMatchText?: boolean,
        matchText?: string,
    }
    children: ReactNode
}
export const ConfirmButton = (props: ButtonProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState('')

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    useEffect(() => {
        setInput('')
    }, [isOpen])

    return (
        <>
            <button {...Object.fromEntries(Object.entries(props).filter(([key]) => key !== 'options'))} type="button" onClick={openModal}>
                {props.children}
            </button>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[100]" onClose={closeModal}>
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
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-[320px] transform overflow-hidden rounded-lg bg-white align-middle shadow-xl transition-all">
                                    <div className="px-4 py-4">
                                        <p className="font-bold text-lg" dangerouslySetInnerHTML={{ __html: props.options.subject }}></p>
                                        {props.options.subtitle && (
                                            <p className="font-light text-[15px] text-gray-600 mt-2" dangerouslySetInnerHTML={{ __html: props.options.subtitle }}></p>
                                        )}
                                        {Boolean(props.options.isMatchText) && (
                                            <div className="mt-3">
                                                <p className="text-[11px] text-gray-500 text-opacity-90 pl-0.5 mb-0.5">{`아래 입력창에 "${props.options.matchText}"를 입력해주세요`}</p>
                                                <input
                                                    value={input}
                                                    onChange={(data) => {
                                                        setInput(data.target.value)
                                                    }}
                                                    placeholder={props.options.matchText}
                                                    className="w-full text-center border border-gray-300 rounded-md px-2 py-1 placeholder:text-gray-400 placeholder:font-light placeholder:text-opacity-80"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 text-sm font-medium">
                                        <>
                                            <FuncButton
                                                type="button"
                                                options={{ disabled: Boolean(props.options.isMatchText) ? input !== props.options.matchText : false, loading: false, text: props.options.confirmText }}
                                                className={`py-3 ${(String(props.options.isNegative) === "true") ? 'bg-red-500 bg-opacity-80 text-white' : 'bg-blue-500 bg-opacity-90 text-white'}`}
                                                onClick={() => {
                                                    if (props.options.confirmCallback) {
                                                        props.options.confirmCallback()
                                                    }
                                                    closeModal()
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="ml-[1px] py-3 bg-gray-200"
                                                onClick={() => {
                                                    setIsOpen(false)
                                                }}
                                            >
                                                닫기
                                            </button>
                                        </>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
};