import React, { useState } from 'react';
import { 
  User, Phone, Mail, MapPin, 
  Package, AlertTriangle, FileText, 
  Send, X, Building2, Ticket,
  LayoutDashboard, Inbox, LineChart, Settings, Bell, Search, Plus, Sliders
} from 'lucide-react';

const MOCK_STATS = [
  { id: 1, title: "Draft Menunggu CS", value: "2", icon: Ticket, color: "text-sky-500", bg: "bg-sky-50" },
  { id: 2, title: "Pengaduan Diterima", value: "15", icon: Inbox, color: "text-amber-500", bg: "bg-amber-50" },
  { id: 3, title: "Pengaduan Terbuka", value: "15", icon: LayoutDashboard, color: "text-orange-500", bg: "bg-orange-50" },
  { id: 4, title: "Selesai Seluruhnya", value: "342", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-50" }
];

const INITIAL_COMPLAINTS = [
  { id: "40005CC202609291539", name: "Bapak Budi", phone: "0812345678", office: "KEDIRI 64100", source: "Live Chat", summary: "Paket masih belum diterima, padahal status delivered.", status: "ENTRI", date: "29 Sep 2026" },
  { id: "40005CC202609281528", name: "Ibu Siti N.", phone: "0857123991", office: "JAKARTA 10000", source: "Berita Online", summary: "Barang rusak akibat pengemasan buruk.", status: "KONFIRMASI", date: "28 Sep 2026" },
  { id: "40005CC202609280802", name: "Toko Harapan", phone: "0819998887", office: "BATU 65300", source: "Call Center", summary: "Alamat salah kirim ke tetangga.", status: "ENTRI", date: "28 Sep 2026" },
  { id: "40005CC202609280757", name: "Hengky Indra", phone: "0878888745", office: "BANDUNG 40000", source: "Live Chat", summary: "Resi tidak bisa dilacak di sistem.", status: "SELESAI", date: "28 Sep 2026" }
];

function Sidebar({ activeMenu, setActiveMenu }) {
  const menus = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pengaduan', label: 'Pengaduan', icon: Inbox },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col hidden md:flex z-20 shadow-xl">
      <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3 text-white font-bold text-2xl tracking-wide">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Ticket className="text-white" size={20} />
          </div>
          POS <span className="text-blue-500 font-light">CCH</span>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Monitoring</p>
        {menus.map((m) => {
          const IconComponent = m.icon;
          const isActive = activeMenu === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMenu(m.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <IconComponent size={20} /> {m.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800/50">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold border-2 border-slate-600">
            EF
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Efendi Dev</p>
            <p className="text-xs text-blue-400">CS Lead Dev</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Header({ searchQuery, setSearchQuery }) {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 z-10 sticky top-0">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Utama</h1>
        <p className="text-sm text-slate-500">Pantau performa layanan pengaduan pelanggan secara real-time.</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-slate-400" size={16} />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID, Nama, atau Ringkasan..." 
            className="pl-10 pr-4 py-2.5 bg-slate-100 border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm w-72 outline-none shadow-inner"
          />
        </div>
        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
          <button className="w-10 h-10 rounded-full hover:bg-slate-100 text-slate-500 transition flex items-center justify-center relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
}

function MetricCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {MOCK_STATS.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">{stat.title}</p>
              <h4 className="text-3xl font-bold text-slate-800">{stat.value}</h4>
            </div>
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
              <Icon size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CreateTicketModal({ isOpen, onClose, onAddComplaint }) {
  const [formData, setFormData] = useState({
    nama: '', phone: '', email: '', alamat: '', resi: '', jenisKiriman: 'POS REGULER', jenisPengaduan: 'Keterlambatan', ringkasan: '', uraian: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComplaint = {
      id: "40005CC" + Date.now().toString().slice(-10),
      name: formData.nama,
      phone: formData.phone,
      office: "HALOPOSCARE 40005CC",
      source: "Live Chat",
      summary: formData.ringkasan,
      status: "ENTRI",
      date: "Baru Saja"
    };
    onAddComplaint(newComplaint);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Buat Pengaduan Baru</h2>
            <p className="text-xs text-slate-500 mt-0.5">Isi detail keluhan pelanggan di bawah ini. Tanda (*) wajib diisi.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-500 flex items-center justify-center transition">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Data Pelanggan & Lokasi</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Pelanggan *</label>
              <input type="text" required placeholder="Ketik nama..." value={formData.nama} onChange={e=>setFormData({...formData, nama: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nomor HP *</label>
              <input type="tel" required placeholder="08..." value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Alamat Lengkap</label>
              <textarea rows="2" placeholder="Alamat..." value={formData.alamat} onChange={e=>setFormData({...formData, alamat: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Detail Kiriman & Keluhan</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nomor Resi / Kiriman *</label>
              <input type="text" required placeholder="Cth: P2510..." value={formData.resi} onChange={e=>setFormData({...formData, resi: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Ringkasan (Subjek) *</label>
              <input type="text" required placeholder="Cth: Paket belum diterima..." value={formData.ringkasan} onChange={e=>setFormData({...formData, ringkasan: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Uraian Detail Keluhan *</label>
              <textarea required rows="3" placeholder="Ceritakan detail..." value={formData.uraian} onChange={e=>setFormData({...formData, uraian: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
            </div>
          </div>
          <div className="md:col-span-2 pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition">Batal</button>
            <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition flex items-center gap-2"><Send size={16} /> Simpan Pengaduan</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);

  const filteredComplaints = complaints.filter(item => 
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans text-slate-800">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-20">
          <MetricCards />

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Daftar Pengaduan Terbaru</h2>
                <p className="text-xs text-slate-500 mt-1">Data tersinkronisasi dari seluruh cabang operasional.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-md flex items-center gap-2 transition"
              >
                <Plus size={16} /> Tiket Baru
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="p-5 font-semibold">ID Pengaduan</th>
                    <th className="p-5 font-semibold">Pelanggan</th>
                    <th className="p-5 font-semibold">Tujuan / Sumber</th>
                    <th className="p-5 font-semibold">Ringkasan</th>
                    <th className="p-5 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {filteredComplaints.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-5 font-mono text-sm font-semibold text-blue-600">{item.id}</td>
                      <td className="p-5">
                        <div className="font-medium text-slate-800">{item.name}</div>
                        <div className="text-xs text-slate-500">{item.phone}</div>
                      </td>
                      <td className="p-5">
                        <div className="font-medium text-slate-700">{item.office}</div>
                        <div className="text-xs text-slate-500">{item.source}</div>
                      </td>
                      <td className="p-5"><p className="text-sm text-slate-600 max-w-xs">{item.summary}</p></td>
                      <td className="p-5 text-center">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wide ${
                          item.status === 'ENTRI' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                          item.status === 'KONFIRMASI' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                          'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <CreateTicketModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddComplaint={(newC) => setComplaints([newC, ...complaints])} 
      />
    </div>
  );
}