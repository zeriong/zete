import React, {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store';
import {Outlet, useSearchParams} from 'react-router-dom';
import {Header} from './Header';
import {Aside} from './Aside';
import {CategoryIcon} from '../../../assets/vectors';
import {SearchMemo} from '../components/SearchMemo';
import {setShowSideNavReducer} from '../../../store/layout/layout.slice';
import CustomScroller from '../../../common/components/customScroller';
import {useWindowResize} from '../../../hooks/useWindowResize';
export const MemoLayout = () => {
    const [searchParams] = useSearchParams()

    const dispatch = useDispatch<AppDispatch>();
    const memoState = useSelector((state: RootState) => state.memo);
    const { loading, data } = useSelector((state: RootState) => state.user);
    const { isShowSideNav } = useSelector((state: RootState) => state.layout);

    const windowResize = useWindowResize();

    // 사이즈 변화에 따른 사이드 네비게이션 활성화
    useEffect(() => {
        if (windowResize.width <= 920) {
            if (isShowSideNav) dispatch(setShowSideNavReducer(false));
        } else {
            if (!isShowSideNav) dispatch(setShowSideNavReducer(true));
        }
    },[windowResize]);

    const categoryName = useMemo(() => {
        const cate = searchParams.get('cate');
        if (!cate) return '전체메모';
        else if (cate === 'important') return '중요메모';
        else {
            const matchCate = memoState.cate.list.find((cate) => Number(cate.id) === Number(searchParams.get('cate')))?.name;
            if (matchCate) return matchCate;
            return '카테고리가 존재하지않습니다.'
        }
    }, [searchParams, memoState.cate]);

    return (loading && !data.name) ? <div className='flex h-full items-center justify-center'>로딩중...</div> :
        <>
            <Header/>
            <Aside/>
            <main
                className={`${ isShowSideNav ? 'pl-0 md:pl-[256px]' : 'pl-0' }
                flex relative flex-col justify-center h-full text-center items-center pt-[46px] duration-300 ease-in-out`}
            >
                <div className='w-full h-full flex relative pt-[46px]'>
                    <header className='flex fixed top-[46px] h-[46px] items-center justify-between w-full ease-in-out duration-300 bg-white border-b border-zete-light-gray-400 pl-[16px] md:pl-[20px]'>
                        <div className={`flex items-center  ${ categoryName === '카테고리가 존재하지않습니다.' && 'text-zete-scroll-gray' }`}>
                            <div className='w-[16px] md:w-[20px] mr-[10px]'>
                                <CategoryIcon className=''/>
                            </div>
                            <p className='line-clamp-1'>
                                { categoryName }
                            </p>
                        </div>
                        <div className='block md:hidden pr-[16px]'>
                            <SearchMemo/>
                        </div>
                    </header>
                    <div className='w-full h-full bg-zete-light-gray-100'>
                        <CustomScroller autoHide={ false }>
                            <Outlet/>
                        </CustomScroller>
                    </div>
                </div>
            </main>
        </>
};