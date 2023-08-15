import {createAsyncThunk} from '@reduxjs/toolkit';
import {Api} from '../../openapi/api';
import {
    ChangeImportantInput,
    CreateCategoryInput,
    DeleteCategoryInput,
    DeleteMemoInput, GetMemoInput,
    SearchMemosInput, UpdateCategoryInput,
} from '../../openapi/generated';

/* ========================= 카테고리 ======================== */

export const getCategoriesAction = createAsyncThunk(
    'memo/getCategoriesAction',
    async (_, thunkAPI) => {
        try {
            const response = await Api.memo.getCategories();

            if (!response) return thunkAPI.rejectWithValue(null);

            return response.data;
        } catch (err) {
            thunkAPI.rejectWithValue(err);
        }
    }
);

export const createCategoryAction = createAsyncThunk(
    'memo/createCategoryAction',
    async (input: CreateCategoryInput, thunkAPI) => {
        try {
            const response = await Api.memo.createCategory(input);

            if (!response) return thunkAPI.rejectWithValue(null);

            return response.data;
        } catch (err) {
            thunkAPI.rejectWithValue(err);
        }
    }
);

export const updateCategoryAction = createAsyncThunk(
    'memo/updateCategoryAction',
    async (input: UpdateCategoryInput, thunkAPI) => {
        try {
            const response = await Api.memo.updateCategory(input);

            if (!response) return thunkAPI.rejectWithValue(null);

            return response.data;
        } catch (err) {
            thunkAPI.rejectWithValue(err);
        }
    }
);

export const deleteCategoryAction = createAsyncThunk(
    'memo/deleteCategoryAction',
    async (input: DeleteCategoryInput, thunkAPI) => {
        try {
            const response = await Api.memo.deleteCategory(input);

            if (!response) return thunkAPI.rejectWithValue(null);

            return response.data;
        } catch (err) {
            thunkAPI.rejectWithValue(err);
        }
    }
);

/* ========================= 메모 ======================== */

export const searchMemosAction = createAsyncThunk(
    'memo/searchMemosAction',
    async (input: { data: SearchMemosInput,  refresh?: boolean }, thunkAPI) => {
        try {
            /** 변경사항 = refresh타입 추가하여 리프레쉬인 경우와 아닌 경우 상태관리 다르게 함 */
            const response = await Api.memo.searchMemos(input.data);

            if (!response) return thunkAPI.rejectWithValue(null);

            return response.data;
        } catch (err) {
            thunkAPI.rejectWithValue(err);
        }
    }
);

export const changeImportantAction = createAsyncThunk(
    'memo/changeImportantAction',
    async (input: ChangeImportantInput, thunkAPI) => {
        try {
            const response = await Api.memo.changeImportant(input);

            if (!response) return thunkAPI.rejectWithValue(null);

            return response.data;
        } catch (err) {
            thunkAPI.rejectWithValue(err);
        }
    }
);

export const deleteMemoAction = createAsyncThunk(
    'memo/deleteMemoAction',
    async (input: DeleteMemoInput, thunkAPI) => {
        try {
            const response = await Api.memo.deleteMemo(input);

            if (!response) return thunkAPI.rejectWithValue(null);

            return response.data;
        } catch (err) {
            thunkAPI.rejectWithValue(err);
        }
    }
);

export const getMemoAction = createAsyncThunk(
    'memo/getMemoAction',
    async (input: GetMemoInput, thunkAPI) => {
        try {
            const response = await Api.memo.getMemo(input);

            if (!response) return thunkAPI.rejectWithValue(null);

            return response.data;
        } catch (err) {
            thunkAPI.rejectWithValue(err);
        }
    }
);