import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, store} from '../../store';
import {deleteAlert, IAlertObject} from '../../store/alert/alert.slice';
import {AlarmIcon} from '../../assets/vectors';

export const Alert = () => {
    const alarm = useRef<HTMLDivElement>(null);

    const { alerts } = useSelector((state:RootState) => state.alert);

    const [alert, setAlert] = useState<IAlertObject>({ message: '' });
    const [isShow, setIsShow] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isRender, setIsRender] = useState(false);

    const dispatch = useDispatch();

    const showAlert = () => {
        setIsRender(true);
        alarm.current.style.display = 'flex';

        if (!isRunning && store.getState().alert.alerts.length > 0) {
            setIsRunning(true);
            setAlert(store.getState().alert.alerts[store.getState().alert.alerts.length - 1]);
            setIsShow(true);
            
            setTimeout(() => {
                setIsShow(false);
                
                setTimeout(() => {
                    dispatch(deleteAlert());
                    setIsRunning(false);
                    showAlert();
                    alarm.current.style.display = 'none';
                }, 300);
                
            }, 3000);
        }
    }

    useEffect(() => showAlert(), [alerts]);

    useEffect(() => {
        if (!isRunning && store.getState().alert.alerts.length === 0) {
            setIsRender(false);
        }
    }, [isRunning]);

    return (
        <>
            {!isRender ? <div ref={ alarm }/> :
                <div
                    ref={ alarm }
                    className={`bg-[#202124] flex items-center justify-center fixed h-[40px] pl-[20px] pr-[26px] py-[30px] z-[200] left-[26px]
                    rounded-[4px] transition-all duration-300 ${ isShow ? 'bottom-[26px] opacity-100' : 'opacity-0 bottom-0' }`}
                >
                    <div className='mr-[6px]'>
                        <AlarmIcon className='fill-white h-[22px]'/>
                    </div>
                    <span className='w-full font-normal text-white'>
                        { alert.message }
                    </span>
                </div>
            }
        </>
    )
}