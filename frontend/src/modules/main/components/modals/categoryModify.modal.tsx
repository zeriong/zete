import React, {Fragment, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {CatePlusIcon, DeleteIcon, FillCategoryIcon, ModifyIcon} from "../../../../assets/vectors";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store";
import CustomScroller from "../../../../common/components/customScroller";
import {showAlert} from "../../../../store/slices/alert.slice";
import {ConfirmButton} from "../../../../common/components/confirmButton";
import {createCategory, deleteCategory, loadAsideData, UPDATE_CATE} from "../../../../store/slices/memo.slice";
import {Api} from "../../../../common/api";

export const CategoryModifyModal = (props: { buttonText: string }) => {
    const { cate } = useSelector((state: RootState) => state.memo.data);

    const [isShow, setIsShow] = useState(false);
    const [addInputValues, setAddInputValues] = useState({ addCateName: "" });
    const [updateInputValues, setUpdateInputValues] = useState<{ [key: number]: string }>({});

    const dispatch = useDispatch();

    const openModal = () => setIsShow(true);
    const closeModal = () => {
        setAddInputValues({ addCateName: "" });
        setIsShow(false);
    }

    // 카테고리 생성 submit
    const handleSubmit = (e) => {
        e.preventDefault();
        createCategory({ cateName: addInputValues.addCateName });
        setAddInputValues({ addCateName: "" });
    }

    // 카테고리 생성 onChange
    const addCategoryOnChange = (e) => {
        setAddInputValues({
            ...addInputValues,
            [e.target.name]: e.target.value,
        });
    }

    // 카테고리 업데이트 submit
    const handleUpdateOnSubmit = (id: number, prevVal: string, input: any) => {
        const val = input.value
        if (val && val.length > 1 && val !== prevVal) {
            Api.memo.updateCategory({ cateId: id, cateName: val })
                .then((res) => {
                    if (res.data) {
                        if (res.data.success) {
                            return dispatch(UPDATE_CATE({ cateId: id, cateName: val }));
                        }
                        // 입력 초기화
                        input.value = prevVal;
                        showAlert(res.data.error);
                    }
                })
                .catch((e) => {
                    // 입력 초기화
                    input.value = prevVal;
                    console.log("에러: ", e);
                    showAlert("카테고리 업데이트에 실패하였습니다.");
                });
        }
    }

    // 카테고리 업데이트 input change
    const updateCategoryOnChange = (id: number, value: string) => {
        setUpdateInputValues((state) => {
            state[id] = value;
            return { ...state }
        })
    }

    // 카테고리 목록에 따른 input state 생성
    useEffect(() => {
        let values = {}
        cate.map((cate) => (
            values = { ...values, [cate.id]: cate.cateName }
        ));
        setUpdateInputValues(values);
    }, [cate]);

    // 모달 오픈시 카테고리 목록 갱신
    useEffect(() => {
        if (isShow) loadAsideData();
    },[isShow]);

    return (
        <>
            <button
                type="button"
                onClick={ openModal }
                className="flex w-full justify-between items-center px-10px py-8px rounded-[5px] mt-4px h-42px"
            >
                <div className="flex justify-start items-center w-full font-light transition-all duration-150">
                    <ModifyIcon className="mr-10px"/>
                    <span>
                        { props.buttonText }
                    </span>
                </div>
            </button>
            <Transition appear show={ isShow } as={ Fragment }>
                <Dialog
                    as="div"
                    className="relative z-30"
                    onClose={ closeModal }
                >
                    <Transition.Child
                        as={ Fragment }
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-40"/>
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="close-modal-background flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-[300px] relative transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all">
                                    <div className="relative h-[430px] w-full p-16px">
                                        <CustomScroller>
                                            <p className="text-zete-dark-400">
                                                카테고리 추가/수정
                                            </p>
                                            <div className="py-16px px-8px text-15">
                                                <form
                                                    onSubmit={ handleSubmit }
                                                    className="flex items-center"
                                                >
                                                    <ModifyIcon className="min-w-[22px] mr-16px"/>
                                                    <input
                                                        name="addCateName"
                                                        placeholder="새 카테고리 만들기"
                                                        onChange={ addCategoryOnChange }
                                                        value={ addInputValues.addCateName || "" }
                                                        className="placeholder:text-zete-dark-300 placeholder:font-thin pb-5px border-b border-zete-memo-border
                                                        text-zete-dark-300 w-full"
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="flex justify-center items-center rounded-full p-2px ml-8px hover:bg-zete-light-gray-200"
                                                    >
                                                        <CatePlusIcon className="fill-zete-dark-100"/>
                                                    </button>
                                                </form>
                                                <ul className="text-zete-dark-200 grid gap-16px py-20px">
                                                    {cate?.map((val, idx) => (
                                                        <li key={ idx }>
                                                            <form
                                                                onSubmit={(event) => {
                                                                    event.preventDefault()
                                                                    // 서브밋이벤트의 타겟은 form내부 input, button 등 몇번째요소의 벨류인지 적어주어야 함.
                                                                    const input = event.target[0];
                                                                    handleUpdateOnSubmit(val.id, val.cateName, input);
                                                                }}
                                                                onBlur={(event) => {
                                                                    // form에서의 onBlur타겟은 인풋이 몇개가 있든 가장 첫번째인풋을 타겟함
                                                                    const input = event.target;
                                                                    handleUpdateOnSubmit(val.id, val.cateName, input);
                                                                }}
                                                                className="flex items-center"
                                                            >
                                                                <FillCategoryIcon className="relative -left-3px fill-zete-dark-100 mr-10px"/>
                                                                <input
                                                                    placeholder="카테고리 이름을 입력해주세요."
                                                                    value={ updateInputValues[val.id] || "" }
                                                                    onChange={ (event) => updateCategoryOnChange(val.id, event.target.value) }
                                                                    className="font-medium w-full flex items-center"
                                                                />
                                                                <ConfirmButton
                                                                    options={{
                                                                        subject: `"${val.cateName}"를 삭제하시겠습니까?`,
                                                                        subtitle: "카테고리가 삭제되면 하위 메모가<br/>모두 삭제됩니다.",
                                                                        confirmText: "삭제",
                                                                        isNegative: true,
                                                                        confirmCallback: () => deleteCategory({cateId: val.id}),
                                                                    }}
                                                                    className="relative group p-6px rounded-full hover:bg-zete-light-gray-200 -right-2px"
                                                                >
                                                                    <DeleteIcon className="fill-zete-dark-100 group-hover:fill-black"/>
                                                                </ConfirmButton>
                                                            </form>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </CustomScroller>
                                    </div>
                                    <div className="w-full flex justify-end p-4px py-16px pr-14px border-t border-zete-memo-border">
                                        <button
                                            type="button"
                                            onClick={ closeModal }
                                            className="text-15 font-normal text-zete-dark-500 py-8px px-22px hover:bg-zete-light-gray-200 rounded-[4px]"
                                        >
                                            완료
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
}