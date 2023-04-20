import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Category, initState, MemoData, ModifyMemoPayload, addMemoPayload} from "./constants";

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
        ADD_CATE: (state: MemoData, action: PayloadAction<{cateName:string}>) => {
            const { cateName } = action.payload;
            if (!cateName) return

            const allCate = state.tableArr.categories.filter(cate => cate.cateId !== 'undefined');
            const cateIds = allCate.map(cate => cate.cateId);
            const makeId = cateIds.length > 0 ? Math.max( Number(...cateIds) ) + 1 : 1;
            const newState = {
                tableArr: {
                    ...state.tableArr,
                    categories:[
                        ...allCate,
                        {cateName: cateName, cateId: makeId}
                    ].sort((a, b) => a.cateName > b.cateName ? 1 : -1)
                },
                data: state.data
            }

            saveMemoState(newState);

            return newState;
        },
        DELETE_CATE: (state: MemoData, action: PayloadAction<number|'undefined'>) => {
            const target = state.tableArr.cateMemos.filter(cateMemo => cateMemo.cateId === action.payload);
            const currentCateTags = state.tableArr.cateTags.filter(cateTags => cateTags.cateId === action.payload)
            const memoId = target.map(val => val.memoId);

            if (memoId.length !== 0) {
                state.tableArr.memos = state.tableArr.memos.filter(memos => !memoId.some(memoId => memoId === memos.memoId))
            }

            state.tableArr.categories = state.tableArr.categories.filter(cate => cate.cateId !== action.payload).sort((a, b) => a.cateName > b.cateName ? 1 : -1);
            state.tableArr.cateMemos = state.tableArr.cateMemos.filter(cateMemo => cateMemo.cateId !== action.payload);
            state.tableArr.cateTags = state.tableArr.cateTags.filter(cateTags => cateTags.cateId !== action.payload);
            state.tableArr.tags = state.tableArr.tags.filter(cateTags => !currentCateTags.some(current => current.tagId === cateTags.tagId));
            saveMemoState(state);
        },
        ADD_MEMO: (state: MemoData, action: PayloadAction<addMemoPayload>) => {
            const { ...table } = state.tableArr;
            const { categoryId, title, content, important, tagNames } = action.payload;

            // add memos
            let memos = table.memos;

            const memoIds = memos.map((memo) => memo.memoId) || [];
            const newMemoId = memoIds.length > 0 ? Math.max(...memoIds) + 1 : 1;
            const newMemo = {
                memoId: newMemoId,
                title,
                content,
                important,
            };
            memos = [...memos, newMemo];

            // add tags
            const getTags = table.tags.filter(exist => tagNames.some(tag => tag === exist.tagName)); //name이 일치하는 데이터들을가져온다. (일치하지 않는 데이터는 반드시추가대상)
            const sameCateTagsId = table.cateTags.filter(exist => exist.cateId === categoryId); //현재 카테고리id에 일치하는 cateTags 데이터
            const existCateTags = table.tags.filter(tags => sameCateTagsId.some(id => id.tagId === tags.tagId)) //현재카테고리기준 모든 tags를 가져옴
            const existCateNames = existCateTags.filter(tags => getTags.some(name => name.tagName === tags.tagName)) //이름으로 중복체크해서 카테고리기준으로 이름이 안겹치도록
            const mustBeAddTags = getTags.filter(tags => !existCateNames.some(exist => exist.tagName === tags.tagName)).map(tag => tag.tagName) || []
            const tagNamesFilter = tagNames.filter(name => !table.tags.some(val => val.tagName === name))  //받아온 name을 전체name에서 검색해서 일치하지 않는 것을 가져온다.
            let tagNamesSet = [...tagNamesFilter, ...mustBeAddTags];

            const addTags = tagNamesSet.map((newTagName, idx) => {
                    const tagIds = table.tags.map((tag) => tag.tagId); // new id를 만들기 위해 선언
                    const makeId = tagIds.length > 0 ? Math.max(...tagIds) + (idx + 1) : idx + 1;

                    return {
                        tagId: makeId,
                        tagName: newTagName,
                    }
            });

            const newTags = [...table.tags, ...addTags];

            // add cateMemos
            let newCateMemos = [...table.cateMemos, {cateId: categoryId, memoId: newMemoId}];

            // add cateTags
            let newCateTags = [
                ...table.cateTags,
                ...addTags.map(val => ({cateId: categoryId, tagId: val.tagId}))
            ];

            // add memoTags
            let newMemoTags = [...table.memoTags];

            if (tagNames.length !== 0) {
                newMemoTags = [
                    ...table.memoTags,
                    ...tagNames.map((tagName) => {
                        const currentCateTags = newCateTags.filter(cateTag => cateTag.cateId === categoryId);
                        const addTagNames = newTags.filter(tags => currentCateTags.some(match => match.tagId === tags.tagId));
                        const targetTagId = addTagNames.filter(current => tagName === current.tagName).map(id => id.tagId);

                        return (
                            {
                                memoId: newMemoId,
                                tagId: targetTagId[0],
                            }
                        )
                    })
                ]
            }

            // Update state
            const newState = {
                tableArr: {
                    ...state.tableArr,
                    memos,
                    tags: [...newTags],
                    memoTags: newMemoTags,
                    cateMemos: newCateMemos,
                    cateTags: newCateTags,
                },
                data: state.data
            }
            saveMemoState(newState);

            return newState
        },
        UPDATE_MEMO: (state: MemoData, action: PayloadAction<ModifyMemoPayload>) => {
            const { ...table } = state.tableArr;
            const { categoryId, title, content, important, tagNames, memoId } = action.payload;
            console.log('리듀서 tagNames',tagNames)
            /** update memos */
            const existedMemo = table.memos.filter(memos => memos.memoId !== memoId);
            const newMemo = {
                memoId,
                title,
                content,
                important,
            };
            const memos = [...existedMemo, newMemo]; //변경된 메모

            /** update cateMemos */
            const currentCateMemo = table.cateMemos.find((cateMemo) => cateMemo.memoId === memoId);
            const reBuildCateMemo = table.cateMemos.filter((cateMemo) => cateMemo.memoId !== memoId);
            let newCateMemos = [...table.cateMemos];

            if (currentCateMemo.cateId !== categoryId) {
                newCateMemos = [...reBuildCateMemo, {cateId: categoryId, memoId: memoId}]
            }

            /** reBuild: tags & cateTags & memoTags */
            const reBuildMemoTags = table.memoTags.filter(memoTags => memoTags.memoId !== memoId); //현재 데이터 제외
            const reBuildTags = table.tags.filter(tags => reBuildMemoTags.some(exist => exist.tagId === tags.tagId)); //현재메모에 있는 태그를 제외 (제외했음에도 있다면 다른메모에 존재함으로 hold)
            const findTagIdInCate = reBuildMemoTags.filter(memoTags => reBuildCateMemo.some(cateMemo=> cateMemo.memoId === memoTags.memoId))
            const findTagsInCate = reBuildTags.filter(tags => findTagIdInCate.some(findId => findId.tagId === tags.tagId))
            const reBuildCateTags = [...findTagsInCate.map(tags => ({cateId: categoryId, tagId: tags.tagId}))];

            /** update tags */
            const getTags = reBuildTags.filter(exist => tagNames.some(tag => tag === exist.tagName)); //name이 일치하는 데이터들을가져온다. (일치하지 않는 데이터는 반드시추가대상)
            const sameCateTagsId = reBuildCateTags.filter(exist => exist.cateId === categoryId); //현재 카테고리id에 일치하는 cateTags 데이터
            const existCateTags = reBuildTags.filter(tags => sameCateTagsId.some(id => id.tagId === tags.tagId)) //현재카테고리기준 모든 tags를 가져옴
            const existCateNames = existCateTags.filter(tags => getTags.some(name => name.tagName === tags.tagName)) //이름으로 중복체크해서 카테고리기준으로 이름이 안겹치도록
            const mustBeAddTags = getTags.filter(tags => !existCateNames.some(exist => exist.tagName === tags.tagName)).map(tag => tag.tagName) || []
            const tagNamesFilter = tagNames.filter(name => !reBuildTags.some(val => val.tagName === name))  //받아온 name을 전체name에서 검색해서 일치하지 않는 것을 가져온다.
            let tagNamesSet = [...tagNamesFilter, ...mustBeAddTags];
            console.log('리듀서 tagNames',tagNames)
            const addTags = tagNamesSet.map((newTagName, idx) => {
                const memoIds = reBuildTags.map((tag) => tag.tagId); // new id를 만들기 위해 선언
                const makeId = memoIds.length > 0 ? Math.max(...memoIds) + (idx + 1) : idx + 1;
                return {
                    tagId: makeId,
                    tagName: newTagName,
                }
            });

            const newTags = [...reBuildTags, ...addTags];

            /** update cateTags */
            let newCateTags = [...reBuildCateTags];

            if (tagNames.length !== 0) {
                newCateTags = [
                    ...reBuildCateTags,
                    ...addTags.map(tags => ({cateId: categoryId, tagId:tags.tagId}))
                ]
            }

            /** update memoTags */
            let newMemoTags = [...reBuildMemoTags];

            if (tagNames.length !== 0) {
                newMemoTags = [
                    ...reBuildMemoTags,
                    ...tagNames.map((tagName) => {
                        const currentCateTags = newCateTags.filter(cateTag => cateTag.cateId === categoryId);
                        const addTagNames = newTags.filter(tags => currentCateTags.some(match => match.tagId === tags.tagId));
                        const targetTagId = addTagNames.filter(current => tagName === current.tagName).map(id => id.tagId);

                        return (
                            {
                                memoId: memoId,
                                tagId: targetTagId[0],
                            }
                        )
                    })
                ]
            }

            /** Update state */
            const newState = {
                tableArr: {
                    ...state.tableArr,
                    memos,
                    tags: [...newTags],
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
            const deleteTagsMemos = state.tableArr.memoTags.filter((memoTag) => memoTag.memoId !== memoId)

            state.tableArr.memos = state.tableArr.memos.filter((memo) => memo.memoId !== memoId);
            state.tableArr.memoTags = deleteTagsMemos;
            state.tableArr.cateMemos = state.tableArr.cateMemos.filter((cateMemo) => cateMemo.memoId !== memoId);
            state.tableArr.tags = state.tableArr.tags.filter(tags => deleteTagsMemos.some(delCate => delCate.tagId === tags.tagId));
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
                }).sort((a, b) => a.cateName > b.cateName ? 1 : -1)
            };

            const newState = { ...state, tableArr: newTableArr }
            saveMemoState(newState);

            return newState;
        },
        UPDATE_A_CATE: (state: MemoData, action: PayloadAction<Category>) => {
            const existCate = state.tableArr.categories.filter(cate => cate.cateId !== action.payload.cateId);
            const newTableArr = {
                ...state.tableArr,
                categories: [
                    ...existCate,
                    action.payload
                ].sort((a, b) => a.cateName > b.cateName ? 1 : -1)
            }
            const newState = { ...state, tableArr: newTableArr}
            saveMemoState(newState);

            return newState
        },
        SET_DATA: (state: MemoData) => {
            const { categories, memos, tags, memoTags, cateMemos } = state.tableArr;
            const newData = cateMemos.map((cate) => {
                const existMemoInCate = categories.some(category => cate.cateId === category.cateId);
                let setCateName = undefined;

                if (existMemoInCate) {
                    setCateName = categories.filter(category => category.cateId === cate.cateId)[0].cateName;
                }

                return {
                    cateId: cate.cateId,
                    cateName: setCateName,
                    memos: memos.filter(memo => memo.memoId === cate.memoId) //memos에서 해당 cate에 존재하는 data
                                .map((memo) => {
                                    const existMemoTags = memoTags.some(memoTag => memoTag.memoId === memo.memoId);
                                    const memoTagsTarget = memoTags.filter(memoTag => memoTag.memoId === memo.memoId);
                                    const addTags = tags.filter(tags => memoTagsTarget.some(target => target.tagId === tags.tagId))

                                    return {
                                        memoId: memo.memoId,
                                        title: memo.title,
                                        content: memo.content,
                                        tags: existMemoTags ? addTags : [],
                                        important: memo.important,
                                    }
                                }).flat()
                }

            })
            const newState = {
                ...state,
                data: newData
            }
            saveMemoState(newState);

            return newState
        },
        CHANGE_IMPORTANT: (state: MemoData, action: PayloadAction<number>) => {
            const memoId = action.payload
            state.tableArr.memos = state.tableArr.memos.map(memos => {
                let modifyMemo = memos

                if (memos.memoId === memoId) {
                    modifyMemo = {
                        ...memos,
                        important: memos.important !== true
                    }
                }

                return modifyMemo
            })
        },
    },
});

export const { SET_DATA, ADD_CATE, ADD_MEMO, UPDATE_CATE, DELETE_CATE, DELETE_MEMO, UPDATE_MEMO, UPDATE_A_CATE,CHANGE_IMPORTANT } = memoSlice.actions;