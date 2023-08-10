import React, {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store';
import CustomScroller from '../../../common/components/customScroller';
import {CategoryEditModal} from '../components/modals/CategoryEdit.modal';
import {Link, To, useSearchParams} from 'react-router-dom';
import {AllIcon, CategoryIcon, StarIcon, TagIcon} from '../../../assets/vectors';
import {Tag} from '../../../openapi/generated';
import {toggleSideNav} from '../../../store/layout/layout.slice';
import {getCategories} from '../../../store/memo/memo.actions';

export const Aside = () => {
    const { isShowSideNav } = useSelector((state: RootState) => (state.layout));
    const { cate } = useSelector((state: RootState) => state.memo);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        // 카테고리 목록 로드
        dispatch(getCategories())
    }, [])

    return (
        <>
            <section
                onClick={() => dispatch(toggleSideNav())}
                className={`z-50 w-full h-full left-0 top-0 fixed bg-black opacity-0 hidden max-md:block ease-in-out duration-300
                ${ isShowSideNav ? 'opacity-50 visible' : 'opacity-0 invisible' }`}
            />
            <aside
                className={`fixed w-[256px] bg-white z-50 md:z-20 ease-in-out duration-300 pt-0 md:pt-[46px] h-full
                overflow-hidden border-r border-zete-light-gray-400
                ${ isShowSideNav ? 'left-0' : '-left-[256px]' }`}
            >
                <CustomScroller customTrackVerticalStyle={{ width: 5 }}>
                    <section className='h-full w-full p-14px text-zete-dark-500 font-light text-14'>
                        <div className='h-fit pb-[12px]'>
                            <ul className='flex flex-col justify-center gap-4px'>
                                <CateItemList
                                    to={{ pathname: '/memo' }}
                                    cateId={ null }
                                    cateName='전체메모'
                                    iconComponent={ AllIcon }
                                    iconClassName='mr-14px w-20px'
                                    count={ cate.totalMemoCount }
                                />
                                <CateItemList
                                    to={{ pathname: '/memo', search: '?cate=important' }}
                                    cateId={ null }
                                    cateName='중요메모'
                                    iconComponent={ StarIcon }
                                    iconClassName='mr-14px w-20px'
                                    count={ cate.importantMemoCount }
                                />
                            </ul>
                            <p className='text-zete-dark-300 text-11 font-light pb-14px pt-17px pl-12px'>
                                카테고리
                            </p>
                            <ul className='grid gap-4px'>
                                {cate.list.map((cate, idx) => (
                                    <CateItemList
                                        key={idx}
                                        to={{ pathname: '/memo', search: `?cate=${cate.id}` }}
                                        cateId={ String(cate.id) }
                                        cateName={ cate.name }
                                        iconComponent={ CategoryIcon }
                                        iconClassName='mr-10px mt-4px min-w-[21px]'
                                        tags={ cate.tags }
                                        count={ cate.memoCount }
                                    />
                                ))}
                            </ul>
                            <CategoryEditModal buttonText={ cate.list.length > 0 ? '카테고리 수정' : '카테고리 추가' }/>
                        </div>
                    </section>
                </CustomScroller>
            </aside>
        </>
    )
}

const CateItemList = (props: { to: To, iconComponent: any, iconClassName: string, cateName: string, cateId: string, count: number, tags?: Tag[] }) => {
    const [searchParams] = useSearchParams();

    const isActiveCate = useMemo(() => {
        const cate = searchParams.get('cate');
        if (props.cateName === '전체메모') return !cate;
        if (props.cateName === '중요메모') return cate === 'important';
        if (props.cateId) return cate === String(props.cateId);
    },[searchParams]);

    return (
        <li
            className={`font-bold group rounded-[5px] hover:bg-zete-light-gray-200
            ${ isActiveCate && 'bg-zete-light-gray-200' }`}
        >
            <Link
                to={ props.to }
                className='flex w-full justify-between items-center p-10px hover:bg-zete-light-gray-200 rounded-[5px]'
            >
                <div
                    className={`flex justify-start w-full font-light transition-all duration-150
                    ${ props.cateId ? 'items-start' : 'items-center' }`}
                >
                    <props.iconComponent className={ props.iconClassName }/>
                    <span>
                        { props.cateName }
                    </span>
                </div>
                <div
                    className={`rounded-full text-zete-dark-100 py-2px px-8px text-12 font-medium
                    ${ isActiveCate ? 'bg-white' : 'group-hover:bg-white bg-zete-light-gray-300' }`}
                >
                    <span className='relative bottom-1px'>
                        { props.count || 0 }
                    </span>
                </div>
            </Link>
            <div className={ (isActiveCate && props.tags?.length > 0) ? 'px-12px pb-12px' : 'h-0 overflow-hidden' }>
                {props.tags?.map((tag, idx) => (
                    <div
                        key={ idx }
                        className={`overflow-hidden font-light text-13 transition-all duration-300 
                        ${ isActiveCate ? 'max-h-[200px] mt-6px' : 'h-[0vh] p-0 m-0' }`}
                    >
                        <Link
                            to={{ pathname: '/memo', search: `${ props.to.search }&tag=${ tag.name }` }}
                            className={`flex w-full h-fit py-8px pl-16px rounded-[5px] mb-1px hover:bg-zete-light-gray-500
                            ${ searchParams.get('tag') === tag.name && 'bg-zete-light-gray-500' }`}
                        >
                            <TagIcon svgClassName='w-14px mr-8px' strokeClassName='fill-zete-dark-200'/>
                            <p>
                                { tag.name }
                            </p>
                        </Link>
                    </div>
                ))}
            </div>
        </li>
    )
}