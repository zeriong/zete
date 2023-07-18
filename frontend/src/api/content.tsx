import {store} from "../store";
import {Api} from "./index";
import {CateIdInput, CreateCateInput, GetMemosInput} from "../openapi/generated";
import {showAlert} from "../store/slices/alert.slice";
import {memoSlice} from "../store/slices/memo.slice";

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

