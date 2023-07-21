import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface ChangedMenuState {
    showMenu: boolean;
}

const initChangedMenuState: ChangedMenuState = {
    showMenu: true,
}

export const changedMenuSlice = createSlice({
    name: 'changedMenu',
    initialState: initChangedMenuState,
    reducers: {
        TOGGLE_SHOW_MENU: (state: ChangedMenuState) => {
            state.showMenu = !state.showMenu;
        },
        SET_SHOW_MENU: (state: ChangedMenuState, { payload }: PayloadAction<boolean>) => {
            state.showMenu = payload;
        },
    },
})

export const { TOGGLE_SHOW_MENU, SET_SHOW_MENU } = changedMenuSlice.actions;