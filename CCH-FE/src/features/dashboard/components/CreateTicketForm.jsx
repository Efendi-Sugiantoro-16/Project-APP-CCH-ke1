import React, { useState } from 'react';
import { 
  User, Phone, Mail, MapPin, 
  Package, AlertTriangle, FileText, 
  Send, X, Building2, Ticket
} from 'lucide-react';

const CreateTicketForm = () => {
  // Simulasi state sederhana buat nampung data form
  const [formData, setFormData] = useState({
    nama: '',
    phone: '',
    email: '',
    alamat: '',
    resi: '',
    jenisKiriman: '',
    jenisPengaduan: '',
    ringkasan: '',
    uraian: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Di dunia nyata, ini bakal nembak API Golang (Si Bolang)
    console.log("Data siap dikirim ke Si Bolang:", formData);
    alert("Simulasi: Tiket Berhasil Dibuat! (Cek Console log)");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-w-5xl mx-auto">
      
      {/* Header Form */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Ticket className="text-blue-600" size={24} />
            Buat Pengaduan Baru
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Isi detail informasi pelanggan dan keluhan. Tanda (*) wajib diisi.
          </p>
        </div>
        <button className="w-10 h-10 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Body Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          
          {/* KOLOM KIRI: Data Identitas & Lokasi */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
              <User className="text-blue-500" size={18} />
              <h3 className="font-bold text-slate-700">Data Pelanggan & Lokasi</h3>
            </div>

            {/* Field Otomatis (Disabled) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">ID Pengaduan (Auto)</label>
                <input 
                  type="text" 
                  value="40005CC-NEW" 
                  disabled 
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Kantor Asal</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    value="HALOPOSCARE 40005CC" 
                    disabled 
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-600 font-medium cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Field Input Pelanggan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Pelanggan <span className="text-red-500">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" name="nama" required
                  placeholder="Ketik nama pelanggan..." 
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nomor HP <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="tel" name="phone" required
                    placeholder="08..." 
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="email" name="email"
                    placeholder="email@contoh.com" 
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Alamat Lengkap</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                <textarea 
                  name="alamat" rows="2"
                  placeholder="Ketik alamat pengiriman..." 
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: Data Paket & Uraian Keluhan */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
              <Package className="text-amber-500" size={18} />
              <h3 className="font-bold text-slate-700">Detail Kiriman & Keluhan</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nomor Kiriman / Resi <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="resi" required
                  placeholder="Cth: P2510..." 
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Jenis Kiriman <span className="text-red-500">*</span></label>
                <select 
                  name="jenisKiriman" required onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                >
                  <option value="">Pilih Layanan...</option>
                  <option value="POS NEXTDAY">POS NEXTDAY</option>
                  <option value="POS REGULER">POS REGULER</option>
                  <option value="RETAIL PKH">RETAIL PKH</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kategori Pengaduan <span className="text-red-500">*</span></label>
              <div className="relative">
                <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select 
                  name="jenisPengaduan" required onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                >
                  <option value="">Pilih Kategori...</option>
                  <option value="Keterlambatan">Keterlambatan Kiriman</option>
                  <option value="Gagal Antar">Gagal Antar / Alamat Tidak Ditemukan</option>
                  <option value="Barang Rusak">Barang Rusak / Cacat</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subjek / Ringkasan <span className="text-red-500">*</span></label>
              <input 
                type="text" name="ringkasan" required
                placeholder="Cth: Paket belum diterima padahal status Delivered" 
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Uraian Detail <span className="text-red-500">*</span></label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-slate-400" size={16} />
                <textarea 
                  name="uraian" required rows="4"
                  placeholder="Ceritakan detail keluhan pelanggan di sini secara lengkap..." 
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                ></textarea>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end gap-3">
          <button 
            type="button" 
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Send size={16} /> Simpan Pengaduan
          </button>
        </div>
      </form>

    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-800 flex items-center justify-center">
      <div className="w-full">
        <CreateTicketForm />
      </div>
    </div>
  );
}