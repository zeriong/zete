import {CateInput, GetMemos, MemoLengthInCate, TagNameAndCateId} from "../../openapi";

export interface Data {
    memosLength: number;
    importantMemoLength: number;
    tagsLength: number;
    memoLengthInCate: MemoLengthInCate[];
    cate: CateInput[];
    memos: GetMemos[];
    tagsInCate: TagNameAndCateId[];
}
export interface CombineData {
    data: Data;
    searchInput: string;
}
export const memoSliceInitState: CombineData = {
    data: {
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