// import React, { useEffect, useState } from 'react';
// import api from '../api/axios';
// import { Edit2, Trash2, UserPlus, FileDown, Key, Search } from 'lucide-react';

// const StudentManagement = () => {
//     const [students, setStudents] = useState([]);
//     const [showModal, setShowModal] = useState(false);
//     const [showLoginModal, setShowLoginModal] = useState(false);
//     const [formData, setFormData] = useState({ name: '', email: '', batch: '', fees: 0, feeStatus: 'PENDING' });
//     const [loginForm, setLoginForm] = useState({ email: '', password: '' });
//     const [loginMsg, setLoginMsg] = useState('');
//     const [editId, setEditId] = useState(null);
//     const [search, setSearch] = useState('');
//     const [generating, setGenerating] = useState(false);

//     useEffect(() => { fetchStudents(); }, []);

//     const fetchStudents = async () => {
//         const res = await api.get('/batches');
//         setStudents(res.data);
//     };

//     const handleSave = async (e) => {
//         e.preventDefault();
//         if (editId) await api.put(`/batches/id/${editId}`, formData);
//         else await api.post('/batches', formData);
//         setShowModal(false);
//         setEditId(null);
//         setFormData({ name: '', email: '', batch: '', fees: 0, feeStatus: 'PENDING' });
//         fetchStudents();
//     };

//     // ── Toggle Fee Status ──────────────────────────────────────
//     const toggleFeeStatus = async (student) => {
//         const newStatus = student.feeStatus === 'PAID' ? 'PENDING' : 'PAID';
//         await api.put(`/batches/id/${student.id}`, { ...student, feeStatus: newStatus });
//         fetchStudents();
//     };

//     // ── Give Login Access ──────────────────────────────────────
//     const handleGiveLogin = async (e) => {
//         e.preventDefault();
//         setLoginMsg('');
//         try {
//             const res = await api.post('/auth/create-student', loginForm);
//             setLoginMsg({ type: 'success', text: res.data.message || 'Login created successfully!' });
//             setTimeout(() => { setShowLoginModal(false); setLoginMsg(''); }, 2000);
//         } catch (err) {
//             setLoginMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create login.' });
//         }
//     };

//     // ── Export All as PDF ──────────────────────────────────────
//     const generateAllReport = async () => {
//         setGenerating(true);
//         try {
//             const { jsPDF } = await import('jspdf');
//             const { default: autoTable } = await import('jspdf-autotable');
//             const doc = new jsPDF();
//             const pageWidth = doc.internal.pageSize.getWidth();
//             const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

//             doc.setFillColor(67, 56, 202);
//             doc.rect(0, 0, pageWidth, 32, 'F');
//             doc.setTextColor(255, 255, 255);
//             doc.setFontSize(18); doc.setFont('helvetica', 'bold');
//             doc.text('EduTrack', 14, 13);
//             doc.setFontSize(9); doc.setFont('helvetica', 'normal');
//             doc.text('Admin Portal v1.0', 14, 21);
//             doc.text(`Generated: ${today}`, pageWidth - 14, 21, { align: 'right' });

//             doc.setTextColor(30, 30, 30);
//             doc.setFontSize(16); doc.setFont('helvetica', 'bold');
//             doc.text('Student Directory', 14, 48);
//             doc.setDrawColor(67, 56, 202); doc.setLineWidth(0.8);
//             doc.line(14, 51, pageWidth - 14, 51);

//             autoTable(doc, {
//                 startY: 58,
//                 head: [['#', 'Name', 'Email', 'Batch', 'Fees (Rs.)', 'Fee Status']],
//                 body: students.map((s, idx) => [
//                     idx + 1, s.name || '-', s.email || '-', s.batch || '-',
//                     Number(s.fees).toLocaleString('en-IN'),
//                     s.feeStatus || 'PENDING'
//                 ]),
//                 styles: { fontSize: 9, cellPadding: 4 },
//                 headStyles: { fillColor: [67, 56, 202], textColor: 255, fontStyle: 'bold' },
//                 alternateRowStyles: { fillColor: [248, 248, 255] },
//                 margin: { left: 14, right: 14 },
//             });

//             const pageCount = doc.internal.getNumberOfPages();
//             for (let i = 1; i <= pageCount; i++) {
//                 doc.setPage(i);
//                 doc.setFontSize(8); doc.setTextColor(160, 160, 160);
//                 doc.text(`Page ${i} of ${pageCount}  |  EduTrack  |  Confidential`,
//                     pageWidth / 2, doc.internal.pageSize.getHeight() - 8, { align: 'center' });
//             }
//             doc.save(`EduTrack_Students_${new Date().toISOString().slice(0, 10)}.pdf`);
//         } catch (err) {
//             alert('Install jspdf and jspdf-autotable first: npm install jspdf jspdf-autotable');
//         } finally {
//             setGenerating(false);
//         }
//     };

//     // ── Export as Excel ────────────────────────────────────────
//     const exportExcel = async () => {
//         try {
//             const { utils, writeFile } = await import('xlsx');
//             const data = students.map((s, i) => ({
//                 '#': i + 1,
//                 'Name': s.name,
//                 'Email': s.email,
//                 'Batch': s.batch,
//                 'Fees': s.fees,
//                 'Fee Status': s.feeStatus || 'PENDING'
//             }));
//             const ws = utils.json_to_sheet(data);
//             const wb = utils.book_new();
//             utils.book_append_sheet(wb, ws, 'Students');
//             writeFile(wb, `EduTrack_Students_${new Date().toISOString().slice(0, 10)}.xlsx`);
//         } catch (err) {
//             alert('Install xlsx first: npm install xlsx');
//         }
//     };

//     const filteredStudents = students.filter(s =>
//         s.name?.toLowerCase().includes(search.toLowerCase()) ||
//         s.email?.toLowerCase().includes(search.toLowerCase()) ||
//         s.batch?.toLowerCase().includes(search.toLowerCase())
//     );

//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h2 className="text-3xl font-black text-slate-800">Student Directory</h2>
//                     <p className="text-slate-500 font-medium text-sm">Manage students and their login access.</p>
//                 </div>
//                 <div className="flex gap-3">
//                     {/* Search */}
//                     <div className="relative">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                         <input
//                             type="text"
//                             placeholder="Search..."
//                             value={search}
//                             onChange={e => setSearch(e.target.value)}
//                             className="bg-white border border-slate-200 rounded-2xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-48"
//                         />
//                     </div>
//                     {/* Export Excel */}
//                     <button
//                         onClick={exportExcel}
//                         disabled={students.length === 0}
//                         className="bg-white text-emerald-600 border border-emerald-200 px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-50 transition-all shadow-sm disabled:opacity-50"
//                     >
//                         <FileDown size={18} /> Excel
//                     </button>
//                     {/* Export PDF */}
//                     <button
//                         onClick={generateAllReport}
//                         disabled={generating || students.length === 0}
//                         className="bg-white text-indigo-600 border border-indigo-200 px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-sm disabled:opacity-50"
//                     >
//                         <FileDown size={18} /> {generating ? 'Generating...' : 'PDF'}
//                     </button>
//                     {/* Add New */}
//                     <button
//                         onClick={() => { setShowModal(true); setEditId(null); setFormData({ name: '', email: '', batch: '', fees: 0, feeStatus: 'PENDING' }); }}
//                         className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
//                     >
//                         <UserPlus size={20} /> Add New
//                     </button>
//                 </div>
//             </div>

//             {/* Table */}
//             <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
//                 <table className="w-full text-left">
//                     <thead className="bg-slate-50/50 border-b border-slate-100">
//                         <tr className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                             <th className="px-10 py-5">Full Name</th>
//                             <th className="px-10 py-5">Batch</th>
//                             <th className="px-10 py-5">Fees</th>
//                             <th className="px-10 py-5">Fee Status</th>
//                             <th className="px-10 py-5 text-right">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-100">
//                         {filteredStudents.length === 0 ? (
//                             <tr>
//                                 <td colSpan={5} className="px-10 py-12 text-center text-slate-400 font-medium">
//                                     {search ? 'No students match your search.' : 'No students added yet.'}
//                                 </td>
//                             </tr>
//                         ) : (
//                             filteredStudents.map(s => (
//                                 <tr key={s.id} className="group hover:bg-slate-50 transition-colors">
//                                     <td className="px-10 py-6">
//                                         <p className="font-bold text-slate-800">{s.name}</p>
//                                         <p className="text-xs text-slate-400 font-medium">{s.email}</p>
//                                     </td>
//                                     <td className="px-10 py-6">
//                                         <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl font-bold text-xs">
//                                             {s.batch}
//                                         </span>
//                                     </td>
//                                     <td className="px-10 py-6">
//                                         <p className="text-sm font-black text-slate-800">₹{Number(s.fees).toLocaleString()}</p>
//                                     </td>
//                                     <td className="px-10 py-6">
//                                         {/* Clickable fee status toggle */}
//                                         <button
//                                             onClick={() => toggleFeeStatus(s)}
//                                             className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
//                                                 s.feeStatus === 'PAID'
//                                                     ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
//                                                     : 'bg-rose-50 text-rose-500 hover:bg-rose-100'
//                                             }`}
//                                         >
//                                             {s.feeStatus === 'PAID' ? '✓ Paid' : '⚠ Pending'}
//                                         </button>
//                                     </td>
//                                     <td className="px-10 py-6 text-right">
//                                         <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                                             {/* Give Login Access */}
//                                             <button
//                                                 onClick={() => {
//                                                     setLoginForm({ email: s.email, password: '' });
//                                                     setLoginMsg('');
//                                                     setShowLoginModal(true);
//                                                 }}
//                                                 className="p-2.5 text-amber-500 hover:bg-amber-50 rounded-xl transition-all"
//                                                 title="Give Student Login Access"
//                                             >
//                                                 <Key size={18} />
//                                             </button>
//                                             {/* Edit */}
//                                             <button
//                                                 onClick={() => { setEditId(s.id); setFormData(s); setShowModal(true); }}
//                                                 className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
//                                                 title="Edit Student"
//                                             >
//                                                 <Edit2 size={18} />
//                                             </button>
//                                             {/* Delete */}
//                                             <button
//                                                 onClick={async () => {
//                                                     if (window.confirm(`Delete ${s.name}?`)) {
//                                                         await api.delete(`/batches/id/${s.id}`);
//                                                         fetchStudents();
//                                                     }
//                                                 }}
//                                                 className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
//                                                 title="Delete Student"
//                                             >
//                                                 <Trash2 size={18} />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Add/Edit Student Modal */}
//             {showModal && (
//                 <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-[3rem] p-12 w-full max-w-lg shadow-2xl">
//                         <h3 className="text-2xl font-black text-slate-800 mb-8">
//                             {editId ? 'Modify Student' : 'New Admission'}
//                         </h3>
//                         <form onSubmit={handleSave} className="space-y-6">
//                             <InputField label="Name" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />
//                             <InputField label="Email" type="email" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} />
//                             <div className="grid grid-cols-2 gap-6">
//                                 <InputField label="Batch Code" value={formData.batch} onChange={v => setFormData({ ...formData, batch: v })} />
//                                 <InputField label="Fees (₹)" type="number" value={formData.fees} onChange={v => setFormData({ ...formData, fees: v })} />
//                             </div>
//                             {/* Fee Status Selector */}
//                             <div className="space-y-1.5">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fee Status</label>
//                                 <select
//                                     className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-slate-800"
//                                     value={formData.feeStatus}
//                                     onChange={e => setFormData({ ...formData, feeStatus: e.target.value })}
//                                 >
//                                     <option value="PENDING">Pending</option>
//                                     <option value="PAID">Paid</option>
//                                 </select>
//                             </div>
//                             <div className="flex gap-4 pt-6">
//                                 <button type="button" onClick={() => setShowModal(false)} className="flex-1 text-slate-400 font-bold hover:text-slate-600">Cancel</button>
//                                 <button type="submit" className="flex-[2] bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-indigo-600 transition-all">Submit Entry</button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* Give Login Access Modal */}
//             {showLoginModal && (
//                 <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-[3rem] p-12 w-full max-w-md shadow-2xl">
//                         <div className="flex items-center gap-3 mb-2">
//                             <div className="bg-amber-50 p-2 rounded-xl">
//                                 <Key size={20} className="text-amber-500" />
//                             </div>
//                             <h3 className="text-2xl font-black text-slate-800">Give Login Access</h3>
//                         </div>
//                         <p className="text-slate-400 text-sm font-medium mb-8">
//                             Set a password so this student can login to their portal.
//                         </p>

//                         {loginMsg && (
//                             <div className={`mb-6 text-sm font-medium px-4 py-3 rounded-2xl ${
//                                 loginMsg.type === 'success'
//                                     ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
//                                     : 'bg-rose-50 text-rose-500 border border-rose-200'
//                             }`}>
//                                 {loginMsg.text}
//                             </div>
//                         )}

//                         <form onSubmit={handleGiveLogin} className="space-y-6">
//                             {/* Email — readonly, pre-filled */}
//                             <div className="space-y-1.5">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Student Email</label>
//                                 <input
//                                     type="email"
//                                     value={loginForm.email}
//                                     readOnly
//                                     className="w-full bg-slate-100 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-500 outline-none cursor-not-allowed"
//                                 />
//                             </div>
//                             {/* Password */}
//                             <div className="space-y-1.5">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Set Password</label>
//                                 <input
//                                     type="password"
//                                     placeholder="Enter a password for the student"
//                                     value={loginForm.password}
//                                     onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
//                                     className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-slate-800"
//                                     required
//                                     minLength={6}
//                                 />
//                                 <p className="text-xs text-slate-400 ml-1">Minimum 6 characters</p>
//                             </div>
//                             <div className="flex gap-4 pt-4">
//                                 <button
//                                     type="button"
//                                     onClick={() => { setShowLoginModal(false); setLoginMsg(''); }}
//                                     className="flex-1 text-slate-400 font-bold hover:text-slate-600"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="flex-[2] bg-amber-500 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-amber-600 transition-all"
//                                 >
//                                     Create Login
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// const InputField = ({ label, type = 'text', value, onChange }) => (
//     <div className="space-y-1.5">
//         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
//         <input
//             type={type}
//             className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-slate-800"
//             value={value}
//             onChange={e => onChange(e.target.value)}
//             required
//         />
//     </div>
// );

// export default StudentManagement;




import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { Edit2, Trash2, UserPlus, FileDown, Key, Search } from 'lucide-react';

const StudentManagement = () => {
    const toast = useToast();
    const [students, setStudents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', batch: '', fees: 0, feeStatus: 'PENDING' });
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState('');
    const [generating, setGenerating] = useState(false);

    useEffect(() => { fetchStudents(); }, []);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/batches');
            setStudents(res.data);
        } catch { toast.error('Failed to load students'); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editId) { await api.put(`/batches/id/${editId}`, formData); toast.success('Student updated!'); }
            else { await api.post('/batches', formData); toast.success('Student added!'); }
            setShowModal(false); setEditId(null);
            setFormData({ name: '', email: '', batch: '', fees: 0, feeStatus: 'PENDING' });
            fetchStudents();
        } catch { toast.error('Failed to save. Try again.'); }
    };

    const toggleFeeStatus = async (student) => {
        try {
            const newStatus = student.feeStatus === 'PAID' ? 'PENDING' : 'PAID';
            await api.put(`/batches/id/${student.id}`, { ...student, feeStatus: newStatus });
            toast.success(`Fee status → ${newStatus}`);
            fetchStudents();
        } catch { toast.error('Failed to update fee status'); }
    };

    const handleGiveLogin = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/create-student', loginForm);
            toast.success('Student login created!');
            setShowLoginModal(false);
            setLoginForm({ email: '', password: '' });
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to create login'); }
    };

    const handleDelete = async (student) => {
        if (!window.confirm(`Delete ${student.name}?`)) return;
        try {
            await api.delete(`/batches/id/${student.id}`);
            toast.success(`${student.name} deleted`);
            fetchStudents();
        } catch { toast.error('Failed to delete student'); }
    };

    const generateAllReport = async () => {
        setGenerating(true);
        try {
            const { jsPDF } = await import('jspdf');
            const { default: autoTable } = await import('jspdf-autotable');
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
            doc.setFillColor(67, 56, 202); doc.rect(0, 0, pageWidth, 32, 'F');
            doc.setTextColor(255, 255, 255); doc.setFontSize(18); doc.setFont('helvetica', 'bold');
            doc.text('EduTrack', 14, 13); doc.setFontSize(9); doc.setFont('helvetica', 'normal');
            doc.text('Admin Portal v1.0', 14, 21);
            doc.text(`Generated: ${today}`, pageWidth - 14, 21, { align: 'right' });
            doc.setTextColor(30, 30, 30); doc.setFontSize(16); doc.setFont('helvetica', 'bold');
            doc.text('Student Directory', 14, 48);
            doc.setDrawColor(67, 56, 202); doc.setLineWidth(0.8); doc.line(14, 51, pageWidth - 14, 51);
            autoTable(doc, {
                startY: 58,
                head: [['#', 'Name', 'Email', 'Batch', 'Fees (Rs.)', 'Status']],
                body: students.map((s, i) => [i + 1, s.name, s.email, s.batch, Number(s.fees).toLocaleString('en-IN'), s.feeStatus || 'PENDING']),
                styles: { fontSize: 9, cellPadding: 4 },
                headStyles: { fillColor: [67, 56, 202], textColor: 255, fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [248, 248, 255] },
                margin: { left: 14, right: 14 },
            });
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i); doc.setFontSize(8); doc.setTextColor(160, 160, 160);
                doc.text(`Page ${i} of ${pageCount}  |  EduTrack  |  Confidential`, pageWidth / 2, doc.internal.pageSize.getHeight() - 8, { align: 'center' });
            }
            doc.save(`EduTrack_Students_${new Date().toISOString().slice(0, 10)}.pdf`);
            toast.success('PDF downloaded!');
        } catch { toast.error('PDF generation failed'); }
        finally { setGenerating(false); }
    };

    const exportExcel = async () => {
        try {
            const { utils, writeFile } = await import('xlsx');
            const data = students.map((s, i) => ({ '#': i + 1, Name: s.name, Email: s.email, Batch: s.batch, Fees: s.fees, 'Fee Status': s.feeStatus || 'PENDING' }));
            const ws = utils.json_to_sheet(data);
            const wb = utils.book_new();
            utils.book_append_sheet(wb, ws, 'Students');
            writeFile(wb, `EduTrack_Students_${new Date().toISOString().slice(0, 10)}.xlsx`);
            toast.success('Excel downloaded!');
        } catch { toast.error('Install xlsx: npm install xlsx'); }
    };

    const filteredStudents = students.filter(s =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase()) ||
        s.batch?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-800">Student Directory</h2>
                    <p className="text-slate-500 font-medium text-sm">Manage students and their login access.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                            className="bg-white border border-slate-200 rounded-2xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-48" />
                    </div>
                    <button onClick={exportExcel} disabled={students.length === 0}
                        className="bg-white text-emerald-600 border border-emerald-200 px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-50 transition-all shadow-sm disabled:opacity-50">
                        <FileDown size={18} /> Excel
                    </button>
                    <button onClick={generateAllReport} disabled={generating || students.length === 0}
                        className="bg-white text-indigo-600 border border-indigo-200 px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-sm disabled:opacity-50">
                        <FileDown size={18} /> {generating ? 'Generating...' : 'PDF'}
                    </button>
                    <button onClick={() => { setShowModal(true); setEditId(null); setFormData({ name: '', email: '', batch: '', fees: 0, feeStatus: 'PENDING' }); }}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                        <UserPlus size={20} /> Add New
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            <th className="px-10 py-5">Full Name</th>
                            <th className="px-10 py-5">Batch</th>
                            <th className="px-10 py-5">Fees</th>
                            <th className="px-10 py-5">Fee Status</th>
                            <th className="px-10 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredStudents.length === 0 ? (
                            <tr><td colSpan={5} className="px-10 py-12 text-center text-slate-400 font-medium">
                                {search ? 'No students match your search.' : 'No students added yet.'}
                            </td></tr>
                        ) : filteredStudents.map(s => (
                            <tr key={s.id} className="group hover:bg-slate-50 transition-colors">
                                <td className="px-10 py-6">
                                    <p className="font-bold text-slate-800">{s.name}</p>
                                    <p className="text-xs text-slate-400 font-medium">{s.email}</p>
                                </td>
                                <td className="px-10 py-6">
                                    <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl font-bold text-xs">{s.batch}</span>
                                </td>
                                <td className="px-10 py-6">
                                    <p className="text-sm font-black text-slate-800">₹{Number(s.fees).toLocaleString()}</p>
                                </td>
                                <td className="px-10 py-6">
                                    <button onClick={() => toggleFeeStatus(s)}
                                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${s.feeStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-rose-50 text-rose-500 hover:bg-rose-100'}`}>
                                        {s.feeStatus === 'PAID' ? '✓ Paid' : '⚠ Pending'}
                                    </button>
                                </td>
                                <td className="px-10 py-6 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setLoginForm({ email: s.email, password: '' }); setShowLoginModal(true); }}
                                            className="p-2.5 text-amber-500 hover:bg-amber-50 rounded-xl transition-all" title="Give Login"><Key size={18} /></button>
                                        <button onClick={() => { setEditId(s.id); setFormData(s); setShowModal(true); }}
                                            className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Edit"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDelete(s)}
                                            className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all" title="Delete"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[3rem] p-12 w-full max-w-lg shadow-2xl">
                        <h3 className="text-2xl font-black text-slate-800 mb-8">{editId ? 'Modify Student' : 'New Admission'}</h3>
                        <form onSubmit={handleSave} className="space-y-6">
                            <InputField label="Name" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />
                            <InputField label="Email" type="email" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} />
                            <div className="grid grid-cols-2 gap-6">
                                <InputField label="Batch Code" value={formData.batch} onChange={v => setFormData({ ...formData, batch: v })} />
                                <InputField label="Fees (₹)" type="number" value={formData.fees} onChange={v => setFormData({ ...formData, fees: v })} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fee Status</label>
                                <select className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-slate-800"
                                    value={formData.feeStatus} onChange={e => setFormData({ ...formData, feeStatus: e.target.value })}>
                                    <option value="PENDING">Pending</option>
                                    <option value="PAID">Paid</option>
                                </select>
                            </div>
                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 text-slate-400 font-bold">Cancel</button>
                                <button type="submit" className="flex-[2] bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-indigo-600 transition-all">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showLoginModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[3rem] p-12 w-full max-w-md shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-amber-50 p-2 rounded-xl"><Key size={20} className="text-amber-500" /></div>
                            <h3 className="text-2xl font-black text-slate-800">Give Login Access</h3>
                        </div>
                        <form onSubmit={handleGiveLogin} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Student Email</label>
                                <input type="email" value={loginForm.email} readOnly
                                    className="w-full bg-slate-100 rounded-2xl p-4 font-bold text-slate-500 outline-none cursor-not-allowed" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Set Password</label>
                                <input type="password" placeholder="Min 6 characters" value={loginForm.password}
                                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 outline-none font-bold text-slate-800"
                                    required minLength={6} />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowLoginModal(false)} className="flex-1 text-slate-400 font-bold">Cancel</button>
                                <button type="submit" className="flex-[2] bg-amber-500 text-white font-bold py-4 rounded-2xl hover:bg-amber-600 transition-all">Create Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const InputField = ({ label, type = 'text', value, onChange }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <input type={type} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 outline-none font-bold text-slate-800"
            value={value} onChange={e => onChange(e.target.value)} required />
    </div>
);

export default StudentManagement;