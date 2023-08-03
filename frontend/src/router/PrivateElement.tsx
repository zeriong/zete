import {Navigate, useLocation} from 'react-router-dom';
import {RootState} from '../store';
import React from 'react';
import {useSelector} from 'react-redux';

export const PrivateElement = (props: { children? : React.ReactElement }) : React.ReactElement => {
    const { isLoggedIn } = useSelector((state: RootState) => state.auth);

    let location = useLocation();

    if (isLoggedIn) return props.children;

    return <Navigate to={'/'} state={{ from: location }}/>
};