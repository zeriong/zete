import React, {useEffect} from "react";
import { Index } from "./router";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "./store";
import {sendRefreshAccessToken} from "./store/slices/auth.slice";
import {Api} from "./utile/api";
import {SET_TABLE_DATA} from "./store/slices/memo.slice";
import {setData} from "./utile";


function App() {
    const { loading } = useSelector((state: RootState) => (state.auth));
    const { tableData, data } = useSelector((state: RootState) => (state.memo));
    const dispatch = useDispatch<AppDispatch>();

    useEffect( ()=> {
        (async () => {
            await dispatch(sendRefreshAccessToken());
            await Api().memo.sendDefaultData().then((res) => {
                console.log(res.data)

            });
        })();
    },[dispatch]);

    return (
        <>
            {loading ? (<div className="flex h-full items-center justify-center">로딩중...</div>
            ) : (
                <Index/>
            )}
        </>
    );
}

export default App;
