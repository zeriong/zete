export interface Category {
    cateId:number;
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
    cateId:number;
    tagId:number;
}
export interface CateMemo {
    cateId:number;
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
    cateId?: number;
    cateName?: string;
    memos?: Memos[];
}

export interface SetMemoPayload {
    categoryId: number;
    title: string;
    content: string;
    important: boolean;
    tagNames: string[];
    memoIdToUpdate?: number; // 수정할 메모의 ID (수정할 때만 사용)
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