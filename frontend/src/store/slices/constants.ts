export interface Category {
    cateId:number | null;
    cateName:string;
}
export interface TagsInCate {
    cateId:number | null;
    tagName:string;
}
export interface Tag {
    memoId:number;
    cateId:number | null;
    tagId:number;
    tagName:string;
}
export interface Memos {
    updateAt: number;
    memoId: number;
    cateId: number | null;
    title: string;
    content: string;
    important: boolean;
    tags: Tag[];
}
export interface MemoLengthInCate {
    cateId: number | null;
    length: number;
}
export interface Data {
    memosLength: number;
    importantMemoLength: number;
    memoLengthInCate: MemoLengthInCate[];
    cate: Category[];
    memos: Memos[];
    tagsInCate: TagsInCate[];
}
export interface CombineData {
    data: Data;
}
export interface addMemoPayload {
    updateAt: number;
    memoId?: number;
    cateId?: number | null;
    title: string;
    content: string;
    important: boolean;
    tags: Tag[];
}
export const memoSliceInitState: CombineData = {
    data: {
        memosLength: 0,
        importantMemoLength: 0,
        memoLengthInCate: [],
        cate: [],
        memos: [],
        tagsInCate: [],
    },
}