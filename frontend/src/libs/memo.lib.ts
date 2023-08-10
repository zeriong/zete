import {showAlert} from '../store/alert/alert.slice';
import {isIntegerString} from './common.lib';
import {store} from '../store';
import {searchMemos} from '../store/memo/memo.actions';
import {MEMO_LIST_REQUEST_LIMIT} from '../common/constants';


// url 파라미터 기준 카테고리 아이디 반환
export const getCategoryId = (searchParams): number => {
    return isIntegerString(searchParams.get('cate')) ? Number(searchParams.get('cate')) : 0;
}

// 태그 삭제
export const deleteMemoTag = (form, name) => {
    const tags = form.getValues('tags');
    if (tags) form.setValue('tags', tags.filter(tag => tag.name !== name));
}

// 태그 추가
export const handleAddMemoTagSubmit = (event, form) => {
    event.preventDefault();

    const input = event.target[0];
    const value = input?.value;
    if (!value) return;

    const tags = form.getValues('tags') || [];
    const exists = tags.find(tag => tag.name === value);

    if (exists) return showAlert('이미 존재하는 태그명 입니다.');

    form.setValue('tags', [ ...tags, { name: input.value } ]);
    input.value = '';
}

// 제목 인풋에서 enter시 내용으로 이동
export const handleFormSubmit = (event) => {
    event.preventDefault();
    // 제목 -> 내용 포커싱
    const input = event.target[2];
    input.focus();
};

// 메모리스트 로드
export const loadMemoList = (dispatch, searchParams, refresh) => {
    const memoState = store.getState().memo.memo;
    const cateState = store.getState().memo.cate;

    // 초기값은 전체목록 기준, 이 후 경우에 따라 필터링을 거쳐 변환
    let memoCount = memoState.totalCount;

    const cateParam = searchParams.get('cate');
    const tagParam = searchParams.get('tag');
    const searchParam = searchParams.get('search');

    if (tagParam) {  // 태그목록인 경우
        memoCount = memoState.list?.filter(memo => memo.tags.some((tag) => tag.name === tagParam)).length;
    } else if (cateParam) {  // 카테고리목록인 경우
        // 중요메모 여부 체크, cateState list가 비어있는 것을 체크하지 않으면 새로고침시 에러발생
        if (cateParam === 'important') memoCount = cateState.importantMemoCount;
        else if (cateState.list.length > 0) {
            memoCount = cateState.list.find((cate) => cate.id === cateParam).memoCount;
        }
    }

    if (!memoState.isLoading && (memoState.totalCount === -1 || memoState.offset < memoCount)) {
        dispatch(searchMemos({
            data: {
                // 검색어가 있다면 카테고리, 태그 미적용
                cate: searchParam ? undefined : cateParam,
                tag: searchParam ? undefined : tagParam,
                search: searchParam ? decodeURI(searchParam) : undefined,
                offset: refresh ? 0 : memoState.offset,
                limit: refresh ? memoState.list.length : MEMO_LIST_REQUEST_LIMIT,
            },
            refresh,
        }));
    }
}
