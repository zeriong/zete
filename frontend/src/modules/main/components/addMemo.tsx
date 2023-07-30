import {CategoryIcon, CloseIcon, FillStarIcon, PlusIcon, StarIcon} from "../../../assets/vectors";
import React, {useEffect, useRef, useState} from "react";
import {useHandleQueryStr} from "../../../hooks/useHandleQueryStr";
import {
    handleTagInput,
    handleResizeHeight,
    handleAddTagSubmit,
    updateOrAddMemo,
    getToday
} from "../../../common/libs";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {useHorizontalScroll} from "../../../hooks/useHorizontalScroll";
import {useForm} from "react-hook-form";
import {showAlert} from "../../../store/slices/alert.slice";
import {CreateMemoInput, Memo} from "../../../openapi/generated";
import {Api} from "../../../common/api";
import {deleteMemo} from "../../../store/slices/memo.slice";
import {dispatchGptAvailable, dispatchGptRefillAt} from "../../../store/slices/user.slice";

export const AddMemo = () => {
    const contentTextarea = useRef<HTMLTextAreaElement>(null);
    const titleTextarea = useRef<HTMLTextAreaElement>(null);
    const tagsInput = useRef<HTMLInputElement>(null);
    const memoRef = useRef<HTMLElement>(null);
    const gptBtnRef = useRef<HTMLButtonElement>(null);
    const gptAreaRef = useRef<HTMLElement>(null);
    const gptTextareaRef = useRef<HTMLTextAreaElement>(null);
    const typingTimout = useRef<NodeJS.Timeout>(null);
    const moveGptContentToMemoContentBtn = useRef<HTMLButtonElement>(null);
    const isUpdate = useRef<boolean>(false);
    const temporarySaveMemo = useRef<Memo>(null);

    const { cateQueryStr, tagQueryStr, searchParams } = useHandleQueryStr();
    const { cate } = useSelector((state: RootState) => state.memo.data);
    const userState = useSelector((state: RootState) => state.user.data);

    const [isImportant, setIsImportant] = useState<boolean>(false);
    const [readyToMemo, setReadyToMemo] = useState<boolean | number>(0);
    const [openGpt, setOpenGpt] = useState(false);
    const [gptTextInput, setGptTextInput] = useState("");
    const [memoId, setMemoId] = useState(0);
    const [gptLoading, setGptLoading] = useState(false);
    const [gptContent, setGptContent] = useState("");
    const [titleFocus, setTitleFocus] = useState(false);
    const [contentFocus, setContentFocus] = useState(false);
    const [waitText, setWaitText] = useState(false);
    const [hoverGptContent, setHoverGptContent] = useState(false);

    const horizonScroll = useHorizontalScroll();
    const form = useForm<CreateMemoInput>({ mode: "onBlur" });

    const { ref: titleRef, ...titleReg } = form.register("title", {
        required: false,
        maxLength: 64,
        onChange: () => {
            handleResizeHeight(titleTextarea)
            handleOnChangeUpdate();
        },
    });
    const { ref: contentRef, ...contentReg } = form.register("content", {
        required: false,
        maxLength: 65535,
        onChange: () => {
            handleOnChangeUpdate();
            handleResizeHeight(contentTextarea);
        },
    });

    // setState Handler
    const titleOnFocus = () => setTitleFocus(true);
    const titleOnBlur = () => setTitleFocus(false);
    const contentOnFocus = () => setContentFocus(true);
    const contentOnBlur = () => setContentFocus(false);
    const gptContentOnMouseEnter = () => setHoverGptContent(true);
    const gptContentOnMouseLeave = () => setHoverGptContent(false);
    const toggleOpenGpt = () => setOpenGpt(!openGpt);

    // 메모상자 초기화 함수
    const resetAddMemoForm = () => {
        form.reset({ title: "", content: "", cateId: Number(cateQueryStr) || 0, tags: [] });
        contentTextarea.current.style.height = "auto";
        titleTextarea.current.style.height = "auto";
    }

    // 제목에서 Enter = textarea -> focus / shift + enter = 줄바꿈
    const handleKeyDown = (e) => {
        if (e.shiftKey && e.key === "Enter") {
            const startPos = e.target.selectionStart;
            const endPos = e.target.selectionEnd;
            const value = e.target.value;
            e.target.value = value.substring(0, startPos) + "\n" + value.substring(endPos, value.length);
            e.target.selectionStart = startPos + 1;
            e.target.selectionEnd = startPos + 1;
            e.preventDefault();
        } else if (e.key === "Enter") {
            contentTextarea.current.focus();
            e.preventDefault();
        }
        handleResizeHeight(titleTextarea);
    }

    // 업데이트 핸들러 (함수를 실행할때 데이터를 넣어야 최신화된 데이터로 동작)
    const handleMemoRequest = (auto: boolean) => {
        updateOrAddMemo({
            getTitle: form.getValues("title"),
            getContent: form.getValues("content"),
            getNewTags: form.getValues("tags"),
            getCateId: form.getValues("cateId"),
            typingTimeout: typingTimout,
            reqType: "create",
            autoReq: auto,
            isImportant,
            memoId,
            setMemoId,
            isUpdate: isUpdate,
            temporarySaveMemo,
        });
    }

    // 중요메모 변경시에도 자동저장 필요
    const handleImportant = () => {
        handleOnChangeUpdate();
        setIsImportant(!isImportant);
    }

    // 타이핑 자동저장 기능
    const handleOnChangeUpdate = () => {
        isUpdate.current = false;

        if (typingTimout.current != null) {
            clearTimeout(typingTimout.current);
            typingTimout.current = null;
        }
        if (typingTimout.current === null) {
            typingTimout.current = setTimeout(() => handleMemoRequest(true), 3000);
        }
    }

    const deleteTag = (tagName) => {
        const tags = form.getValues("tags");
        if (tags) form.setValue("tags", tags.filter(tag => tag.name !== tagName));
    }

    const gptTextareaOnChange = (e) => {
        handleResizeHeight(gptTextareaRef);
        setGptTextInput(e.target.value);
    }

    // gpt api 요청 함수
    const requestGpt = () => {
        if (userState.gptDailyLimit === 0) return showAlert("질문가능 횟수가 초과하였습니다, 매일 자정이 지나면 충전됩니다.");
        
        setGptLoading(true);
        Api.openAi.createCompletion({ content: gptTextInput })
            .then((res) => {
                /* gpt 3.5 turbo 특성상 요청이 매우느리고 연속요청에 에러를 발생시키기 때문에 요청에러방지,
                   사용자경험을 향상을 위해 요청을 받은 후 setWaitText를 통해 "답변이 거의 완성되었어요!" 문구를 띄움 */
                setWaitText(true);
                
                setTimeout(() => {
                    setWaitText(false);
                    setGptLoading(false);
                }, 5000);

                if (!res.data.success) return showAlert(res.data.error);
                if (res.data.message) return showAlert(res.data.message);
                if (res.data.gptResponse) {
                    dispatchGptAvailable(res.data.gptDailyLimit);
                    setGptContent(res.data.gptResponse);
                }
            })
            .catch((e) => {
                setGptLoading(false);
                console.log(e);
                showAlert("Chat-GPT 서버에 접속할 수 없습니다.");
            });
    }

    // gpt submit 핸들러
    const handleGptSubmit = () => {
        if (gptTextInput === "") return showAlert("GPT: 대화내용을 입력해주세요");
        
        requestGpt();
        setGptTextInput("");
        gptTextareaRef.current.style.height = "auto";
    }

    // gptTextarea shift + enter 줄바꿈기능
    const handleKeydownForGptSubmit = (e) => {
        if (e.shiftKey && e.key === "Enter") handleResizeHeight(gptTextareaRef);
        else if (e.key === "Enter") {
            e.preventDefault();
            handleGptSubmit();
        }
    }

    // 새메모 작성중 취소할때 자동저장된 메모가 있다면 삭제하는 함수
    const HandleMemoCancel = () => {
        resetAddMemoForm();
        if (memoId === 0) return;
        
        deleteMemo(memoId, "create");
        setMemoId(0);
    }

    // gpt답변을 메모내용에 추가하는 함수
    const moveGptContentToMemoContent = () => {
        form.setValue("content", gptContent);
        handleOnChangeUpdate();
        setReadyToMemo(true);
        handleResizeHeight(contentTextarea);
        contentTextarea.current.focus();
    }

    // 파라미터쿼리에 따른 기본값 설정
    useEffect(() => {
        form.setValue("cateId", cateQueryStr ? Number(cateQueryStr) : 0);
        form.setValue("tags", tagQueryStr ? [ { name: tagQueryStr } ] : []);
    },[searchParams]);


    // 클릭시 메모폼인지 아닌지 감지
    useEffect(() => {
        const handleOutside = (e) => {
            if (memoRef.current && memoRef.current.contains(e.target)) setReadyToMemo(true);
            else if (gptAreaRef.current.contains(e.target)) return;
            else {
                setReadyToMemo(false);
                setOpenGpt(false);
            }
        }

        document.addEventListener("click", handleOutside);

        return () => document.removeEventListener("click", handleOutside);
    },[]);

    // 메모폼에 메모를 적을 수 없는 상태일때 메모 업데이트 & 메모폼 초기화
    useEffect(() => {
        if (readyToMemo === false) {
            handleMemoRequest(false);
            setIsImportant(false);
            resetAddMemoForm();
        }
    }, [readyToMemo]);

    // gpt 질문가능횟수 통신함수
    const handleTryGptAvailable = (gptDailyResetDate) => {
        Api.user.resetGptDailyLimit({ gptDailyResetDate })
            .then((res) => {
                // 성공시 success true만 존재.
                dispatchGptAvailable(res.data.gptDailyLimit);
                dispatchGptRefillAt(res.data.gptDailyResetDate);
            }).catch(e => console.log(e));
    }

    /* gptOpen 일때 db에서 받아온 날짜비교하여 통신결정
       (initState가 null이기 때문에 최초에 반드시 1회 요청) */
    useEffect(() => {
        if (!openGpt) return;
        const today = getToday();
        
        if (userState.gptDailyResetDate !== today) {
            handleTryGptAvailable(today);
        }
    }, [openGpt]);

    // gpt 로딩이 끝나고(gptTextarea disable 끝나고) 메모폼에 포커싱되지 않았다면 gptTextarea에 자동 포커싱
    useEffect(() => {
        if (!gptLoading && !titleFocus && !contentFocus) {
            gptTextareaRef.current.focus();
        }
    }, [gptLoading]);

    // gpt content hover 스타일 컨트롤
    useEffect(() => {
        if (moveGptContentToMemoContentBtn.current && gptContent && hoverGptContent && !waitText && !gptLoading) {
            if (hoverGptContent) {
                moveGptContentToMemoContentBtn.current.style.visibility = "visible";
                moveGptContentToMemoContentBtn.current.style.opacity = "100%";
            }
        }
        else {
            moveGptContentToMemoContentBtn.current.style.visibility = "hidden";
            moveGptContentToMemoContentBtn.current.style.opacity = "0%";
        }
    }, [hoverGptContent, waitText, gptLoading]);


    // gpt button component
    const GptBtn = (props: { className?: string }) => {
        return (
            <button
                ref={ gptBtnRef }
                type="button"
                /* textarea에 onBlur이벤트 때문에 onClick시 동시에 이벤트가 일어나지 않고 onBlur만 실행
                   이벤트 핸들러 작동 순서: mouseDown -> onBlur -> onClick -> mouseUp */
                onMouseUp={ toggleOpenGpt }
                className={`text-12 rounded-[8px] font-normal text-white border-2 border-zete-gpt-200 py-4px px-8px
                ${openGpt ? "bg-zete-gpt-100" : "bg-zete-gpt-500"} ${ props.className }`}
            >
                AI에게 질문하기
            </button>
        )
    }

    return (
        <div className="relative w-full browser-width-900px:w-[500px]">
            <div className="relative min-w-0 h-fit">
                <article
                    ref={ memoRef }
                    className={`relative flex flex-col justify-between transition-all duration-300 px-18px pb-10px pt-12px memo-shadow
                    ${openGpt ? "rounded-t-[8px] bg-white border-t-[10px] border-x-[10px] border-zete-gpt-100" 
                        : "border border-zete-light-gray-500 rounded-[8px] bg-zete-primary-200"}`}
                >
                    <div className="relative w-full h-full flex flex-col">
                        <div className="flex flex-col w-full h-full">
                            <div
                                className={`flex justify-between items-center pb-0 overflow-hidden h-0
                                    ${ readyToMemo && "h-full pb-8px" }`}
                            >
                                <textarea
                                    ref={(e) => {
                                        titleRef(e);
                                        titleTextarea.current = e;
                                    }}
                                    { ...titleReg }
                                    onKeyDown={ handleKeyDown }
                                    onFocus={ titleOnFocus }
                                    onBlur={ titleOnBlur }
                                    rows={ 1 }
                                    placeholder="제목"
                                    className="resize-none w-full pr-6px max-h-[80px] bg-transparent text-zete-gray-500 placeholder:text-zete-gray-500
                                    font-light placeholder:text-15 memo-custom-scroll"
                                />
                                <button type="button" onClick={ handleImportant }>
                                    { isImportant ? <FillStarIcon/> : <StarIcon/> }
                                </button>
                            </div>
                            <textarea
                                ref={(e) => {
                                    contentRef(e);
                                    contentTextarea.current = e;
                                }}
                                { ...contentReg }
                                onFocus={ contentOnFocus }
                                onBlur={ contentOnBlur }
                                rows={ 1 }
                                placeholder="메모 작성..."
                                className={`resize-none max-h-[300px] w-full bg-transparent text-zete-gray-500 placeholder:text-zete-gray-500
                                font-light placeholder:text-15 memo-custom-scroll
                                ${ readyToMemo ? "pt-9px" : "pt-0" }`}
                            />
                        </div>
                        {readyToMemo === true &&
                            <div className="w-full h-full">
                                <div onClick={ () => contentTextarea.current.focus() } className="h-20px w-full"/>
                                <div ref={ horizonScroll } className="flex w-full h-full relative pb-8px overflow-y-hidden memo-custom-vertical-scroll">
                                    {form.watch("tags")?.map((tag, idx) => (
                                        <div key={idx} className="relative flex items-center pl-9px pr-21px py-1px mr-4px rounded-[4px] bg-black bg-opacity-10 cursor-default">
                                            <span className="font-light text-11 text-zete-dark-400 whitespace-nowrap">
                                                { tag.name }
                                            </span>
                                            <button
                                                onClick={ () => deleteTag(tag.name) }
                                                className="absolute right-2px group rounded-full grid place-content-center hover:bg-zete-dark-300 hover:bg-opacity-50 w-14px h-14px"
                                            >
                                                <CloseIcon className="w-10px fill-zete-dark-400 group-hover:fill-white"/>
                                            </button>
                                        </div>
                                    ))}
                                    <form
                                        onSubmit={(e) => {
                                            handleAddTagSubmit(e, form.getValues, form.setValue, "tags");
                                            handleMemoRequest(true);
                                        }}
                                        className="relative flex items-center text-zete-dark-400 text-12"
                                    >
                                        <input
                                            ref={ tagsInput }
                                            onChange={ () => handleTagInput(tagsInput) }
                                            placeholder="태그추가"
                                            className="min-w-[50px] w-50px px-2px placeholder:text-zete-placeHolder bg-transparent whitespace-nowrap"
                                        />
                                        <button type="submit" className="relative w-14px h-14px grid place-content-center">
                                            <PlusIcon svgClassName="w-9px" strokeClassName="fill-black"/>
                                        </button>
                                    </form>
                                </div>
                                <div className="relative flex justify-between items-center pt-10px">
                                    <div className="flex items-center">
                                        <div className="flex items-center border border-zete-memo-border rounded-md px-2 py-1">
                                            <CategoryIcon className="w-18px opacity-75 mr-0.5"/>
                                            <select
                                                {...form.register("cateId", { required: true })}
                                                className="w-[130px] text-[13px] text-gray-500 bg-transparent"
                                            >
                                                <option value={ 0 }>
                                                    전체메모
                                                </option>
                                                {
                                                    cate.map((cate, idx) => (
                                                        <option key={idx} value={cate.id}>
                                                            {cate.name}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <GptBtn className="ml-20px"/>
                                    </div>
                                    <button type="button" onClick={ HandleMemoCancel }>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </article>
            </div>
            {!readyToMemo &&
                <GptBtn
                    className={`absolute right-18px
                    ${ openGpt ? "top-[calc(50%-10px)] -translate-[calc(50%-10px)]" : "top-1/2 -translate-y-1/2" }`}
                />
            }
            <article
                ref={ gptAreaRef }
                className={`flex flex-col absolute transition-all duration-300 w-full bg-zete-gpt-100 h-0 rounded-b-[8px] overflow-hidden z-50 shadow-2xl
                ${ openGpt && "h-[400px] p-10px" }`}
            >
                <div className="flex flex-col relative w-full h-full">
                    <div
                        onMouseEnter={ gptContentOnMouseEnter }
                        onMouseLeave={ gptContentOnMouseLeave }
                        className="relative grow text-start text-zete-dark-500 bg-white overflow-hidden rounded-[8px] p-8px bg-opacity-80"
                    >
                        <div className="relative text-center bg-zete-gpt-500 rounded-[8px] py-4px mb-16px">
                            <span className="text-zete-gpt-black font-bold">
                                Chat GPT
                            </span>
                            <div className="absolute top-1/2 -translate-y-1/2 text-13 right-13px text-white font-semibold">
                                질문 가능 횟수:
                                <span>
                                    {` ${ userState.gptDailyLimit }`}
                                </span>
                            </div>
                        </div>
                        <div className="relative h-[calc(100%-100px)] px-8px">
                            {
                                (!gptLoading && gptContent === "") ?
                                    (
                                        // 응답받은 gpt-content가 없고 로딩이 아닌경우
                                        <>
                                            <p className="mb-12px">궁금한 것이 있다면 GPT에게 물어보세요!</p>
                                            표준어를 사용해주세요!<br/>
                                            줄임말이나 신조어를 사용하면<br/>
                                            원하는 답변을 얻지 못할 수 있어요.<br/>
                                            {`< 참고사항 >`}<br/>
                                            1. gpt에게 물어볼 수 있는 횟수는 한 계정당 10번 물어볼 수 있어요.<br/>
                                            2. 하나의 질문에 한번의 답변만 할 수 있어요. (대화형식 불가)
                                        </>
                                    ) : gptLoading ? (
                                        // 답변 응답을 받는중인 경우 ( 로딩중 )
                                        <>
                                            {
                                                waitText ? "답변이 거의 완성되었어요!" :
                                                "gpt가 답변을 준비하고 있어요."
                                            }
                                        </>
                                    ) : gptContent !== "" && (
                                        // 답변을 받은 경우
                                        <textarea
                                            readOnly={ true }
                                            value={ gptContent }
                                            rows={ 1 }
                                            className="resize-none w-full !h-full pb-46px bg-transparent memo-custom-vertical-scroll overflow-auto"
                                        />
                                    )
                            }
                        </div>
                        <button
                            ref={ moveGptContentToMemoContentBtn }
                            type="button"
                            onClick={ moveGptContentToMemoContent }
                            className="absolute bottom-[64px] left-1/2 -translate-x-1/2 transition-all duration-300 bg-zete-gpt-500 py-4px px-8px rounded-[8px] text-zete-light-gray-100"
                        >
                            메모에 추가하기 +
                        </button>
                    </div>
                    <article
                        className={`flex items-center justify-between absolute bottom-10px p-8px shadow-1xl rounded-[12px] w-[calc(100%-20px)]
                            border border-zete-light-gray-500 left-1/2 -translate-x-1/2 shadow-2xl ${ gptLoading ? "bg-zete-light-gray-300" : "bg-white" }`}
                    >
                        <div className="relative flex items-center memo-custom-scroll overflow-auto max-h-[88px] w-[calc(100%-42px)]">
                            <textarea
                                ref={ gptTextareaRef }
                                maxLength={ 500 }
                                onChange={ gptTextareaOnChange }
                                onKeyDown={ handleKeydownForGptSubmit }
                                value={ gptTextInput }
                                rows={ 1 }
                                disabled={ gptLoading }
                                placeholder="GPT에게 물어보세요! ( Shift + Enter 줄바꿈 )"
                                className="resize-none bg-transparent placeholder:text-zete-gray-500 font-light placeholder:text-14 w-full h-fit"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={ handleGptSubmit }
                            className="absolute right-10px px-4px bg-zete-gpt-200 text-white whitespace-nowrap h-fit text-15"
                        >
                            전송
                        </button>
                    </article>
                </div>
            </article>
        </div>
    )
}