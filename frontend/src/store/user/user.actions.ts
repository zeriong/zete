import {createAsyncThunk} from "@reduxjs/toolkit";
import {Api} from "../../openapi/api";

export const getMyProfile = createAsyncThunk(
    'user/getMyProfile',
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