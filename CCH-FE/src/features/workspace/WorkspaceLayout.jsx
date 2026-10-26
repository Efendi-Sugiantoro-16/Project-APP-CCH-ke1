import { useContext, useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Bell, Headset, LogOut, Menu, Search, ShieldCheck, X } from 'lucide-react'
import { AuthContext } from '../../features/auth/auth-context.js'
import { SidebarFooter, WorkspaceSidebar } from '../../features/workspace/WorkspaceSidebar.jsx'

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(timer)
  }, [])
  return now
}

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
const timeFmt = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' })

function Topbar({ onOpenSidebar }) {
  const now = useClock()
  const { isAuthenticated, logout } = useContext(AuthContext)

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="btn-ghost rounded-lg p-2 lg:hidden"
          aria-label="Buka menu"
          onClick={onOpenSidebar}
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:block">
          <h1 className="text-xl font-bold text-slate-800">Workspace Pengaduan</h1>
          <p className="text-xs text-slate-500">Pantau tiket dan follow-up kantor Anda.</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Cari tiket…"
            className="input w-64 pl-9"
            aria-label="Cari tiket"
          />
        </div>
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <button type="button" className="relative rounded-full p-2 text-slate-500 transition hover:bg-slate-100" aria-label="Notifikasi">
            <Bell size={18} />
          </button>
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold text-slate-800">{dateFmt.format(now)}</p>
            <p className="text-[10px] text-slate-500">{timeFmt.format(now)} WIB</p>
          </div>
          {isAuthenticated ? (
            <button
              type="button"
              className="rounded-full p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
              aria-label="Keluar dari sesi staf"
              onClick={logout}
            >
              <LogOut size={18} />
            </button>
          ) : (
            <Link to="/login" className="btn btn-secondary btn-sm">
              <ShieldCheck size={14} /> Sesi staf
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

function SidebarBrand() {
  return (
    <Link to="/workspace" className="flex h-20 items-center gap-3 border-b border-slate-800/50 px-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
        <Headset size={20} />
      </span>
      <span className="text-2xl font-bold tracking-wide text-white">
        POS <span className="font-light text-blue-400">CCH</span>
      </span>
    </Link>
  )
}

/** Dark sidebar shell used by every /workspace route. */
export function WorkspaceLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // The mobile drawer is closed by its own nav/overlay handlers rather than a
  // route effect, avoiding a cascading render on every navigation.
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-800">
      {/* Desktop sidebar */}
      <aside className="z-20 hidden w-64 flex-col bg-slate-900 text-slate-300 shadow-xl md:flex">
        <SidebarBrand />
        <WorkspaceSidebar />
        <SidebarFooter />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative flex h-full w-64 flex-col bg-slate-900 text-slate-300 shadow-2xl">
            <button
              type="button"
              className="absolute right-3 top-5 rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              aria-label="Tutup menu"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={18} />
            </button>
            <SidebarBrand />
            <WorkspaceSidebar onNavigate={() => setSidebarOpen(false)} />
            <SidebarFooter />
          </aside>
        </div>
      ) : null}

      <main className="flex flex-1 flex-col overflow-hidden">
        <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
        <div className="flex-1 overflow-y-auto p-4 pb-20 lg:p-8">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}