import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {SET_ALERT} from "../../store/slices/alert.slice";
import {RootState} from "../../store";
import {SET_SHOW_MENU, TOGGLE_SHOW_MENU} from "../../store/slices/changedMenu.slice";
import {CategoryList, MainMemoList} from "../../components/layout/asideComponents";
import CustomScroller from "../../components/customScroller";
import {CateModifyModal} from "../../modals/cateModifyModal";

export const Aside = () => {
    const dispatch = useDispatch();
    const { alerts } = useSelector((state: RootState) => state.alert);
    const { showMenu } = useSelector((state: RootState) => (state.changedMenu));

    const { data, tableArr } = useSelector((state: RootState) => state.memo);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 767) {
                dispatch(SET_SHOW_MENU(true));
            } else {
                dispatch(SET_SHOW_MENU(false));
            }
        }
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [dispatch])

    const toggleMenu = () => dispatch(TOGGLE_SHOW_MENU());

    return (
        <>
            <section
                className={`${showMenu ? "opacity-50 visible" : "opacity-0 invisible"}
                z-10 w-full h-full left-0 top-0 fixed bg-black opacity-0 hidden max-md:block ease-in-out duration-300`}
                onClick={toggleMenu}
            />
            <nav
                className={`${showMenu ? "left-0" : "-left-asideWidth"}
                fixed w-asideWidth bg-white z-20 ease-in-out duration-300 pt-headerHeight h-full overflow-auto scroll-hidden border-r border-zete-light-gray-400`}
            >
                <CustomScroller>
                    <div className="flex flex-col h-full w-full min-h-[600px] p-14px text-zete-dark-500 font-light text-14">
                        <>
                            <MainMemoList tableArr={tableArr}/>
                        </>
                        <p className='text-zete-dark-300 text-11 font-light pb-14px pt-17px pl-12px'>
                            카테고리
                        </p>
                        <ul className='grid gap-4px'>
                            {
                                data && tableArr &&
                                tableArr.categories.map((cate, idx) => {
                                    const matchData = data.filter(data => data.cateId === cate.cateId);
                                    return (
                                        <CategoryList
                                            key={idx}
                                            matchData={matchData}
                                            tableArr={tableArr}
                                            cate={cate}
                                        />
                                    )
                                })
                            }
                        </ul>
                        <>
                            <CateModifyModal/>
                        </>
                        <button
                            className="fixed bg-black text-white bottom-0 right-0 p-2"
                            type="button"
                            onClick={
                                () => {
                                    dispatch(
                                        SET_ALERT({type: "success", message:"안녕안녕안녕안녕ㅇㄴ"})
                                    )
                                    console.log(alerts);
                                }
                            }
                        >
                            알림 테스트
                        </button>
                    </div>
                </CustomScroller>
            </nav>
        </>
    )
}