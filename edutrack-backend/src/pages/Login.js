import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ArrowRight, ShieldCheck, User } from 'lucide-react';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginType, setLoginType] = useState('ADMIN'); // 'ADMIN' or 'STUDENT'
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const endpoint = loginType === 'STUDENT' ? '/auth/student-login' : '/auth/login';
            const res = await api.post(endpoint, form);
            const { token, ...userData } = res.data;
            login(userData, token);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 w-full max-w-md p-12 border border-slate-100">

                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-xl shadow-indigo-200 mb-4">
                        <GraduationCap size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800">EduTrack</h2>
                    <p className="text-slate-400 font-medium mt-1 text-sm">Sign in to your account</p>
                </div>

                {/* Toggle Admin / Student */}
                <div className="flex bg-slate-100 rounded-2xl p-1 mb-8">
                    <button
                        onClick={() => { setLoginType('ADMIN'); setError(''); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                            loginType === 'ADMIN'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <ShieldCheck size={16} /> Admin
                    </button>
                    <button
                        onClick={() => { setLoginType('STUDENT'); setError(''); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                            loginType === 'STUDENT'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <User size={16} /> Student
                    </button>
                </div>

                {error && (
                    <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium px-4 py-3 rounded-2xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                            {loginType === 'STUDENT' ? 'Student Email' : 'Work Email'}
                        </label>
                        <input
                            type="email"
                            placeholder="name@email.com"
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-600 focus:bg-white outline-none transition-all font-medium"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-600 focus:bg-white outline-none transition-all font-medium"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="group w-full bg-slate-900 text-white p-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                    >
                        {loading ? 'Signing in...' : `Sign in as ${loginType === 'STUDENT' ? 'Student' : 'Admin'}`}
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                {loginType === 'ADMIN' && (
                    <div className="mt-8 text-center">
                        <p className="text-slate-400 text-sm font-medium">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-indigo-600 font-bold hover:underline">Sign Up</Link>
                        </p>
                    </div>
                )}

                {loginType === 'STUDENT' && (
                    <div className="mt-6 bg-indigo-50 rounded-2xl p-4 text-center">
                        <p className="text-indigo-600 text-xs font-medium">
                            Student accounts are created by your admin. Contact your admin if you cannot login.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;