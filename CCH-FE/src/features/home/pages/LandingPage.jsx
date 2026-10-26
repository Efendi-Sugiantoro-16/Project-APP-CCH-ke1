import { Link } from 'react-router-dom'
import { 
  HeadsetIcon, 
  MailIcon, 
  TrendingUpIcon, 
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowRightIcon
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <HeadsetIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">CCH System</div>
                <div className="text-xs text-slate-500">PT Pos Indonesia</div>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <Link 
                to="/intake" 
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
              >
                Lapor Keluhan
              </Link>
              <Link 
                to="/login" 
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
              >
                Login Staf
              </Link>
              <Link 
                to="/dev-login" 
                className="btn btn-primary btn-sm"
              >
                Dev Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-6">
              <ShieldCheckIcon className="w-4 h-4" />
              Customer Complaint Handling
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Sistem Penanganan Keluhan Pelanggan
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Platform terintegrasi untuk mengelola keluhan pelanggan dengan cepat, transparan, dan efisien. 
              Tingkatkan kepuasan pelanggan dengan sistem Customer Complaint Handling PT Pos Indonesia.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/intake" 
                className="btn btn-primary inline-flex items-center gap-2 px-6 py-3 text-base"
              >
                <MailIcon className="w-5 h-5" />
                Laporkan Keluhan
              </Link>
              <Link 
                to="/login" 
                className="btn btn-secondary inline-flex items-center gap-2 px-6 py-3 text-base"
              >
                Login Staf
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="panel bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUpIcon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold">98%</div>
              </div>
              <div className="text-sm font-medium opacity-90">Tingkat Penyelesaian</div>
            </div>
            
            <div className="panel bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold">24j</div>
              </div>
              <div className="text-sm font-medium opacity-90">Rata-rata Respons</div>
            </div>
            
            <div className="panel bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold">50K+</div>
              </div>
              <div className="text-sm font-medium opacity-90">Keluhan Terselesaikan</div>
            </div>
            
            <div className="panel bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold">4.8/5</div>
              </div>
              <div className="text-sm font-medium opacity-90">Rating Kepuasan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Fitur Unggulan</h2>
          <p className="text-lg text-slate-600">
            Sistem lengkap untuk penanganan keluhan pelanggan yang efektif
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="panel hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <MailIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Pelaporan Mudah</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Laporkan keluhan kapan saja, dimana saja melalui platform online yang mudah digunakan. 
              Tidak perlu datang ke kantor pos.
            </p>
          </div>

          <div className="panel hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <ClockIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Tracking Real-time</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Pantau status penanganan keluhan Anda secara real-time. Dapatkan notifikasi update 
              setiap ada perkembangan.
            </p>
          </div>

          <div className="panel hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheckIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Aman & Terpercaya</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Data Anda tersimpan dengan aman. Sistem terenkripsi dan terintegrasi dengan 
              database resmi PT Pos Indonesia.
            </p>
          </div>

          <div className="panel hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <UsersIcon className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Tim Profesional</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ditangani oleh Customer Service Officer berpengalaman yang siap membantu 
              menyelesaikan keluhan Anda.
            </p>
          </div>

          <div className="panel hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUpIcon className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Analitik Lengkap</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Dashboard lengkap untuk monitoring dan analisis tren keluhan. Bantu kami 
              meningkatkan layanan.
            </p>
          </div>

          <div className="panel hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
              <CheckCircleIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Follow-up Otomatis</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Sistem follow-up otomatis memastikan setiap keluhan mendapat penanganan hingga 
              tuntas dan selesai.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="panel bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Melaporkan Keluhan?</h2>
          <p className="text-lg mb-8 opacity-90">
            Kami siap membantu menyelesaikan masalah Anda dengan cepat dan profesional
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/intake" 
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-blue-600 font-semibold hover:bg-blue-50 transition"
            >
              <MailIcon className="w-5 h-5" />
              Buat Laporan Sekarang
            </Link>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-white text-white font-semibold hover:bg-white/10 transition"
            >
              Login sebagai Staf
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="text-sm text-slate-600">
              © 2026 PT Pos Indonesia. Customer Complaint Handling System.
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition">
                Tentang
              </a>
              <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition">
                Bantuan
              </a>
              <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition">
                Kontak
              </a>
              <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition">
                Privasi
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
