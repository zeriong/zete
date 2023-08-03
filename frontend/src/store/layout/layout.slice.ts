import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface IState {
    showMenu: boolean;
}

const initState: IState = {
    showMenu: true,
}

export const layoutSlice = createSlice({
    name: 'layout',
    initialState: initState,
    reducers: {
        toggleSideNav: (state: IState) => {
            state.showMenu = !state.showMenu;
        },
        setShowSideNav: (state: IState, { payload }: PayloadAction<boolean>) => {
            state.showMenu = payload;
        },
    },
});

export const { toggleSideNav, setShowSideNav } = layoutSlice.actions;