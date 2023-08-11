import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {logoutAction, refreshAccessTokenAction} from './auth.actions';

interface IState {
    isLoggedIn: boolean;
    accessToken: string;
    loading: boolean | undefined;
}

const initState: IState = {
    isLoggedIn: false,
    accessToken: '',
    loading: true,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: initState,
    reducers: {
        setLoginReducer: (state: IState, { payload }: PayloadAction<string>) => {
            state.accessToken = payload;
            state.isLoggedIn = true;
        },
        setLogoutReducer: (state: IState) => {
            state.accessToken = '';
            state.isLoggedIn = false;
        },
    },
    extraReducers: (builder) => {
        // refreshToken
        builder.addCase(refreshAccessTokenAction.fulfilled, (state: IState, { payload }) => {
            if (payload.success) {
                state.isLoggedIn = true;
                state.accessToken = payload.accessToken;
            } else {
                state.isLoggedIn = false;
                state.accessToken = '';
            }
            state.loading = false;
        });
        builder.addCase(refreshAccessTokenAction.rejected, (state: IState) => {
            state.loading = false;
        });
        // logout
        builder.addCase(logoutAction.fulfilled, (state: IState, { payload }) => {
            if (payload.success) {
                state.isLoggedIn = false;
                state.accessToken = '';
            }
        });
    }
});

export const { setLoginReducer, setLogoutReducer } = authSlice.actions;