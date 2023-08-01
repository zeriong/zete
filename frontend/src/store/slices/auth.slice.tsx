import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Api} from "../../openapi/api";

export interface AuthState {
    isLoggedIn: boolean;
    accessToken: string;
    loading: boolean | undefined;
}

const initAuthState: AuthState = {
    isLoggedIn: false,
    accessToken: '',
    loading: true,
}

export const sendLogout = createAsyncThunk(
    'user/sendLogout',
    async (_, thunkAPI) => {
        try {
            const response = await Api.auth.logout();

            if (!response || !response.data) return thunkAPI.rejectWithValue(null);

            return response.data;
        }
        catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
);

export const sendRefreshAccessToken = createAsyncThunk(
    'user/sendRefreshAccessToken',
    async (_, thunkAPI) => {
        try {
            const response = await Api.auth.refreshToken();

            if (!response || !response.data) return thunkAPI.rejectWithValue(null);

            return response.data;
        }
        catch (err) {
            return thunkAPI.rejectWithValue(err.response.message);
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState: initAuthState,
    reducers: {
        SET_LOGIN: (state: AuthState, { payload }: PayloadAction<string>) => {
            state.accessToken = payload;
            state.isLoggedIn = true;

            localStorage.setItem('at', state.accessToken);
        },
        SET_LOGOUT: (state: AuthState) => {
            state.accessToken = '';
            state.isLoggedIn = false;

            localStorage.setItem('at', '');
        },
    },
    extraReducers: (builder) => {
        // sendRefreshAccessToken
        builder.addCase(sendRefreshAccessToken.fulfilled, (state: AuthState, { payload }) => {
            if (payload.success) {
                state.isLoggedIn = true;
                state.accessToken = payload.accessToken;
                state.loading = false;

                localStorage.setItem('at', state.accessToken);
            }
        });
        builder.addCase(sendRefreshAccessToken.rejected, (state: AuthState) => {
            state.loading = false;
        });
        // sendLogout
        builder.addCase(sendLogout.fulfilled, (state: AuthState, { payload }) => {
            if (payload.success) {
                state.isLoggedIn = false;
                state.accessToken = '';

                localStorage.setItem('at', '');
            }
        });
    }
});

export const { SET_LOGIN, SET_LOGOUT } = authSlice.actions;