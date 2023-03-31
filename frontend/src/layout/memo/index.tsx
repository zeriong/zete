import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {sendMyProfile} from "../../store/slices/user.slice";
import {AppDispatch, RootState} from "../../store";
import {Outlet} from "react-router-dom";
import {Header} from "./header";
import {Aside} from "./aside";
import {Alert} from "../../components/alert";
import {Api} from "../../utile/api";
import {useInput} from "../../hooks/useInput.js"

export const MemoLayout = () => {
    const { loading } = useSelector((state: RootState) => (state.user));
    const { showMenu } = useSelector((state: RootState) => (state.changedMenu));
    const dispatch = useDispatch<AppDispatch>();

    const {value, valueReset, inputOnChange} = useInput();

    const submit = async (e:any) => {
        e.preventDefault();
        await Api().AI.createCompletion({ question: value, model: 'gpt-3.5-turbo', temperature: 0 })
            .then((res) => {
                console.log(res)
            })
            .catch((e) => {
                console.log(e)
            })
        valueReset();
    }


    useEffect(() => {
        dispatch(sendMyProfile());
    }, [dispatch])

    return ( loading ? (<div className="flex h-full items-center justify-center">로딩중...</div>) : (
        <>
            <Header/>
            <Aside/>
            <main
                className={`${showMenu ? "pl-[300px] max-md:pl-0" : "pl-0"}
                flex relative flex-col justify-center h-full text-center items-center pt-[60px]
                overflow-auto duration-300 ease-in-out`}
            >
                <div>
                    <form onSubmit={submit}>
                        <input placeholder='적어' onChange={inputOnChange} value={value}/>
                        <button>전송</button>
                    </form>
                    <p>
                        {}
                    </p>
                </div>
                <Alert/>
                <Outlet/>
            </main>
        </>
        )
    )
};