import React, {useEffect} from 'react';
import { Router } from './router/Router';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from './store';
import {sendRefreshAccessToken} from './store/auth/auth.slice';
import {Alert} from './common/components/Alert';

function App() {
    const { loading } = useSelector((state: RootState) => (state.auth));
    const dispatch = useDispatch<AppDispatch>();

    useEffect(()=> {
        ( async () => await dispatch(sendRefreshAccessToken()) )()
    },[dispatch]);

    return (
        <>
            {
                loading ? <div className='flex h-full items-center justify-center'>로딩중...</div>
                    : <Router/>
            }
            <Alert/>
        </>
    )
}

export default App;
