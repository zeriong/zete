import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";

export const Guide = () => {
    const { loading } = useSelector((state: RootState) => state.user);
    return (
        loading ? <div className="flex h-full items-center justify-center">로딩중...</div> :
            <div className="m-auto text-center">
                <h1 className="text-32 font-bold mt-40px">
                    기능안내 페이지입니다.
                </h1>
            </div>
    )
}