import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState, store} from '../../../store';
import {Link} from 'react-router-dom';
import {resetMemosReducer} from '../../../store/memo/memo.slice';

export const ProfilePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data: userState, loading } = useSelector((state: RootState) => state.user);

    // 프로필 페이지로 이동시 list reset
    useEffect(() => {
        dispatch(resetMemosReducer());
    },[]);

    return ( loading ? (<div>로딩중...</div>) : (
            <>
                <p className='text-[24px] font-bold'>
                    { `이름: ${userState.name}` }
                </p>
                <p className='text-[24px] font-bold'>
                    { `이메일: ${userState.email}` }
                </p>
                <p className='text-[24px] font-bold'>
                    { `휴대전화번호: ${userState.mobile}` }
                </p>
                <Link
                    to={ 'edit' }
                    className='mt-20px w-[180px] py-8px flex justify-center mb-12px cursor-pointer text-22 items-center bg-orange-500 rounded-[16px] text-white' >
                    회원정보 수정
                </Link>
            </>
        )
    )
};