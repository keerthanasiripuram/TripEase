import React from 'react';
import { Navigate } from 'react-router-dom';

//Authentication check
const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

const protectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default protectedRoute;
