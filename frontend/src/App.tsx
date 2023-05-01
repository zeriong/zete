import React, {useEffect} from "react";
import { Index } from "./router";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "./store";
import {sendRefreshAccessToken} from "./store/slices/auth.slice";
import {ApiLib} from "./common/libs/api.lib";
import {SET_DATA} from "./store/slices/memo.slice";

function App() {
    const { loading } = useSelector((state: RootState) => (state.auth));
    const { data } = useSelector((state: RootState) => (state.memo));
    const dispatch = useDispatch<AppDispatch>();

    useEffect( ()=> {
        (async () => {
            await dispatch(sendRefreshAccessToken());
            await ApiLib().memo.sendDefaultData().then((res) => {
                if (res.data.success) {
                    console.log(res.data)
                    const { importantMemoLength, memosLength, memoLengthInCate, cate, tags } = res.data

                    const lengthToNumber = memoLengthInCate.map((inCate) => {
                        return {
                            cateId: inCate.cateId,
                            length: Number(inCate.length),
                        }
                    })

                    dispatch(SET_DATA({
                        memosLength: Number(memosLength),
                        importantMemoLength: Number(importantMemoLength),
                        memoLengthInCate: lengthToNumber,
                        cate: cate.sort((a, b) => a.cateName > b.cateName ? 1 : -1),
                        tagsInCate: tags.sort((a, b) => a.tagName > b.tagName ? 1 : -1),
                        memos:[],
                    }))
                } else {
                    console.log(res.data.error)
                }
            }).catch(e => console.log(e));
        })();
        (async () => {
            await dispatch(sendRefreshAccessToken());
            await ApiLib().memo.scrollPagination({
                offset: 0,
                limit: 10,
                cateStr: null,
                tagStr: null,
                menuStr: null,
            }).then((res) => {
                console.log(res.data)

            }).catch(e => console.log(e));
        })();
    },[dispatch]);

    return (
        <>
            {loading ? (<div className="flex h-full items-center justify-center">로딩중...</div>
            ) : (
                <>
                    <button onClick={() => console.log(data)} type='button' className='fixed position-center p-30px bg-black text-white z-50'>test</button>
                    <Index/>
                </>
            )}
        </>
    );
}

export default App;
