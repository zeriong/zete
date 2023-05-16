import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    AsideData,
    CategoriesAndMemoCount,
    Category,
    CateIdInput,
    CateInput,
    CreateCateInput,
    GetMemosInput,
    Memo,
} from "../../openapi";
import {store} from "../index";
import {Api} from "../../common/libs/api";
import {showAlert} from "./alert.slice";

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

export const resetMemos = () => store.dispatch(memoSlice.actions.RESET_MEMOS());
export const resetSearch = () => store.dispatch(memoSlice.actions.RESET_SEARCH());
export const setSearch = (value: string) => store.dispatch(memoSlice.actions.SET_SEARCH(value));

export const importantConverter = (memoId: number) => {
    Api().memo.changeImportant({memoId})
        .then((res) => {
            if (res.data.success) {
                store.dispatch(memoSlice.actions.SET_IMPORTANT_LENGTH(Number(res.data.importantMemoCount)))
                store.dispatch(memoSlice.actions.CHANGE_IMPORTANT(memoId));
            } else { console.log(res.data.error) }
        }).catch(e => console.log(e));
}

export const loadAsideData = () => {
    Api().memo.getAsideData().then((res) => {
        if (res.data.success) {
            store.dispatch(memoSlice.actions.SET_ASIDE_DATA(res.data.asideData));
        } else { console.log(res.data.error) }
    }).catch(e => console.log(e));
}

export const refreshMemos = (input: GetMemosInput) => {
    Api().memo.get(input)
        .then((res) => {
            if (res.data.success) {
                store.dispatch(memoSlice.actions.REFRESH_MEMOS(res.data.memos));
            } else { console.log(res.data.error) }
        })
        .catch(e => console.log(e));
}

export const refreshTargetMemo = (input: number) => {
    Api().memo.getOne({ memoId: input })
        .then((res) => {
            if (res.data.success) {
                store.dispatch(memoSlice.actions.REFRESH_TARGET_MEMO(res.data.memo));
            } else { console.log(res.data.error) }
        })
        .catch(e => console.log(e));
}

export const createCategory = (input: CreateCateInput) => {
    Api().memo.createCategory(input)
        .then((res) => {
            if (res.data.success) {
                store.dispatch(memoSlice.actions.ADD_CATE(res.data.savedCate));
            } else { showAlert(res.data.error) }
        })
        .catch((e) => {
            console.log(e);
            showAlert("카테고리 생성에 실패하였습니다.");
        });
}

export const deleteCategory = (input: CateIdInput) => {
    Api().memo.deleteCategory(input)
        .then((res) => {
            if (res.data.success) {
                store.dispatch(memoSlice.actions.DELETE_CATE({
                    importantMemoCount : res.data.importantMemoCount,
                    cateId: input.cateId,
                }));
            } else { showAlert(res.data.error) }
        })
        .catch((e) => {
            console.log(e);
            showAlert("카테고리 삭제에 실패하였습니다.");
        });
}

export const deleteMemo = (memoId: number) => {
    Api().memo.deleteMemo({memoId})
        .then((res) => {
            if (res.data.success) {
                store.dispatch(memoSlice.actions.DELETE_MEMO(memoId));
                showAlert(res.data.message);
            } else { showAlert(res.data.error) }
        })
        .catch(e => console.log(e));
    store.dispatch(memoSlice.actions.DELETE_MEMO(memoId));
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
            }));
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