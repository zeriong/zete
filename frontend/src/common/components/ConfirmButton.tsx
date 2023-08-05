import React, {Fragment, ReactNode, useEffect, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {FuncButton} from './FuncButton';
import * as DOMPurify from 'dompurify';
import {stopBubbling} from '../../libs/memo.lib';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    options: {
        foreignSetOpen?: boolean;
        setForeignSetOpen?: React.Dispatch<React.SetStateAction<boolean>>;
        subject: string;
        subtitle?: string;
        confirmText: string;
        confirmCallback: any;
        isNegative?: boolean;
        isMatchText?: boolean;
        matchText?: string;
    }
    children: ReactNode;
}

export const ConfirmButton = (props: ButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');

    const funcButtonOptions = {
        disabled: Boolean(props.options.isMatchText)
            ? input !== props.options.matchText
            : false, loading: false, text: props.options.confirmText
    }

    const buttonPropsOptions = Object.fromEntries(Object.entries(props).filter(([key]) => key !== 'options'));

    const handleFuncButtonOnClick = () => {
        if (props.options.confirmCallback) {
            props.options.confirmCallback();
        }
        closeModal();
    }

    const closeModal = () => {
        if (!props.options.setForeignSetOpen) return setIsOpen(false);
        props.options.setForeignSetOpen(false);
    }

    const openModal = () => {
        if (!props.options.setForeignSetOpen) return setIsOpen(true);
        props.options.setForeignSetOpen(true);
    }

    const handleInput = (e) => setInput(e.target.value);

    useEffect(() => {
        setInput('');
    }, [isOpen]);

    return (
        <>
            <button
                { ...buttonPropsOptions }
                type='button'
                onClick={ openModal }
            >
                { props.children }
            </button>
            <Transition appear show={ props.options.foreignSetOpen || isOpen } as={ Fragment }>
                <Dialog as='div' className='relative z-[100]' onClose={ closeModal }>
                    <Transition.Child
                        as={ Fragment }
                        enter='ease-out duration-300'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                    >
                        <div className='fixed inset-0 bg-black/40'/>
                    </Transition.Child>
                    <div
                        className='fixed inset-0 overflow-y-auto'
                        // 부모요소에 걸린 이벤트 상속방지
                        onClick={ stopBubbling }
                    >
                        <div className='flex min-h-full items-center justify-center p-4 text-center'>
                            <Transition.Child
                                as={Fragment}
                                enter='ease-out duration-300'
                                enterFrom='opacity-0 scale-95'
                                enterTo='opacity-100 scale-100'
                                leave='ease-in duration-200'
                                leaveFrom='opacity-100 scale-100'
                                leaveTo='opacity-0 scale-95'
                            >
                                <Dialog.Panel className='w-full max-w-[320px] transform overflow-hidden rounded-[8px] bg-white align-middle shadow-xl transition-all'>
                                    <div className='px-[16px] py-[16px]'>
                                        <p
                                            className='font-bold text-[18px]'
                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(props.options.subject) }}
                                        />
                                        {props.options.subtitle && (
                                            <p
                                                className='font-light text-[15px] text-gray-600 mt-[32px]'
                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(props.options.subtitle) }}
                                            />
                                        )}
                                        {Boolean(props.options.isMatchText) && (
                                            <div className='mt-[12px]'>
                                                <p className='text-[11px] text-gray-500 text-opacity-90 pl-[2px] mb-[2px]'>
                                                    {`아래 입력창에 '${ props.options.matchText }'를 입력해주세요`}
                                                </p>
                                                <input
                                                    value={ input }
                                                    onChange={ handleInput }
                                                    placeholder={ props.options.matchText }
                                                    className='w-full text-center border border-gray-300 rounded-[6px] px-[8px] py-[4px] placeholder:text-gray-400/80 placeholder:font-light'
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className='grid grid-cols-2 text-[14px] font-medium'>
                                        <FuncButton
                                            onClick={ handleFuncButtonOnClick }
                                            options={ funcButtonOptions }
                                            type='button'
                                            className={`py-[12px] ${ props.options.isNegative ? 'bg-red-500/80 text-white' : 'bg-blue-500/90 text-white' }`}
                                        />
                                        <button
                                            type='button'
                                            className='ml-[1px] py-[12px] bg-gray-200'
                                            onClick={ closeModal }
                                        >
                                            닫기
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
};