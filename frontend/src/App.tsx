import React, {useEffect} from "react";
import { Index } from "./router";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "./store";
import {sendRefreshAccessToken} from "./store/slices/auth.slice";
import {Api} from "./common/libs/api";
import {SET_DATA} from "./store/slices/memo.slice";
import {Alert} from "./common/components/alert";

function App() {
    const { loading } = useSelector((state: RootState) => (state.auth));
    const dispatch = useDispatch<AppDispatch>();

    useEffect( ()=> {
        (async () => {
            await dispatch(sendRefreshAccessToken());
            await Api().memo.getAsideData().then((res) => {
                if (res.data.success) {
                    console.log('받아버린데이터', res.data)

                    // const lengthToNumber = memoLengthInCate.map((inCate) => {
                    //     return {
                    //         cateId: inCate.cateId,
                    //         length: Number(inCate.length),
                    //     }
                    // })

                    // dispatch(SET_DATA({
                    //     memosLength: Number(memosLength),
                    //     importantMemoLength: Number(importantMemoLength),
                    //     memoLengthInCate: lengthToNumber,
                    //     cate: cate.sort((a, b) => a.cateName > b.cateName ? 1 : -1),
                    //     tagsInCate: tags.sort((a, b) => a.tagName > b.tagName ? 1 : -1),
                    //     memos:[],
                    // }))
                } else {
                    console.log(res.data.error)
                }
            }).catch(e => console.log(e));
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
