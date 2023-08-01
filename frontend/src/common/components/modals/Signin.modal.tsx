import React, {Fragment, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {Dialog, Transition } from "@headlessui/react";
import {SET_LOGIN, SET_LOGOUT } from "../../../store/slices/auth.slice";
import {SET_USER} from "../../../store/slices/user.slice";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {FuncButton} from "../FuncButton";
import {Api} from "../../../openapi/api";
import {useHandleQueryStr} from "../../../hooks/useHandleQueryStr";
/** 폼항목 */
type FormData = {
    email: string;
    password: string;
};

export const SigninModal = () => {
    const { loading } = useSelector((state: RootState) => state.auth);
    const { searchParams, setSearchParams } = useHandleQueryStr();

    const [occurError, setOccurError] = useState("");
    const [isShow, setIsShow] = useState(false);
    const [showPW, setShowPW] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    // useForm 컨트롤
    const {
        reset,
        setValue,
        getValues,
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<FormData>({ mode: "onChange" });

    const toggleShowPW = () => setShowPW(!showPW);

    const openModal = () => {
        searchParams.set("modal", "sign-up");
        setSearchParams(searchParams);
    }

    const closeModal = () => {
        if (searchParams.get("modal") !== "sign-in") return;
        searchParams.delete("modal");
        setSearchParams(searchParams);
        setValue("email", "");
        setValue("password", "");
        setOccurError("");
        reset();
    }

    const handleOnSubmit = handleSubmit(async () => {
        const { email, password } = getValues();
        await Api.auth.login({ email, password })
            .then((res) => {
                if (!res.data.success) {
                    setOccurError(res.data.error);
                    dispatch(SET_LOGOUT());
                    return;
                }
                dispatch(SET_LOGIN(res.data.accessToken));
                dispatch(SET_USER(res.data.user));
                closeModal();
                setValue("email", "");
                setValue("password", "");
                navigate("/memo");
            })
            .catch((e) => console.log(e));
    });

    useEffect(() => {
        if (searchParams.get("modal") === "sign-in") return setIsShow(true);
        setIsShow(false);
    },[searchParams]);

    return (
        <>
            <Transition appear show={ isShow } as={ Fragment }>
                <Dialog as="div" className="relative z-30" onClose={ closeModal }>
                    <Transition.Child
                        as={ Fragment }
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
                                as={ Fragment }
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-lg bg-white p-24px md:p-32px text-left align-middle shadow-xl transition-all">
                                    <h1 className="text-28 font-bold">
                                        로그인
                                    </h1>
                                    <p className="h-20px relative top-16px text-red-500">
                                        { occurError }
                                    </p>
                                    <form
                                        className="flex flex-col mx-auto mt-32px gap-y-16px"
                                        onSubmit={ handleOnSubmit }
                                    >
                                        <div>
                                            <input
                                                {...register("email", {
                                                    required: true,
                                                    minLength: 6,
                                                    maxLength: 70,
                                                    pattern: /^[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
                                                })}
                                                placeholder="이메일을 입력해주세요."
                                                className="border border-gray-400 rounded px-8px py-4px w-full"
                                            />
                                            <p className="mt-1 text-red-500 text-12 font-normal h-12px">
                                                { errors.email && "이메일을 입력해주시기 바랍니다." }
                                            </p>
                                        </div>
                                        <div>
                                            <input
                                                {...register("password", {
                                                    required: true,
                                                    minLength: 8,
                                                    maxLength: 100,
                                                })}
                                                type={ showPW ? "text" : "password" }
                                                placeholder="비밀번호를 입력해주세요."
                                                className="border border-gray-400 rounded px-8px py-4px w-full"
                                            />
                                            <div className="flex justify-between">
                                                <p className="mt-1 text-red-500 text-12 font-normal h-12px">
                                                    { errors.password && "비밀번호는 최소 8자 이상입니다." }
                                                </p>
                                                <span
                                                    onClick={ toggleShowPW }
                                                    className="cursor-pointer text-12 bg-gray-600 h-fit text-gray-100 px-8px mr-4px"
                                                >
                                                    { showPW ? "비밀번호 숨김" : "비밀번호 확인" }
                                                </span>
                                            </div>
                                        </div>
                                        <FuncButton
                                            options={{
                                                text: "로그인",
                                                disabled: !isValid,
                                                loading: loading,
                                            }}
                                            type="submit"
                                            className="w-full py-4px bg-orange-500 text-white mx-auto mt-12px text-center cursor-pointer text-22 items-center rounded-[16px]"
                                        />
                                        <button
                                            type="button"
                                            onClick={ openModal }
                                            className="w-full py-4px bg-orange-500 text-white mx-auto mb-12px text-center
                                            cursor-pointer text-22 items-center rounded-[16px]"
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