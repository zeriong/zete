import React, {Fragment, useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import {Dialog, Transition } from "@headlessui/react";
import {SET_LOGIN, SET_LOGOUT } from "../../../store/slices/auth.slice";
import {SET_USER} from "../../../store/slices/user.slice";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";

import {Api} from "../../libs/api";
import {FuncButton} from "../funcButton";
/** 폼항목 */
type FormData = {
    email: string;
    password: string;
};

export const SigninModal = () => {

    // 쿼리를 이용한 모달 팝업 컨트롤
    const [searchParams, setSearchParams] = useSearchParams();
    const [isShow, setIsShow] = useState(false);
    const navigate = useNavigate();
    const setRouterQuery = (key: string, value:string) => {
        searchParams.set(key, value);
        setSearchParams(searchParams);
    };

    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => (state.auth));

    let closeModal = () => {
        if (searchParams.get("modal") === "sign-in") {
            searchParams.delete('modal');
            setSearchParams(searchParams);
            setValue('email', "");
            setValue('password', "");
            setOccurError('');
            reset();
        }
    };

    useEffect(() => {
        if (searchParams.get("modal") === "sign-in") {
            setIsShow(true);
        } else { setIsShow(false) }
        console.log(typeof loading)
    },[searchParams]);

    // 폼 컨트롤
    const {
        reset,
        setValue,
        getValues,
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<FormData>({ mode: 'onChange' });

    const [PwShow, setPwShow] = useState(false);
    const [occurError, setOccurError] = useState('');

    // submit
    const onSubmit = handleSubmit(async () => {
        const {email,password} = getValues();
        await Api().auth.login(
            {
                email, password,
            },)
            .then((res) => {
                console.log(res.data);
                if (res.data.success) {
                    dispatch(SET_LOGIN(res.data.accessToken));
                    dispatch(SET_USER(res.data.user));
                    closeModal();
                    setValue('email', "");
                    setValue('password', "");
                    navigate('/memo');
                } else {
                    setOccurError(res.data.error);
                    dispatch(SET_LOGOUT());
                }
            })
            .catch((e) => {
                console.log(e);
            });
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
                                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-lg bg-white p-24px md:p-32px text-left align-middle shadow-xl transition-all">
                                    <div className="text-28 font-bold">
                                        로그인
                                    </div>
                                    <div className="h-20px relative top-16px text-red-500">
                                        {occurError}
                                    </div>
                                    <form
                                        className="flex flex-col mx-auto mt-32px gap-y-16px"
                                        onSubmit={onSubmit}
                                    >
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
                                            <p className="mt-1 text-red-500 text-12 font-normal h-12px">
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
                                                <p className="mt-1 text-red-500 text-12 font-normal h-12px">
                                                    {errors.password && '비밀번호는 최소 8자 이상입니다.'}
                                                </p>
                                                <span
                                                    onClick={()=>{setPwShow(!PwShow)}}
                                                    className='cursor-pointer text-12 bg-gray-600 h-fit text-gray-100 px-8px mr-4px'
                                                >
                                                    { PwShow ? "비밀번호 숨김" : "비밀번호 확인" }
                                                </span>
                                            </div>
                                        </div>
                                        <FuncButton
                                            className="w-full py-4px bg-orange-500 text-white mx-auto mt-12px text-center cursor-pointer text-22 items-center rounded-[16px]"
                                            type="submit"
                                            options={{
                                                text: "로그인",
                                                disabled: !isValid,
                                                loading: loading,
                                            }}
                                        />
                                        <button
                                            className="w-full py-4px bg-orange-500 text-white mx-auto mb-12px text-center
                                            cursor-pointer text-22 items-center rounded-[16px]"
                                            type="button"
                                            onClick={() => {
                                                setRouterQuery("modal","sign-up")
                                            }}>
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