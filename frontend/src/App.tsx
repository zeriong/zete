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
            await Api().memo.sendContentData().then((res) => {
                console.log(res.data)
                const table = {
                    categories: Object.values(res.data.cate).map((cate) => {
                        return {
                            cateId: cate.id,
                            cateName: cate.cateName
                        }}).sort((a, b) => a.cateName > b.cateName ? 1 : -1),
                    tags: Object.values(res.data.tags).map((tags) => {
                        return {
                            tagId: tags.id,
                            tagName: tags.tagName,
                            memoId: tags.memoId,
                            cateId: tags.cateId
                        }}).sort((a, b) => a.tagName > b.tagName ? 1 : -1),
                    memos: Object.values(res.data.memos).map((memos) => {
                        return {
                            memoId: memos.id,
                            title: memos.title,
                            content: memos.content,
                            cateId: memos.cateId,
                            important: Boolean(memos.important),
                        }}),
                }
                dispatch(SET_TABLE_DATA(table));
                setData();
            });
        })();
    },[dispatch]);

    return (
        <>
            {loading? <div className="flex h-full items-center justify-center">로딩중...</div>: <>
                <Index/>
                <button
                    type='button'
                    className='fixed p-30px top-[20%] left-[20%] bg-black text-white z-50'
                    onClick={() => {
                        console.log(tableData)
                        console.log(data)
                    }}
                >
                    test
                </button>
            </>}
        </>
    );
}

export default App;
