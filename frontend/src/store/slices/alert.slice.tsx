import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {store} from "../index";

export interface IAlertObject {
    message?: string
}

export interface INotificationState {
    alerts: Array<IAlertObject>,
}

const initNotificationState: INotificationState = {
    alerts: [],
}

export const showAlert = (msg: string) => {
    store.dispatch(alertSlice.actions.SET_ALERT({ message: msg }))
}

export const alertSlice = createSlice({
    name: 'alert',
    initialState: initNotificationState,
    reducers: {
        SET_ALERT: (state: INotificationState, action: PayloadAction<IAlertObject>) => {
            state.alerts.push({message: action.payload.message});
        },
        DELETE_ALERT: (state:INotificationState) => {
            state.alerts.shift();
        },
    },
})

export const { DELETE_ALERT } = alertSlice.actions;