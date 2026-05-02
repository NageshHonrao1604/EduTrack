import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, UserPlus } from 'lucide-react';

const Register = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // This calls your AuthController.java @PostMapping("/register")
            await api.post('/auth/register', form);
            alert("Account Created Successfully!");
            navigate('/login');
        } catch (err) {
            alert("Registration Failed. Check if Backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 w-full max-w-md p-12 border border-slate-100 animate-slideIn">
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-xl shadow-indigo-200 mb-4">
                        <UserPlus size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800">Create Account</h2>
                    <p className="text-slate-400 font-medium mt-1 text-sm tracking-tight">Join the EduTrack management system</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Username</label>
                        <input type="text"  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-600 focus:bg-white outline-none transition-all font-medium" 
                            onChange={(e) => setForm({...form, username: e.target.value})} required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Email Address</label>
                        <input type="email"  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-600 focus:bg-white outline-none transition-all font-medium" 
                            onChange={(e) => setForm({...form, email: e.target.value})} required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Password</label>
                        <input type="password"  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-600 focus:bg-white outline-none transition-all font-medium" 
                            onChange={(e) => setForm({...form, password: e.target.value})} required />
                    </div>

                    <button disabled={loading} className="group w-full bg-slate-900 text-white p-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 mt-4">
                        {loading ? "Creating..." : "Sign Up"} 
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-400 text-sm font-medium">
                        Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log In</Link>
                    </p>
                </div>
                
            </div>
        </div>
    );
};

export default Register;