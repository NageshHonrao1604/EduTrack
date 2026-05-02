import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Bell, Pin, Trash2, Plus, X, Megaphone, BookOpen, DollarSign, Calendar } from 'lucide-react';

const CATEGORIES = [
    { value: 'GENERAL', label: 'General', color: 'bg-blue-50 text-blue-600 border-blue-200', icon: <Megaphone size={14} /> },
    { value: 'EXAM', label: 'Exam', color: 'bg-purple-50 text-purple-600 border-purple-200', icon: <BookOpen size={14} /> },
    { value: 'FEE', label: 'Fee', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: <DollarSign size={14} /> },
    { value: 'HOLIDAY', label: 'Holiday', color: 'bg-amber-50 text-amber-600 border-amber-200', icon: <Calendar size={14} /> },
];

const getCategoryStyle = (cat) => CATEGORIES.find(c => c.value === cat) || CATEGORIES[0];

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [filterCat, setFilterCat] = useState('ALL');
    const [form, setForm] = useState({
        title: '', message: '', category: 'GENERAL', date: new Date().toISOString().slice(0, 10), pinned: false
    });

    useEffect(() => { fetchAnnouncements(); }, []);

    const fetchAnnouncements = async () => {
        const res = await api.get('/announcements');
        setAnnouncements(res.data);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await api.post('/announcements', form);
        setShowModal(false);
        setForm({ title: '', message: '', category: 'GENERAL', date: new Date().toISOString().slice(0, 10), pinned: false });
        fetchAnnouncements();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this announcement?')) {
            await api.delete(`/announcements/${id}`);
            fetchAnnouncements();
        }
    };

    const handlePin = async (id) => {
        await api.patch(`/announcements/${id}/pin`);
        fetchAnnouncements();
    };

    const filtered = filterCat === 'ALL'
        ? announcements
        : announcements.filter(a => a.category === filterCat);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-800">Announcements</h2>
                    <p className="text-slate-500 font-medium text-sm">Post notices and updates for students.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                    <Plus size={20} /> New Announcement
                </button>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setFilterCat('ALL')}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                        filterCat === 'ALL'
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                            : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    All ({announcements.length})
                </button>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.value}
                        onClick={() => setFilterCat(cat.value)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all border ${
                            filterCat === cat.value
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                : `${cat.color} hover:opacity-80`
                        }`}
                    >
                        {cat.icon} {cat.label} ({announcements.filter(a => a.category === cat.value).length})
                    </button>
                ))}
            </div>

            {/* Announcements List */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-16 text-center border border-slate-100 shadow-sm">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell size={28} className="text-slate-400" />
                    </div>
                    <p className="text-slate-400 font-bold">No announcements yet</p>
                    <p className="text-slate-300 text-sm mt-1">Click "New Announcement" to post one</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map(a => {
                        const cat = getCategoryStyle(a.category);
                        return (
                            <div key={a.id} className={`bg-white rounded-[2rem] p-7 shadow-sm border ${
                                a.pinned ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-100'
                            } transition-all`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                                            {a.pinned && (
                                                <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200">
                                                    <Pin size={11} /> Pinned
                                                </span>
                                            )}
                                            <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl border ${cat.color}`}>
                                                {cat.icon} {cat.label}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium">{a.date}</span>
                                        </div>
                                        <h3 className="text-lg font-black text-slate-800 mb-2">{a.title}</h3>
                                        <p className="text-slate-500 font-medium text-sm leading-relaxed">{a.message}</p>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handlePin(a.id)}
                                            className={`p-2.5 rounded-xl transition-all ${
                                                a.pinned
                                                    ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                                                    : 'text-slate-400 hover:bg-slate-100'
                                            }`}
                                            title={a.pinned ? 'Unpin' : 'Pin to top'}
                                        >
                                            <Pin size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(a.id)}
                                            className="p-2.5 text-rose-400 hover:bg-rose-50 rounded-xl transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* New Announcement Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[3rem] p-12 w-full max-w-lg shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-slate-800">New Announcement</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-5">
                            {/* Title */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                                <input
                                    type="text"
                                    placeholder="Announcement title..."
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-slate-800"
                                    required
                                />
                            </div>
                            {/* Message */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                                <textarea
                                    placeholder="Write your announcement here..."
                                    value={form.message}
                                    onChange={e => setForm({ ...form, message: e.target.value })}
                                    rows={4}
                                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 outline-none transition-all font-medium text-slate-800 resize-none"
                                    required
                                />
                            </div>
                            {/* Category + Date */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                    <select
                                        value={form.category}
                                        onChange={e => setForm({ ...form, category: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-slate-800"
                                    >
                                        {CATEGORIES.map(c => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                                    <input
                                        type="date"
                                        value={form.date}
                                        onChange={e => setForm({ ...form, date: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-slate-800"
                                    />
                                </div>
                            </div>
                            {/* Pin toggle */}
                            <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4">
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, pinned: !form.pinned })}
                                    className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form.pinned ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${form.pinned ? 'left-7' : 'left-1'}`} />
                                </button>
                                <span className="text-sm font-bold text-slate-600">Pin to top</span>
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 text-slate-400 font-bold hover:text-slate-600">Cancel</button>
                                <button type="submit" className="flex-[2] bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-indigo-700 transition-all">Post Announcement</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Announcements;