import {createSlice} from '@reduxjs/toolkit';
import {User} from '../../openapi/generated';
import {getMyProfile} from './user.actions';

interface IState {
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
        setUser: (state: IState, { payload }) => {
            state.data = payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getMyProfile.pending, (state: IState) => {
            state.loading = true;
        });
        builder.addCase(getMyProfile.fulfilled, (state: IState, { payload }) => {
            state.data = payload;
            state.loading = false;
        });
    }
});

export const { setUser } = userSlice.actions;