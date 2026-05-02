import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const navigate = useNavigate();

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        // Redirect based on role
        if (userData.role === 'STUDENT') {
            navigate('/student-dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const isAdmin = () => user?.role === 'ADMIN';
    const isStudent = () => user?.role === 'STUDENT';

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin, isStudent }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);