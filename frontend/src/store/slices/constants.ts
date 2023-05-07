import {Categories, MemoLengthInCate, Memos, TagNameAndCateId} from "../../openapi";

export interface Data {
    cateLength: number;
    memosLength: number;
    importantMemoLength: number;
    tagsLength: number;
    memoLengthInCate: MemoLengthInCate[];
    cate: Categories[];
    memos: Memos[];
    tagsInCate: TagNameAndCateId[];
}
export interface CombineData {
    data: Data;
    searchInput: string;
}
export const memoSliceInitState: CombineData = {
    data: {
        cateLength: 0,
        memosLength: 0,
        importantMemoLength: 0,
        tagsLength: 0,
        memoLengthInCate: [],
        cate: [],
        memos: [],
        tagsInCate: [],
    },
    searchInput: '',
}