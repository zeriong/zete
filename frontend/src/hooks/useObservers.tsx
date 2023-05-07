import {useEffect, useRef, useState} from "react";
import {loadAsideData, resetMemos, resetSearch, SET_MEMO} from "../store/slices/memo.slice";
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
    const dataLengthRef = useRef<{
        importantMemoLength: number;
        memosLength: number;
        tagsLength: number;
    }>(null);

    const [isReset,setIsReset] = useState<boolean>(false);
    const [retryObs,setRetryObs] = useState<boolean>(false);
    const [payloadLength,setPayloadLength] = useState<{
        importantMemoLength: number;
        memosLength: number;
        tagsLength: number;
    }>({
        importantMemoLength: 0,
        memosLength: 0,
        tagsLength: 0,
    });

    const { menuQueryStr, cateQueryStr, tagQueryStr } = useHandleQueryStr();
    const { searchInput, data } = useSelector((state: RootState) => state.memo);

    const dispatch = useDispatch();

    const handleLoadMore = () => offset.current += limit.current;

    // 페이지네이션 옵저버 생성
    useEffect(()=> {
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

    // url 변경시 옵저버 초기화
    useEffect(() => {
        obsRef.current.disconnect();

        if (!isReset) {
            resetMemos();
            offset.current = 0;
            setIsReset(true);
            loadEndRef.current = false;
        }
    },[menuQueryStr, cateQueryStr, tagQueryStr]);


    // 초기화 완료시 retryObs를 변경시켜 옵저버 재생성
    useEffect(() => {
        if (isReset) {
            preventRef.current = true;
            setRetryObs(!retryObs);
            setIsReset(false);
        }
    },[isReset]);

    // 검색창 입력시 데이터로드
    useEffect(() => {
        obsRef.current.disconnect();
        offset.current = 0;
        preventRef.current = true;
        loadEndRef.current = false;
        resetMemos();
        setRetryObs(!retryObs);
    },[searchInput])

    // aside정보 서버데이터와 비교 후 리로드
    useEffect(() => {
        console.log('데이터변경 체크1')
        // if (dataLengthRef.current) {
        //     dataLengthRef.current = {
        //         importantMemoLength: data.importantMemoLength,
        //         memosLength: data.memosLength,
        //         tagsLength: data.tagsLength,
        //     };
        //
        //     console.log('데이터변경 체크')
        //
        //     if (dataLengthRef.current !== payloadLength) {
        //         console.log('무한루프는 아닐거야');
        //         loadAsideData();
        //     }
        // }
    },[data.memos, dataLengthRef.current])

    const loadMemos = () => {
        (async () => {
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
                        console.log(res.data,'로드데이터');

                        setPayloadLength({
                            importantMemoLength: res.data.importantMemoLength,
                            memosLength: res.data.memosLength,
                            tagsLength: res.data.tagsLength,
                        });

                        if (res.data.memos.length === limit.current) {
                            setRetryObs(!retryObs)
                        }

                        preventRef.current = true;

                        dispatch(SET_MEMO(res.data.memos));
                    } else if (!res.data.memos) {
                        loadEndRef.current = true;
                        preventRef.current = true;
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

    const [changeHeight, setChangeHeight] = useState(0);

    useEffect(() => { //addMemo-clone-box 옵저버생성
        if (cloneMainRef.current) {
            const obsRef = new ResizeObserver(() => setChangeHeight(cloneMainRef.current.offsetHeight));
            obsRef.observe(cloneMainRef.current);
            return () => obsRef.disconnect();
        }
    },[cloneMainRef.current]);

    useEffect(() => { //addMemo-clone-box 변경감지
        if (!cloneRef.current) return;
        cloneRef.current.style.height = `${changeHeight}px`;
    }, [changeHeight]);

    return { cloneMainRef, cloneRef }
}