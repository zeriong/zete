import React, {Fragment} from 'react';
import {Dialog, Transition } from '@headlessui/react';

export const SuccessSignupModal = (props: { isShow: boolean, setIsShow: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const closeModal = () => props.setIsShow(false);

    return (
        <Transition appear show={ props.isShow } as={ Fragment }>
            <Dialog as='div' className='relative z-20' onClose={ closeModal }>
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
                <article className='fixed inset-0 overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center p-4 text-center'>
                        <Transition.Child
                            as={ Fragment }
                            enter='ease-out duration-300'
                            enterFrom='opacity-0 scale-95'
                            enterTo='opacity-100 scale-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100 scale-100'
                            leaveTo='opacity-0 scale-95'
                        >
                            <Dialog.Panel className='w-full max-w-sm transform overflow-hidden rounded-lg bg-white p-24px md:p-32px text-left align-middle shadow-xl transition-all'>
                                <h1 className='text-24 mb-20px'>
                                    회원가입 성공!
                                </h1>
                                <h2 className='mb-24px'>
                                    Zeriong Kepp 서비스를 무료로 이용해보세요.
                                </h2>
                                <button
                                    type='button'
                                    onClick={ closeModal }
                                    className='w-[160px] flex justify-center cursor-pointer rounded-[8px] p-4px bg-orange-500 text-white m-auto'
                                >
                                    확인
                                </button>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </article>
            </Dialog>
        </Transition>
    );
};