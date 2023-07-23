import {useSearchParams} from "react-router-dom";

// searchParams 재사용하기 위한 훅
export const useHandleQueryStr = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    return {
        menuQueryStr: searchParams.get("menu"),
        cateQueryStr: searchParams.get("cate"),
        tagQueryStr: searchParams.get("tag"),
        modalQueryStr: searchParams.get("modal"),
        searchParams, setSearchParams,
    }
};