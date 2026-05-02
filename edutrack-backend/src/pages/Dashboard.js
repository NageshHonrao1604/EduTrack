import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Users, BookOpen, Wallet, ArrowUpRight, TrendingUp, FileDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({ count: 0, fees: 0, batches: 0, pending: 0 });
    const [chartData, setChartData] = useState([]);
    const [generating, setGenerating] = useState(false);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        api.get('/batches').then(res => {
            const data = res.data;
            setStudents(data);

            // Stats
            const batchSet = [...new Set(data.map(x => x.batch).filter(Boolean))];
            const pending = data.filter(s => s.feeStatus === 'PENDING').length;
            setStats({
                count: data.length,
                fees: data.reduce((a, b) => a + b.fees, 0),
                batches: batchSet.length,
                pending
            });

            // Chart data — students per batch
            const batchMap = {};
            data.forEach(s => {
                const b = s.batch || 'Unknown';
                batchMap[b] = (batchMap[b] || 0) + 1;
            });
            setChartData(Object.entries(batchMap).map(([batch, count]) => ({ batch, count })));
        });
    }, []);

    const generateReport = async () => {
        setGenerating(true);
        try {
            const { jsPDF } = await import('jspdf');
            const { default: autoTable } = await import('jspdf-autotable');
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

            doc.setFillColor(67, 56, 202);
            doc.rect(0, 0, pageWidth, 32, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(18); doc.setFont('helvetica', 'bold');
            doc.text('EduTrack', 14, 13);
            doc.setFontSize(9); doc.setFont('helvetica', 'normal');
            doc.text('Admin Portal v1.0', 14, 21);
            doc.text(`Generated: ${today}`, pageWidth - 14, 21, { align: 'right' });

            doc.setTextColor(30, 30, 30);
            doc.setFontSize(16); doc.setFont('helvetica', 'bold');
            doc.text('Student Report', 14, 48);
            doc.setDrawColor(67, 56, 202); doc.setLineWidth(0.8);
            doc.line(14, 51, pageWidth - 14, 51);

            const cardData = [
                { label: 'Total Students', value: String(stats.count) },
                { label: 'Course Batches', value: String(stats.batches) },
                { label: 'Total Revenue', value: `Rs. ${stats.fees.toLocaleString('en-IN')}` },
                { label: 'Pending Fees', value: String(stats.pending) },
            ];
            doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 100, 100);
            doc.text('SUMMARY', 14, 62);
            cardData.forEach((card, i) => {
                const x = 14 + i * 46;
                doc.setFillColor(238, 242, 255);
                doc.roundedRect(x, 66, 40, 22, 3, 3, 'F');
                doc.setTextColor(80, 80, 80); doc.setFontSize(7); doc.setFont('helvetica', 'normal');
                doc.text(card.label, x + 3, 73);
                doc.setTextColor(30, 30, 30); doc.setFontSize(10); doc.setFont('helvetica', 'bold');
                doc.text(card.value, x + 3, 83);
            });

            const batchMap = {};
            students.forEach(s => {
                if (!batchMap[s.batch]) batchMap[s.batch] = { count: 0, fees: 0 };
                batchMap[s.batch].count += 1;
                batchMap[s.batch].fees += s.fees;
            });
            doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 100, 100);
            doc.text('BATCH BREAKDOWN', 14, 102);
            autoTable(doc, {
                startY: 106,
                head: [['Batch', 'Students', 'Total Fees (Rs.)', 'Paid', 'Pending']],
                body: Object.entries(batchMap).map(([batch, data]) => {
                    const batchStudents = students.filter(s => s.batch === batch);
                    const paid = batchStudents.filter(s => s.feeStatus === 'PAID').length;
                    return [batch || 'N/A', data.count, data.fees.toLocaleString('en-IN'), paid, data.count - paid];
                }),
                styles: { fontSize: 9, cellPadding: 4 },
                headStyles: { fillColor: [67, 56, 202], textColor: 255, fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [248, 248, 255] },
                margin: { left: 14, right: 14 },
            });

            const afterBatch = doc.lastAutoTable.finalY + 10;
            doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 100, 100);
            doc.text('STUDENT DIRECTORY', 14, afterBatch);
            autoTable(doc, {
                startY: afterBatch + 4,
                head: [['#', 'Name', 'Email', 'Batch', 'Fees', 'Status']],
                body: students.map((s, idx) => [
                    idx + 1, s.name || '-', s.email || '-', s.batch || '-',
                    `Rs. ${Number(s.fees).toLocaleString('en-IN')}`,
                    s.feeStatus || 'PENDING'
                ]),
                styles: { fontSize: 9, cellPadding: 4 },
                headStyles: { fillColor: [67, 56, 202], textColor: 255, fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [248, 248, 255] },
                margin: { left: 14, right: 14 },
            });

            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8); doc.setTextColor(160, 160, 160); doc.setFont('helvetica', 'normal');
                doc.text(`Page ${i} of ${pageCount}  |  EduTrack Admin Portal  |  Confidential`,
                    pageWidth / 2, doc.internal.pageSize.getHeight() - 8, { align: 'center' });
            }
            doc.save(`EduTrack_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (err) {
            console.error(err);
            alert('Report generation failed. Make sure jspdf and jspdf-autotable are installed.');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Total Students" value={stats.count} icon={<Users />} color="text-blue-600" bg="bg-blue-50" />
                <StatCard label="Course Batches" value={stats.batches} icon={<BookOpen />} color="text-indigo-600" bg="bg-indigo-50" />
                <StatCard label="Total Revenue" value={`₹${stats.fees.toLocaleString()}`} icon={<Wallet />} color="text-emerald-600" bg="bg-emerald-50" />
                <StatCard label="Pending Fees" value={stats.pending} icon={<TrendingUp />} color="text-rose-600" bg="bg-rose-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Real Bar Chart */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-800">Students per Batch</h3>
                        <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">
                            <TrendingUp size={16} /> Live Data
                        </div>
                    </div>
                    {chartData.length === 0 ? (
                        <div className="h-64 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-medium">
                            Add students to see chart
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="batch" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`${value} students`, 'Count']}
                                />
                                <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-4 leading-tight">Quick Actions</h3>
                        <p className="text-indigo-100 text-sm mb-8">
                            Generate a full student report with batch breakdown and revenue summary as PDF.
                        </p>
                        <button
                            onClick={generateReport}
                            disabled={generating}
                            className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all flex items-center gap-2 disabled:opacity-60"
                        >
                            {generating ? 'Generating...' : <><FileDown size={18} /> Export PDF Report</>}
                        </button>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color, bg }) => (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6">
        <div className={`${bg} ${color} p-4 rounded-2xl`}>{icon}</div>
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
        </div>
    </div>
);

export default Dashboard;