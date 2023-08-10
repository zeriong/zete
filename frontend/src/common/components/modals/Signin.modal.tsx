import React, {Fragment, useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {Dialog, Transition } from '@headlessui/react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store';
import {FuncButton} from '../FuncButton';
import {Api} from '../../../openapi/api';
import {LoginInput} from '../../../openapi/generated';
import {PATTERNS} from '../../constants';
import {setLogin, setLogout} from '../../../store/auth/auth.slice';

export const SigninModal = () => {
    const { VALID_PASSWORD, INPUT_PASSWORD, EMAIL } = PATTERNS;
    const { loading } = useSelector((state: RootState) => state.auth);

    const [searchParams, setSearchParams] = useSearchParams();
    const [isShow, setIsShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const form = useForm<LoginInput>({ mode: 'onChange' });

    const openSignupModal = () => {
        searchParams.set('modal', 'sign-up');
        setSearchParams(searchParams);
    }

    const closeModal = () => {
        searchParams.delete('modal');
        setSearchParams(searchParams);
        form.reset();
    }

    const loginSubmit = form.handleSubmit(async () => {
        await Api.auth.login(form.getValues())
            .then((res) => {
                if (!res.data.success) {
                    setErrorMessage(res.data.error);
                    dispatch(setLogout());
                    return;
                }
                closeModal();
                dispatch(setLogin(res.data.accessToken));
                navigate('/memo');
            })
            .catch((e) => {
                setErrorMessage('서버와 통신할 수 없습니다.');
                console.log(e);
            });
    });

    useEffect(() => {
        if (searchParams.get('modal') === 'sign-in') return setIsShow(true);
        setIsShow(false);
    },[searchParams]);

    return (
        <>
            <Transition appear show={ isShow } as={ Fragment }>
                <Dialog as='div' className='relative z-30' onClose={ closeModal }>
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
                                <Dialog.Panel className='w-full max-w-sm transform overflow-hidden rounded-lg bg-white p-[24px] md:p-[32px] text-left align-middle shadow-xl transition-all'>
                                    <h1 className='text-[28px] font-bold'>
                                        로그인
                                    </h1>
                                    <p className='h-[20px] relative top-[16px] text-red-500'>
                                        { errorMessage }
                                    </p>
                                    <form
                                        className='flex flex-col mx-auto mt-[32px] gap-y-[16px]'
                                        onSubmit={ loginSubmit }
                                    >
                                        <div>
                                            <input
                                                {...form.register('email', {
                                                    required: true,
                                                    minLength: 6, maxLength: 70,
                                                    pattern: EMAIL,
                                                })}
                                                placeholder='이메일을 입력해주세요.'
                                                className='border border-gray-400 rounded px-[8px] py-[4px] w-full'
                                            />
                                            <p className='mt-1 text-red-500 text-[12px] font-normal h-[12px]'>
                                                { form.formState.errors.email && '이메일을 입력해주시기 바랍니다.' }
                                            </p>
                                        </div>
                                        <div>
                                            <input
                                                {...form.register('password', {
                                                    required: true,
                                                    minLength: 8, maxLength: 64,
                                                    pattern: VALID_PASSWORD,
                                                    onChange: (event) => {
                                                        // value filter
                                                        const value = event.target.value;
                                                        event.target.value = value.replace(INPUT_PASSWORD, '');
                                                    },
                                                })}
                                                type={ showPassword ? 'text' : 'password' }
                                                placeholder='비밀번호를 입력해주세요.'
                                                className='border border-gray-400 rounded px-[8px] py-[4px] w-full'
                                            />
                                            <div className='flex justify-between'>
                                                <p className='mt-1 text-red-500 text-[12px] font-normal h-[12px]'>
                                                    { form.formState.errors.password && '비밀번호는 최소 8자 이상입니다.' }
                                                </p>
                                                <span
                                                    onClick={ () => setShowPassword(!showPassword) }
                                                    className='cursor-pointer text-[12px] bg-gray-600 h-fit text-gray-100 px-[8px] mr-[4px]'
                                                >
                                                    { showPassword ? '비밀번호 숨김' : '비밀번호 확인' }
                                                </span>
                                            </div>
                                        </div>
                                        <FuncButton
                                            options={{
                                                text: '로그인',
                                                disabled: !form.formState.isValid,
                                                loading: loading,
                                            }}
                                            type='submit'
                                            className='w-full py-[6px] bg-orange-500 text-white mx-auto mt-[12px] text-center cursor-pointer text-[22px] items-center rounded-[16px]'
                                        />
                                        <button
                                            type='button'
                                            onClick={ openSignupModal }
                                            className='w-full py-[6px] bg-orange-500 text-white mx-auto mb-[12px] text-center
                                            cursor-pointer text-[22px] items-center rounded-[16px]'
                                        >
                                            회원가입
                                        </button>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};