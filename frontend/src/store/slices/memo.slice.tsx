import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Category, initState, Memo, MemoData, SetMemoPayload} from "./constants";



// 로컬스토리지 임시저장
const loadMemoState = (): MemoData => {
    try {
        const memoData = localStorage.getItem('memoData');
        if (memoData === null) {
            return initState;
        }
        return JSON.parse(memoData);
    } catch (err) {
        return initState;
    }
};
const saveMemoState = (state: MemoData) => {
    try {
        const memoData = JSON.stringify(state);
        localStorage.setItem('memoData', memoData);
    } catch (err) {
        console.log(err);
    }
};

export const memoSlice = createSlice({
    name: 'memo',
    initialState: loadMemoState(),
    reducers: {
        SET_CATE: (state: MemoData, action: PayloadAction<{cateName:string}>) => {
            const { cateName } = action.payload;
            const memoIds = state.tableArr.categories.map((cate) => cate.cateId) || [];
            const makeId = memoIds.length > 0 ? Math.max(...memoIds) + 1 : 1;
            state.tableArr['categories'].push({
                cateId: makeId,
                cateName,
            });
            saveMemoState(state);
        },
        DELETE_CATE: (state: MemoData, action: PayloadAction<number>) => {
            state.tableArr.categories = state.tableArr.categories.filter(cate => cate.cateId !== action.payload);
            state.tableArr.cateMemos = state.tableArr.cateMemos.filter(match => match.cateId !== action.payload);
            saveMemoState(state);
        },
        SET_MEMO: (state: MemoData, action: PayloadAction<SetMemoPayload>) => {
            const { categoryId, title, content, important, tagNames, isUpdate, memoIdToUpdate } = action.payload;

            // set memos
            let memos: Memo[] = state.tableArr['memos'] || [];
            let memoToUpdate = memos.find((memo) => memo.memoId === memoIdToUpdate); // 추가인지 수정인지 여부체크 후 처리 //

            if (memoToUpdate && isUpdate) {  // 업데이트인경우 //
                memoToUpdate['title'] = title;
                memoToUpdate['content'] = content;
                memoToUpdate['important'] = important;
            } else {
                const memoIds = memos.map((memo) => memo.memoId) || [];  // 추가인경우 //
                const makeId = memoIds.length > 0 ? Math.max(...memoIds) + 1 : 1;
                const newMemo = {
                    memoId: makeId,
                    title,
                    content,
                    important,
                };
                memos = [...memos, newMemo]; /** 데이터를 추가 */
                memoToUpdate = newMemo;
                // memoToUpdate에 할당시켜 이후 처리에서 수정인 경우와 추가인경우를 동률적으로 바꿈 //
            }

            // set tags
            const existTags = [...state.tableArr['tags']]; // 이미 존재한다면 존재하는 태그배열을 가져옴
            const excludeTags = existTags.filter((exist) => tagNames.some(tag => tag === exist.tagName));
            const excludeNames = excludeTags.map((exist) => exist.tagName);
            let tagNamesSet = tagNames.filter((name) => !excludeNames.some(tag => tag === name))

            console.log('이거슨 existTags',JSON.stringify(existTags))
            console.log('이거슨 excludeTags',JSON.stringify(excludeTags))
            console.log('이거슨 tagNamesSet',tagNamesSet)
            console.log('비교해보자 tagNamesSet',tagNames,excludeNames)
            if (excludeNames === tagNamesSet) {
                tagNamesSet = [];
            }
            if (excludeNames.length === 0) {
                tagNamesSet = tagNames;
                console.log('들어와부르스')
                console.log('들어와부르스 tagNamesSet은', tagNamesSet)
            }

            const newTags = tagNamesSet.map((newTagName, idx) => {
                    const memoIds = state.tableArr['tags']?.map((tag) => tag.tagId); // new id를 만들기 위해 선언
                    const makeId = memoIds.length > 0 ? Math.max(...memoIds) + (idx + 1) : idx + 1;
                    return {
                        tagId: makeId,
                        tagName: newTagName,
                    }
                });

            const allTags = [...existTags, ...newTags];

            // set memoTags
            const memoTags = state.tableArr['memoTags'];
            const memoTagsUpdateTarget = memoTags.filter((memoTag) => memoTag.memoId === memoIdToUpdate); //업데이트시 받는 아이디로 존재체크
            const memoTagsDeleteTarget = memoTagsUpdateTarget.filter((memoTag) => !allTags.find((tag) => tag.tagId === memoTag.tagId));
            const memoTagsAddTarget = allTags.filter((tag) => !memoTags.find((memoTag) => memoTag.memoId === memoToUpdate.memoId && memoTag.tagId === tag.tagId));
            const newMemoTags = [
                ...memoTags.filter((memoTag) => !memoTagsDeleteTarget.includes(memoTag)),
                ...memoTagsAddTarget.map((tag) => ({
                memoId: memoToUpdate.memoId,
                tagId: tag.tagId,
                })),
            ];

            // set cateMemos
            const cateMemos = state.tableArr['cateMemos'] || [];
            const cateTarget = cateMemos.find((cateMemo) => cateMemo.cateId === categoryId);
            const memoTarget = cateMemos.find((cateMemo) => cateMemo.memoId === memoToUpdate.memoId);

            let newCateMemos = [];

            if (!cateTarget || !memoTarget) {
                newCateMemos.push(...cateMemos, {cateId: categoryId, memoId: memoToUpdate.memoId});
            } else if (memoTarget.cateId !== categoryId) {
                const deleteTarget = cateMemos.filter((cateMemo) => cateMemo.memoId !== memoToUpdate.memoId);
                newCateMemos.push(...deleteTarget, {cateId: categoryId, memoId: memoToUpdate.memoId});
            } else {
                newCateMemos.push(...cateMemos)
            }

            // set cateTags
            const cateTags = state.tableArr['cateTags'] || [];
            const cateTags_cateTarget = cateTags.find((cateTags) => cateTags.cateId === categoryId);
            const cateTags_tagTarget = cateTags.find((cateTags) => allTags.some(tags => tags.tagId === cateTags.cateId));
            const tagIds =  newTags.map((val) => ({cateId: categoryId, tagId: val.tagId}));

            let newCateTags = [];

            if (!cateTags_cateTarget || !cateTags_tagTarget) {
                newCateTags.push(...cateTags, ...tagIds);
            } else if (memoTarget.cateId !== categoryId) {
                const newCateTagsWithoutOldData = cateTags.filter((cateTag) => {
                    const isSameCategory = memoTarget.cateId === cateTag.cateId;
                    const isOldData = tagIds.some((tagId) => tagId.tagId === cateTag.tagId);

                    return !(isSameCategory && isOldData);
                });

                newCateTags.push(...newCateTagsWithoutOldData, ...tagIds);
            } else {
                newCateTags.push(...cateTags);
            }

            const newState = { // Update state
                tableArr: {
                    ...state.tableArr,
                    memos,
                    tags: [...allTags],
                    memoTags: newMemoTags,
                    cateMemos: newCateMemos,
                    cateTags: newCateTags,
                },
                data: state.data
            }
            saveMemoState(newState)
            return newState
        },
        DELETE_MEMO: (state: MemoData, action: PayloadAction<number>) => {
            const memoId = action.payload;
            state.tableArr.memos = state.tableArr.memos.filter((memo) => memo.memoId !== memoId);
            state.tableArr.memoTags = state.tableArr.memoTags.filter((memoTag) => memoTag.memoId !== memoId);
            state.tableArr.cateMemos = state.tableArr.cateMemos.filter((cateMemo) => cateMemo.memoId !== memoId);
        },
        UPDATE_CATE: (state: MemoData, action: PayloadAction<Category[]>) => {
            const newCategories = action.payload;
            const newTableArr = {
                ...state.tableArr,
                categories: state.tableArr['categories'].map((category) => {
                    const matchingCategory = newCategories.find((cate) => cate.cateId === category.cateId);
                    if (matchingCategory) {
                        return { ...category, cateName: matchingCategory.cateName };
                    }
                    return category;
                })
            };
            const newState = { ...state, tableArr: newTableArr }
            saveMemoState(newState);

            return newState;
        },
        SET_DATA: (state: MemoData) => {
            const { categories, memos, tags, memoTags, cateMemos } = state.tableArr;
            const newData = categories.map(cate => ({
                cateId: cate.cateId,
                cateName: cate.cateName,
                memos: cateMemos
                    .filter(cateMemos => cateMemos.cateId === cate.cateId)
                    .map(cateMemos =>
                        memos
                            .filter(memo => memo.memoId === cateMemos.memoId)
                            .map(memo => ({
                                memoId: memo.memoId,
                                title: memo.title,
                                content: memo.content,
                                tags: memoTags.filter(memoTag => memoTag.memoId === memo.memoId)
                                    .map(memoTag => tags.find(tag => tag.tagId === memoTag.tagId)),
                                important: memo.important,
                            }))
                    ).flat()
            }))
            const newState = {
                ...state,
                data: newData
            }
            saveMemoState(newState);

            return newState
        }
    },
});

export const { SET_DATA, SET_CATE, SET_MEMO, UPDATE_CATE, DELETE_CATE, DELETE_MEMO } = memoSlice.actions;