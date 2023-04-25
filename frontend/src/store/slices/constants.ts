export interface Category {
    cateId:number;
    cateName:string;
}
export interface Memo {
    cateId:number;
    memoId:number;
    title:string;
    content:string;
    important:boolean;
}
export interface Tag {
    memoId:number;
    cateId:number;
    tagId:number;
    tagName:string;
}
export interface TableData {
    categories: Category[];
    memos: Memo[];
    tags: Tag[];
}
export interface Memos {
    memoId: number;
    title: string;
    content: string;
    important: boolean;
    tags: Tag[];
}

export interface Data {
    cateId?: number;
    memos?: Memos[];
}
export interface addMemoPayload {
    categoryId: number;
    title: string;
    content: string;
    important: boolean;
    tagNames: string[];
}
export interface ModifyMemoPayload {
    memoId: number;
    categoryId: number;
    title: string;
    content: string;
    important: boolean;
    tagNames: string[];
}
export interface MemoData {
    tableData: TableData,
    data: Data[],
}
export const memoSliceInitState:MemoData = {
    tableData: {
        categories: [],
        memos: [],
        tags: [],
    },
    data: [],
}