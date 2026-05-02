import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudentManagement from './pages/StudentManagement';
import StudentDashboard from './pages/StudentDashboard';
import Attendance from './pages/Attendance';
import Announcements from './pages/Announcements';
import Marks from './pages/Marks';

const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (user.role === 'STUDENT') return <Navigate to="/student-dashboard" />;
    return children;
};

const StudentRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (user.role === 'ADMIN') return <Navigate to="/dashboard" />;
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <ToastProvider>
                    <AuthProvider>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/student-dashboard" element={
                                <StudentRoute><StudentDashboard /></StudentRoute>
                            } />
                            <Route path="/" element={<AdminRoute><Layout /></AdminRoute>}>
                                <Route index element={<Navigate to="/dashboard" replace />} />
                                <Route path="dashboard" element={<Dashboard />} />
                                <Route path="students" element={<StudentManagement />} />
                                <Route path="attendance" element={<Attendance />} />
                                <Route path="announcements" element={<Announcements />} />
                                <Route path="marks" element={<Marks />} />
                            </Route>
                            <Route path="*" element={<Navigate to="/login" replace />} />
                        </Routes>
                    </AuthProvider>
                </ToastProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;