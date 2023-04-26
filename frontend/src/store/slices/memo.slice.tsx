import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Category, memoSliceInitState, MemoData, ModifyMemoPayload, addMemoPayload, TableData} from "./constants";

export const memoSlice = createSlice({
    name: 'memo',
    initialState: memoSliceInitState,
    reducers: {
        SET_TABLE_DATA: (state: MemoData, action: PayloadAction<TableData>) => {
            state.tableData = action.payload
        },
        SET_DATA: (state: MemoData) => {
            const { memos, tags } = state.tableData;
            const setCate = new Set(memos.map(memo => memo.cateId));
            const newData = [];

            Array.from(setCate).map(set => newData.push([ { cateId: set, memos: [] } ]) );

            memos.map((memo) => {
                const findTags = tags.filter(tags => tags.memoId === memo.memoId);

                newData.map((data) => {
                    if (memo.cateId === data[0].cateId) {
                        data[0].memos.push({
                            memoId: memo.memoId,
                            title: memo.title,
                            content: memo.content,
                            tags: findTags || [],
                            important: memo.important,
                        })
                    }
                    return newData
                });

                return newData
            })

            return {...state, data: newData}
        },
        ADD_CATE: (state: MemoData, action: PayloadAction<Category>) => {
            const { cateName, cateId } = action.payload;

            const existsCate = state.tableData.categories.filter(cate => cate.cateName === cateName);

            if (!cateName) return
            if (existsCate.length !== 0) return

            return {
                tableData: {
                    ...state.tableData,
                    categories:[
                        ...state.tableData.categories,
                        {cateName: cateName, cateId: cateId}
                    ].sort((a, b) => a.cateName > b.cateName ? 1 : -1)
                },
                data: state.data
            };
        },
        UPDATE_ONE_CATE: (state: MemoData, action: PayloadAction<Category>) => {
            const existCate = state.tableData.categories.filter(cate => cate.cateId !== action.payload.cateId);
            const newTableArr = {
                ...state.tableData,
                categories: [
                    ...existCate,
                    action.payload
                ].sort((a, b) => a.cateName > b.cateName ? 1 : -1)
            }

            return { ...state, tableData: newTableArr}
        },
        UPDATE_MANY_CATE: (state: MemoData, action: PayloadAction<Category[]>) => {
            const newCategories = action.payload;
            const newTableArr = {
                ...state.tableData,
                categories: state.tableData['categories'].map((category) => {
                    const matchingCategory = newCategories.find((cate) => cate.cateId === category.cateId);
                    if (matchingCategory) {
                        return { ...category, cateName: matchingCategory.cateName };
                    }
                    return category;
                }).sort((a, b) => a.cateName > b.cateName ? 1 : -1)
            };

            return { ...state, tableData: newTableArr }
        },
        DELETE_CATE: (state: MemoData, action: PayloadAction<number>) => {
            const { memos, tags, categories } = state.tableData

            const remainedMemo = memos.filter(memo => memo.cateId !== action.payload);
            const remainedCate = categories.filter(cate => cate.cateId !== action.payload);
            const remainedTags = tags.filter(tags => tags.cateId !== action.payload);

            return {
                ...state,
                tableData: {
                    categories: remainedCate.sort((a, b) => a.cateName > b.cateName ? 1 : -1),
                    memos: remainedMemo,
                    tags: remainedTags,
                }
            }
        },
        ADD_MEMO: (state: MemoData, action: PayloadAction<addMemoPayload>) => {
            const { ...table } = state.tableData;
            const { cateId, title, content, important, tags, memoId } = action.payload;

            console.log('리덕스',tags);

            // add memos
            const newMemo = {
                cateId,
                memoId,
                title,
                content,
                important,
            };

            const memos = [...table.memos, newMemo];

            // add tags
            const addTags = tags.map((tag) => {
                return {
                    tagId: tag.tagId,
                    tagName: tag.tagName,
                    cateId: tag.cateId,
                    memoId: tag.memoId,
                }
            });

            const newTags = [...table.tags, ...addTags];

            return {
                tableData: {
                    ...state.tableData,
                    memos,
                    tags: newTags,
                },
                data: state.data
            }
        },
        // UPDATE_MEMO: (state: MemoData, action: PayloadAction<ModifyMemoPayload>) => {
        //     const { ...table } = state.tableData;
        //     const { categoryId, title, content, important, tagNames, memoId } = action.payload;
        //     console.log('리듀서 tagNames',tagNames)
        //     /** update memos */
        //     const existedMemo = table.memos.filter(memos => memos.memoId !== memoId);
        //     const newMemo = {
        //         memoId,
        //         title,
        //         content,
        //         important,
        //     };
        //     const memos = [...existedMemo, newMemo]; //변경된 메모
        //
        //     /** update cateMemos */
        //     const currentCateMemo = table.cateMemos.find((cateMemo) => cateMemo.memoId === memoId);
        //     const reBuildCateMemo = table.cateMemos.filter((cateMemo) => cateMemo.memoId !== memoId);
        //     let newCateMemos = [...table.cateMemos];
        //
        //     if (currentCateMemo.cateId !== categoryId) {
        //         newCateMemos = [...reBuildCateMemo, {cateId: categoryId, memoId: memoId}]
        //     }
        //
        //     /** reBuild: tags & cateTags & memoTags */
        //     const reBuildMemoTags = table.memoTags.filter(memoTags => memoTags.memoId !== memoId); //현재 데이터 제외
        //     const reBuildTags = table.tags.filter(tags => reBuildMemoTags.some(exist => exist.tagId === tags.tagId)); //현재메모에 있는 태그를 제외 (제외했음에도 있다면 다른메모에 존재함으로 hold)
        //     const findTagIdInCate = reBuildMemoTags.filter(memoTags => reBuildCateMemo.some(cateMemo=> cateMemo.memoId === memoTags.memoId))
        //     const findTagsInCate = reBuildTags.filter(tags => findTagIdInCate.some(findId => findId.tagId === tags.tagId))
        //     const reBuildCateTags = [...findTagsInCate.map(tags => ({cateId: categoryId, tagId: tags.tagId}))];
        //
        //     /** update tags */
        //     const getTags = reBuildTags.filter(exist => tagNames.some(tag => tag === exist.tagName)); //name이 일치하는 데이터들을가져온다. (일치하지 않는 데이터는 반드시추가대상)
        //     const sameCateTagsId = reBuildCateTags.filter(exist => exist.cateId === categoryId); //현재 카테고리id에 일치하는 cateTags 데이터
        //     const existCateTags = reBuildTags.filter(tags => sameCateTagsId.some(id => id.tagId === tags.tagId)) //현재카테고리기준 모든 tags를 가져옴
        //     const existCateNames = existCateTags.filter(tags => getTags.some(name => name.tagName === tags.tagName)) //이름으로 중복체크해서 카테고리기준으로 이름이 안겹치도록
        //     const mustBeAddTags = getTags.filter(tags => !existCateNames.some(exist => exist.tagName === tags.tagName)).map(tag => tag.tagName) || []
        //     const tagNamesFilter = tagNames.filter(name => !reBuildTags.some(val => val.tagName === name))  //받아온 name을 전체name에서 검색해서 일치하지 않는 것을 가져온다.
        //     let tagNamesSet = [...tagNamesFilter, ...mustBeAddTags];
        //     console.log('리듀서 tagNames',tagNames)
        //     const addTags = tagNamesSet.map((newTagName, idx) => {
        //         const memoIds = reBuildTags.map((tag) => tag.tagId); // new id를 만들기 위해 선언
        //         const makeId = memoIds.length > 0 ? Math.max(...memoIds) + (idx + 1) : idx + 1;
        //         return {
        //             tagId: makeId,
        //             tagName: newTagName,
        //         }
        //     });
        //
        //     const newTags = [...reBuildTags, ...addTags];
        //
        //     /** update cateTags */
        //     let newCateTags = [...reBuildCateTags];
        //
        //     if (tagNames.length !== 0) {
        //         newCateTags = [
        //             ...reBuildCateTags,
        //             ...addTags.map(tags => ({cateId: categoryId, tagId:tags.tagId}))
        //         ]
        //     }
        //
        //     /** update memoTags */
        //     let newMemoTags = [...reBuildMemoTags];
        //
        //     if (tagNames.length !== 0) {
        //         newMemoTags = [
        //             ...reBuildMemoTags,
        //             ...tagNames.map((tagName) => {
        //                 const currentCateTags = newCateTags.filter(cateTag => cateTag.cateId === categoryId);
        //                 const addTagNames = newTags.filter(tags => currentCateTags.some(match => match.tagId === tags.tagId));
        //                 const targetTagId = addTagNames.filter(current => tagName === current.tagName).map(id => id.tagId);
        //
        //                 return (
        //                     {
        //                         memoId: memoId,
        //                         tagId: targetTagId[0],
        //                     }
        //                 )
        //             })
        //         ]
        //     }
        //
        //     /** Update state */
        //     const newState = {
        //         tableData: {
        //             ...state.tableData,
        //             memos,
        //             tags: [...newTags],
        //             memoTags: newMemoTags,
        //             cateMemos: newCateMemos,
        //             cateTags: newCateTags,
        //         },
        //         data: state.data
        //     }
        //
        //
        //
        //     return newState
        // },
        // DELETE_MEMO: (state: MemoData, action: PayloadAction<number>) => {
        //     const memoId = action.payload;
        //     const deleteTagsMemos = state.tableData.memoTags.filter((memoTag) => memoTag.memoId !== memoId)
        //
        //     state.tableData.memos = state.tableData.memos.filter((memo) => memo.memoId !== memoId);
        //     state.tableData.memoTags = deleteTagsMemos;
        //     state.tableData.cateMemos = state.tableData.cateMemos.filter((cateMemo) => cateMemo.memoId !== memoId);
        //     state.tableData.tags = state.tableData.tags.filter(tags => deleteTagsMemos.some(delCate => delCate.tagId === tags.tagId));
        // },

        CHANGE_IMPORTANT: (state: MemoData, action: PayloadAction<number>) => {
            const memoId = action.payload
            state.tableData.memos = state.tableData.memos.map(memos => {
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

export const { SET_TABLE_DATA, SET_DATA, ADD_CATE, UPDATE_ONE_CATE, UPDATE_MANY_CATE, DELETE_CATE, ADD_MEMO, CHANGE_IMPORTANT } = memoSlice.actions;