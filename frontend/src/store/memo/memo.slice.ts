// import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// import {
//     AsideData,
//     CategoriesAndMemoCount,
//     Category, CateIdInput,
//     CateInput, CreateCateInput, GetMemosInput,
//     Memo,
// } from '../../openapi/generated';
// import {store} from '../index';
// import {Api} from '../../openapi/api';
// import {showAlert} from '../alert/alert.slice';
//
//
// /** state dispatch 매서드 */
//
// export const resetMemos = () => {
//     store.dispatch(memoSlice.actions.RESET_MEMOS());
// }
// export const resetSearch = () => {
//     store.dispatch(memoSlice.actions.RESET_SEARCH());
// }
// export const setSearch = (value: string) => {
//     store.dispatch(memoSlice.actions.SET_SEARCH(value));
// }
//
//
// /** API를 통한 state 변경매서드 */
//
// export const importantConverter = (memoId: number) => {
//     Api.memo.changeImportant({memoId})
//         .then((res) => {
//             if (res.data.success) {
//                 store.dispatch(memoSlice.actions.SET_IMPORTANT_LENGTH(Number(res.data.importantMemoCount)));
//                 store.dispatch(memoSlice.actions.CHANGE_IMPORTANT(memoId));
//             }
//             else console.log(res.data.error);
//         })
//         .catch(e => console.log(e));
// }
//
// export const loadAsideData = () => {
//     Api.memo.getAsideData()
//         .then((res) => {
//             if (res.data.success) {
//                 store.dispatch(memoSlice.actions.SET_ASIDE_DATA(res.data.asideData));
//             }
//             else console.log(res.data.error);
//         })
//         .catch(e => console.log(e));
// }
//
// export const refreshMemos = (input: GetMemosInput) => {
//     Api.memo.get(input)
//         .then((res) => {
//             if (res.data.success) {
//                 store.dispatch(memoSlice.actions.REFRESH_MEMOS(res.data.memos));
//             }
//             else console.log(res.data.error);
//         })
//         .catch(e => console.log(e));
// }
//
// export const refreshTargetMemo = (input: number) => {
//     Api.memo.getOne({ memoId: input })
//         .then((res) => {
//             if (res.data.success) {
//                 store.dispatch(memoSlice.actions.REFRESH_TARGET_MEMO(res.data.memo));
//             }
//             else console.log(res.data.error);
//         })
//         .catch(e => console.log(e));
// }
//
// export const createCategory = (input: CreateCateInput) => {
//     Api.memo.createCategory(input)
//         .then((res) => {
//             if (res.data.success) {
//                 store.dispatch(memoSlice.actions.ADD_CATE(res.data.savedCate));
//             }
//             else showAlert(res.data.error);
//         })
//         .catch((e) => showAlert('카테고리 생성에 실패하였습니다.'));
// }
//
// export const deleteCategory = (input: CateIdInput) => {
//     Api.memo.deleteCategory(input)
//         .then((res) => {
//             if (res.data.success) {
//                 store.dispatch(memoSlice.actions.DELETE_CATE({
//                     importantMemoCount : res.data.importantMemoCount,
//                     cateId: input.cateId,
//                 }));
//             }
//             else showAlert(res.data.error);
//         })
//         .catch((e) => showAlert('카테고리 삭제에 실패하였습니다.'));
// }
//
// export const deleteMemo = (memoId: number, create?: string) => {
//     Api.memo.deleteMemo({memoId})
//         .then((res) => {
//             if (res.data.success) {
//                 if (create === 'create') return;
//                 store.dispatch(memoSlice.actions.DELETE_MEMO(memoId));
//                 showAlert(res.data.message);
//             }
//             else showAlert(res.data.error);
//         })
//         .catch(e => console.log(e));
// }
//
// export interface Data {
//     memosCount: number;
//     importantMemoCount: number;
//     cate: CategoriesAndMemoCount[];
//     memos: Memo[];
// }
// export interface CombineData {
//     data: Data;
//     searchInput: string;
// }
// export const memoSliceInitState: CombineData = {
//     data: {
//         memosCount: 0,
//         importantMemoCount: 0,
//         cate: [],
//         memos: [],
//     },
//     searchInput: '',
// }
//
// export const memoSlice = createSlice({
//     name: 'memo',
//     initialState: memoSliceInitState,
//     reducers: {
//         SET_ASIDE_DATA: (state: CombineData, { payload }: PayloadAction<AsideData>) => {
//             const { cate, ...leftStates } = payload;
//             state.data.cate = cate.map(val => ({
//                 ...val,
//                 id: Number(val.id),
//                 tag: val.tag.map(tag => {
//                     tag.id = Number(tag.id);
//                     tag.cateId = Number(tag.cateId);
//                     return tag
//                 }) || [],
//             })).sort((a, b) => a.name > b.name ? 1 : -1);
//             state.data.memosCount = leftStates.memosCount;
//             state.data.importantMemoCount = leftStates.importantMemoCount;
//         },
//         SET_CATE: (state: CombineData, { payload }: PayloadAction<Category[]>) => {
//             state.data.cate = payload;
//         },
//         ADD_CATE: (state: CombineData, { payload }: PayloadAction<CategoriesAndMemoCount>) => {
//             state.data.cate = [...state.data.cate, payload].sort((a, b) => a.name > b.name ? 1 : -1);
//         },
//         UPDATE_CATE: (state: CombineData, { payload }: PayloadAction<CateInput>) => {
//             state.data.cate = state.data.cate.map((cate) => {
//                 if (cate.id === payload.cateId) {
//                     cate.name = payload.name;
//                     return cate;
//                 }
//                 else return cate;
//             }).sort((a, b) => a.name > b.name ? 1 : -1);
//         },
//         DELETE_CATE: (state: CombineData, { payload }: PayloadAction<{ importantMemoCount: number, cateId: number }>) => {
//             const { cateId, importantMemoCount } = payload;
//             const { memos, cate } = state.data;
//
//             const targetLength = cate.find(cate => cate.id === cateId).memoCount;
//
//             state.data.memosCount -= targetLength;
//             state.data.importantMemoCount = importantMemoCount;
//             state.data.memos = memos.filter(memo => memo.cateId !== cateId) || [];
//             state.data.cate = cate.filter(exists => exists.id !== cateId) || [];
//         },
//         SET_MEMO: (state: CombineData, { payload }: PayloadAction<Memo[]>) => {
//             state.data.memos = [...state.data.memos, ...payload.map((memos) => {
//                 if (memos.cateId !== null) {
//                     memos.cateId = Number(memos.cateId);
//                     return memos
//                 }
//                 return memos;
//             })];
//         },
//         ADD_MEMO: (state: CombineData, { payload }: PayloadAction<Memo>) => {
//             state.data.memos = [...state.data.memos, payload]
//                 .sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
//             loadAsideData();
//         },
//         REFRESH_MEMOS: (state: CombineData, { payload }: PayloadAction<Memo[]>) => {
//             state.data.memos = payload
//                 .sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
//             loadAsideData();
//         },
//         REFRESH_TARGET_MEMO: (state: CombineData, { payload }: PayloadAction<Memo>) => {
//             state.data.memos = state.data.memos.map((memo) => {
//                 if (memo.id === payload.id) {
//                     memo = payload;
//                     memo.cateId = memo.cateId === null ? null : Number(memo.cateId);
//                     return memo;
//                 }
//                 return memo;
//             }).sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
//             loadAsideData();
//         },
//         SET_IMPORTANT_LENGTH: (state: CombineData, { payload }: PayloadAction<number>) => {
//             state.data.importantMemoCount = payload;
//         },
//         CHANGE_IMPORTANT: (state: CombineData, { payload }: PayloadAction<number>) => {
//             state.data.memos = state.data.memos.map((memos) => {
//                 if (memos.id === payload) return { ...memos, important: memos.important !==true };
//                 else return memos;
//             }).sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
//         },
//         DELETE_MEMO: (state, { payload }: PayloadAction<number>) => {
//             state.data.memos = state.data.memos.filter(memo => memo.id !== payload)
//                 .sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
//         },
//         SET_SEARCH: (state: CombineData, { payload }: PayloadAction<string>) => {
//             state.searchInput = payload;
//         },
//         RESET_MEMOS: (state: CombineData) => {
//             state.data.memos = [];
//         },
//         RESET_SEARCH: (state: CombineData) => {
//             state.searchInput = '';
//         },
//     },
// });
//
// export const { SET_MEMO, UPDATE_CATE } = memoSlice.actions;

import {createSlice, current} from '@reduxjs/toolkit';
import {CategoryDto,
    Memo,
} from '../../openapi/generated';
import {
    changeImportant,
    createCategory,
    updateCategory,
    deleteCategory,
    deleteMemo,
    getCategories,
    getMemo,
    searchMemos,
} from './memo.actions';
import {MEMO_LIST_REQUEST_LIMIT} from '../../common/constants';

interface IState {
    cate: {
        totalMemoCount?: number;
        importantMemoCount?: number;
        list?: CategoryDto[];
        isLoading: boolean;
    }
    memo: {
        offset?: number;
        totalCount?: number;
        list?: Memo[];
        isLoading: boolean;
        pagingEffect: boolean;
    }
}
const initState: IState = {
    cate: {
        totalMemoCount: 0,
        importantMemoCount: 0,
        list: [],
        isLoading: false,
    },
    memo: {
        offset: 0,
        totalCount: -1,
        list: [],
        isLoading: false,
        /**
         * 추가 변경사항
         * @description: 페이징시 db에서 보유한 기대 데이터가 limit보다 많을 가능성이 있는 경우
         *               변경시켜 주어 useEffect의 deps에 넣어 주기 위한 state
         * */
        pagingEffect: false,
    }
}

export const memoSlice = createSlice({
    name: 'memo',
    initialState: initState,
    reducers: {
        refreshMemosReducer: (state) => {
            state.memo.offset = 0;
            state.memo.totalCount = -1;
            state.memo.list = [];
        },
        saveMemoReducer: (state, { payload: memo }) => {
            state.memo.list = [...state.memo.list, memo].sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
            state.memo.offset++;
        },
        // updateTags: (state, { payload }) => {
        //     const { cateId, tags, memoId } = payload;
        //     const targetCate = state.cate.list.find(target => target.id == cateId);
        //     const newTags = tags.filter((tag) => !targetCate.tags.some((cate) => cate.name === tag.name))
        //         .map((tag) => ({ id: tag.id, name: tag.name, userId: tag.userId, memoId, cateId }));
        //
        //     state.cate.list = state.cate.list.map((cate) => {
        //         if (cate.id == cateId) {
        //             cate.tags = [...cate.tags, ...newTags].sort((a, b) => a.name > b.name ? 1 : -1);
        //             return cate;
        //         }
        //         return cate;
        //     });
        // },
    },
    extraReducers: (builder) => {
        /* ======================= 카테고리 ====================== */

        // 카테고리 목록
        builder.addCase(getCategories.fulfilled, (state, { payload: data }) => {
            if (data.success) {
                state.cate.list = data.list.sort((a, b) => a.name > b.name ? 1 : -1);
                state.cate.totalMemoCount = data.totalMemoCount;
                state.cate.importantMemoCount = data.importantMemoCount;
            }
        });

        // 카테고리 생성
        builder.addCase(createCategory.fulfilled, (state, { payload: data }) => {
            if (data.success) {
                state.cate.list = [...state.cate.list, data.savedCate]
                    .sort((a, b) => a.name > b.name ? 1 : -1);
            }
        });

        // 카테고리 업데이트
        builder.addCase(updateCategory.fulfilled, (state, { payload: data, meta }) => {
            const input = meta.arg;
            if (data.success) {
                state.cate.list = state.cate.list.map((cate) => {
                    if (cate.id === input.id) {
                        cate.name = input.name;
                        return cate;
                    }
                    else return cate;
                }).sort((a, b) => a.name > b.name ? 1 : -1);
            }
        });

        // 카테고리 삭제
        builder.addCase(deleteCategory.fulfilled, (state, { payload: data, meta }) => {
            const input = meta.arg;
            if (data.success) {
                state.cate.list = data.list.sort((a, b) => a.name > b.name ? 1 : -1);
                state.cate.totalMemoCount = data.totalMemoCount;
                state.cate.importantMemoCount = data.importantMemoCount;
                // 삭제된 카테고리 하위 메모 데이터 제외
                state.memo.list = state.memo.list.filter(memo => memo.cateId !== input.id) || [];
            }
        });

        /* ======================= 메모 ====================== */

        // 메모 목록 검색
        builder.addCase(searchMemos.pending, (state) => {
            state.memo.isLoading = true;
        });
        builder.addCase(searchMemos.fulfilled, (state, { payload: data, meta }) => {
            const refresh = meta.arg.refresh;
            if (!data.success) return;
            if (refresh) {
                state.memo.list = data.list.sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
                state.memo.offset = data.list.length;
                state.memo.totalCount = data.totalCount;
                state.memo.isLoading = false;
            } else {
                /**
                 * 추가 변경사항
                 * @description: 1. 현재 limit보다 db에서 가지고 있는 메모 갯수가 많은경우 observer가 페이징을 하지 않음.
                 *               2. 해당 state를 통해 effect를 일으켜 페이징를 재 시도함.
                 *               3. 데이터에서 받은 데이터 갯수와 limit갯수가 같다면 db에 더 많은 데이터를 기대할 수 있기 때문에
                 *                  state를 변경시켜 컴포넌트에서 useEffect를 통해 페이징 재시도를 할 수 있다.
                 * */
                if (data.list.length === MEMO_LIST_REQUEST_LIMIT) {
                    state.memo.pagingEffect = !state.memo.pagingEffect;
                }

                // 데이터 누적
                state.memo.list = [ ...state.memo.list, ...data.list ]
                    .sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
                state.memo.offset = state.memo.offset + data.list.length;
                state.memo.totalCount = data.totalCount;
                state.memo.isLoading = false;
            }
        });
        builder.addCase(searchMemos.rejected, (state) => {
            state.memo.isLoading = false;
        });

        // 중요메모 설정
        builder.addCase(changeImportant.fulfilled, (state, { payload: data, meta }) => {
            const input = meta.arg;
            if (data.success) {
                state.memo.list = state.memo.list.map((memo) => {
                    if (memo.id === input.id) return { ...memo, isImportant: !memo.isImportant };
                    else return memo;
                }).sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
            }
        });

        // 메모 삭제
        builder.addCase(deleteMemo.fulfilled, (state, { payload: data, meta }) => {
            const input = meta.arg;
            if (data.success) {
                state.memo.list = state.memo.list.filter(memo => memo.id !== input.id)
                    .sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
            }
        });

        // 특정 메모 정보
        builder.addCase(getMemo.fulfilled, (state, { payload: data }) => {
            if (data.success) {

            }
        });
    }
});

export const { refreshMemosReducer, saveMemoReducer } = memoSlice.actions;