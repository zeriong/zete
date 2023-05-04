import {useEffect, useRef, useState} from "react";
import {resetMemos, resetSearch, SET_MEMO} from "../store/slices/memo.slice";
import {Api} from "../common/libs/api";
import {useHandleQueryStr} from "./useHandleQueryStr";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";

export const usePaginationObservers = () => {
    const loadEndRef = useRef(false); // 모든 데이터로드시 true
    const preventRef = useRef(true); // obs 중복방지
    const limit = useRef<number>(15);
    const offset = useRef<number>(0);
    const obsRef = useRef<IntersectionObserver>(null);
    const paginationDivObsRef = useRef(null);

    const timeout = useRef<NodeJS.Timeout>(null);

    const [isReset,setIsReset] = useState<boolean>(false);
    const [retryObs,setRetryObs] = useState<boolean>(false);

    const { menuQueryStr, cateQueryStr, tagQueryStr } = useHandleQueryStr();
    const { searchInput } = useSelector((state: RootState) => state.memo);

    const dispatch = useDispatch();

    const handleLoadMore = () => offset.current += limit.current;

    useEffect(()=> { //페이지네이션 옵저버 생성
        console.log('retry감지')
        obsRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !loadEndRef.current && preventRef.current) {
                preventRef.current = false;
                loadMemos();
            }
        });
        if (obsRef.current) {
            if(paginationDivObsRef.current) obsRef.current.observe(paginationDivObsRef.current);
            return () => { obsRef.current.disconnect(); }
        }
    }, [retryObs]);

    useEffect(() => {
        clearTimeout(timeout.current);
        timeout.current = null;
        obsRef.current.disconnect();

        if (!isReset) {
            resetMemos();
            offset.current = 0;
            setIsReset(true);
            loadEndRef.current = false;
        }
    },[menuQueryStr, cateQueryStr, tagQueryStr]);

    useEffect(() => {
        if (isReset) {
            preventRef.current = true;
            setRetryObs(!retryObs);
            setIsReset(false);
        }
    },[isReset]);

    useEffect(() => {
        clearTimeout(timeout.current);
        obsRef.current.disconnect();
        timeout.current = null;
        offset.current = 0;
        preventRef.current = true;
        loadEndRef.current = false;
        resetMemos();
        setRetryObs(!retryObs);
        console.log('인풋바뀜')
    },[searchInput])

    const loadMemos = () => {
        (async () => {
            console.log('뭐임')
            const cateId = cateQueryStr === '' ? null : Number(cateQueryStr)
            await Api().memo.get({
                search: searchInput,
                offset: offset.current,
                limit: limit.current,
                cateQueryStr: cateId,
                tagQueryStr,
                menuQueryStr,
            })
                .then((res) => {
                    if (res.data.memos) {
                        if (res.data.memos.length < limit.current) {
                            loadEndRef.current = true;
                        }
                        handleLoadMore();
                        timeout.current = setTimeout(() => {
                            console.log(res.data.memos,'데이터 들어왔다~~~~~~~~~~~~~~~~~~~')
                            if (res.data.memos.length === limit.current) {
                                setRetryObs(!retryObs)
                            }
                            preventRef.current = true;
                            dispatch(SET_MEMO(res.data.memos));
                        },200);
                    } else if (!res.data.memos) {
                        loadEndRef.current = true;
                        preventRef.current = true;
                        dispatch(SET_MEMO([]));
                    } else { console.log(res.data.error) }
                })
                .catch(e => console.log(e))
        })()
    }

    return { paginationDivObsRef }
}

export const useCloneDivObserver = () => {
    const cloneMainRef = useRef(null);
    const cloneRef = useRef(null);
    const obsRef = useRef<ResizeObserver>(null);

    const [changeHeight, setChangeHeight] = useState(0);

    useEffect(() => { //addMemo-clone-box 옵저버생성
        if (cloneMainRef.current && cloneRef.current && obsRef.current) {
            obsRef.current = new ResizeObserver(() => setChangeHeight(cloneMainRef.current.offsetHeight));
            obsRef.current.observe(cloneMainRef.current);

            return () => obsRef.current.disconnect();
        }
    },[]);

    useEffect(() => { //addMemo-clone-box 변경감지
        if (!cloneRef.current) return;
        cloneRef.current.style.height = `${changeHeight}px`;
    }, [changeHeight]);

    return { cloneMainRef, cloneRef }
}