import {CategoriesAndMemoCount, Memos} from "../../openapi";
export interface RefreshMemos {
    search: string;
    offset: number;
    limit: number;
    cateQueryStr: number;
    tagQueryStr: string;
    menuQueryStr: string;
}
export interface Data {
    memosCount: number;
    importantMemoCount: number;
    cate: CategoriesAndMemoCount[];
    memos: Memos[];
}
export interface CombineData {
    data: Data;
    searchInput: string;
    isPagingRetry: boolean;
}
export const memoSliceInitState: CombineData = {
    data: {
        memosCount: 0,
        importantMemoCount: 0,
        cate: [],
        memos: [],
    },
    searchInput: '',
    isPagingRetry: false,
}