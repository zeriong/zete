import React, {Fragment, useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {Dialog, Transition } from "@headlessui/react";
import {FuncButton} from "../FuncButton";
import {CreateAccountDto} from "../../../openapi/generated";
import {Api} from "../../../openapi/api";
import {getToday} from "../../libs";
import {useHandleQueryStr} from "../../../hooks/useHandleQueryStr";

/** 폼항목 */
type FormData = {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    mobile: string;
};

export const SignupModal = (props: { successControl: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { loading } = useSelector((state: RootState) => state.auth);
    const { searchParams, setSearchParams } = useHandleQueryStr();

    const [isShow, setIsShow] = useState(false);
    const [showPW, setShowPW] = useState(false);
    const [showConfirmPW, setShowConfirmPW] = useState(false);
    const [occurError, setOccurError] = useState("");

    // useForm 컨트롤
    const {
        setValue,
        getValues,
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm<FormData>({ mode: "onChange" });

    const toggleShowPW = () => setShowPW(!showPW);
    const toggleShowConfirmPW = () => setShowConfirmPW(!showConfirmPW);

    const closeModal = () => {
        if (searchParams.get("modal") !== "sign-up") return;
        searchParams.delete("modal");
        setSearchParams(searchParams);
        setValue("email", "");
        setValue("password", "");
        setValue("passwordConfirm", "");
        setValue("mobile", "");
        setValue("name", "");
        setOccurError("");
    };

    useEffect(() => {
        if (searchParams.get("modal") === "sign-up") return setIsShow(true);
        setIsShow(false);
    },[searchParams]);

    const handleOnSubmit = handleSubmit(async () => {
        const { email, password, name, mobile } = getValues();
        const gptDailyResetDate = getToday();
        const reqData: CreateAccountDto = { email, password, name, mobile, gptDailyResetDate };

        await Api.user.createAccount(reqData)
            .then((res) => {
                if (!res.data.success) return console.log(res.data.error);
                closeModal();
                props.successControl(true);
            })
            .catch(e => console.log(e));
    });

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
                                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-[8px] bg-white p-24px md:p-32px text-left align-middle shadow-xl transition-all">
                                    <p className="text-24 font-bold h-10px">
                                        회원가입
                                    </p>
                                    <p className="absolute top-36px right-36px text-red-500 py-4px px-8px font-bold">
                                        { occurError }
                                    </p>
                                    <form
                                        className="flex flex-col mx-auto mt-48px gap-y-16px justify-center"
                                        onSubmit={ handleOnSubmit }
                                    >
                                        <div>
                                            <input
                                                {...register("name", {
                                                    required: true,
                                                    minLength: 2,
                                                    maxLength: 30,
                                                })}
                                                type="text"
                                                placeholder="이름을 입력해주세요."
                                                className="border border-gray-400 rounded px-8px py-4px w-full"
                                            />
                                            <p className="mt-4px text-red-500 text-12 font-normal h-12px">
                                                { errors.name && "성함을 입력해 주시기 바랍니다." }
                                            </p>
                                        </div>
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
                                            <p className="mt-4px text-red-500 text-12 font-normal h-12px">
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
                                                <p className="mt-4px text-red-500 text-12 font-normal h-12px">
                                                    { errors.password && "비밀번호는 최소 8자 이상입니다." }
                                                </p>
                                                <span
                                                    onClick={ toggleShowPW }
                                                    className="cursor-pointer text-12 bg-gray-600 h-fit text-gray-100 px-8px mr-4px font-light"
                                                >
                                                    { showPW ? "비밀번호 숨김" : "비밀번호 확인" }
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <input
                                                {...register("passwordConfirm", {
                                                    required: true,           // watch("password", "") === 비밀번호 재확인을 위한 변수
                                                    validate: value => value === watch("password", ""),
                                                })}
                                                type={ showConfirmPW ? "text" : "password" }
                                                placeholder="비밀번호를 다시 한번 입력해주세요."
                                                className="border border-gray-400 rounded px-8px py-4px w-full"
                                            />
                                            <div className="flex justify-between">
                                                <p className="mt-4px text-red-500 text-12 font-normal h-12px">
                                                    { errors.passwordConfirm && "비밀번호가 동일하지 않습니다." }
                                                </p>
                                                <span
                                                    onClick={ toggleShowConfirmPW }
                                                    className="cursor-pointer text-12 bg-gray-600 h-fit text-gray-100 px-8px mr-4px font-light"
                                                >
                                                    { showConfirmPW ? "비밀번호 숨김" : "비밀번호 확인" }
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <input
                                                {...register("mobile", {
                                                    required: true,
                                                    minLength: 13,
                                                })}
                                                onInput={(e) => {
                                                    const val = e.currentTarget.value.substring(0, 13).replace(/[^0-9]/g, "")
                                                        .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/(-{1,2})$/g, "");
                                                    setValue("mobile", val);
                                                }}
                                                type="text"
                                                placeholder="휴대폰번호를 입력해주세요."
                                                className="border border-gray-400 rounded px-8px py-4px w-full"
                                            />
                                            <p className="mt-4px text-red-500 text-12 font-normal h-12px">
                                                { errors.mobile && "휴대전화번호를 입력해주세요." }
                                            </p>
                                        </div>
                                        <FuncButton
                                            options={{
                                                text: "회원가입",
                                                disabled: !isValid,
                                                loading: loading,
                                            }}
                                            type="submit"
                                            className="w-full py-4px bg-orange-500 text-white mx-auto text-center cursor-pointer text-22 items-center rounded-[16px]"
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
