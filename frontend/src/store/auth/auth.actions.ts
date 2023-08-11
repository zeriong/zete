import {createAsyncThunk} from '@reduxjs/toolkit';
import {Api} from '../../openapi/api';

export const logoutAction = createAsyncThunk(
    'user/logout',
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

export const refreshAccessTokenAction = createAsyncThunk(
    'user/refreshToken',
    async (_, thunkAPI) => {
        try {
            const response = await Api.auth.refreshToken();

            if (!response || !response.data) return thunkAPI.rejectWithValue(null);

            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e.response.message);
        }
    }
);