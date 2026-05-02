import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Calendar, CheckCircle, XCircle, Save, ChevronLeft, ChevronRight, Users } from 'lucide-react';

const Attendance = () => {
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filterBatch, setFilterBatch] = useState('ALL');

    // Fetch all students once
    useEffect(() => {
        api.get('/batches').then(res => setStudents(res.data));
    }, []);

    // Fetch attendance for selected date
    useEffect(() => {
        if (!selectedDate) return;
        setLoading(true);
        api.get(`/attendance/date/${selectedDate}`)
            .then(res => {
                const map = {};
                res.data.forEach(r => { map[r.studentId] = r.status; });
                setAttendance(map);
            })
            .catch(() => setAttendance({}))
            .finally(() => setLoading(false));
    }, [selectedDate]);

    // Toggle a student present/absent
    const toggle = (studentId) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: prev[studentId] === 'PRESENT' ? 'ABSENT' : 'PRESENT'
        }));
    };

    // Mark all present
    const markAllPresent = () => {
        const map = {};
        filteredStudents.forEach(s => { map[s.id] = 'PRESENT'; });
        setAttendance(prev => ({ ...prev, ...map }));
    };

    // Mark all absent
    const markAllAbsent = () => {
        const map = {};
        filteredStudents.forEach(s => { map[s.id] = 'ABSENT'; });
        setAttendance(prev => ({ ...prev, ...map }));
    };

    // Save attendance
    const saveAttendance = async () => {
        setSaving(true);
        try {
            const records = students
                .filter(s => attendance[s.id])
                .map(s => ({
                    studentId: s.id,
                    studentName: s.name,
                    batch: s.batch,
                    date: selectedDate,
                    status: attendance[s.id]
                }));

            await api.post('/attendance/bulk', records);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            alert('Failed to save attendance. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // Change date by 1 day
    const changeDate = (days) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + days);
        setSelectedDate(d.toISOString().slice(0, 10));
    };

    // Batch list for filter
    const batches = ['ALL', ...new Set(students.map(s => s.batch).filter(Boolean))];
    const filteredStudents = filterBatch === 'ALL'
        ? students
        : students.filter(s => s.batch === filterBatch);

    // Stats
    const presentCount = filteredStudents.filter(s => attendance[s.id] === 'PRESENT').length;
    const absentCount = filteredStudents.filter(s => attendance[s.id] === 'ABSENT').length;
    const unmarkedCount = filteredStudents.filter(s => !attendance[s.id]).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-800">Attendance</h2>
                    <p className="text-slate-500 font-medium text-sm">Mark daily attendance for your students.</p>
                </div>
                <button
                    onClick={saveAttendance}
                    disabled={saving || students.length === 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg disabled:opacity-50 ${
                        saved
                            ? 'bg-emerald-500 text-white shadow-emerald-200'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                    }`}
                >
                    {saved ? <><CheckCircle size={18} /> Saved!</> : saving ? 'Saving...' : <><Save size={18} /> Save Attendance</>}
                </button>
            </div>

            {/* Date Picker + Batch Filter */}
            <div className="flex items-center gap-4 flex-wrap">
                {/* Date navigator */}
                <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-2">
                    <button
                        onClick={() => changeDate(-1)}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div className="flex items-center gap-2 px-2">
                        <Calendar size={16} className="text-indigo-600" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                            className="text-sm font-bold text-slate-800 outline-none bg-transparent"
                        />
                    </div>
                    <button
                        onClick={() => changeDate(1)}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500"
                        disabled={selectedDate >= new Date().toISOString().slice(0, 10)}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                {/* Batch filter */}
                <div className="flex gap-2 flex-wrap">
                    {batches.map(b => (
                        <button
                            key={b}
                            onClick={() => setFilterBatch(b)}
                            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                                filterBatch === b
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {b}
                        </button>
                    ))}
                </div>

                {/* Mark all buttons */}
                <div className="flex gap-2 ml-auto">
                    <button
                        onClick={markAllPresent}
                        className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-all border border-emerald-200"
                    >
                        ✓ All Present
                    </button>
                    <button
                        onClick={markAllAbsent}
                        className="px-4 py-2 bg-rose-50 text-rose-500 rounded-xl font-bold text-xs hover:bg-rose-100 transition-all border border-rose-200"
                    >
                        ✗ All Absent
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-emerald-50 p-3 rounded-xl">
                        <CheckCircle size={20} className="text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-emerald-600">{presentCount}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Present</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-rose-50 p-3 rounded-xl">
                        <XCircle size={20} className="text-rose-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-rose-500">{absentCount}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Absent</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-slate-100 p-3 rounded-xl">
                        <Users size={20} className="text-slate-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-600">{unmarkedCount}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unmarked</p>
                    </div>
                </div>
            </div>

            {/* Student Attendance List */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="py-16 text-center text-slate-400 font-medium">
                        Loading attendance...
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 font-medium">
                        No students found. Add students first.
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <th className="px-10 py-5">Student</th>
                                <th className="px-10 py-5">Batch</th>
                                <th className="px-10 py-5 text-center">Status</th>
                                <th className="px-10 py-5 text-center">Mark</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStudents.map(s => {
                                const status = attendance[s.id];
                                return (
                                    <tr
                                        key={s.id}
                                        className={`transition-colors cursor-pointer ${
                                            status === 'PRESENT' ? 'bg-emerald-50/40 hover:bg-emerald-50'
                                            : status === 'ABSENT' ? 'bg-rose-50/40 hover:bg-rose-50'
                                            : 'hover:bg-slate-50'
                                        }`}
                                        onClick={() => toggle(s.id)}
                                    >
                                        <td className="px-10 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                                                    status === 'PRESENT' ? 'bg-emerald-100 text-emerald-600'
                                                    : status === 'ABSENT' ? 'bg-rose-100 text-rose-500'
                                                    : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {s.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{s.name}</p>
                                                    <p className="text-xs text-slate-400">{s.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-5">
                                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-xl font-bold text-xs">
                                                {s.batch}
                                            </span>
                                        </td>
                                        <td className="px-10 py-5 text-center">
                                            {status === 'PRESENT' ? (
                                                <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-xl">
                                                    <CheckCircle size={13} /> Present
                                                </span>
                                            ) : status === 'ABSENT' ? (
                                                <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-500 text-xs font-bold px-3 py-1.5 rounded-xl">
                                                    <XCircle size={13} /> Absent
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-400 text-xs font-bold px-3 py-1.5 rounded-xl">
                                                    — Not Marked
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-10 py-5">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={e => { e.stopPropagation(); setAttendance(p => ({ ...p, [s.id]: 'PRESENT' })); }}
                                                    className={`p-2 rounded-xl transition-all font-bold text-xs ${
                                                        status === 'PRESENT'
                                                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                                                            : 'bg-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                                                    }`}
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                                <button
                                                    onClick={e => { e.stopPropagation(); setAttendance(p => ({ ...p, [s.id]: 'ABSENT' })); }}
                                                    className={`p-2 rounded-xl transition-all font-bold text-xs ${
                                                        status === 'ABSENT'
                                                            ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                                                            : 'bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500'
                                                    }`}
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Save reminder if unmarked */}
            {unmarkedCount > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 flex items-center justify-between">
                    <p className="text-amber-600 font-bold text-sm">
                        ⚠ {unmarkedCount} student{unmarkedCount > 1 ? 's' : ''} not marked yet
                    </p>
                    <div className="flex gap-2">
                        <button onClick={markAllPresent} className="text-xs font-bold text-amber-600 hover:underline">Mark all present</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;