import {showAlert} from '../store/alert/alert.slice';
import {isIntegerString} from './common.lib';
import {MEMO_LIST_REQUEST_LIMIT} from '../common/constants';
import {searchMemos} from '../store/memo/memo.actions';
import {store} from '../store';


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

// 메모리스트 로드
export const loadMemoList = (dispatch, searchParams, refresh) => {
    const state = store.getState().memo;
    if (!state.memo.isLoading && (state.memo.totalCount === -1 || state.memo.offset < state.memo.totalCount)) {
        dispatch(searchMemos({
            data: {
                // 검색어가 있다면 카테고리, 태그 미적용
                cate: searchParams.get('search') ? undefined : searchParams.get('cate'),
                tag: searchParams.get('search') ? undefined : searchParams.get('tag'),
                search: searchParams.get('search') ? decodeURI(searchParams.get('search')) : undefined,
                offset: refresh ? 0 : state.memo.offset,
                limit: refresh ? state.memo.list.length : MEMO_LIST_REQUEST_LIMIT,
            },
            refresh,
        }));
    }
}

export const stopBubbling = (e) => e.stopPropagation();
