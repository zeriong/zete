import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Api} from "../../common/api";
import {store} from "../index";

export interface userState {
    data: {
        name: string | null,
        email: string | null,
        mobile: string | null,
        password: string | null,
        gptAvailable: number | null,
        gptRefillAt: number | null,
    },
    loading: boolean,
}
const initUserState: userState = {
    data: {
        name: "",
        email: null,
        mobile: null,
        password: null,
        gptAvailable: null,
        gptRefillAt: null,
    },
    loading: true,
}

export const sendMyProfile = createAsyncThunk(
    'user/sendMyProfile',
    async (_, thunkAPI) => {
        try {
            const response = await Api.user.profile();

            if (!response) return thunkAPI.rejectWithValue(null);

            return response.data;
        }
        catch (err) {
            thunkAPI.rejectWithValue(err);
        }
    }
);

export const dispatchGptAvailable = (available: number) => {
    store.dispatch(userSlice.actions.SET_GPT_AVAILABLE(available));
}
export const dispatchGptRefillAt = (refillAt: number) => {
    store.dispatch(userSlice.actions.SET_GPT_REFILL_AT(refillAt));
}

export const userSlice = createSlice({
    name: 'user',
    initialState: initUserState,
    reducers: {
        SET_USER: (state: userState, { payload }) => {
            state.data = payload;
        },
        SET_GPT_AVAILABLE: (state: userState, { payload }) => {
            state.data.gptAvailable = payload;
        },
        SET_GPT_REFILL_AT: (state: userState, { payload }) => {
            state.data.gptRefillAt = payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(sendMyProfile.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(sendMyProfile.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
        });
    }
});

export const { SET_USER } = userSlice.actions;