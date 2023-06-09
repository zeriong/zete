import {configureStore} from '@reduxjs/toolkit';
import {authSlice} from "./slices/auth.slice";
import {userSlice} from "./slices/user.slice";
import {alertSlice} from "./slices/alert.slice";
import {changedMenuSlice} from "./slices/changedMenu.slice";
import {memoSlice} from "./slices/memo.slice";

export const store = configureStore({
    reducer: {
        memo: memoSlice.reducer,
        auth: authSlice.reducer,
        user: userSlice.reducer,
        alert: alertSlice.reducer,
        changedMenu: changedMenuSlice.reducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch