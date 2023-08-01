import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    AsideData,
    CategoriesAndMemoCount,
    Category, CateIdInput,
    CateInput, CreateCateInput, GetMemosInput,
    Memo,
} from "../../openapi/generated";
import {store} from "../index";
import {Api} from "../../openapi/api";
import {showAlert} from "./alert.slice";


/** state dispatch 매서드 */

export const resetMemos = () => {
    store.dispatch(memoSlice.actions.RESET_MEMOS());
}
export const resetSearch = () => {
    store.dispatch(memoSlice.actions.RESET_SEARCH());
}
export const setSearch = (value: string) => {
    store.dispatch(memoSlice.actions.SET_SEARCH(value));
}


/** API를 통한 state 변경매서드 */

export const importantConverter = (memoId: number) => {
    Api.memo.changeImportant({memoId})
        .then((res) => {
            if (res.data.success) {
                store.dispatch(memoSlice.actions.SET_IMPORTANT_LENGTH(Number(res.data.importantMemoCount)));
                store.dispatch(memoSlice.actions.CHANGE_IMPORTANT(memoId));
            }
            else console.log(res.data.error);
        })
        .catch(e => console.log(e));
}

export const loadAsideData = () => {
    Api.memo.getAsideData()
        .then((res) => {
            if (res.data.success) {
                store.dispatch(memoSlice.actions.SET_ASIDE_DATA(res.data.asideData));
            }
            else console.log(res.data.error);
        })
        .catch(e => console.log(e));
}

export const refreshMemos = (input: GetMemosInput) => {
    Api.memo.get(input)
        .then((res) => {
            if (res.data.success) {
                store.dispatch(memoSlice.actions.REFRESH_MEMOS(res.data.memos));
            }
            else console.log(res.data.error);
        })
        .catch(e => console.log(e));
}

export const refreshTargetMemo = (input: number) => {
    Api.memo.getOne({ memoId: input })
        .then((res) => {
            if (res.data.success) {
                store.dispatch(memoSlice.actions.REFRESH_TARGET_MEMO(res.data.memo));
            }
            else console.log(res.data.error);
        })
        .catch(e => console.log(e));
}

export const createCategory = (input: CreateCateInput) => {
    Api.memo.createCategory(input)
        .then((res) => {
            if (res.data.success) {
                store.dispatch(memoSlice.actions.ADD_CATE(res.data.savedCate));
            }
            else showAlert(res.data.error);
        })
        .catch((e) => showAlert("카테고리 생성에 실패하였습니다."));
}

export const deleteCategory = (input: CateIdInput) => {
    Api.memo.deleteCategory(input)
        .then((res) => {
            if (res.data.success) {
                store.dispatch(memoSlice.actions.DELETE_CATE({
                    importantMemoCount : res.data.importantMemoCount,
                    cateId: input.cateId,
                }));
            }
            else showAlert(res.data.error);
        })
        .catch((e) => showAlert("카테고리 삭제에 실패하였습니다."));
}

export const deleteMemo = (memoId: number, create?: string) => {
    Api.memo.deleteMemo({memoId})
        .then((res) => {
            if (res.data.success) {
                if (create === 'create') return;
                store.dispatch(memoSlice.actions.DELETE_MEMO(memoId));
                showAlert(res.data.message);
            }
            else showAlert(res.data.error);
        })
        .catch(e => console.log(e));
}

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
        SET_ASIDE_DATA: (state: CombineData, { payload }: PayloadAction<AsideData>) => {
            const { cate, ...leftStates } = payload;
            state.data.cate = cate.map(val => ({
                ...val,
                id: Number(val.id),
                tag: val.tag.map(tag => {
                    tag.id = Number(tag.id);
                    tag.cateId = Number(tag.cateId);
                    return tag
                }) || [],
            })).sort((a, b) => a.name > b.name ? 1 : -1);
            state.data.memosCount = leftStates.memosCount;
            state.data.importantMemoCount = leftStates.importantMemoCount;
        },
        SET_CATE: (state: CombineData, { payload }: PayloadAction<Category[]>) => {
            state.data.cate = payload;
        },
        ADD_CATE: (state: CombineData, { payload }: PayloadAction<CategoriesAndMemoCount>) => {
            state.data.cate = [...state.data.cate, payload].sort((a, b) => a.name > b.name ? 1 : -1);
        },
        UPDATE_CATE: (state: CombineData, { payload }: PayloadAction<CateInput>) => {
            state.data.cate = state.data.cate.map((cate) => {
                if (cate.id === payload.cateId) {
                    cate.name = payload.name;
                    return cate;
                }
                else return cate;
            }).sort((a, b) => a.name > b.name ? 1 : -1);
        },
        DELETE_CATE: (state: CombineData, { payload }: PayloadAction<{ importantMemoCount: number, cateId: number }>) => {
            const { cateId, importantMemoCount } = payload;
            const { memos, cate } = state.data;

            const targetLength = cate.find(cate => cate.id === cateId).memoCount;

            state.data.memosCount -= targetLength;
            state.data.importantMemoCount = importantMemoCount;
            state.data.memos = memos.filter(memo => memo.cateId !== cateId) || [];
            state.data.cate = cate.filter(exists => exists.id !== cateId) || [];
        },
        SET_MEMO: (state: CombineData, { payload }: PayloadAction<Memo[]>) => {
            state.data.memos = [...state.data.memos, ...payload.map((memos) => {
                if (memos.cateId !== null) {
                    memos.cateId = Number(memos.cateId);
                    return memos
                }
                return memos;
            })];
        },
        ADD_MEMO: (state: CombineData, { payload }: PayloadAction<Memo>) => {
            state.data.memos = [...state.data.memos, payload]
                .sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
            loadAsideData();
        },
        REFRESH_MEMOS: (state: CombineData, { payload }: PayloadAction<Memo[]>) => {
            state.data.memos = payload
                .sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
            loadAsideData();
        },
        REFRESH_TARGET_MEMO: (state: CombineData, { payload }: PayloadAction<Memo>) => {
            state.data.memos = state.data.memos.map((memo) => {
                if (memo.id === payload.id) {
                    memo = payload;
                    memo.cateId = memo.cateId === null ? null : Number(memo.cateId);
                    return memo;
                }
                return memo;
            }).sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
            loadAsideData();
        },
        SET_IMPORTANT_LENGTH: (state: CombineData, { payload }: PayloadAction<number>) => {
            state.data.importantMemoCount = payload;
        },
        CHANGE_IMPORTANT: (state: CombineData, { payload }: PayloadAction<number>) => {
            state.data.memos = state.data.memos.map((memos) => {
                if (memos.id === payload) return { ...memos, important: memos.important !==true };
                else return memos;
            }).sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
        },
        DELETE_MEMO: (state, { payload }: PayloadAction<number>) => {
            state.data.memos = state.data.memos.filter(memo => memo.id !== payload)
                .sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
        },
        SET_SEARCH: (state: CombineData, { payload }: PayloadAction<string>) => {
            state.searchInput = payload;
        },
        RESET_MEMOS: (state: CombineData) => {
            state.data.memos = [];
        },
        RESET_SEARCH: (state: CombineData) => {
            state.searchInput = '';
        },
    },
});

export const { SET_MEMO, UPDATE_CATE } = memoSlice.actions;