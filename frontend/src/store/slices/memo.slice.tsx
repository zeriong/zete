import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface memoData {
    id: number;
    important: boolean;
    title: string;
    content: string;
    tags: string[];
    cate: string;
}

interface memoCate {
    [key: string]: memoData[];
}

interface memoState {
    data: memoCate;
    loading: boolean
}

const initMemoState: memoState = {
    data: {},
    loading: true,
}

// 로컬스토리지 임시저장
const loadMemoState = (): memoState => {
    try {
        const memoState = localStorage.getItem('memoState');
        if (memoState === null) {
            return initMemoState;
        }
        return JSON.parse(memoState);
    } catch (err) {
        return initMemoState;
    }
};
const saveMemoState = (state: memoState) => {
    try {
        const memoState = JSON.stringify(state);
        localStorage.setItem('memoState', memoState);
    } catch (err) {
        console.log(err);
    }
};

export const memoSlice = createSlice({
    name: 'memo',
    initialState: loadMemoState(),
    reducers: {
        SET_MEMO: (state: memoState, action: PayloadAction<{cateStr: string, newData: memoData}>) => {
            const { cateStr, newData } = action.payload;
            if (!state.data[cateStr]) {
                state.data[cateStr] = [newData];
            } else {
                state.data[cateStr].push(newData)
            }
            saveMemoState(state);
        },
        DELETE_MEMO: (state: memoState, action: PayloadAction<{cate: string, memoId: number}>) => {
            const { cate, memoId } = action.payload;
            state.data[cate] = state.data[cate].filter((memo) => memo.id !== memoId);
            saveMemoState(state);
        },
    },
    // extraReducers: (builder) => {
    //     builder.addCase(sendMyProfile.pending, (state) => {
    //         state.loading = true;
    //     });
    //     builder.addCase(sendMyProfile.fulfilled, (state, action) => {
    //         state.data = action.payload;
    //         state.loading = false;
    //     });
    //
    //     /*builder.addCase(setProfile.rejected, (state, action) => {
    //         state.loading = true;
    //         console.log("썬크 리젝트", action.error);
    //     });*/
    // }
});

export const { SET_MEMO, DELETE_MEMO } = memoSlice.actions;