import React, {Fragment, useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {Dialog, Transition } from "@headlessui/react";
import {FuncButton} from "../funcButton";
import {exportApis} from "../../../openapi/generated";
import {Api} from "../../api";

/** 폼항목 */
type FormData = {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    mobile: string;
};

export const SignupModal = (props: { successControl: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isShow, setIsShow] = useState(false);
    const [PwShow, setPwShow] = useState(false);
    const [PwConfirmShow, setPwConfirmShow] = useState(false);
    const [occurError, setOccurError] = useState('');

    /** State Management */
    const { loading } = useSelector((state: RootState) => (state.auth));

    /** 폼 컨트롤 */
    const {
        setValue,
        getValues,
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm<FormData>({ mode: 'onChange' });

    // passwordConfirm === password 검증을 위한 변수
    let password = watch("password", "");

    const setRouterQuery = (key: string, value:string) => {
        searchParams.set(key, value);
        setSearchParams(searchParams);
    };

    let closeModal = () => {
        if (searchParams.get("modal") === "sign-up") {
            searchParams.delete('modal');
            setSearchParams(searchParams);
            setValue('email', "");
            setValue('password', "");
            setValue('passwordConfirm', "");
            setValue('mobile', "");
            setValue('name', "");
            setOccurError('');
        }
    };

    useEffect(() => {
        if (searchParams.get("modal") === "sign-up") setIsShow(true);
        else setIsShow(false);
    },[searchParams]);

    /** submit */
    const onSubmit = handleSubmit(async () => {
        const {email,password,name,mobile} = getValues();
        await Api.user.createAccount(
            {
                "email": email,
                "password": password,
                "name": name,
                "mobile": mobile,
            },)
            .then((res) => {
                if (res.data.success) {
                    closeModal();
                    props.successControl(true);
                }
                else console.log(res.data.error);
            })
            .catch(e => console.log(e));
    });

    return (
        <>
            <Transition appear show={isShow} as={Fragment}>
                <Dialog as="div" className="relative z-30" onClose={closeModal}>
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
                                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-[8px] bg-white p-24px md:p-32px text-left align-middle shadow-xl transition-all">
                                    <p className="text-24 font-bold h-10px">
                                        회원가입
                                    </p>
                                    <p className="absolute top-36px right-36px text-red-500 py-4px px-8px font-bold">
                                        {occurError}
                                    </p>
                                    <form
                                        className="flex flex-col mx-auto mt-48px gap-y-16px justify-center"
                                        onSubmit={onSubmit}
                                    >
                                        <div>
                                            <input
                                                className="border border-gray-400 rounded px-8px py-4px w-full"
                                                {...register("name", { required: true, minLength: 2, maxLength: 30 })}
                                                type="text"
                                                placeholder="이름을 입력해주세요."
                                            />
                                            <p className="mt-4px text-red-500 text-12 font-normal h-12px">
                                                {errors.name && '성함을 입력해 주시기 바랍니다.'}
                                            </p>
                                        </div>
                                        <div>
                                            <input
                                                className="border border-gray-400 rounded px-8px py-4px w-full"
                                                {...register("email", {
                                                    required: true,
                                                    minLength: 6,
                                                    maxLength: 70,
                                                    pattern: /^[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
                                                })}
                                                placeholder="이메일을 입력해주세요."
                                            />
                                            <p className="mt-4px text-red-500 text-12 font-normal h-12px">
                                                {errors.email && '이메일을 입력해주시기 바랍니다.'}
                                            </p>
                                        </div>
                                        <div>
                                            <input
                                                className="border border-gray-400 rounded px-8px py-4px w-full"
                                                {...register("password", { required: true,  minLength: 8, maxLength: 100 })}
                                                type={ PwShow ? "text" : "password" }
                                                placeholder="비밀번호를 입력해주세요."
                                            />
                                            <div className="flex justify-between">
                                                <p className="mt-4px text-red-500 text-12 font-normal h-12px">
                                                    {errors.password && '비밀번호는 최소 8자 이상입니다.'}
                                                </p>
                                                <span
                                                    onClick={()=>{setPwShow(!PwShow)}}
                                                    className='cursor-pointer text-12 bg-gray-600 h-fit text-gray-100 px-8px mr-4px font-light'
                                                >
                                                    { PwShow ? "비밀번호 숨김" : "비밀번호 확인" }
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <input
                                                className="border border-gray-400 rounded px-8px py-4px w-full"
                                                {...register("passwordConfirm", {
                                                    required: true,
                                                    validate: value => value === password
                                                })}
                                                type={ PwConfirmShow ? "text" : "password" }
                                                placeholder="비밀번호를 다시 한번 입력해주세요."
                                            />
                                            <div className="flex justify-between">
                                                <p className="mt-4px text-red-500 text-12 font-normal h-12px">
                                                    {errors.passwordConfirm && '비밀번호가 동일하지 않습니다.'}
                                                </p>
                                                <span
                                                    onClick={()=>{setPwConfirmShow(!PwConfirmShow)}}
                                                    className='cursor-pointer text-12 bg-gray-600 h-fit text-gray-100 px-8px mr-4px font-light'
                                                >
                                                    { PwConfirmShow ? "비밀번호 숨김" : "비밀번호 확인" }
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <input
                                                className="border border-gray-400 rounded px-8px py-4px w-full"
                                                {...register("mobile",
                                                    {
                                                        required: true,
                                                        minLength: 13
                                                    })}
                                                type="text"
                                                placeholder="휴대폰번호를 입력해주세요."
                                                onInput={(e) => {
                                                    let val = e.currentTarget.value.substring(0, 13).replace(/[^0-9]/g, '')
                                                        .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/(-{1,2})$/g, "");
                                                    setValue("mobile", val);
                                                }}
                                            />
                                            <p className="mt-4px text-red-500 text-12 font-normal h-12px">
                                                {errors.mobile && '휴대전화번호를 입력해주세요.'}
                                            </p>
                                        </div>
                                        <FuncButton
                                            type="submit"
                                            className="w-full py-4px bg-orange-500 text-white mx-auto text-center cursor-pointer text-22 items-center rounded-[16px]"
                                            options={{
                                                text: "회원가입",
                                                disabled: !isValid,
                                                loading: loading,
                                            }}
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

export const SuccessSignupModal = () => {
    /** 쿼리를 이용한 모달 팝업 컨트롤 */
    const [searchParams, setSearchParams] = useSearchParams();
    const [isShow, setIsShow] = useState(false);

    let closeModal = () => {
        if (searchParams.get("modal") === "success-signup") {
            searchParams.delete('modal');
            setSearchParams(searchParams);
        }
    };

    useEffect(() => {
        if (searchParams.get("modal") === "success-signup") {
            setIsShow(true);
        } else { setIsShow(false) }
    },[searchParams]);

    return (
        <>
            <Transition appear show={isShow} as={Fragment}>
                <Dialog as="div" className="relative z-20" onClose={closeModal}>
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
                                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-lg bg-white p-24px md:p-32px text-left align-middle shadow-xl transition-all">
                                    <div className="text-24 mb-20px">
                                        회원가입 성공!
                                    </div>
                                    <div className="mb-24px">
                                        Zeriong Kepp 서비스를 무료로 이용해보세요.
                                    </div>
                                    <div
                                        className="w-[160px] flex justify-center cursor-pointer
                                        rounded-[8px] p-4px bg-orange-500 text-white m-auto"
                                        onClick={closeModal}
                                    >
                                        확인
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};