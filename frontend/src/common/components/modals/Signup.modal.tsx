import React, {Fragment, useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {Dialog, Transition } from '@headlessui/react';
import {FuncButton} from '../FuncButton';
import {CreateAccountInput} from '../../../openapi/generated';
import {Api} from '../../../openapi/api';
import {PATTERNS} from '../../constants';


export const SignupModal = (props: { successControl: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { VALID_PASSWORD, INPUT_PASSWORD, EMAIL } = PATTERNS;
    const { loading } = useSelector((state: RootState) => state.auth);

    const [searchParams, setSearchParams] = useSearchParams();
    const [isShow, setIsShow] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const form = useForm<CreateAccountInput & { passwordConfirm?: string }>({ mode: 'onChange' });

    const closeModal = () => {
        // 폼 초기화
        form.reset();
        // 모달 종료
        searchParams.delete('modal');
        setSearchParams(searchParams);
    };

    useEffect(() => {
        if (searchParams.get('modal') === 'sign-up') return setIsShow(true);
        setIsShow(false);
    },[searchParams]);

    const handleOnSubmit = form.handleSubmit(async () => {
        await Api.user.createAccount(form.getValues())
            .then((res) => {
                if (!res.data.success) return setErrorMessage(res.data.error || '잘못된 접근으로 에러가 발생했습니다.');

                closeModal();
                props.successControl(true);
            })
            .catch(e => console.log(e));
    });

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
                                <Dialog.Panel className='w-full max-w-sm transform overflow-hidden rounded-[8px] bg-white p-[24px] md:p-[32px] text-left align-middle shadow-xl transition-all'>
                                    <h1 className='text-[26px] font-bold h-[10px]'>
                                        회원가입
                                    </h1>
                                    <p className='absolute top-[36px] right-[36px] text-red-500 py-[4px] px-[8px] font-bold'>
                                        { errorMessage }
                                    </p>
                                    <form
                                        className='flex flex-col mx-auto mt-[50px] gap-y-[20px] justify-center'
                                        onSubmit={ handleOnSubmit }
                                    >
                                        <div>
                                            <input
                                                {...form.register('name', {
                                                    required: true,
                                                    minLength: 2, maxLength: 32,
                                                })}
                                                type='text'
                                                placeholder='이름을 입력해주세요.'
                                                className='border border-gray-400 rounded px-[8px] py-[4px] w-full text-[18px]'
                                            />
                                            <p className='mt-[4px] text-red-500 text-[11px] font-normal h-[12px]'>
                                                { form.formState.errors.name && '성함을 입력해 주시기 바랍니다.' }
                                            </p>
                                        </div>
                                        <div>
                                            <input
                                                {...form.register('email', {
                                                    required: true,
                                                    minLength: 6, maxLength: 64,
                                                    pattern: EMAIL,
                                                })}
                                                placeholder='이메일을 입력해주세요.'
                                                className='border border-gray-400 rounded px-[8px] py-[4px] w-full text-[18px]'
                                            />
                                            <p className='mt-[4px] text-red-500 text-[11px] font-normal h-[12px]'>
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
                                                        // mask
                                                        const value = event.target.value;
                                                        event.target.value = value.replace(INPUT_PASSWORD, '');
                                                    },
                                                })}
                                                type={ showPassword ? 'text' : 'password' }
                                                placeholder='비밀번호를 입력해주세요.'
                                                className='border border-gray-400 rounded px-[8px] py-[4px] w-full text-[18px]'
                                            />
                                            <div className='flex justify-between'>
                                                <div className='mt-[4px] text-red-500 text-[11px] font-normal h-[12px]'>
                                                    {form.formState.errors.password &&
                                                        <div className='relative'>
                                                            <p>비밀번호는 최소 8자입니다.</p>
                                                            <h2 className='absolute top-[80%] text-[9px] whitespace-nowrap'>
                                                                숫자, 영문, 특수문자
                                                                <span className='px-[2px] mr-[2px] overflow-hidden font-bold'>
                                                                    @$!%*#?&
                                                                </span>
                                                                를 포함해야 합니다.
                                                            </h2>
                                                        </div>
                                                    }
                                                </div>
                                                <span
                                                    onClick={ () => setShowPassword(!showPassword) }
                                                    className='cursor-pointer text-[12px] bg-gray-600 h-fit text-gray-100 px-[8px] mr-[4px] font-light'
                                                >
                                                    { showPassword ? '비밀번호 숨김' : '비밀번호 확인' }
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <input
                                                {...form.register('passwordConfirm', {
                                                    required: true,
                                                    minLength: 8, maxLength: 64,
                                                    pattern: VALID_PASSWORD,
                                                    validate: (value, data) => value === data.password,
                                                    onChange: (event) => {
                                                        // mask
                                                        const value = event.target.value;
                                                        event.target.value = value.replace(INPUT_PASSWORD, '');
                                                    },
                                                })}
                                                type={ showPasswordConfirm ? 'text' : 'password' }
                                                placeholder='비밀번호를 다시 한번 입력해주세요.'
                                                className='border border-gray-400 rounded px-[8px] py-[4px] w-full text-[18px]'
                                            />
                                            <div className='flex justify-between'>
                                                <p className='mt-[4px] text-red-500 text-[12px] font-normal h-[12px]'>
                                                    { form.formState.errors.passwordConfirm && '비밀번호가 동일하지 않습니다.' }
                                                </p>
                                                <span
                                                    onClick={ () => setShowPasswordConfirm(!showPasswordConfirm) }
                                                    className='cursor-pointer text-[12px] bg-gray-600 h-fit text-gray-100 px-[8px] mr-[4px] font-light'
                                                >
                                                    { showPasswordConfirm ? '비밀번호 숨김' : '비밀번호 확인' }
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <input
                                                {...form.register('mobile', {
                                                    required: true,
                                                    minLength: 13,
                                                    onChange: (event) => {
                                                        const value = event.target.value.substring(0, 13).replace(/[^0-9]/g, '')
                                                            .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3').replace(/(-{1,2})$/g, '');
                                                        event.target.value = value;
                                                    },
                                                })}
                                                type='text'
                                                placeholder='휴대폰번호를 입력해주세요.'
                                                className='border border-gray-400 rounded px-[8px] py-[4px] w-full text-[18px]'
                                            />
                                            <p className='mt-[4px] text-red-500 text-[12px] font-normal h-[12px]'>
                                                { form.formState.errors.mobile && '휴대전화번호를 입력해주세요.' }
                                            </p>
                                        </div>
                                        <FuncButton
                                            options={{
                                                text: '회원가입',
                                                disabled: !form.formState.isValid,
                                                loading: loading,
                                            }}
                                            type='submit'
                                            className='w-full py-[6px] bg-orange-500 text-white mx-auto text-center cursor-pointer text-[22px] items-center rounded-[16px]'
                                        />
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
