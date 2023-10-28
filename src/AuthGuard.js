import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
    const navigate = useNavigate();
    const isUserAuthenticated = localStorage.getItem('v1:userInfo');

    useEffect(() => {
        if (!isUserAuthenticated) {
            navigate('/login');
        }
    }, [])
    return children;
};

export default AuthGuard;
