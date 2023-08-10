import {createAsyncThunk} from '@reduxjs/toolkit';
import {Api} from '../../openapi/api';

export const getProfile = createAsyncThunk(
    'user/getProfile',
    async (_, thunkAPI) => {
        try {
            const response = await Api.user.profile();

            if (!response) return thunkAPI.rejectWithValue(null);
            console.log('getMyProfile: ', response.data)
            return response.data;
        }
        catch (err) {
            thunkAPI.rejectWithValue(err);
        }
    }
);