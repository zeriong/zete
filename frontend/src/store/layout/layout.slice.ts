import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface IState {
    isShowSideNav: boolean;
}

const initState: IState = {
    isShowSideNav: true,
}

export const layoutSlice = createSlice({
    name: 'layout',
    initialState: initState,
    reducers: {
        toggleSideNav: (state) => {
            state.isShowSideNav = !state.isShowSideNav;
        },
        setShowSideNav: (state, { payload }: PayloadAction<boolean>) => {
            state.isShowSideNav = payload;
        },
    },
});

export const { toggleSideNav, setShowSideNav } = layoutSlice.actions;