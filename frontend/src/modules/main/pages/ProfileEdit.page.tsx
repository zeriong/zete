import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {useForm} from 'react-hook-form';
import {FuncButton} from '../../../common/components/FuncButton';
import {showAlert} from '../../../store/alert/alert.actions';
import {useLocation, useNavigate} from 'react-router-dom';
import {Api} from '../../../openapi/api';
import {setUserReducer} from '../../../store/user/user.slice';
import {PATTERNS} from '../../../common/constants';
import {UpdateAccountInput} from '../../../openapi/generated';

export const ProfileEditPage = () => {
    const { VALID_PASSWORD, INPUT_PASSWORD, EMAIL, INPUT_PHONE } = PATTERNS;

    const [showPW, setShowPW] = useState(false);
    const [showConfirmPW, setShowConfirmPW] = useState(false);
    const [occurError, setOccurError] = useState('');
    const [isRender, setIsRender] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data: userState, loading } = useSelector((state: RootState) => (state.user));

    const form = useForm<UpdateAccountInput & { passwordConfirm: string | null }>({
        mode: 'onChange',
        defaultValues: {
            name: userState.name,
            email: userState.email,
            mobile: userState.mobile,
        },
    });

    const subTitleStyle = 'font-bold md:text-[18px] text-[14px] text-[#5f5f5f]';
    const inputStyle = 'border border-gray-400 rounded px-[8px] py-[4px] md:w-[384px] w-full';

    const toggleShowConfirmPW = () => setShowConfirmPW(!showConfirmPW);
    const toggleShowPW = () => setShowPW(!showPW);

    const onSubmit = form.handleSubmit(async () => {
        const { email, password, name, mobile } = form.getValues();
        await Api.user.updateProfile({ email, name, mobile, password })
            .then((res) => {
                console.log(res.data);
                if (res.data.success) {
                    dispatch(setUserReducer({...userState, email, name, mobile }))
                    showAlert('✔ 회원정보 수정이 완료되었습니다!');
                    return navigate(-1);
                }
                setOccurError(res.data.error);
                showAlert('❌ 회원정보 수정에 실패했습니다.');
            })
            .catch(e => console.log(e));
    });

    useEffect(() => form.reset(), [form.reset, userState]);

    useEffect(() => setIsRender(true),[]);

    return  loading ? <div>로딩중...</div> :
        <div className='w-full min-h-[640px] md:min-h-[700px] h-full relative flex justify-center items-center overflow-hidden'>
            <form
                onSubmit={ onSubmit }
                className={`flex flex-col justify-center relative bg-white text-start items-center shadow-2xl transition-all ease-in-out duration-500
                md:gap-[16px] md:p-[20px] md:rounded-[16px] md:border md:border-gray-300 md:w-auto md:h-auto
                h-full w-full gap-[14px] px-[16px]
                ${isRender ? 'bottom-0' : '-bottom-full'}`}
            >
                <h1 className='font-extrabold text-[24px] md:text-[30px] text-center'>
                    프로필 변경
                </h1>
                <div className='md:w-auto w-full md:px-0'>
                    <h2 className={ subTitleStyle }>
                        이름
                    </h2>
                    <input
                        {...form.register('name', {
                            required: true,
                            minLength: 2, maxLength: 30,
                        })}
                        tabIndex={ 1 }
                        placeholder='수정할 이름을 입력해주세요.'
                        className={ inputStyle }
                    />
                    <p className='mt-[4px] text-red-500 [12px] font-normal h-[12px]'>
                        { form.formState.errors.name && '성함을 입력해 주시기 바랍니다.' }
                    </p>
                </div>
                <div className='md:w-auto w-full md:px-0'>
                    <p className='absolute -top-[20px] text-red-500 font-bold'>
                        { occurError }
                    </p>
                    <h2 className={ subTitleStyle }>
                        이메일
                        <span className='md:text-[14px] text-[12px] text-orange-400/80'>
                                &nbsp;(현계정에 등록된 이메일 외 중복이메일은 등록불가)
                        </span>
                    </h2>
                    <input
                        {...form.register('email', {
                            required: true,
                            minLength: 6, maxLength: 64,
                            pattern: EMAIL,
                        })}
                        tabIndex={ 2 }
                        placeholder='변경할 이메일을 입력해주세요.'
                        className={ inputStyle }
                    />
                    <p className='mt-1 text-red-500 [12px] font-normal h-3'>
                        { form.formState.errors.email && '이메일을 입력해주시기 바랍니다.' }
                    </p>
                </div>
                <div className='md:w-auto w-full md:px-0'>
                    <h2 className={ subTitleStyle }>
                        휴대전화번호
                    </h2>
                    <input
                        {...form.register('mobile', {
                            required: true,
                            minLength: 13, maxLength: 14,
                            onChange: (event) => {
                                const value = event.target.value.substring(0, 13).replace(/[^0-9]/g, '')
                                    .replace(INPUT_PHONE, '$1-$2-$3').replace(/(-{1,2})$/g, '');
                                event.target.value = value;
                            },
                        })}
                        type='text'
                        tabIndex={ 3 }
                        placeholder='휴대폰번호를 입력해주세요.'
                        className={ inputStyle }
                    />
                    <p className='mt-1 text-red-500 [12px] font-normal h-3'>
                        { form.formState.errors.mobile && '휴대전화번호를 입력해주세요.' }
                    </p>
                </div>
                <h2 className='text-center font-extrabold md:text-[18px] mt-[12px] text-[15px] text-[#4f4f4f]'>
                    { '< 비밀변호 변경은 필수입력 사항이 아닙니다. >' }
                </h2>
                <div className='md:w-auto w-full md:px-0'>
                    <h2 className={ subTitleStyle }>
                        비밀번호 변경
                    </h2>
                    <input
                        {...form.register('password', {
                            required: false,
                            minLength: 8, maxLength: 64,
                            pattern: VALID_PASSWORD,
                            onChange: (event) => {
                                // mask
                                const value = event.target.value;
                                event.target.value = value.replace(INPUT_PASSWORD, '');
                            },
                        })}
                        type={ showPW ? 'text' : 'password' }
                        tabIndex={ 4 }
                        placeholder='수정할 비밀번호를 입력해주세요.'
                        className={ inputStyle }
                    />
                    <div className='flex justify-between mb-[18px] md:w-96 w-full'>
                        <div className='mt-[4px] text-red-500 text-[11px] font-normal h-[12px]'>
                            {form.formState.errors.password &&
                                <h2 className='relative'>
                                    비밀번호는 최소 8자입니다.
                                    <h3 className='absolute top-[80%] text-[9px] whitespace-nowrap'>
                                        숫자, 영문, 특수문자
                                        <span className='px-[2px] mr-[2px] overflow-hidden font-bold'>
                                            @$!%*#?&
                                        </span>
                                        를 포함해야 합니다.
                                    </h3>
                                </h2>
                            }
                        </div>
                        <button
                            type='button'
                            onClick={ toggleShowPW }
                            className='cursor-pointer [12px] bg-gray-500 h-fit text-gray-100 px-2 mr-1'
                        >
                            { showPW ? '비밀번호 숨김' : '비밀번호 확인' }
                        </button>
                    </div>
                    <h2 className={ subTitleStyle }>
                        비밀번호 변경 재확인
                    </h2>
                    <input
                        {...form.register('passwordConfirm', {
                            required: false,
                            minLength: 8, maxLength: 64,
                            pattern: VALID_PASSWORD,
                            validate: (value, data) => value === data.password,
                            onChange: (event) => {
                                // mask
                                const value = event.target.value;
                                event.target.value = value.replace(INPUT_PASSWORD, '');
                            },
                        })}
                        type={ showConfirmPW ? 'text' : 'password' }
                        tabIndex={ 5 }
                        placeholder='비밀번호를 다시 한번 입력해주세요.'
                        className={ inputStyle }
                    />
                    <div className='flex justify-between md:w-96 w-full'>
                        <p className='mt-1 text-red-500 [12px] font-normal h-3'>
                            { form.formState.errors.passwordConfirm && '비밀번호가 동일하지 않습니다.' }
                        </p>
                        <button
                            type='button'
                            onClick={ toggleShowConfirmPW }
                            className='cursor-pointer [12px] bg-gray-500 h-fit text-gray-100 px-2 mr-1'
                        >
                            { showConfirmPW ? '비밀번호 숨김' : '비밀번호 확인' }
                        </button>
                    </div>
                </div>
                <FuncButton
                    options={{
                        text: '프로필 변경하기',
                        disabled: !form.formState.isValid,
                        loading: loading,
                    }}
                    type='submit'
                    className='mt-[32px] w-full py-[8px] flex justify-center mb-[12px] cursor-pointer text-[18px] md:text-[22px] items-center bg-orange-500 rounded-[16px] text-white'
                />
            </form>
        </div>
};