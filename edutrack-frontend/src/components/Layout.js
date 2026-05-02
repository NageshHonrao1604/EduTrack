import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    LayoutGrid, Users, LogOut, GraduationCap, Bell,
    Search, ChevronRight, CalendarCheck, Megaphone, Award,
    Sun, Moon
} from 'lucide-react';

const NavItem = ({ to, icon: Icon, label, active }) => (
    <Link to={to} className={`group flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
        active
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
            : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm'
    }`}>
        <div className="flex items-center gap-3">
            <Icon size={20} className={active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'} />
            <span className="font-bold text-sm">{label}</span>
        </div>
        {active && <ChevronRight size={14} />}
    </Link>
);

const Layout = () => {
    const { user, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-[#F1F5F9] dark:bg-slate-900 transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-72 fixed h-screen p-6 flex flex-col z-20 bg-[#F1F5F9] dark:bg-slate-900 transition-colors duration-300">
                <div className="flex items-center gap-3 px-3 mb-10">
                    <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
                        <GraduationCap className="text-white" size={24} />
                    </div>
                    <span className="text-xl font-black tracking-tight text-slate-800 dark:text-white">EduTrack</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <NavItem to="/dashboard" icon={LayoutGrid} label="Dashboard"
                        active={location.pathname === '/dashboard'} />
                    <NavItem to="/students" icon={Users} label="Students"
                        active={location.pathname === '/students'} />
                    <NavItem to="/attendance" icon={CalendarCheck} label="Attendance"
                        active={location.pathname === '/attendance'} />
                    <NavItem to="/announcements" icon={Megaphone} label="Announcements"
                        active={location.pathname === '/announcements'} />
                    <NavItem to="/marks" icon={Award} label="Marks & Grades"
                        active={location.pathname === '/marks'} />
                </nav>

                <div className="mt-auto bg-slate-900 dark:bg-slate-800 rounded-[2rem] p-6 text-white relative overflow-hidden border border-slate-700/50">
                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-sm font-bold">Admin Portal v1.0</p>
                    <div className="flex items-center justify-between mt-4">
                        <button onClick={logout} className="flex items-center gap-2 text-rose-400 font-bold text-sm hover:text-rose-300 transition-colors">
                            <LogOut size={16} /> Logout
                        </button>
                        {/* Dark mode toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 transition-all px-3 py-1.5 rounded-xl"
                            title={darkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
                        >
                            {darkMode
                                ? <Sun size={15} className="text-amber-400" />
                                : <Moon size={15} className="text-slate-300" />
                            }
                            <span className="text-xs font-bold text-slate-300">
                                {darkMode ? 'Light' : 'Dark'}
                            </span>
                        </button>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/5 rounded-full"></div>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 ml-72 p-8 transition-colors duration-300">
                <header className="flex items-center justify-between mb-10">
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Search anything..."
                            className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl py-3 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-sm text-slate-500 hover:text-indigo-600 cursor-pointer">
                            <Bell size={20} />
                        </div>
                        <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>
                        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-1.5 pr-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-800 dark:text-white">{user?.email?.split('@')[0]}</p>
                                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">Authorized Admin</p>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="page-transition">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;