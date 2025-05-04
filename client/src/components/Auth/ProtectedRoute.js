// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedFor = 'user' }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Optional: restrict admin/user access
    if (allowedFor === 'admin' && user.email !== 'admin@gmail.com') {
        return <Navigate to="/user/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
