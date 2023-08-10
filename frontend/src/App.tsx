import React, {useEffect} from 'react';
import {Router} from './router/Router';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from './store';
import {Alert} from './common/components/Alert';
import {getProfile} from './store/user/user.actions';

function App() {
    const authState = useSelector((state: RootState) => (state.auth));
    const userState = useSelector((state: RootState) => (state.user));
    const dispatch = useDispatch<AppDispatch>();

    useEffect(()=> {
        // 본인 정보를 불러오는 것으로 로그인 검증
        (async () => dispatch(getProfile()))()
    },[dispatch]);

    return (
        <>
            {
                (authState.loading || userState.loading) ?
                    <div className='flex h-full items-center justify-center'>로딩중...</div>
                    : <Router/>
            }
            <Alert/>
        </>
    )
}

export default App;
