import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {AddMemo, SavedMemo} from "../../components/memoContent";
import Masonry from "react-masonry-css";
import CustomScroller from "../../components/customScroller";

export const MemoMain = () => {
    const { data: userState, loading } = useSelector((state: RootState) => (state.user));
    const breakpointColumnsObj = {
        default: 7,
        2544: 6,
        2222: 5,
        1888: 4,
        1566: 3,
        1234: 2,
        900: 1,
        767: 2,
        610: 1,
    };
    return (
        loading ? (<div className="flex h-full items-center justify-center">로딩중...</div>) : (
            <CustomScroller>
                <section className='flex justify-center gap-28px w-full min-h-full p-16px browser-width-900px:p-30px'>
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className='my-masonry-grid flex gap-x-16px browser-width-900px:gap-x-30px w-full browser-width-900px:w-auto'
                        columnClassName='my-masonry-grid_column'
                    >
                        <div className='mb-16px browser-width-900px:mb-30px'>
                            <AddMemo/>
                        </div>
                        <div className='mb-16px browser-width-900px:mb-30px'>
                            <SavedMemo/>
                        </div>
                        <div className='mb-16px browser-width-900px:mb-30px'>
                            <SavedMemo/>
                        </div>
                        <div className='mb-16px browser-width-900px:mb-30px'>
                            <SavedMemo/>
                        </div>
                        <div className='mb-16px browser-width-900px:mb-30px'>
                            <SavedMemo/>
                        </div>
                        <div className='mb-16px browser-width-900px:mb-30px'>
                            <SavedMemo/>
                        </div>
                        <div className='mb-16px browser-width-900px:mb-30px'>
                            <SavedMemo/>
                        </div>
                    </Masonry>
                </section>
            </CustomScroller>
        )
    )
}
