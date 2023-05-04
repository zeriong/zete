import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CombineData, memoSliceInitState} from "./constants";
import {AsideData, CateNameAndCateId, GetMemos, GetMemosInput} from "../../openapi";
import {store} from "../index";
import {Api} from "../../common/libs/api";

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
        ADD_CATE: (state: CombineData, action: PayloadAction<CateNameAndCateId>) => {
            state.data.cate = [...state.data.cate, action.payload].sort((a, b) => a.cateName > b.cateName ? 1 : -1);
        },
        UPDATE_ONE_CATE: (state: CombineData, action: PayloadAction<CateNameAndCateId>) => {
            state.data.cate = state.data.cate.map((cate) => {
                if (cate.cateId === action.payload.cateId) {
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

            const targetLength = memoLengthInCate.filter(tags => tags.cateId === cateId)[0].length;

            state.data.memosLength = memosLength - targetLength;
            state.data.importantMemoLength = importantMemoLength;
            state.data.memos = memos.filter(memo => memo.cateId !== cateId).sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
            state.data.cate = cate.filter(exists => exists.cateId !== cateId).sort((a, b) => a.cateName > b.cateName ? 1 : -1)
            state.data.tagsInCate = tagsInCate.filter(tags => tags.cateId !== cateId).sort((a, b) => a.tagName > b.tagName ? 1 : -1);
        },
        SET_MEMO: (state: CombineData, action: PayloadAction<GetMemos[]>) => {
            state.data.memos = [...state.data.memos, ...action.payload]
                .sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
        },
        SET_IMPORTANT_LENGTH: (state: CombineData, action: PayloadAction<number>) => {
            state.data.importantMemoLength = action.payload;
        },
        CHANGE_IMPORTANT: (state: CombineData, action: PayloadAction<number>) => {
            state.data.memos = state.data.memos.map((memos) => {
                if (memos.memoId === action.payload) {
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

export const {
    ADD_CATE, DELETE_CATE,//ADD_MEMO,
    SET_MEMO, } = memoSlice.actions;