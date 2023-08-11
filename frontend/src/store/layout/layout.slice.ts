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
        toggleSideNavReducer: (state) => {
            state.isShowSideNav = !state.isShowSideNav;
        },
        setShowSideNavReducer: (state, { payload }: PayloadAction<boolean>) => {
            state.isShowSideNav = payload;
        },
    },
});

export const { toggleSideNavReducer, setShowSideNavReducer } = layoutSlice.actions;