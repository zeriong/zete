export interface Category {
    cateId:number|'undefined';
    cateName:string;
}
export interface Memo {
    memoId:number;
    title:string;
    content:string;
    important:boolean;
}
export interface Tag {
    tagId:number;
    tagName:string;
}
export interface MemoTag {
    memoId:number;
    tagId:number;
}
export interface CateTag {
    cateId:number|'undefined';
    tagId:number;
}
export interface CateMemo {
    cateId:number|'undefined';
    memoId:number;
}
export interface TableArr {
    categories: Category[];
    memos: Memo[];
    tags: Tag[];
    memoTags: MemoTag[];  // joinData
    cateMemos: CateMemo[];  // joinData
    cateTags: CateTag[];  // joinData
}
export interface Memos {
    memoId: number;
    title: string;
    content: string;
    important: boolean;
    tags: Tag[];
}

export interface Data {
    cateId?: number|'undefined';
    cateName?: string;
    memos?: Memos[];
}
export interface addMemoPayload {
    categoryId: number|'undefined';
    title: string;
    content: string;
    important: boolean;
    tagNames: string[];
}
export interface ModifyMemoPayload {
    memoId: number;
    categoryId: number|'undefined';
    title: string;
    content: string;
    important: boolean;
    tagNames: string[];
}
export interface MemoData {
    tableArr: TableArr,
    data: Data[],
}
export const initState:MemoData = {
    tableArr: {
        categories: [],
        memos: [],
        tags: [],
        memoTags: [],
        cateMemos: [],
        cateTags: [],
    },
    data: [],
}