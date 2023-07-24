import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {store} from "../index";

export interface IAlertObject {
    message?: string;
}

export interface INotificationState {
    alerts: Array<IAlertObject>;
}

const initNotificationState: INotificationState = {
    alerts: [],
}

export const showAlert = (message: string) => {
    store.dispatch(alertSlice.actions.SET_ALERT({ message }));
}

export const alertSlice = createSlice({
    name: 'alert',
    initialState: initNotificationState,
    reducers: {
        SET_ALERT: (state: INotificationState, { payload }: PayloadAction<IAlertObject>) => {
            state.alerts.push({message: payload.message});
        },
        DELETE_ALERT: (state:INotificationState) => {
            state.alerts.shift();
        },
    },
})

export const { DELETE_ALERT } = alertSlice.actions;