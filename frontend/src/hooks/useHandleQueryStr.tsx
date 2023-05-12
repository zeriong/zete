import {useSearchParams} from "react-router-dom";

export const useHandleQueryStr = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    return {
        menuQueryStr: searchParams.get('menu'),
        cateQueryStr: searchParams.get('cate'),
        tagQueryStr: searchParams.get('tag'),
        modalQueryStr: searchParams.get('modal'),
        searchParams, setSearchParams
    }
};