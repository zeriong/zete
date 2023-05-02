import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {store} from "../index";

export interface IAlertObject {
    type?: string
    message?: string
}

export interface INotificationState {
    alerts: Array<IAlertObject>,
}

const initNotificationState: INotificationState = {
    alerts: [],
}

export const showAlert = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    store.dispatch(alertSlice.actions.SET_ALERT({ message: msg, type }))
}

export const alertSlice = createSlice({
    name: 'alert',
    initialState: initNotificationState,
    reducers: {
        SET_ALERT: (state: INotificationState, action: PayloadAction<IAlertObject>) => {
            state.alerts.push({
                message: action.payload.message,
                type: action.payload.type,
            });
        },
        DELETE_ALERT: (state:INotificationState) => {
            state.alerts.shift();
        },
    },
})

export const { SET_ALERT, DELETE_ALERT } = alertSlice.actions;