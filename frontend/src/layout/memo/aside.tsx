import React, {useEffect, useState} from "react";
import {Link, useLocation, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {SET_ALERT} from "../../store/slices/alert.slice";
import {RootState} from "../../store";
import {SET_SHOW_MENU, TOGGLE_SHOW_MENU} from "../../store/slices/changedMenu.slice";
import {AllIcon, CategoryIcon, ModifyIcon, StarIcon, StickerMemoIcon, TagIcon} from "../../components/vectors";

const MemoButton = (props: { label: string }) => {
    const [onMouseMemos, setOnMouseMemos] = useState<boolean>(false);

    return (
        <button
            onMouseEnter={() => setOnMouseMemos(true)}
            onMouseLeave={() => setOnMouseMemos(false)}
            className={`${onMouseMemos ? "font-bold border-orange-400" : "font-normal border-gray-200"}
                                    relative flex justify-center items-center bg-transparent border-l-2 h-10 overflow-hidden transition-all duration-200`}
        >
            <div
                className={`${onMouseMemos ? "left-0" : "-left-[240px]"}
                                        relative h-full w-full bg-orange-100  transition-all duration-200`}
            />
            <span className="absolute text-ellipsis whitespace-nowrap overflow-hidden w-[200px] text-start pl-4">{props.label}</span>
        </button>
    )
}

export const Aside = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { alerts } = useSelector((state: RootState) => state.alert);
    const { showMenu } = useSelector((state: RootState) => (state.changedMenu));

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

    const toggleMenu = () => {
        dispatch(TOGGLE_SHOW_MENU());
    }

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [queryStr, setQueryStr] = useState('');
    const categoryOpenHandler = () => setIsCategoryOpen(!isCategoryOpen);
    const getQueryStr = () => setQueryStr(searchParams.get('search')); // url 쿼리를 넣어줌 (쿼리에 따른 active 변화)

    useEffect(()=>{
        getQueryStr();
    },[searchParams])

    return (
        <>
            <section
                className={`${showMenu ? "opacity-50 visible" : "opacity-0 invisible"}
                    z-10 w-full h-full left-0 top-0 fixed bg-black opacity-0 hidden max-md:block ease-in-out duration-300`}
                onClick={toggleMenu}
            />
            <nav
                className={`${showMenu ? "left-0" : "-left-asideWidth"}
                fixed w-asideWidth bg-white z-20 ease-in-out duration-300 left-0 pt-headerHeight h-full overflow-auto scroll-hidden`}
            >
                <div className="flex flex-col h-full w-full min-h-[820px] px-17px text-zete-dark-500 font-light text-14">
                    <div className="flex flex-col font-bold gap-1px">
                        <button
                            type='button'
                            className='flex justify-between items-center hover:bg-zete-light-gray-200 rounded-[5px] p-12px group'
                            onClick={()=> setIsCategoryOpen(false)}
                        >
                            <Link
                                to="/memo"
                                className='flex justify-start items-center w-full font-light transition-all duration-150'
                            >
                                <AllIcon className='mr-14px w-20px'/>
                                <span>전체메모</span>
                            </Link>
                            <div className='rounded-full bg-zete-light-gray-300 text-zete-dark-100 py-3px px-8px text-12 group-hover:bg-white font-medium'>
                                10
                            </div>
                        </button>
                        <button
                            type='button'
                            className='flex justify-between items-center hover:bg-zete-light-gray-200 rounded-[5px] p-12px group'
                            onClick={()=> setIsCategoryOpen(false)}
                        >
                            <Link
                                to="/memo"
                                className='flex justify-start items-center w-full font-light transition-all duration-150'
                            >
                                <StarIcon className='mr-14px w-20px'/>
                                <span>중요메모</span>
                            </Link>
                            <div className='rounded-full bg-zete-light-gray-300 text-zete-dark-100 py-3px px-8px text-12 group-hover:bg-white font-medium'>
                                10
                            </div>
                        </button>
                    </div>
                    <p className='text-zete-dark-300 text-11 font-light py-14px pl-12px'>
                        카테고리
                    </p>
                    <div
                        className={`flex flex-col font-bold group rounded-[5px] hover:bg-zete-light-gray-200
                        ${isCategoryOpen ? 'bg-zete-light-gray-200' : 'bg-white'}`}
                    >
                        <div className='flex flex-col justify-center'>
                            <button
                                type='button'
                                className='flex w-full justify-between items-center p-12px'
                                onClick={categoryOpenHandler}
                            >
                                <div className='flex justify-start items-center w-full font-light transition-all duration-150'>
                                    <CategoryIcon className='mr-10px'/>
                                    <span>개발</span>
                                </div>
                                <div
                                    className={`rounded-full text-zete-dark-100 py-3px px-8px text-12 font-medium
                                    ${isCategoryOpen ? 'bg-white' : 'group-hover:bg-white bg-zete-light-gray-300'}`}
                                >
                                    2
                                </div>
                            </button>
                            <div
                                className={`overflow-hidden font-light text-13 transition-all duration-300 
                                ${isCategoryOpen ? 'max-h-[200px] p-12px' : 'h-[0vh] p-0'}`}
                            >
                                <Link
                                    to='/memo?search=React'
                                    className={`flex h-fit py-8px pl-16px rounded-[5px] mb-1px hover:bg-zete-light-gray-500
                                    ${queryStr === 'React' && 'bg-zete-light-gray-500'}`}
                                >
                                    <TagIcon svgClassName='w-14px mr-8px' strokeClassName='fill-zete-dark-200'/>
                                    <span>React</span>
                                </Link>
                                <Link
                                    to='/memo?search=Nodejs'
                                    className={`flex py-8px pl-16px rounded-[5px] hover:bg-zete-light-gray-500
                                    ${queryStr === 'Nodejs' && 'bg-zete-light-gray-500'}`}
                                >
                                    <TagIcon svgClassName='w-14px mr-8px' strokeClassName='fill-zete-dark-200'/>
                                    <span>Nodejs</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <button
                        type='button'
                        className='flex w-full justify-between items-center p-12px rounded-[5px] hover:bg-zete-light-gray-200'
                    >
                        <div className='flex justify-start items-center w-full font-light transition-all duration-150'>
                            <ModifyIcon className='mr-10px'/>
                            <span>카테고리 수정</span>
                        </div>
                    </button>
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
            </nav>
        </>
    )
}