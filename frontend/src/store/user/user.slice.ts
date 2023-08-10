import {createSlice} from '@reduxjs/toolkit';
import {User} from '../../openapi/generated';
import {getProfile} from './user.actions';

export interface IState {
    data: User | undefined,
    loading: boolean;
}
const initState: IState = {
    data: undefined,
    loading: true,
}

export const userSlice = createSlice({
    name: 'user',
    initialState: initState,
    reducers: {
        SET_USER: (state, { payload }) => {
            state.data = payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getProfile.pending, (state: IState) => {
            state.loading = true;
        });
        builder.addCase(getProfile.fulfilled, (state: IState, { payload }) => {
            state.data = payload;
            state.loading = false;
        });
    }
});

export const { SET_USER } = userSlice.actions;