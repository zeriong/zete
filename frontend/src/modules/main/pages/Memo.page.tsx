import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store';
import {AddMemo} from '../components/AddMemo';
import Masonry from 'react-masonry-css';
import * as DOMPurify from 'dompurify';
import {FillStarIcon, StarIcon} from '../../../assets/vectors';
import {MemoEditModal} from '../components/modals/MemoEdit.modal';
import {SavedMemoMenuPopover} from '../components/popovers/SavedMemoMenu.popover';
import {useSearchParams} from 'react-router-dom';
import {changeImportantAction} from '../../../store/memo/memo.actions';
import {resetMemosReducer} from '../../../store/memo/memo.slice';
import {HorizontalScroll} from '../../../common/components/HorizontalScroll';
import {loadMemos} from '../../../libs/memo.lib';

export const MemoPage = () => {
    const observer = useRef<IntersectionObserver>(null);
    const loader = useRef(null);

    const [searchParams, setSearchParams] = useSearchParams();

    const memoState = useSelector((state: RootState) => state.memo);
    const dispatch = useDispatch<AppDispatch>();

    const [masonryCols] = useState({
        default: 7,
        2544: 6,
        2222: 5,
        1888: 4,
        1566: 3,
        1234: 2,
        900: 2,
        767: 1,
        610: 1,
    });

    const selectMemo = (id) => {
        searchParams.set('view', id);
        setSearchParams(searchParams);
    }

    const changeMemoImportant = (memo) => {
        dispatch(changeImportantAction({id: memo.id}));
    }

    const handleObserver = async (entities, observer) => {
        const target = entities[0];
        if (target.isIntersecting) await loadMemos(dispatch, searchParams, false);
    };

    // deps에 url변경을 카테고리, 태그, 검색에 대해서만 (메모수정인 view 제외)
    useEffect(() => {
        if (observer.current) {
            (async () => {
                observer.current.disconnect();
                // 옵저버 & 메모리스트 초기화 후 로드
                await dispatch(resetMemosReducer());
                await loadMemos(dispatch, searchParams, false);
            })();
        }
    },[searchParams.get('cate'), searchParams.get('tag'), searchParams.get('search')]);

    useEffect(() => {
        const options = {
            root: null, // viewport를 root로 설정
            rootMargin: '20px', // 타겟의 교차상태를 판단할 때, 타겟의 마진을 추가로 고려
            threshold: 0.2, // 타겟이 viewport에 20% 이상 보이면 교차상태로 판단 (사용자경험 + 중요메모에는 메모 폼이 없어 위치변경 문제발생을 해결하기 위함.)
        };

        observer.current = new IntersectionObserver(handleObserver, options);

        if (loader.current) observer.current.observe(loader.current);

        return () => observer && observer.current.disconnect();
        // deps에 limit와 응답 데이터 개수가 같은 경우 감지하여 실행
    }, [memoState.memo.pagingEffect]);

    return (
        <>
            <section className='relative top-0 gap-28px w-full p-16px pc:p-30px'>
                {searchParams.get('cate') !== 'important' && (
                    <div className='relative flex justify-center mt-6px mb-22px pc:mb-30px pc:mt-0'>
                        <AddMemo/>
                    </div>
                )}
                <Masonry
                    breakpointCols={ masonryCols }
                    className='my-masonry-grid flex justify-center gap-x-16px pc:gap-x-30px w-full pc:w-auto'
                    columnClassName='my-masonry-grid_column'
                >
                    {memoState.memo.list?.map((memo) => (
                        <div
                            key={ memo.id }
                            className='relative w-full mb-16px pc:w-[300px] pc:mb-30px flex rounded-[8px] memo-shadow'
                            onClick={ () => selectMemo(memo.id) }
                        >
                            <article
                                className='relative flex flex-col justify-between border w-full
                                    border-zete-light-gray-500 rounded-[8px] px-18px pb-[12px] pt-[14px] min-h-[212px] bg-zete-primary-200 break-words'
                            >
                                <div className='flex relative w-full'>
                                    <p
                                        dangerouslySetInnerHTML={{ __html: memo.title && DOMPurify.sanitize(memo.title.replace(/\n/g, '<br/>')) }}
                                        className={`text-zete-gray-500 font-light text-20 text-start w-full mb-10px ${!memo.title && 'h-[20px] w-full mb-10px pr-30px'}`}
                                    />
                                    {/* 중요메모 버튼 */}
                                    <button
                                        type='button'
                                        className={memo.title ? 'relative flex items-start' : 'absolute right-0'}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            changeMemoImportant(memo);
                                        }}
                                    >
                                        { memo.isImportant ? <FillStarIcon/> : <StarIcon/> }
                                    </button>
                                </div>
                                <div className='items-end h-full w-full line-clamp-[14]'>
                                    <p
                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(memo.content).replace(/\n/g, '<br/>') }}
                                        className='text-start text-zete-gray-500 font-light h-full w-full max-h-[336px]'
                                    />
                                </div>
                                <div className='w-full flex'>
                                    <div className='flex w-full items-center pr-[6px] overflow-hidden'>
                                        <HorizontalScroll>
                                            <div className='flex w-full h-full relative pt-[8px] pb-[9px] overflow-y-hidden'>
                                                {memo.tags?.map((tag, idx) => (
                                                    <div key={ idx } className='flex items-center px-9px py-1px mr-4px rounded-[4px] bg-black bg-opacity-10 cursor-default'>
                                                        <span className='font-light text-11 text-zete-dark-400 whitespace-nowrap'>
                                                            { tag.name }
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </HorizontalScroll>
                                    </div>
                                    <div className='relative -bottom-[4px]'>
                                        <SavedMemoMenuPopover memoId={ memo.id }/>
                                    </div>
                                </div>
                            </article>
                        </div>
                    ))}
                </Masonry>
                <MemoEditModal/>
            </section>
            <div className='relative'>
                <div ref={loader} className='absolute left-0 -top-[100px] bottom-0 w-[1px] h-[300px]'/>
            </div>
        </>
    )
}
