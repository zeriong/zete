import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState, store} from "../../store";
import {DELETE_ALERT, IAlertObject} from "../../store/slices/alert.slice";
import {AlarmIcon} from "../../assets/vectors";

export const Alert = () => {
    const { alerts } = useSelector((state:RootState) => state.alert);
    const [alert, setAlert] = useState<IAlertObject>({type: "", message: ""});
    const [isShow, setIsShow] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const alarm = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    const showAlert = () => {
        alarm.current.style.display = 'flex';
        if (!isRunning && store.getState().alert.alerts.length > 0) {
            setIsRunning(true)
            setAlert(store.getState().alert.alerts[store.getState().alert.alerts.length - 1])
            setIsShow(true)
            setTimeout(() => {
                setIsShow(false)
                setTimeout(() => {
                    dispatch(DELETE_ALERT())
                    setIsRunning(false)
                    showAlert()
                    alarm.current.style.display = 'none';
                }, 300);
            }, 3000);
        }
    }

    useEffect(() => {
        showAlert()
    }, [alerts]);

    return (
        <div
            className={`bg-[#202124] flex items-center justify-center fixed w-auto h-40px p-30px z-[200] left-26px
            rounded-[4px] transition-all duration-300 ease-in-out ${isShow ? "bottom-26px opacity-100" : "opacity-0 bottom-0"}`}
            ref={alarm}
        >
            <div className='mr-6px'>
                <AlarmIcon className='fill-white h-22px'/>
            </div>
            <span className='w-full font-normal text-white'>
                {alert.message}
            </span>
        </div>
    )
}