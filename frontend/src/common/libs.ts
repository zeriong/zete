import css from 'dom-css';
import {showAlert} from "../store/slices/alert.slice";
import {CreateMemoInput, Memo} from "../openapi/generated";
import {store} from "../store";
import {deleteMemo, memoSlice, refreshMemos, refreshTargetMemo} from "../store/slices/memo.slice";
import {Api} from "./api";

/** ---- Handle Cookie ---- */

export const getCookie = (name: string) => {
    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value ? decodeURI(value[2]) : undefined;
}

export const setCookie = (name: string, val: string) => {
    const maxAge = 30 * 24 * 60 * 60 * 1000;
    document.cookie = `${name}=${val}; path=/; max-age=${maxAge}; SameSite=Strict;`;
}

export const deleteCookie = (name: string) => document.cookie = name+"=; max-age=0;";

export const existToken = () => {
    if (getCookie('rt')) console.log(String(getCookie('rt')));
    else console.log(null);
}

/** ---- In Content Method ---- */

export const handleResizeHeight = (textareaRef) => {
    const ref = textareaRef.current;
    if (ref) {
        ref.style.height = 'auto';
        ref.style.height = ref.scrollHeight + 'px';
    }
}
export const handleTagInput = (inputRef) => {
    const input = inputRef.current;
    input.style.width = '50px';
    input.style.width = `${input.scrollWidth}px`;
    input.style.whiteSpace = 'nowrap'; // 추가
};

export const handleAddTagSubmit = (event, getVal, setValFunc, target) => {
    event.preventDefault();
    const input = event.target[0];
    if (input.value === '') return;

    const tags = getVal(target) || [];
    const exists = tags.find(tag => tag.tagName === input.value);

    if (!exists) {
        setValFunc(target, [ ...tags, { tagName: input.value } ]);
        input.value = '';
    }
    else showAlert('이미 존재하는 태그명 입니다.');
}


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
    if (typeof document !== 'undefined') {
        const div = document.createElement('div');
        css(div, {
            width: 100,
            height: 100,
            position: 'absolute',
            top: -9999,
            overflow: 'scroll',
            MsOverflowStyle: 'scrollbar',
        });
        document.body.appendChild(div);
        scrollbarWidth = div.offsetWidth - div.clientWidth;
        document.body.removeChild(div);
    } else {
        scrollbarWidth = 0;
    }
    return scrollbarWidth || 0;
}

export const isString = (maybe: string | number) => typeof maybe === 'string';

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
    autoReq: boolean;
    reqType: string;
    typingTimeout: React.MutableRefObject<NodeJS.Timeout | null>;
    closeModal?: Function;
    cateQueryStr?: string;
    tagQueryStr?: string;
    menuQueryStr?: string;
    isImportant: boolean;
    setIsDone?: React.Dispatch<React.SetStateAction<any>>;
    isDone?: any;
    temporarySaveMemo? : Memo;
    setTemporarySaveMemo? : React.Dispatch<React.SetStateAction<any>>;
}

export const updateOrAddMemo = (props: HandleUpdateOrAddMemoInterface) => {
    const {
        getTitle, getNewTags, getContent, memoId,
        getCateId, cateQueryStr, autoReq, reqType,
        isDone, setIsDone, typingTimeout, closeModal,
        isImportant, tagQueryStr, menuQueryStr, setMemoId,
        temporarySaveMemo, setTemporarySaveMemo,
    } = props;

    // 자동저장 아닐때만 취소
    if (!autoReq) {
        clearTimeout(typingTimeout.current);
        typingTimeout.current = null;
    }

    const data = store.getState().memo.data;

    // 업데이트상황에서만 사용
    if (!autoReq && reqType === 'update') closeModal();

    // 줄바꿈 및 공백 제거하여 제목, 내용여부 체크
    const titleDeleteSpace = getTitle.replace(/\s*|\n/g,"");
    const contentDeleteSpace = getContent.replace(/\s*|\n/g,"");

    if (titleDeleteSpace === '' && contentDeleteSpace === '') {
        // 업데이트일때
        if (reqType === 'update') return showAlert('메모수정이 취소되었습니다.');
        else {
            // 메모 생성일때 새로작성 중인 메모가 자동저장되어 있다면
            if (memoId !== 0) {
                setMemoId(0);
                deleteMemo(memoId, 'create');
            }
            // 자동저장이 안되어있는 경우
            else return;
        }
    }

    const dbVerTitle = getTitle.replace(/\n/g, '<br/>');
    const dbVerContent = getContent.replace(/\n/g, '<br/>');

    // 메모생성이고 자동저장 안되어있다면
    if (reqType === 'create' && memoId === 0) {
        // 새 메모 할당 값
        const newMemoContent: CreateMemoInput = {
            important: isImportant,
            tags: getNewTags,
            cateId: getCateId as number,
            title: dbVerTitle,
            content: dbVerContent,
        }

        // 새로 만들게 되면 addMemo컴포넌트에 id를 state로 저장
        Api.memo.createMemo(newMemoContent)
            .then((res) => {
                if (res.data.success) {
                    if (autoReq) {
                        setTemporarySaveMemo(res.data.savedMemo);
                        setMemoId(res.data.savedMemo.id);
                    }
                    else store.dispatch(memoSlice.actions.ADD_MEMO({...res.data.savedMemo}));
                }
                else showAlert(res.data.error); // 실패시 에러 알람띄움
            })
            .catch(e => console.log(e));
        return;
    }

    const targetMemo = reqType === 'create' ? temporarySaveMemo
        : data.memos.find(memo => memo.id === memoId);
    const cateId = reqType === 'create' ? temporarySaveMemo.cateId
        : getCateId === 0 ? null : Number(getCateId);
    const changedTagLength = targetMemo.tag.filter(tag => getNewTags.some(inputTag => inputTag.tagName === tag.tagName)).length;
    const newTagLength = getNewTags.filter((newTag) => !targetMemo.tag.some((tag) => tag.tagName === newTag.tagName)).length;

    // 수정사항이 없는 경우 요청X
    if (
        getTitle === targetMemo.title.replace(/<br\/>/g, '\n') &&
        getContent === targetMemo.content.replace(/<br\/>/g, '\n') &&
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

    const memo = {
        id: targetMemo.id,
        cateId,
        title: dbVerTitle,
        content: dbVerContent,
        important: isImportant,
    };

    if (isDone && !autoReq) refreshTargetMemo(memoId);
    else {
        Api.memo.updateMemo({memo, newTags, deleteTagIds}).then((res)=>{
            if (res.data.success) {
                if (autoReq) setIsDone(true);
                else refreshTargetMemo(memoId);
            }
            else {
                if (autoReq) setIsDone(false);
                else {
                    console.log(res.data.error);
                    refreshMemos({
                        search: '',
                        offset: 0,
                        limit: data.memos.length,
                        menuQueryStr,
                        cateQueryStr: Number(cateQueryStr) || null,
                        tagQueryStr,
                    });
                    showAlert(res.data.error);
                }
            }
        }).catch(e => console.log(e));
    }
    setIsDone(false);
}
/** ---- 메모 (생성, 업데이트) + 자동저장기능 모듈매서드 close ---- */