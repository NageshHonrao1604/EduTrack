import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
    GraduationCap, LogOut, BookOpen, Wallet,
    CheckCircle, XCircle, Calendar, User,
    Megaphone, Award, TrendingUp
} from 'lucide-react';

const CATEGORY_STYLES = {
    GENERAL: { color: 'bg-blue-50 text-blue-600 border-blue-200', label: 'General' },
    EXAM:    { color: 'bg-purple-50 text-purple-600 border-purple-200', label: 'Exam' },
    FEE:     { color: 'bg-emerald-50 text-emerald-600 border-emerald-200', label: 'Fee' },
    HOLIDAY: { color: 'bg-amber-50 text-amber-600 border-amber-200', label: 'Holiday' },
};

const getGrade = (obtained, total) => {
    const pct = (obtained / total) * 100;
    if (pct >= 90) return { grade: 'A+', color: 'text-emerald-600 bg-emerald-50' };
    if (pct >= 80) return { grade: 'A',  color: 'text-emerald-600 bg-emerald-50' };
    if (pct >= 70) return { grade: 'B',  color: 'text-blue-600 bg-blue-50' };
    if (pct >= 60) return { grade: 'C',  color: 'text-amber-600 bg-amber-50' };
    if (pct >= 50) return { grade: 'D',  color: 'text-orange-600 bg-orange-50' };
    return { grade: 'F', color: 'text-rose-600 bg-rose-50' };
};

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const [attendance, setAttendance] = useState({ total: 0, present: 0, absent: 0, percentage: 0 });
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [marks, setMarks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch attendance
                if (user?.studentId) {
                    const summaryRes = await api.get(`/attendance/summary/${user.studentId}`);
                    setAttendance(summaryRes.data);
                    const recordsRes = await api.get(`/attendance/student/${user.studentId}`);
                    setAttendanceRecords(recordsRes.data.slice(-5).reverse());

                    // Fetch this student's marks
                    const marksRes = await api.get(`/marks/student/${user.studentId}`);
                    setMarks(marksRes.data);
                }

                // Fetch announcements — all students can see
                const annRes = await api.get('/announcements');
                setAnnouncements(annRes.data.slice(0, 5)); // show latest 5

            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const attendanceColor = attendance.percentage >= 75 ? 'text-emerald-600'
        : attendance.percentage >= 50 ? 'text-amber-500' : 'text-rose-500';

    const attendanceBg = attendance.percentage >= 75 ? 'bg-emerald-50'
        : attendance.percentage >= 50 ? 'bg-amber-50' : 'bg-rose-50';

    // Calculate overall average from marks
    const avgMarks = marks.length > 0
        ? Math.round(marks.reduce((sum, m) => sum + (m.marksObtained / m.totalMarks) * 100, 0) / marks.length)
        : null;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
                        <GraduationCap className="text-white" size={22} />
                    </div>
                    <span className="text-xl font-black tracking-tight text-slate-800">EduTrack</span>
                    <span className="text-xs bg-indigo-100 text-indigo-600 font-bold px-3 py-1 rounded-full ml-2">Student Portal</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-slate-50 p-2 pr-4 rounded-2xl border border-slate-100">
                        <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-800">{user?.name}</p>
                            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">Student</p>
                        </div>
                    </div>
                    <button onClick={logout} className="flex items-center gap-2 text-rose-500 font-bold text-sm hover:text-rose-600 bg-rose-50 px-4 py-2 rounded-xl transition-all">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </header>

            <div className="max-w-5xl mx-auto p-8 space-y-8">

                {/* Welcome */}
                <div>
                    <h1 className="text-3xl font-black text-slate-800">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
                    <p className="text-slate-400 font-medium mt-1">Here is your complete academic overview</p>
                </div>

                {/* Top Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
                        <p className="text-2xl font-black text-indigo-600">{attendance.percentage}%</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Attendance</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
                        <p className="text-2xl font-black text-emerald-600">{avgMarks !== null ? `${avgMarks}%` : 'N/A'}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Avg Marks</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
                        <p className="text-2xl font-black text-slate-800">{marks.length}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Exams Taken</p>
                    </div>
                    <div className={`rounded-2xl p-5 border shadow-sm text-center ${
                        user?.feeStatus === 'PAID'
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'bg-rose-50 border-rose-200'
                    }`}>
                        <p className={`text-2xl font-black ${user?.feeStatus === 'PAID' ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {user?.feeStatus === 'PAID' ? '✓' : '⚠'}
                        </p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Fee Status</p>
                    </div>
                </div>

                {/* Profile + Fee */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-indigo-50 p-2 rounded-xl"><User size={20} className="text-indigo-600" /></div>
                            <h3 className="font-black text-slate-800">My Profile</h3>
                        </div>
                        <div className="space-y-4">
                            <InfoRow label="Full Name" value={user?.name || '-'} />
                            <InfoRow label="Email" value={user?.email || '-'} />
                            <InfoRow label="Batch" value={user?.batch || '-'} />
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-emerald-50 p-2 rounded-xl"><Wallet size={20} className="text-emerald-600" /></div>
                            <h3 className="font-black text-slate-800">Fee Details</h3>
                        </div>
                        <div className="space-y-4">
                            <InfoRow label="Total Fees" value={`₹${Number(user?.fees || 0).toLocaleString()}`} />
                            <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</span>
                                <span className={`text-sm font-black px-3 py-1 rounded-xl ${
                                    user?.feeStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                                }`}>
                                    {user?.feeStatus === 'PAID' ? '✓ Paid' : '⚠ Pending'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Announcements Section */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-amber-50 p-2 rounded-xl"><Megaphone size={20} className="text-amber-500" /></div>
                        <h3 className="font-black text-slate-800">Latest Announcements</h3>
                        {announcements.length > 0 && (
                            <span className="ml-auto text-xs bg-amber-50 text-amber-500 font-bold px-3 py-1 rounded-full border border-amber-200">
                                {announcements.length} notices
                            </span>
                        )}
                    </div>
                    {loading ? (
                        <div className="text-center py-6 text-slate-400">Loading...</div>
                    ) : announcements.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 font-medium bg-slate-50 rounded-2xl">
                            No announcements yet
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {announcements.map(a => {
                                const cat = CATEGORY_STYLES[a.category] || CATEGORY_STYLES.GENERAL;
                                return (
                                    <div key={a.id} className={`rounded-2xl p-5 border ${
                                        a.pinned ? 'bg-indigo-50/40 border-indigo-200' : 'bg-slate-50 border-slate-100'
                                    }`}>
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            {a.pinned && (
                                                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                                                    📌 Pinned
                                                </span>
                                            )}
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${cat.color}`}>
                                                {cat.label}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium ml-auto">{a.date}</span>
                                        </div>
                                        <p className="font-black text-slate-800 text-sm mb-1">{a.title}</p>
                                        <p className="text-slate-500 text-xs font-medium leading-relaxed">{a.message}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Marks Section */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-purple-50 p-2 rounded-xl"><Award size={20} className="text-purple-600" /></div>
                        <h3 className="font-black text-slate-800">My Marks & Grades</h3>
                        {avgMarks !== null && (
                            <span className="ml-auto text-xs bg-purple-50 text-purple-600 font-bold px-3 py-1 rounded-full border border-purple-200">
                                Overall: {avgMarks}%
                            </span>
                        )}
                    </div>
                    {loading ? (
                        <div className="text-center py-6 text-slate-400">Loading...</div>
                    ) : marks.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 font-medium bg-slate-50 rounded-2xl">
                            No marks added yet
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {marks.map(m => {
                                const { grade, color } = getGrade(m.marksObtained, m.totalMarks);
                                const pct = Math.round((m.marksObtained / m.totalMarks) * 100);
                                return (
                                    <div key={m.id} className="bg-slate-50 rounded-2xl p-5 flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-black text-slate-800 text-sm">{m.subject}</p>
                                                <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-lg">{m.examType}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-white rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all ${
                                                            pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-400' : 'bg-rose-500'
                                                        }`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                                                    {m.marksObtained}/{m.totalMarks}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-6 flex flex-col items-center">
                                            <span className={`font-black text-lg px-4 py-1.5 rounded-xl ${color}`}>{grade}</span>
                                            <span className="text-[10px] text-slate-400 font-medium mt-1">{pct}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Attendance Section */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-50 p-2 rounded-xl"><Calendar size={20} className="text-blue-600" /></div>
                        <h3 className="font-black text-slate-800">Attendance Overview</h3>
                    </div>
                    {loading ? (
                        <div className="text-center py-8 text-slate-400">Loading attendance...</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-slate-50 rounded-2xl p-5 text-center">
                                    <p className="text-2xl font-black text-slate-800">{attendance.total}</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total</p>
                                </div>
                                <div className="bg-emerald-50 rounded-2xl p-5 text-center">
                                    <p className="text-2xl font-black text-emerald-600">{attendance.present}</p>
                                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mt-1">Present</p>
                                </div>
                                <div className="bg-rose-50 rounded-2xl p-5 text-center">
                                    <p className="text-2xl font-black text-rose-500">{attendance.absent}</p>
                                    <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mt-1">Absent</p>
                                </div>
                            </div>
                            <div className={`${attendanceBg} rounded-2xl p-5`}>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-bold text-slate-600">Attendance Percentage</span>
                                    <span className={`text-2xl font-black ${attendanceColor}`}>{attendance.percentage}%</span>
                                </div>
                                <div className="w-full bg-white rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full transition-all duration-700 ${
                                            attendance.percentage >= 75 ? 'bg-emerald-500'
                                            : attendance.percentage >= 50 ? 'bg-amber-400' : 'bg-rose-500'
                                        }`}
                                        style={{ width: `${attendance.percentage}%` }}
                                    />
                                </div>
                                {attendance.percentage < 75 && (
                                    <p className="text-xs text-amber-600 font-medium mt-2">
                                        ⚠ Minimum 75% required. You need {75 - attendance.percentage}% more.
                                    </p>
                                )}
                            </div>
                            {attendanceRecords.length > 0 && (
                                <div className="mt-5">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Recent</p>
                                    <div className="space-y-2">
                                        {attendanceRecords.map((record, i) => (
                                            <div key={i} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                                                <span className="text-sm font-medium text-slate-600">{record.date}</span>
                                                <span className={`flex items-center gap-1.5 text-xs font-bold ${
                                                    record.status === 'PRESENT' ? 'text-emerald-600' : 'text-rose-500'
                                                }`}>
                                                    {record.status === 'PRESENT'
                                                        ? <><CheckCircle size={14} /> Present</>
                                                        : <><XCircle size={14} /> Absent</>
                                                    }
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Batch Info */}
                <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-200">
                    <div className="flex items-center gap-3 mb-4">
                        <BookOpen size={22} />
                        <h3 className="font-black text-xl">Batch Information</h3>
                    </div>
                    <p className="text-indigo-100 text-sm mb-2">You are enrolled in:</p>
                    <p className="text-4xl font-black">{user?.batch || 'Not assigned'}</p>
                </div>

            </div>
        </div>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-50">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="text-sm font-bold text-slate-800">{value}</span>
    </div>
);

export default StudentDashboard;