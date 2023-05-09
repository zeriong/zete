import React, {useEffect, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {SET_SHOW_MENU, TOGGLE_SHOW_MENU} from "../../../store/slices/changedMenu.slice";
import CustomScroller from "../../../common/components/customScroller";
import {CateModifyModal} from "../components/modals/cateModify.modal";
import {Link, To} from "react-router-dom";
import {useHandleQueryStr} from "../../../hooks/useHandleQueryStr";
import {AllIcon, CategoryIcon, StarIcon, TagIcon} from "../../../assets/vectors";
import {Tags} from "../../../openapi";

export const Aside = () => {
    const dispatch = useDispatch();
    const { showMenu } = useSelector((state: RootState) => (state.changedMenu));

    const { data } = useSelector((state: RootState) => state.memo);

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
                        <ul className='flex flex-col justify-center gap-4px'>
                            <CateItemList
                                to={{ pathname: '/memo' }}
                                iconComponent={AllIcon}
                                iconClassName='mr-14px w-20px'
                                cateName='전체메모'
                                cateId={null}
                                count={data.memosLength}
                            />
                            <CateItemList
                                to={{ pathname: '/memo', search: '?menu=important' }}
                                iconComponent={StarIcon}
                                iconClassName='mr-14px w-20px'
                                cateName='중요메모'
                                cateId={null}
                                count={data.importantMemoLength}
                            />
                        </ul>
                        <p className='text-zete-dark-300 text-11 font-light pb-14px pt-17px pl-12px'>
                            카테고리
                        </p>
                        <ul className='grid gap-4px'>
                            {data.cate.map((cate, idx) => {
                                const count = data.memoLengthInCate.filter(inCate => inCate.cateId === cate.id)[0]?.length || 0;
                                    return (
                                        <CateItemList
                                            key={idx}
                                            to={{ pathname: '/memo', search: `?cate=${cate.id}` }}
                                            iconComponent={CategoryIcon}
                                            iconClassName='mr-10px mt-4px min-w-[21px]'
                                            cateName={cate.cateName}
                                            cateId={String(cate.id)}
                                            count={count}
                                            tags={[]}
                                        />
                                    )
                                })
                            }
                        </ul>
                        <CateModifyModal buttonText={data.cateLength > 0 ? '카테고리 수정' : '카테고리 추가'}/>
                    </div>
                </CustomScroller>
            </nav>
        </>
    )
}

const CateItemList = (props: { to: To, iconComponent: any, iconClassName: string, cateName: string, cateId: string, count: number, tags?: Tags[] }) => {
    const { tagQueryStr, cateQueryStr, searchParams, menuQueryStr } = useHandleQueryStr();

    const isActive = useMemo(() => {
        if (props.cateId) return cateQueryStr === props.cateId
        if (props.cateName === '전체메모') return !cateQueryStr && !tagQueryStr && !menuQueryStr
        if (props.cateName === '중요메모') return menuQueryStr
    },[searchParams])

    return (
        <li
            className={`font-bold group rounded-[5px] hover:bg-zete-light-gray-200
            ${isActive && 'bg-zete-light-gray-200'}`}
        >
            <Link
                to={props.to}
                className='flex w-full justify-between items-center p-10px hover:bg-zete-light-gray-200 rounded-[5px]'
            >
                <div
                    className={`flex justify-start w-full font-light transition-all duration-150
                    ${props.cateId ? 'items-start' : 'items-center'}`}
                >
                    <props.iconComponent className={props.iconClassName}/>
                    <span>
                        {props.cateName}
                    </span>
                </div>
                <div
                    className={`rounded-full text-zete-dark-100 py-2px px-8px text-12 font-medium
                    ${isActive ? 'bg-white' : 'group-hover:bg-white bg-zete-light-gray-300'}`}
                >
                        <span className='relative bottom-1px'>
                            {props.count || 0}
                        </span>
                </div>
            </Link>
            <div className={(isActive && props.tags?.length > 0) ? 'px-12px pb-12px' : 'h-0 overflow-hidden'}>
                {props.tags?.map((tags, idx) => (
                    <div
                        key={idx}
                        className={`overflow-hidden font-light text-13 transition-all duration-300 
                                    ${isActive ? 'max-h-[200px] mt-6px' : 'h-[0vh] p-0 m-0'}`}
                    >
                        <Link
                            to={{ pathname: '/memo', search: `${props.to.search}&tag=${tags.tagName}` }}
                            className={`flex w-full h-fit py-8px pl-16px rounded-[5px] mb-1px hover:bg-zete-light-gray-500
                                        ${tagQueryStr === tags.tagName && 'bg-zete-light-gray-500'}`}
                        >
                            <>
                                <TagIcon svgClassName='w-14px mr-8px' strokeClassName='fill-zete-dark-200'/>
                            </>
                            <span>
                                {tags.tagName}
                            </span>
                        </Link>
                    </div>
                ))}
            </div>
        </li>
    )
}