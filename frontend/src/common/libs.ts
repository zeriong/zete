import css from "dom-css";
import {showAlert} from "../store/slices/alert.slice";
import {CreateMemoInput, Memo} from "../openapi/generated";
import {store} from "../store";
import {deleteMemo, memoSlice, refreshMemos, refreshTargetMemo} from "../store/slices/memo.slice";
import {Api} from "./api";
import React from "react";

/** ---- In Content Method ---- */

export const handleResizeHeight = (textareaRef) => {
    const ref = textareaRef.current;
    if (ref) {
        ref.style.height = "auto";
        ref.style.height = ref.scrollHeight + "px";
    }
}
export const handleTagInput = (inputRef) => {
    const input = inputRef.current;
    input.style.width = "50px";
    input.style.width = `${input.scrollWidth}px`;
    input.style.whiteSpace = "nowrap"; // 추가
};

export const handleAddTagSubmit = (event, getVal, setValFunc, target) => {
    event.preventDefault();
    const input = event.target[0];
    if (input.value === "") return;

    const tags = getVal(target) || [];
    const exists = tags.find(tag => tag.tagName === input.value);

    if (exists) return showAlert("이미 존재하는 태그명 입니다.");

    setValFunc(target, [ ...tags, { tagName: input.value } ]);
    input.value = "";
}

export const getGptRefillAt = () => {
    const date = new Date();
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate());

    return Number(year + month + day);
}

export const stopBubbling = (e) => e.stopPropagation();


/** -------- 커스텀스크롤 function start ------- */
export const getInnerHeight = (el: HTMLDivElement) => {
    const { clientHeight } = el;
    const { paddingTop, paddingBottom } = getComputedStyle(el);
    return clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom);
}

export const getInnerWidth = (el: HTMLDivElement) => {
    const { clientWidth } = el;
    const { paddingLeft, paddingRight } = getComputedStyle(el);
    return clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
}

let scrollbarWidth: boolean | number = false;

export const getScrollbarWidth = (cacheEnabled = true) => {
    if (cacheEnabled && scrollbarWidth !== false) return scrollbarWidth;
    if (typeof document !== "undefined") {
        const div = document.createElement("div");
        css(div, {
            width: 100,
            height: 100,
            position: "absolute",
            top: -9999,
            overflow: "scroll",
            MsOverflowStyle: "scrollbar",
        });
        document.body.appendChild(div);
        scrollbarWidth = div.offsetWidth - div.clientWidth;
        document.body.removeChild(div);
    } else {
        scrollbarWidth = 0;
    }
    return scrollbarWidth || 0;
}

export const isString = (maybe: string | number) => typeof maybe === "string";

export const returnFalse = () => false;
/** -------- close ------- */


/** ---- 메모 (생성, 업데이트) + 자동저장기능 모듈매서드 ---- */
export interface HandleUpdateOrAddMemoInterface {
    getTitle: string;
    getContent: string;
    getNewTags: { tagName: string }[];
    memoId: number;
    setMemoId?: React.Dispatch<React.SetStateAction<any>>;
    getCateId: string | number;
    autoReq: boolean;  // 요청이 자동저장인지 아닌지를 받음
    reqType: string;  // "update" || "create" 로 요청타입
    typingTimeout: React.MutableRefObject<NodeJS.Timeout | null>;  // 자동저장 timeout ref
    closeModal?: Function;
    cateQueryStr?: string;
    tagQueryStr?: string;
    menuQueryStr?: string;
    isImportant: boolean;
    isUpdate?: React.MutableRefObject<boolean>;  // 업데이트여부
    temporarySaveMemo? : React.MutableRefObject<Memo>;  // 메모 비교를 위한 임시저장메모
}

export const updateOrAddMemo = (props: HandleUpdateOrAddMemoInterface) => {
    const {
        getTitle, getNewTags, getContent, memoId,
        getCateId, cateQueryStr, autoReq, reqType,
        isUpdate, typingTimeout, closeModal,
        isImportant, tagQueryStr, menuQueryStr, setMemoId,
        temporarySaveMemo,
    } = props;

    // 자동저장 아닐때만 취소
    if (!autoReq) {
        clearTimeout(typingTimeout.current);
        typingTimeout.current = null;
    }

    // 업데이트상황에서만 사용되는 closeModal
    if (!autoReq && reqType === "update") closeModal();

    // 줄바꿈 및 공백 제거하여 제목, 내용여부 체크 후 처리
    const titleDeleteSpace = getTitle.replace(/\s*|\n/g,"");
    const contentDeleteSpace = getContent.replace(/\s*|\n/g,"");

    if (titleDeleteSpace === "" && contentDeleteSpace === "") {
        // 업데이트일때
        if (reqType === "update") return showAlert("메모수정이 취소되었습니다.");

        // 새 메모 작성중, 자동저장이 안되어있는 경우
        if (memoId === 0) return;

        // 새 메모 작성중, 메모가 자동저장되어 있다면
        setMemoId(0);
        deleteMemo(memoId, "create");
    }

    // 제목, 내용을 DB에 저장 가능한 형태로 변환
    const parsingTitle = getTitle.replace(/\n/g, "<br/>");
    const parsingContent = getContent.replace(/\n/g, "<br/>");

    // 새 메모생성이고 자동저장 안되어있다면
    if (reqType === "create" && memoId === 0) {
        // 새 메모 할당 값
        const newMemoContent: CreateMemoInput = {
            important: isImportant,
            tags: getNewTags,
            cateId: getCateId as number,
            title: parsingTitle,
            content: parsingContent,
        }

        // 새로 만들게 되면 addMemo컴포넌트에 id를 state로 저장
        Api.memo.createMemo(newMemoContent)
            .then((res) => {
                if (res.data.success) {
                    if (autoReq) {
                        temporarySaveMemo.current = res.data.savedMemo;
                        setMemoId(res.data.savedMemo.id);
                    }
                    else {
                        store.dispatch(memoSlice.actions.ADD_MEMO({...res.data.savedMemo}))
                        setMemoId(0);
                    };
                }
                else showAlert(res.data.error); // 실패시 에러 알람띄움
            })
            .catch(e => console.log(e));
        return;
    }

    // 임시저장 메모와 비교하여 수정처리
    const data = store.getState().memo.data;
    const targetMemo = temporarySaveMemo.current;
    const cateId = temporarySaveMemo.current.cateId || null;
    const changedTagLength = targetMemo.tag.filter(tag => getNewTags.some(inputTag => inputTag.tagName === tag.tagName)).length;
    const newTagLength = getNewTags.filter((newTag) => !targetMemo.tag.some((tag) => tag.tagName === newTag.tagName)).length;

    // 수정사항이 없는 경우 요청X
    if (
        getTitle === targetMemo.title.replace(/<br\/>/g, "\n") &&
        getContent === targetMemo.content.replace(/<br\/>/g, "\n") &&
        cateId === targetMemo.cateId &&
        isImportant === targetMemo.important &&
        newTagLength === 0 &&
        (
            changedTagLength === targetMemo.tag.length ||
            (targetMemo.tag.length === 0 && getNewTags.length === 0)
        )
    ) return;

    // 삭제, 추가할 태그분류
    let newTags: { tagName: string }[];
    let deleteTagIds: number[];

    // 카테고리 변경시 태그의 소속 변경
    if (targetMemo.tag.length === 0) {
        newTags = getNewTags.map(tag => ({ tagName: tag.tagName }));
        deleteTagIds = [];
    } else if (targetMemo.cateId !== cateId) {
        newTags = getNewTags.map(tag => ({ tagName: tag.tagName }));
        deleteTagIds = targetMemo.tag.map(tag => tag.id);
    } else {
        newTags = getNewTags.filter(tag => !targetMemo.tag.some(target => target.tagName === tag.tagName))
            .map(tag => ({ tagName: tag.tagName }));

        deleteTagIds = targetMemo.tag.filter(target => !getNewTags.some(tag => tag.tagName === target.tagName))
            .map(tag => tag.id);
    }

    // 메모가 업데이트(자동저장) 되어있다면 서버에 update요청하지 않고 해당 메모만 요청하여 refresh
    if (isUpdate.current && !autoReq) refreshTargetMemo(memoId);
    else if (!isUpdate.current) {
        const memo = {
            id: targetMemo.id,
            cateId,
            title: parsingTitle,
            content: parsingContent,
            important: isImportant,
        };

        Api.memo.updateMemo({ memo, newTags, deleteTagIds })
            .then((res) => {
                if (res.data.success) {
                    // 임시저장메모 최신화
                    temporarySaveMemo.current = { ...temporarySaveMemo.current, ...memo };

                    // 자동저장이라면 업데이트 true
                    if (autoReq) return isUpdate.current = true;
                    // 아니라면 해당메모 refresh -> 변경사항 적용
                    refreshTargetMemo(memoId);
                }
                else {
                    // success: false 이면 모든메모 refresh
                    console.log(res.data.error);
                    refreshMemos({
                        search: "",
                        offset: 0,
                        limit: data.memos.length,
                        menuQueryStr,
                        cateQueryStr: Number(cateQueryStr) || null,
                        tagQueryStr,
                    });
                    showAlert(res.data.error);
                }
            }).catch(e => console.log(e));
    }
}
/** ---- 메모 (생성, 업데이트) + 자동저장기능 모듈매서드 close ---- */