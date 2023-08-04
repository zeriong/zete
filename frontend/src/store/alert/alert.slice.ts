import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {store} from '../index';

export interface IAlertObject {
    message?: string;
}

interface INotificationState {
    alerts: Array<IAlertObject>;
}

const initState: INotificationState = {
    alerts: [],
}

export const showAlert = (message: string) => {
    store.dispatch(alertSlice.actions.setAlert({ message }));
}

export const alertSlice = createSlice({
    name: 'alert',
    initialState: initState,
    reducers: {
        setAlert: (state: INotificationState, { payload }: PayloadAction<IAlertObject>) => {
            state.alerts.push({message: payload.message});
        },
        deleteAlert: (state:INotificationState) => {
            state.alerts.shift();
        },
    },
})

export const { deleteAlert } = alertSlice.actions;