import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addMemoPayload, Category, CombineData, Data, Memos, memoSliceInitState} from "./constants";
import {execSync} from "child_process";
import {tab} from "@testing-library/user-event/dist/tab";

export const memoSlice = createSlice({
    name: 'memo',
    initialState: memoSliceInitState,
    reducers: {
        SET_DATA: (state: CombineData, action: PayloadAction<Data>) => {
            state.data = action.payload
        },
        ADD_CATE: (state: CombineData, action: PayloadAction<Category>) => {
            const { cateName, cateId } = action.payload;

            const existsCate = state.data.cate.filter(cate => cate.cateName === cateName);

            if (!cateName) return
            if (existsCate.length !== 0) return

            return {
                data: {
                    ...state.data,
                    memoLengthInCate: [
                        ...state.data.memoLengthInCate,
                        { cateId: cateId, length: 0 },
                    ],
                    cate:[
                        ...state.data.cate,
                        { cateName: cateName, cateId: cateId }
                    ].sort((a, b) => a.cateName > b.cateName ? 1 : -1)
                }
            };
        },
        UPDATE_ONE_CATE: (state: CombineData, action: PayloadAction<Category>) => {
            const existCate = state.data.cate.filter(cate => cate.cateId !== action.payload.cateId);

            return {
                data: {
                    ...state.data,
                    cate: [
                        ...existCate,
                        action.payload
                    ].sort((a, b) => a.cateName > b.cateName ? 1 : -1)
                }
            }
        },
        UPDATE_MANY_CATE: (state: CombineData, action: PayloadAction<Category[]>) => {
            const newCategories = action.payload;

            return {
                data: {
                    ...state.data,
                    cate: state.data.cate.map((category) => {
                        const matchingCategory = newCategories.find((cate) => cate.cateId === category.cateId);
                        if (matchingCategory) {
                            return { ...category, cateName: matchingCategory.cateName };
                        }
                        return category;
                    }).sort((a, b) => a.cateName > b.cateName ? 1 : -1)
                }
            }
        },
        DELETE_CATE: (state: CombineData, action: PayloadAction<{ importantMemoLength: number, cateId: number }>) => {
            const { cateId, importantMemoLength } = action.payload;
            const { memos, tagsInCate, cate, memoLengthInCate, memosLength } = state.data

            const remainedMemo = memos.filter(memo => memo.cateId !== cateId);
            const remainedCate = cate.filter(exists => exists.cateId !== cateId);
            const remainedTags = tagsInCate.filter(tags => tags.cateId !== cateId);
            const targetLength = memoLengthInCate.filter(tags => tags.cateId === cateId)[0].length;

            return {
                data: {
                    ...state.data,
                    memosLength: memosLength - targetLength,
                    importantMemoLength,
                    cate: remainedCate.sort((a, b) => a.cateName > b.cateName ? 1 : -1),
                    memos: remainedMemo.sort((a, b) => b.updateAt - a.updateAt),
                    tagsInCate: remainedTags,
                }
            }
        },
        ADD_MEMO: (state: CombineData, action: PayloadAction<addMemoPayload>) => {
            const { ...table } = state.data;
            const { cateId, title, content, important, tags, memoId, updateAt } = action.payload;

            let newAllLength = table.memosLength + 1;
            let newInCateLength = table.memoLengthInCate;
            let importantMemoLength = table.importantMemoLength;

            // memosLength
            const lengthValidator = table.memoLengthInCate.filter(inCate => inCate.cateId === cateId) || [];

            if (important) importantMemoLength += 1;

            if (lengthValidator[0]?.cateId !== null) {
                newInCateLength = table.memoLengthInCate.map((inCate) => {
                    if (inCate.cateId === lengthValidator[0].cateId) {
                        return {
                            cateId: inCate.cateId,
                            length: inCate.length + 1,
                        }
                    } else {
                        return inCate;
                    }
                })
            }

            // tagsInCate
            const resTagsInCate = tags.map((tags) => {
                return {
                    cateId: tags.cateId,
                    tagName: tags.tagName,
                }
            })

            const setTagsInCate = [
                ...table.tagsInCate,
                ...resTagsInCate,
            ];

            const tagInCateMap = new Map(); // 키와 값을 가지는 데이터구조 Map을 선언

            for (const { cateId, tagName } of setTagsInCate) { // 반복문으로 id와 name을 그룹으로 지어주고 중복되지 않는경우만 추가하여 중복값을 제거
                const key = `${cateId}-${tagName}`;
                if (!tagInCateMap.has(key)) {
                    tagInCateMap.set(key, { cateId, tagName });
                }
            }

            const newTagsInCate = Array.from(tagInCateMap.values()); // 최종적으로 값인 {cateId: ??, tagName: '??'}인 데이터를 배열에 담는다.

            // memos
            const memos = [...table.memos, {
                memoId,
                cateId,
                title,
                content,
                important,
                tags,
                updateAt,
            }];

            return {
                data: {
                    ...state.data,
                    importantMemoLength,
                    memosLength: newAllLength,
                    memoLengthInCate: newInCateLength,
                    memos,
                    tagsInCate: newTagsInCate.sort((a, b) => a.tagName > b.tagName ? 1 : -1),
                }
            }
        },
        SET_MEMO: (state: CombineData, action: PayloadAction<Memos[]>) => {
            return {
                data: {
                    ...state.data,
                    memos: [...state.data.memos, ...action.payload]
                }
            }
        },
        SET_IMPORTANT_LENGTH: (state: CombineData, action: PayloadAction<number>) => {
            return {
                data: {
                    ...state.data,
                    importantMemoLength: action.payload,
                }
            }
        },
        CHANGE_IMPORTANT: (state: CombineData, action: PayloadAction<Memos[]>) => {
            return {
                data: {
                    ...state.data,
                    memos: action.payload,
                }
            }
        },
        RESET_MEMOS: (state: CombineData) => {
            return {
                data: {
                    ...state.data,
                    memos: [],
                }
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
    },
});

export const {
    SET_DATA, ADD_CATE, DELETE_CATE, UPDATE_MANY_CATE, UPDATE_ONE_CATE, ADD_MEMO,
    SET_MEMO, SET_IMPORTANT_LENGTH, CHANGE_IMPORTANT, RESET_MEMOS } = memoSlice.actions;