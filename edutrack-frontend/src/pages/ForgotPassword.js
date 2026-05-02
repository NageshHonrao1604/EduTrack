import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { GraduationCap, ArrowRight, ArrowLeft, Mail, KeyRound, Lock } from 'lucide-react';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Step 1 — Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSuccess('OTP sent to your email! Check your inbox.');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Try again.');
        } finally { setLoading(false); }
    };

    // Step 2 — Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await api.post('/auth/verify-otp', { email, otp });
            setSuccess('OTP verified! Set your new password.');
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Try again.');
        } finally { setLoading(false); }
    };

    // Step 3 — Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { email, otp, newPassword });
            setSuccess('Password reset successfully!');
            setStep(4);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        } finally { setLoading(false); }
    };

    const stepTitles = {
        1: 'Forgot Password',
        2: 'Enter OTP',
        3: 'New Password',
        4: 'All Done!'
    };

    const stepDesc = {
        1: 'Enter your email and we will send you a 6-digit OTP',
        2: `We sent a 6-digit OTP to ${email}`,
        3: 'Choose a strong new password',
        4: 'Your password has been reset successfully'
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6 transition-colors">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-slate-900 w-full max-w-md p-12 border border-slate-100 dark:border-slate-700">

                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-xl shadow-indigo-200 mb-4">
                        <GraduationCap size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 dark:text-white">{stepTitles[step]}</h2>
                    <p className="text-slate-400 font-medium mt-2 text-sm text-center">{stepDesc[step]}</p>
                </div>

                {/* Step indicators */}
                {step < 4 && (
                    <div className="flex items-center gap-2 mb-8">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                                s <= step ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                            }`} />
                        ))}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-6 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm font-medium px-4 py-3 rounded-2xl">
                        {error}
                    </div>
                )}

                {/* Success */}
                {success && step !== 4 && (
                    <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm font-medium px-4 py-3 rounded-2xl">
                        {success}
                    </div>
                )}

                {/* Step 1 — Email */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-2xl p-4 pl-12 focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-600 outline-none transition-all font-medium text-slate-800 dark:text-white"
                                    required
                                />
                            </div>
                        </div>
                        <button disabled={loading}
                            className="group w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-60">
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                )}

                {/* Step 2 — OTP */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">6-Digit OTP</label>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-2xl p-4 pl-12 focus:border-indigo-600 outline-none transition-all font-bold text-slate-800 dark:text-white text-xl tracking-[0.5em]"
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <p className="text-xs text-slate-400 px-1">Check your email inbox for the OTP</p>
                        </div>
                        <button disabled={loading || otp.length !== 6}
                            className="group w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-60">
                            {loading ? 'Verifying...' : 'Verify OTP'}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button type="button" onClick={() => { setStep(1); setError(''); setSuccess(''); setOtp(''); }}
                            className="w-full flex items-center justify-center gap-2 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors">
                            <ArrowLeft size={16} /> Change email
                        </button>
                    </form>
                )}

                {/* Step 3 — New Password */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    placeholder="Min 6 characters"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-2xl p-4 pl-12 focus:border-indigo-600 outline-none transition-all font-medium text-slate-800 dark:text-white"
                                    required minLength={6}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    placeholder="Repeat password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 rounded-2xl p-4 pl-12 focus:border-indigo-600 outline-none transition-all font-medium text-slate-800 dark:text-white"
                                    required
                                />
                            </div>
                        </div>
                        <button disabled={loading}
                            className="group w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-60">
                            {loading ? 'Resetting...' : 'Reset Password'}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                )}

                {/* Step 4 — Success */}
                {step === 4 && (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-4xl">✅</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                            Your password has been reset successfully. You can now login with your new password.
                        </p>
                        <Link to="/login"
                            className="block w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 text-center">
                            Go to Login
                        </Link>
                    </div>
                )}

                {/* Back to login */}
                {step < 4 && (
                    <div className="mt-8 text-center">
                        <Link to="/login" className="text-slate-400 text-sm font-medium hover:text-indigo-600 transition-colors">
                            ← Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;