import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CombineData, memoSliceInitState} from "./constants";
import {
    AsideData,
    Categories,
    CateInput,
    CreateCateInput,
    CreateMemoInput,
    CreateMemoOutput,
    Memos
} from "../../openapi";
import {store} from "../index";
import {Api} from "../../common/libs/api";
import {showAlert} from "./alert.slice";

export const resetMemos = () => store.dispatch(memoSlice.actions.RESET_MEMOS());
export const resetSearch = () => store.dispatch(memoSlice.actions.RESET_SEARCH());
export const setSearch = (value: string) => store.dispatch(memoSlice.actions.SET_SEARCH(value));

export const importantConverter = (memoId: number) => {
    Api().memo.changeImportant({memoId})
        .then((res) => {
            if (res.data) {
                store.dispatch(memoSlice.actions.SET_IMPORTANT_LENGTH(Number(res.data.importantMemoLength)))
                store.dispatch(memoSlice.actions.CHANGE_IMPORTANT(memoId));
            } else { console.log(res.data.error) }
        }).catch(e => console.log(e));
}

export const loadAsideData = () => {
    Api().memo.getAsideData().then((res) => {
        if (res.data) {
            store.dispatch(memoSlice.actions.SET_ASIDE_DATA(res.data.asideData))
        } else { console.log(res.data.error) }
    }).catch(e => console.log(e));
}

export const createCategory = (input: CreateCateInput) => {
    Api().memo.createCate(input)
        .then((res) => {
            if (res.data) {
                if (res.data.success) {
                    store.dispatch(memoSlice.actions.ADD_CATE(res.data.savedCate));
                } else { showAlert(res.data.error); }
            }})
        .catch((e) => {
            console.log(e);
            showAlert("카테고리 생성에 실패하였습니다.");
        })
}

export const memoSlice = createSlice({
    name: 'memo',
    initialState: memoSliceInitState,
    reducers: {
        SET_ASIDE_DATA: (state: CombineData, action: PayloadAction<AsideData>) => {
            const { cate, ...payload } = action.payload;
            return {
                data: {
                    ...state.data,
                    ...payload,
                    cate: cate.sort((a, b) => a.cateName > b.cateName ? 1 : -1),
                },
                searchInput: state.searchInput,
            };
        },
        ADD_CATE: (state: CombineData, action: PayloadAction<Categories>) => {
            state.data.cateLength += 1;
            state.data.cate = [...state.data.cate, action.payload]
                .sort((a, b) => a.cateName > b.cateName ? 1 : -1);
        },
        UPDATE_CATE: (state: CombineData, action: PayloadAction<CateInput>) => {
            state.data.cate = state.data.cate.map((cate) => {
                if (cate.id === action.payload.cateId) {
                    cate.cateName = action.payload.cateName;
                    return cate;
                } else {
                    return cate;
                }
            }).sort((a, b) => a.cateName > b.cateName ? 1 : -1);
        },
        DELETE_CATE: (state: CombineData, action: PayloadAction<{ importantMemoLength: number, cateId: number }>) => {
            const { cateId, importantMemoLength } = action.payload;
            const { memos, tagsInCate, cate, memoLengthInCate, memosLength } = state.data;

            const targetLength = memoLengthInCate.filter(tags => tags.cateId === cateId).length;

            state.data.cateLength -= 1;
            state.data.memosLength = memosLength - targetLength;
            state.data.importantMemoLength = importantMemoLength;
            state.data.memos = memos.filter(memo => memo.cateId !== cateId).sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
            state.data.cate = cate.filter(exists => exists.id !== cateId).sort((a, b) => a.cateName > b.cateName ? 1 : -1)
            state.data.tagsInCate = tagsInCate.filter(tags => tags.cateId !== cateId).sort((a, b) => a.tagName > b.tagName ? 1 : -1);
        },
        SET_MEMO: (state: CombineData, action: PayloadAction<Memos[]>) => {
            state.data.memos = [...state.data.memos, ...action.payload]
                .sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
        },
        ADD_MEMO: (state: CombineData, action: PayloadAction<Memos>) => {
            state.data.memosLength += 1;

            if (action.payload.important) {
                state.data.importantMemoLength += 1
            }
            if (action.payload.tag.length !== 0) {
                state.data.tagsLength += action.payload.tag.length;
            }

            const addMemoInCateLength = state.data.memoLengthInCate.find(inCate => inCate.cateId === action.payload.cateId);
            if (addMemoInCateLength) {
                state.data.memoLengthInCate = [
                    ...state.data.memoLengthInCate.filter(inCate => inCate.cateId !== addMemoInCateLength.cateId),
                    { cateId: addMemoInCateLength.cateId, length: addMemoInCateLength.length + 1 }
                ];
            }

            const noExists = action.payload.tag?.filter(tag => !state.data.tagsInCate.some(inCate => inCate.tagName === tag.tagName)) || [];
            if (noExists.length !== 0) {
                state.data.tagsInCate = [...state.data.tagsInCate, ...noExists.map(exists => ({
                    cateId: exists.cateId, tagName: exists.tagName
                }))];
            }

            state.data.memos = [...state.data.memos, action.payload]
                .sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
        },
        SET_IMPORTANT_LENGTH: (state: CombineData, action: PayloadAction<number>) => {
            state.data.importantMemoLength = action.payload;
        },
        CHANGE_IMPORTANT: (state: CombineData, action: PayloadAction<number>) => {
            state.data.memos = state.data.memos.map((memos) => {
                if (memos.id === action.payload) {
                    return { ...memos, important: memos.important !==true };
                } else {
                    return memos;
                }
            }).sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
        },
        SET_SEARCH: (state: CombineData, action: PayloadAction<string>) => { state.searchInput = action.payload },
        RESET_MEMOS: (state: CombineData) => { state.data.memos = [] },
        RESET_SEARCH: (state: CombineData) => { state.searchInput = '' },
    },
});

export const { ADD_CATE, DELETE_CATE, ADD_MEMO, SET_MEMO, UPDATE_CATE } = memoSlice.actions;