// ProtectedRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

function ProtectedRoute({ element: Component, ...rest }) {
    // 从 localStorage 中获取 token，判断用户是否已登录
    const isLoggedIn = localStorage.getItem('token');

    return (
        <Route
            {...rest}
            element={isLoggedIn ? <Component /> : <Navigate to="/admin/login" />}
        />
    );
}

export default ProtectedRoute;
