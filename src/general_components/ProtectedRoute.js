import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {

    const user = localStorage.getItem('token');
    
    if (user) {
        try {
            const decodedToken = JSON.parse(atob(user.split('.')[1]));
            userRole = decodedToken.role;
        }
        catch (error) {
            console.error('Error decoding the token')
        }
    }
    if (!user) {
        return <Navigate to='/login' />;
    }
    return children;

};

export default ProtectedRoute;