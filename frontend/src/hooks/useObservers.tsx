import {useEffect, useRef, useState} from 'react';
import {resetMemos, SET_MEMO} from '../store/memo/memo.slice';
import {Api} from '../openapi/api';
import {useHandleQueryStr} from './useHandleQueryStr';
import {AppDispatch, RootState} from '../store';
import {useDispatch, useSelector} from 'react-redux';

export const usePaginationObservers = () => {
    const loadEndRef = useRef(false); // 모든 데이터로드시 true
    const preventRef = useRef(true); // obs 중복방지
    const limit = useRef<number>(15);
    const offset = useRef<number>(0);
    const obsRef = useRef<IntersectionObserver>(null);
    const paginationDivObsRef = useRef(null);
    const timeoutRef = useRef<NodeJS.Timeout>(null);

    const { menuQueryStr, cateQueryStr, tagQueryStr } = useHandleQueryStr();
    const { searchInput } = useSelector((state: RootState) => state.memo);

    const [isReset,setIsReset] = useState<boolean>(false);
    const [retryObs,setRetryObs] = useState<boolean>(false);

    const dispatch = useDispatch<AppDispatch>();

    const handleLoadMore = () => offset.current += limit.current;

    const loadMemos = () => {
        (async () => {
            await Api.memo.get({
                search: searchInput,
                offset: offset.current,
                limit: limit.current,
                cateQueryStr: Number(cateQueryStr) || null,
                tagQueryStr,
                menuQueryStr,
            })
                .then((res) => {
                    timeoutRef.current = setTimeout(() => {
                        if (res.data.success) {
                            if (res.data.memos.length < limit.current) loadEndRef.current = true;
                            handleLoadMore();

                            if (res.data.memos.length === limit.current) setRetryObs(!retryObs);

                            preventRef.current = true;

                            dispatch(SET_MEMO(res.data.memos));
                        }
                        else if (!res.data.memos) {
                            loadEndRef.current = true;
                            preventRef.current = true;
                        }
                        else console.log(res.data.error);
                    }, 100);
                })
                .catch(e => console.log(e));
        })()
    }

    // 페이지네이션 옵저버 생성
    useEffect(()=> {
        obsRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !loadEndRef.current && preventRef.current) {
                preventRef.current = false;
                loadMemos();
            }
        });

        if (obsRef.current) {
            if(paginationDivObsRef.current) obsRef.current.observe(paginationDivObsRef.current);
        }

        return () => obsRef.current.disconnect();
    }, [retryObs]);

    // url 변경시 옵저버 초기화
    useEffect(() => {
        // 메모수정 끝나면 데이터 최신화
        obsRef.current.disconnect();
        clearTimeout(timeoutRef.current);
        if (!isReset) {
            loadEndRef.current = false;
            offset.current = 0;
            resetMemos();
            setIsReset(true);
        }
    }, [menuQueryStr, cateQueryStr, tagQueryStr]);


    // 초기화 완료시 retryObs를 변경시켜 옵저버 재생성
    useEffect(() => {
        if (isReset) {
            preventRef.current = true;
            setRetryObs(!retryObs);
            setIsReset(false);
        }
    }, [isReset]);

    // 검색창 입력시 데이터로드
    useEffect(() => {
        clearTimeout(timeoutRef.current);
        obsRef.current.disconnect();
        offset.current = 0;
        preventRef.current = true;
        loadEndRef.current = false;
        resetMemos();
        setRetryObs(!retryObs);
    }, [searchInput]);

    return { paginationDivObsRef }
}