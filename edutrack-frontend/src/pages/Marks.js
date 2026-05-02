import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Trash2, X, Award, TrendingUp, BookOpen } from 'lucide-react';

const EXAM_TYPES = ['UNIT TEST', 'MID TERM', 'FINAL'];
const SUBJECTS = ['Mathematics', 'Science', 'English', 'History', 'Computer Science', 'Physics', 'Chemistry'];

const getGrade = (obtained, total) => {
    const pct = (obtained / total) * 100;
    if (pct >= 90) return { grade: 'A+', color: 'text-emerald-600 bg-emerald-50' };
    if (pct >= 80) return { grade: 'A', color: 'text-emerald-600 bg-emerald-50' };
    if (pct >= 70) return { grade: 'B', color: 'text-blue-600 bg-blue-50' };
    if (pct >= 60) return { grade: 'C', color: 'text-amber-600 bg-amber-50' };
    if (pct >= 50) return { grade: 'D', color: 'text-orange-600 bg-orange-50' };
    return { grade: 'F', color: 'text-rose-600 bg-rose-50' };
};

const Marks = () => {
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [filterExam, setFilterExam] = useState('ALL');
    const [filterBatch, setFilterBatch] = useState('ALL');
    const [form, setForm] = useState({
        studentId: '', studentName: '', batch: '',
        subject: 'Mathematics', examType: 'UNIT TEST',
        marksObtained: '', totalMarks: 100,
        date: new Date().toISOString().slice(0, 10)
    });

    useEffect(() => {
        fetchStudents();
        fetchMarks();
    }, []);

    const fetchStudents = async () => {
        const res = await api.get('/batches');
        setStudents(res.data);
    };

    const fetchMarks = async () => {
        const res = await api.get('/marks');
        setMarks(res.data);
    };

    const handleStudentSelect = (studentId) => {
        const student = students.find(s => s.id === studentId);
        if (student) {
            setForm(prev => ({
                ...prev,
                studentId: student.id,
                studentName: student.name,
                batch: student.batch
            }));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await api.post('/marks', { ...form, marksObtained: parseInt(form.marksObtained) });
        setShowModal(false);
        setForm({
            studentId: '', studentName: '', batch: '',
            subject: 'Mathematics', examType: 'UNIT TEST',
            marksObtained: '', totalMarks: 100,
            date: new Date().toISOString().slice(0, 10)
        });
        fetchMarks();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this mark entry?')) {
            await api.delete(`/marks/${id}`);
            fetchMarks();
        }
    };

    const batches = ['ALL', ...new Set(students.map(s => s.batch).filter(Boolean))];

    const filteredMarks = marks.filter(m => {
        const examMatch = filterExam === 'ALL' || m.examType === filterExam;
        const batchMatch = filterBatch === 'ALL' || m.batch === filterBatch;
        return examMatch && batchMatch;
    });

    // Stats
    const avgPercentage = filteredMarks.length > 0
        ? Math.round(filteredMarks.reduce((sum, m) => sum + (m.marksObtained / m.totalMarks) * 100, 0) / filteredMarks.length)
        : 0;
    const toppers = filteredMarks.filter(m => (m.marksObtained / m.totalMarks) * 100 >= 90).length;
    const failed = filteredMarks.filter(m => (m.marksObtained / m.totalMarks) * 100 < 50).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-800">Marks & Grades</h2>
                    <p className="text-slate-500 font-medium text-sm">Enter and manage student exam results.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                    <Plus size={20} /> Add Marks
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-indigo-50 p-3 rounded-xl"><TrendingUp size={20} className="text-indigo-600" /></div>
                    <div>
                        <p className="text-2xl font-black text-indigo-600">{avgPercentage}%</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Class Average</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-emerald-50 p-3 rounded-xl"><Award size={20} className="text-emerald-600" /></div>
                    <div>
                        <p className="text-2xl font-black text-emerald-600">{toppers}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Toppers (A+)</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-rose-50 p-3 rounded-xl"><BookOpen size={20} className="text-rose-500" /></div>
                    <div>
                        <p className="text-2xl font-black text-rose-500">{failed}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Failed</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
                {/* Exam type filter */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterExam('ALL')}
                        className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${filterExam === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}
                    >All Exams</button>
                    {EXAM_TYPES.map(et => (
                        <button
                            key={et}
                            onClick={() => setFilterExam(et)}
                            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${filterExam === et ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                        >{et}</button>
                    ))}
                </div>
                {/* Batch filter */}
                <div className="flex gap-2 ml-auto">
                    {batches.map(b => (
                        <button
                            key={b}
                            onClick={() => setFilterBatch(b)}
                            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${filterBatch === b ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                        >{b}</button>
                    ))}
                </div>
            </div>

            {/* Marks Table */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                {filteredMarks.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen size={28} className="text-slate-400" />
                        </div>
                        <p className="text-slate-400 font-bold">No marks added yet</p>
                        <p className="text-slate-300 text-sm mt-1">Click "Add Marks" to enter exam results</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <th className="px-8 py-5">Student</th>
                                <th className="px-8 py-5">Subject</th>
                                <th className="px-8 py-5">Exam</th>
                                <th className="px-8 py-5 text-center">Marks</th>
                                <th className="px-8 py-5 text-center">Grade</th>
                                <th className="px-8 py-5">Date</th>
                                <th className="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredMarks.map(m => {
                                const { grade, color } = getGrade(m.marksObtained, m.totalMarks);
                                const pct = Math.round((m.marksObtained / m.totalMarks) * 100);
                                return (
                                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-8 py-5">
                                            <p className="font-bold text-slate-800 text-sm">{m.studentName}</p>
                                            <p className="text-xs text-slate-400">{m.batch}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-bold text-slate-600">{m.subject}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-xl font-bold text-xs">{m.examType}</span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <p className="font-black text-slate-800">{m.marksObtained}/{m.totalMarks}</p>
                                            <p className="text-xs text-slate-400">{pct}%</p>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`font-black text-sm px-3 py-1.5 rounded-xl ${color}`}>{grade}</span>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-slate-400 font-medium">{m.date}</td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={() => handleDelete(m.id)}
                                                className="p-2 text-rose-400 hover:bg-rose-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add Marks Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[3rem] p-12 w-full max-w-lg shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-slate-800">Add Marks</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-5">
                            {/* Student select */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Student</label>
                                <select
                                    value={form.studentId}
                                    onChange={e => handleStudentSelect(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-slate-800"
                                    required
                                >
                                    <option value="">-- Select Student --</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} — {s.batch}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Subject + Exam Type */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                                    <select
                                        value={form.subject}
                                        onChange={e => setForm({ ...form, subject: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-slate-800"
                                    >
                                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Exam Type</label>
                                    <select
                                        value={form.examType}
                                        onChange={e => setForm({ ...form, examType: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-slate-800"
                                    >
                                        {EXAM_TYPES.map(et => <option key={et} value={et}>{et}</option>)}
                                    </select>
                                </div>
                            </div>
                            {/* Marks + Total */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Marks Obtained</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 85"
                                        value={form.marksObtained}
                                        onChange={e => setForm({ ...form, marksObtained: e.target.value })}
                                        min="0"
                                        max={form.totalMarks}
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-slate-800"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Marks</label>
                                    <input
                                        type="number"
                                        value={form.totalMarks}
                                        onChange={e => setForm({ ...form, totalMarks: parseInt(e.target.value) })}
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-slate-800"
                                        required
                                    />
                                </div>
                            </div>
                            {/* Live grade preview */}
                            {form.marksObtained && (
                                <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-500">Grade Preview</span>
                                    <span className={`font-black text-lg px-4 py-1.5 rounded-xl ${getGrade(form.marksObtained, form.totalMarks).color}`}>
                                        {getGrade(form.marksObtained, form.totalMarks).grade} — {Math.round((form.marksObtained / form.totalMarks) * 100)}%
                                    </span>
                                </div>
                            )}
                            {/* Date */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Exam Date</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={e => setForm({ ...form, date: e.target.value })}
                                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-slate-800"
                                />
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 text-slate-400 font-bold hover:text-slate-600">Cancel</button>
                                <button type="submit" className="flex-[2] bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-indigo-700 transition-all">Save Marks</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Marks;