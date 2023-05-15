import {CategoriesAndMemoCount, Memo} from "../../openapi";
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