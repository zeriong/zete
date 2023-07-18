import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    AsideData,
    CategoriesAndMemoCount,
    Category,
    CateInput,
    Memo,
} from "../../openapi/generated";
import {loadAsideData} from "../../api/content";

export interface Data {
    memosCount: number;
    importantMemoCount: number;
    cate: CategoriesAndMemoCount[];
    memos: Memo[];
}
export interface CombineData {
    data: Data;
    searchInput: string;
}
export const memoSliceInitState: CombineData = {
    data: {
        memosCount: 0,
        importantMemoCount: 0,
        cate: [],
        memos: [],
    },
    searchInput: '',
}

export const memoSlice = createSlice({
    name: 'memo',
    initialState: memoSliceInitState,
    reducers: {
        SET_ASIDE_DATA: (state: CombineData, action: PayloadAction<AsideData>) => {
            const { cate, ...payload } = action.payload;
            state.data.cate = cate.map(val => ({
                ...val,
                id: Number(val.id),
                tag: val.tag.map(tag => {
                    tag.id = Number(tag.id);
                    tag.cateId = Number(tag.cateId);
                    return tag
                }) || [],
            })).sort((a, b) => a.cateName > b.cateName ? 1 : -1);
            state.data.memosCount = payload.memosCount;
            state.data.importantMemoCount = payload.importantMemoCount;
        },
        SET_CATE: (state: CombineData, action: PayloadAction<Category[]>) => {
            state.data.cate = action.payload;
        },
        ADD_CATE: (state: CombineData, action: PayloadAction<CategoriesAndMemoCount>) => {
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
        DELETE_CATE: (state: CombineData, action: PayloadAction<{ importantMemoCount: number, cateId: number }>) => {
            const { cateId, importantMemoCount } = action.payload;
            const { memos, cate } = state.data;

            const targetLength = cate.find(cate => cate.id === cateId).memoCount;

            state.data.memosCount -= targetLength;
            state.data.importantMemoCount = importantMemoCount;
            state.data.memos = memos.filter(memo => memo.cateId !== cateId) || [];
            state.data.cate = cate.filter(exists => exists.id !== cateId) || [];
        },
        SET_MEMO: (state: CombineData, action: PayloadAction<Memo[]>) => {
            state.data.memos = [...state.data.memos, ...action.payload.map((memos) => {
                if (memos.cateId !== null) {
                    memos.cateId = Number(memos.cateId);
                    return memos
                }
                return memos;
            })];
        },
        ADD_MEMO: (state: CombineData, action: PayloadAction<Memo>) => {
            state.data.memos = [...state.data.memos, action.payload]
                .sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
            loadAsideData();
        },
        REFRESH_MEMOS: (state: CombineData, action: PayloadAction<Memo[]>) => {
            state.data.memos = action.payload
                .sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
            loadAsideData();
        },
        REFRESH_TARGET_MEMO: (state: CombineData, action: PayloadAction<Memo>) => {
            state.data.memos = state.data.memos.map((memo) => {
                if (memo.id === action.payload.id) {
                    memo = action.payload;
                    memo.cateId = memo.cateId === null ? null : Number(memo.cateId);
                    return memo;
                }
                return memo;
            }).sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
            loadAsideData();
        },
        SET_IMPORTANT_LENGTH: (state: CombineData, action: PayloadAction<number>) => { state.data.importantMemoCount = action.payload; },
        CHANGE_IMPORTANT: (state: CombineData, action: PayloadAction<number>) => {
            state.data.memos = state.data.memos.map((memos) => {
                if (memos.id === action.payload) {
                    return { ...memos, important: memos.important !==true };
                } else {
                    return memos;
                }
            }).sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
        },
        DELETE_MEMO: (state, action: PayloadAction<number>) => {
            state.data.memos = state.data.memos.filter(memo => memo.id !== action.payload)
                .sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
        },
        SET_SEARCH: (state: CombineData, action: PayloadAction<string>) => {
            state.searchInput = action.payload;
        },
        RESET_MEMOS: (state: CombineData) => {
            state.data.memos = [];
        },
        RESET_SEARCH: (state: CombineData) => {
            state.searchInput = '';
        },
    },
});

export const { ADD_MEMO, SET_MEMO, UPDATE_CATE } = memoSlice.actions;