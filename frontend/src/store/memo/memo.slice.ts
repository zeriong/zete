import {createSlice, current} from '@reduxjs/toolkit';
import {CategoryDto,
    Memo,
} from '../../openapi/generated';
import {
    changeImportantAction,
    createCategoryAction,
    updateCategoryAction,
    deleteCategoryAction,
    deleteMemoAction,
    getCategoriesAction,
    getMemoAction,
    searchMemosAction,
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
        resetMemosReducer: (state) => {
            state.memo.offset = 0;
            state.memo.totalCount = -1;
            state.memo.list = [];
        },
        saveMemoReducer: (state, { payload: memo }) => {
            state.memo.list = [...state.memo.list, memo].sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
            state.memo.offset++;
        },
        updateMemoReducer: (state, { payload: updateMemo }) => {
            state.memo.list = state.memo.list.map((memo) => {
                if (memo.id === updateMemo.id) return updateMemo;
                return memo;
            }).sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
        },
    },
    extraReducers: (builder) => {
        /* ======================= 카테고리 ====================== */

        // 카테고리 목록
        builder.addCase(getCategoriesAction.fulfilled, (state, { payload: data }) => {
            if (data.success) {
                state.cate.list = data.list.sort((a, b) => a.name > b.name ? 1 : -1);
                state.cate.totalMemoCount = data.totalMemoCount;
                state.cate.importantMemoCount = data.importantMemoCount;
            }
        });

        // 카테고리 생성
        builder.addCase(createCategoryAction.fulfilled, (state, { payload: data }) => {
            if (data.success) {
                state.cate.list = [...state.cate.list, data.savedCate]
                    .sort((a, b) => a.name > b.name ? 1 : -1);
            }
        });

        // 카테고리 업데이트
        builder.addCase(updateCategoryAction.fulfilled, (state, { payload: data, meta }) => {
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
        builder.addCase(deleteCategoryAction.fulfilled, (state, { payload: data, meta }) => {
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
        builder.addCase(searchMemosAction.pending, (state) => {
            state.memo.isLoading = true;
        });
        builder.addCase(searchMemosAction.fulfilled, (state, { payload: data, meta }) => {
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
        builder.addCase(searchMemosAction.rejected, (state) => {
            state.memo.isLoading = false;
        });

        // 중요메모 설정
        builder.addCase(changeImportantAction.fulfilled, (state, { payload: data, meta }) => {
            const input = meta.arg;
            if (data.success) {
                state.memo.list = state.memo.list.map((memo) => {
                    if (memo.id === input.id) return { ...memo, isImportant: !memo.isImportant };
                    else return memo;
                })
                state.cate.importantMemoCount = data.totalImportantCount;
            }
        });

        // 메모 삭제
        builder.addCase(deleteMemoAction.fulfilled, (state, { payload: data, meta }) => {
            const input = meta.arg;
            if (data.success) {
                state.memo.list = state.memo.list.filter(memo => memo.id !== input.id)
                    .sort((a, b) => new Date(b.updateAt).valueOf() - new Date(a.updateAt).valueOf());
            }
        });
    }
});

export const { resetMemosReducer, saveMemoReducer, updateMemoReducer } = memoSlice.actions;