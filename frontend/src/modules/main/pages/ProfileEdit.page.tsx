import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {useForm} from "react-hook-form";
import {FuncButton} from "../../../common/components/FuncButton";
import {showAlert} from "../../../store/slices/alert.slice";
import {useNavigate} from "react-router-dom";
import {Api} from "../../../openapi/api";
import {SET_USER} from "../../../store/slices/user.slice";

type FormData = {
    name: string;
    email: string;
    password?: string | "";
    passwordConfirm?: string | "";
    mobile: string;
}

export const ProfileEdit = () => {
    const { data: userState, loading } = useSelector((state: RootState) => (state.user));

    const [showPW, setShowPW] = useState(false);
    const [showConfirmPW, setShowConfirmPW] = useState(false);
    const [occurError, setOccurError] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        setValue,
        getValues,
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isValid },
    } = useForm<FormData>({
        mode: "onChange",
        defaultValues: {
            name: userState.name,
            email: userState.email,
            mobile: userState.mobile,
        },
    });

    const toggleShowConfirmPW = () => setShowConfirmPW(!showConfirmPW);
    const toggleShowPW = () => setShowPW(!showPW);

    const onSubmit = handleSubmit(async () => {
        const { email, password, name, mobile } = getValues();
        await Api.user.profileUpdate({ email, name, mobile, password })
            .then((res) => {
                console.log(res.data);
                if (res.data.success) {
                    dispatch(SET_USER({...userState, email, name, mobile }))
                    showAlert("✔ 회원정보 수정이 완료되었습니다!");
                    return navigate(-1);
                }
                setOccurError(res.data.error);
                showAlert("❌ 회원정보 수정에 실패했습니다.");
            })
            .catch(e => console.log(e));
    });

    useEffect(() => reset(), [reset, userState]);

    return  loading ? <div>로딩중...</div> :
        <>
            <form
                onSubmit={ onSubmit }
                className="flex flex-col justify-center h-full text-center items-center gap-7 relative bottom-5"
            >
                <div className="flex text-start flex-col gap-5">
                    <h1 className="font-extrabold text-[34px] mb-3 text-center">
                        나의 프로필 변경
                    </h1>
                    <div>
                        <p className="font-bold text-[18px] text-[#5f5f5f]">
                            이름
                        </p>
                        <input
                            {...register("name", {
                                required: true,
                                minLength: 2,
                                maxLength: 30,
                            })}
                            placeholder="수정할 이름을 입력해주세요."
                            className="border border-gray-400 rounded px-2 py-1 w-96"
                        />
                        <p className="mt-1 text-red-500 text-xs font-normal h-3">
                            { errors.name && "성함을 입력해 주시기 바랍니다." }
                        </p>
                    </div>
                    <div className="relative">
                        <p className="absolute -top-5 text-red-500 font-bold">
                            { occurError }
                        </p>
                        <h1 className="font-bold text-[18px] text-[#5f5f5f]">
                            이메일
                            <span className="text-[14px] text-[#3f3f3f]">
                                &nbsp;(현계정에 등록된 이메일 외 중복이메일은 등록불가)
                            </span>
                        </h1>
                        <input
                            className="border border-gray-400 rounded px-2 py-1 w-96"
                            {...register("email", {
                                required: true,
                                minLength: 6,
                                maxLength: 70,
                                pattern: /^[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
                            })}
                            placeholder="변경할 이메일을 입력해주세요."
                        />
                        <p className="mt-1 text-red-500 text-xs font-normal h-3">
                            { errors.email && "이메일을 입력해주시기 바랍니다." }
                        </p>
                    </div>
                    <div>
                        <p className="font-bold text-[18px] text-[#5f5f5f]">
                            휴대전화번호
                        </p>
                        <input
                            {...register("mobile",
                                {
                                    required: true,
                                    minLength: 13
                                })}
                            onInput={(e) => {
                                const val = e.currentTarget.value.substring(0, 13).replace(/[^0-9]/g, "")
                                    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/(-{1,2})$/g, "");
                                setValue("mobile", val);
                            }}
                            type="text"
                            placeholder="휴대폰번호를 입력해주세요."
                            className="border border-gray-400 rounded px-2 py-1 w-96"
                        />
                        <p className="mt-1 text-red-500 text-xs font-normal h-3">
                            { errors.mobile && "휴대전화번호를 입력해주세요." }
                        </p>
                    </div>
                    <span className="text-center mt-4 font-extrabold text-[18px] text-[#4f4f4f]">
                        { "< 비밀변호 변경은 필수입력 사항이 아닙니다. >" }
                    </span>
                    <div>
                        <p className="font-bold text-[18px] text-[#5f5f5f]">
                            비밀번호 변경
                        </p>
                        <input
                            {...register("password", {
                                required: false,
                                minLength: 8,
                                maxLength: 100,
                            })}
                            type={ showPW ? "text" : "password" }
                            placeholder="수정할 비밀번호를 입력해주세요."
                            className="border border-gray-400 rounded px-2 py-1 w-96"
                        />
                        <div className="flex justify-between w-96">
                            <p className="mt-1 text-red-500 text-xs font-normal h-3">
                                { errors.password && "비밀번호는 최소 8자 이상입니다." }
                            </p>
                            <span
                                onClick={ toggleShowPW }
                                className="cursor-pointer text-xs bg-gray-400 h-fit text-gray-100 px-2 mr-1"
                            >
                                { showPW ? "비밀번호 숨김" : "비밀번호 확인" }
                            </span>
                        </div>
                        <h1 className="font-bold text-[18px] text-[#5f5f5f]">비밀번호 변경 재확인</h1>
                        <input
                            {...register("passwordConfirm", {
                                required: false,          // watch("password", "") === 비밀번호 재확인을 위한 변수
                                validate: value => value === watch("password", ""),
                            })}
                            type={ showConfirmPW ? "text" : "password" }
                            placeholder="비밀번호를 다시 한번 입력해주세요."
                            className="border border-gray-400 rounded px-2 py-1 w-96"
                        />
                        <div className="flex justify-between w-96">
                            <p className="mt-1 text-red-500 text-xs font-normal h-3">
                                { errors.passwordConfirm && "비밀번호가 동일하지 않습니다." }
                            </p>
                            <span onClick={ toggleShowConfirmPW } className="cursor-pointer text-xs bg-gray-400 h-fit text-gray-100 px-2 mr-1">
                                    { showConfirmPW ? "비밀번호 숨김" : "비밀번호 확인" }
                            </span>
                        </div>
                    </div>
                    <FuncButton
                        options={{
                            text: "프로필 변경하기",
                            disabled: !isValid,
                            loading: loading,
                        }}
                        type="submit"
                        className="mt-8 w-full py-2 flex justify-center mb-3 cursor-pointer text-[22px] items-center bg-orange-500 rounded-2xl text-white"
                    />
                </div>
            </form>
        </>
};