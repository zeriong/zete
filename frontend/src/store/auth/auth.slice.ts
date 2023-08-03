import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {logout, refreshAccessToken} from './auth.actions';

interface IState {
    isLoggedIn: boolean;
    accessToken: string;
    loading: boolean | undefined;
}

const initIState: IState = {
    isLoggedIn: false,
    accessToken: '',
    loading: true,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: initIState,
    reducers: {
        setLogin: (state: IState, { payload }: PayloadAction<string>) => {
            state.accessToken = payload;
            state.isLoggedIn = true;
        },
        setLogout: (state: IState) => {
            state.accessToken = '';
            state.isLoggedIn = false;
        },
    },
    extraReducers: (builder) => {
        // refreshToken
        builder.addCase(refreshAccessToken.fulfilled, (state: IState, { payload }) => {
            if (payload.success) {
                state.isLoggedIn = true;
                state.accessToken = payload.accessToken;
            } else {
                state.isLoggedIn = false;
                state.accessToken = '';
            }
            state.loading = false;
        });
        builder.addCase(refreshAccessToken.rejected, (state: IState) => {
            state.loading = false;
        });
        // logout
        builder.addCase(logout.fulfilled, (state: IState, { payload }) => {
            if (payload.success) {
                state.isLoggedIn = false;
                state.accessToken = '';
            }
        });
    }
});

export const { setLogin, setLogout } = authSlice.actions;