import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Api} from "../../common/api";

export interface AuthState {
    data: {
        isLoggedIn: boolean,
        accessToken: string,
    }
    loading: boolean|undefined,
}

const initAuthState: AuthState = {
    data: {
        isLoggedIn: false,
        accessToken: '',
    },
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
            state.data.accessToken = payload;
            state.data.isLoggedIn = true;

            localStorage.setItem('at', state.data.accessToken);
        },
        SET_LOGOUT: (state: AuthState) => {
            state.data.accessToken = '';
            state.data.isLoggedIn = false;

            localStorage.setItem('at', '');
        },
    },
    extraReducers: (builder) => {
        // sendRefreshAccessToken
        builder.addCase(sendRefreshAccessToken.fulfilled, (state: AuthState, { payload }) => {
            if (payload.success) {
                state.data.isLoggedIn = true;
                state.data.accessToken = payload.accessToken;
                state.loading = false;

                localStorage.setItem('at', state.data.accessToken);
            }
        });
        builder.addCase(sendRefreshAccessToken.rejected, (state: AuthState) => {
            state.loading = false;
        });
        // sendLogout
        builder.addCase(sendLogout.fulfilled, (state: AuthState, { payload }) => {
            if (payload.success) {
                state.data.isLoggedIn = false;
                state.data.accessToken = '';

                localStorage.setItem('at', '');
            }
        });
    }
})

export const { SET_LOGIN, SET_LOGOUT } = authSlice.actions;