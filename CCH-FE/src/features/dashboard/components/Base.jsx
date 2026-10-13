import React, { useState } from 'react';
import { 
  LayoutDashboard, Inbox, BarChart3, Settings, 
  Search, Bell, UserCircle, Plus, Filter,
  MoreVertical, User, Phone, Mail, MapPin, 
  Package, AlertTriangle, FileText, Send, X, Building2, Ticket, CheckCircle2, Clock
} from 'lucide-react';

const MOCK_STATS = [
  { title: "Open Tickets", value: "45", icon: <Ticket size={24} />, color: "text-blue-600", bg: "bg-blue-50" },
  { title: "In Progress", value: "28", icon: <Clock size={24} />, color: "text-amber-600", bg: "bg-amber-50" },
  { title: "Resolved Today", value: "123", icon: <CheckCircle2 size={24} />, color: "text-emerald-600", bg: "bg-emerald-50" },
  { title: "Avg. Resolution", value: "24h", icon: <BarChart3 size={24} />, color: "text-purple-600", bg: "bg-purple-50" }
];

const MOCK_COMPLAINTS = [
  { id: "#CR45921", customer: "Lisa A.", issue: "Refund Issue", status: "Open", priority: "High", date: "2h ago" },
  { id: "#CR45918", customer: "John D.", issue: "Delivery Delay", status: "In Progress", priority: "Medium", date: "5h ago" },
  { id: "#CR45915", customer: "Mark S.", issue: "Broken Item", status: "Resolved", priority: "Low", date: "1d ago" },
  { id: "#CR45911", customer: "Sarah B.", issue: "Lost Package", status: "Open", priority: "High", date: "1d ago" },
];

// --- KOMPONEN KECIL: BADGE STATUS & PRIORITAS ---
const StatusBadge = ({ status }) => {
  const styles = {
    "Open": "bg-blue-50 text-blue-700 border-blue-200",
    "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
    "Resolved": "bg-emerald-50 text-emerald-700 border-emerald-200"
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const styles = {
    "High": "text-red-600 bg-red-50",
    "Medium": "text-amber-600 bg-amber-50",
    "Low": "text-slate-600 bg-slate-100"
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${styles[priority]}`}>
      {priority}
    </span>
  );
};

// --- KOMPONEN SIDEBAR ---
const Sidebar = () => (
  <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex transition-all">
    <div className="h-16 flex items-center px-6 border-b border-slate-800">
      <div className="flex items-center gap-2 text-white font-bold text-xl tracking-wide">
        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
          <Ticket size={18} />
        </div>
        Resolve<span className="font-light">Hub</span>
      </div>
    </div>
    <nav className="flex-1 px-4 py-6 space-y-2">
      <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Monitoring</p>
      <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow-md shadow-blue-900/20">
        <LayoutDashboard size={20} /> Dashboard
      </a>
      <a href="#" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-colors">
        <Inbox size={20} /> All Complaints
      </a>
      <a href="#" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-colors">
        <BarChart3 size={20} /> Analytics
      </a>
      <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-8">System</p>
      <a href="#" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800 hover:text-white rounded-lg font-medium transition-colors">
        <Settings size={20} /> Settings
      </a>
    </nav>
  </aside>
);

// --- KOMPONEN HEADER ---
const Header = () => (
  <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 sticky top-0">
    <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 w-96 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
      <Search size={18} className="text-slate-400" />
      <input type="text" placeholder="Search ticket ID or customer..." className="bg-transparent border-none outline-none ml-2 w-full text-sm text-slate-700" />
    </div>
    <div className="flex items-center gap-4">
      <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
        <Bell size={20} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      </button>
      <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
        <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
          ED
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-semibold text-slate-700 leading-tight">Efendi Dev</p>
          <p className="text-xs text-slate-500">CS Manager</p>
        </div>
      </div>
    </div>
  </header>
);

// --- KOMPONEN MODAL (Form Tambah Tiket) ---
const CreateTicketModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      {/* Container Form (Mirip yang kita buat di sesi sebelumnya) */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Ticket className="text-blue-600" size={20} /> Buat Pengaduan Baru
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 text-slate-400 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body Form (Scrollable) */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Kolom Kiri */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                <User size={16} className="text-slate-400"/> Data Pelanggan
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">ID Pengaduan</label>
                  <input type="text" value="AUTO-GENERATE" disabled className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Kantor Asal</label>
                  <input type="text" value="HALOPOS 40005" disabled className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nama Pelanggan *</label>
                <input type="text" placeholder="Ketik nama..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nomor HP *</label>
                  <input type="tel" placeholder="08..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" placeholder="@" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Package size={16} className="text-slate-400"/> Detail Kiriman
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nomor Resi *</label>
                  <input type="text" placeholder="P2510..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Jenis Layanan *</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option>POS NEXTDAY</option>
                    <option>POS REGULER</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Kategori Pengaduan *</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>Keterlambatan Kiriman</option>
                  <option>Barang Rusak</option>
                  <option>Gagal Antar</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Uraian Keluhan *</label>
                <textarea rows="3" placeholder="Ceritakan detail..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            Batal
          </button>
          <button 
            onClick={() => {
              alert("Data dikirim ke Golang Backend (Si Bolang)!");
              onClose();
            }} 
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
          >
            <Send size={16} /> Simpan
          </button>
        </div>

      </div>
    </div>
  );
};

// --- KOMPONEN UTAMA (App) ---
export default function App() {
  // State untuk mengontrol Pop-up form tambah tiket
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      {/* Render Sidebar */}
      <Sidebar />

      {/* Render Main Area */}
      <main className="flex-1 flex flex-col h-full relative">
        <Header />

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          
          {/* Section: Welcome & Stats */}
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Overview Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Pantau performa layanan pengaduan pelanggan hari ini.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_STATS.map((stat, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Section: Table Area */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-lg font-bold text-slate-800">Daftar Pengaduan Terbaru</h2>
              
              <div className="flex gap-2">
                <button className="px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 font-medium flex items-center gap-2 transition-colors">
                  <Filter size={16} /> Filter
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
                >
                  <Plus size={16} /> Tiket Baru
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="px-6 py-4 font-semibold">ID Pengaduan</th>
                    <th className="px-6 py-4 font-semibold">Pelanggan</th>
                    <th className="px-6 py-4 font-semibold">Kategori Keluhan</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Prioritas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {MOCK_COMPLAINTS.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-mono font-semibold text-blue-600">{item.id}</span>
                        <div className="text-xs text-slate-400 mt-0.5">{item.date}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">{item.customer}</td>
                      <td className="px-6 py-4 text-slate-600">{item.issue}</td>
                      <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                      <td className="px-6 py-4 flex items-center justify-end gap-3">
                        <PriorityBadge priority={item.priority} />
                        <button className="text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {/* Render Modal Tambah Tiket di atas AppShell */}
      <CreateTicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </div>
  );
}