import React from 'react';
import { useSelector} from 'react-redux';
import { RootState} from '../../../store';
import {Link} from 'react-router-dom';

export const Profile = () => {
    const { data: userState, loading } = useSelector((state: RootState) => state.user);

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
                    to={ 'modify' }
                    className='mt-20px w-[180px] py-8px flex justify-center mb-12px cursor-pointer text-22 items-center bg-orange-500 rounded-[16px] text-white' >
                    회원정보 수정
                </Link>
            </>
        )
    )
};