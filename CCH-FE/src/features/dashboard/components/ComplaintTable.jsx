import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const DUMMY_DATA = [
  { id: "40005CC-20260929-001", customer: "Lisa Paradila", issue: "Paket Belum Diterima", status: "ENTRI", priority: "High", date: "Hari ini, 10:30 WIB" },
  { id: "40005CC-20260929-002", customer: "Budi Santoso", issue: "Barang Rusak", status: "KONFIRMASI", priority: "Medium", date: "Kemarin, 14:15 WIB" },
  { id: "40005CC-20260928-088", customer: "PT Maju Mundur", issue: "Salah Alamat", status: "SELESAI", priority: "Low", date: "28 Sep 2026" },
  { id: "40005CC-20260928-045", customer: "Siti Nurhaliza", issue: "Keterlambatan Ekspedisi", status: "ENTRI", priority: "High", date: "28 Sep 2026" },
  { id: "40005CC-20260927-012", customer: "Toko Harapan", issue: "Resi Tidak Terlacak", status: "SELESAI", priority: "Medium", date: "27 Sep 2026" },
];

const StatusBadge = ({ status }) => {
  const styles = {
    ENTRI: "bg-red-50 text-red-600 border-red-200",
    KONFIRMASI: "bg-amber-50 text-amber-600 border-amber-200",
    SELESAI: "bg-emerald-50 text-emerald-600 border-emerald-200"
  };
  
  const icons = {
    ENTRI: <AlertCircle size={14} className="mr-1.5" />,
    KONFIRMASI: <Loader2 size={14} className="mr-1.5 animate-spin-slow" />,
    SELESAI: <CheckCircle2 size={14} className="mr-1.5" />
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
      {icons[status]}
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const styles = {
    High: "text-red-600 bg-red-100/50",
    Medium: "text-amber-600 bg-amber-100/50",
    Low: "text-slate-500 bg-slate-100"
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${styles[priority]}`}>
      {priority}
    </span>
  );
};

const ComplaintTable = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header Tabel */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Daftar Pengaduan</h2>
          <p className="text-xs text-slate-500 mt-1">Data tiket terbaru dari seluruh channel layanan.</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari ID atau nama..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <button className="px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 flex items-center gap-2 transition-colors text-sm font-medium">
            <Filter size={16} /> <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      {/* Body Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
              <th className="p-4 font-semibold whitespace-nowrap">ID Pengaduan</th>
              <th className="p-4 font-semibold">Pelanggan</th>
              <th className="p-4 font-semibold">Uraian Keluhan</th>
              <th className="p-4 font-semibold text-center">Status</th>
              <th className="p-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {data.map((ticket, index) => (
              <tr key={index} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                {/* Kolom ID & Tanggal */}
                <td className="p-4 align-top">
                  <div className="font-mono text-sm font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                    {ticket.id}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <Clock size={12} /> {ticket.date}
                  </div>
                </td>
                
                {/* Kolom Pelanggan */}
                <td className="p-4 align-top">
                  <div className="font-semibold text-slate-800">{ticket.customer}</div>
                  <div className="mt-1">
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                </td>
                
                {/* Kolom Isu */}
                <td className="p-4 align-top">
                  <p className="text-slate-600 font-medium line-clamp-2 max-w-xs">
                    {ticket.issue}
                  </p>
                </td>
                
                {/* Kolom Status */}
                <td className="p-4 align-top text-center">
                  <StatusBadge status={ticket.status} />
                </td>
                
                {/* Kolom Aksi */}
                <td className="p-4 align-top text-right">
                  <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer Tabel (Pagination Mock) */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center text-xs text-slate-500">
        <span>Menampilkan 5 dari 142 data</span>
        <div className="flex gap-1">
          <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white transition-colors disabled:opacity-50">Prev</button>
          <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium shadow-sm shadow-blue-500/20">1</button>
          <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white transition-colors">2</button>
          <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Sederhana buat konteks */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-slate-900/20">
            CH
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Preview Komponen</h1>
            <p className="text-sm text-slate-500">Fitur: ComplaintTable.jsx</p>
          </div>
        </div>

        {/* Panggil komponen tabelnya */}
        <ComplaintTable data={DUMMY_DATA} />

      </div>
    </div>
  );
}