import React, {useEffect} from "react";
import { Index } from "./router";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "./store";
import {sendRefreshAccessToken} from "./store/slices/auth.slice";
import {Alert} from "./common/components/alert";
import {loadAsideData} from "./store/slices/memo.slice";

function App() {
    const { loading } = useSelector((state: RootState) => (state.auth));
    const dispatch = useDispatch<AppDispatch>();

    useEffect( ()=> {
        (async () => {
            await dispatch(sendRefreshAccessToken());
            loadAsideData();
        })();
    },[dispatch]);

    return (
        <>
            {loading ? <div className="flex h-full items-center justify-center">로딩중...</div> : <Index/>}
            <Alert/>
        </>
    );
}

export default App;
