import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  CalendarCheck,
  CheckCircle2,
  Inbox,
  PackageCheck,
  RefreshCw,
  Send,
  Ticket,
  Plus,
} from 'lucide-react'
import { AuthContext } from '../../auth/auth-context.js'
import { complaintApi } from '../api/complaintApi.js'
import { followUpsApi } from '../../followups/api/followUpsApi.js'
import { PageHeader } from '../../../shared/ui/PageHeader.jsx'
import { StatCard } from '../../../shared/ui/StatCard.jsx'
import { Card, CardHeader } from '../../../shared/ui/Card.jsx'
import { Button } from '../../../shared/ui/Button.jsx'
import { StateBox } from '../../../shared/ui/StateBox.jsx'
import { StatusBadge } from '../components/StatusBadge.jsx'
import { ComplaintTable } from '../components/ComplaintTable.jsx'
import { QuickComplaintModal } from '../components/create/QuickComplaintModal.jsx'
import { formatDateTime } from '../format.js'
import { useWorkspaceApi } from '../useWorkspaceApi.js'

function useDashboard(token) {
  return useWorkspaceApi(
    () => {
      if (!token) return Promise.resolve({ counts: null, open: [], dueToday: [] })
      return Promise.all([
        complaintApi.countOpen(token),
        complaintApi.countReceivedOpen(token),
        complaintApi.countSentOpen(token),
        complaintApi.countCompleted(token),
        complaintApi.listOpen(token, { limit: 5 }),
        followUpsApi.listDueToday(token, { limit: 5 }),
      ]).then(([open, received, sent, completed, openList, dueToday]) => ({
        counts: { open, received, sent, completed },
        open: openList,
        dueToday,
      }))
    },
    [token],
  )
}

export function WorkspaceDashboard() {
  const { token } = useContext(AuthContext)
  const { data, loading, error, refresh } = useDashboard(token)
  const counts = data?.counts
  const open = data?.open || []
  const dueToday = data?.dueToday || []

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
      <PageHeader
        eyebrow="Call Center Workspace"
        title="Ringkasan pengaduan"
        subtitle="Pantau tiket terbuka, diterima, dikirim, dan selesai sesuai kebijakan kantor Anda."
        actions={
          <div className="d-flex gap-2">
            <button
              className="btn btn-success"
              onClick={() => setIsModalOpen(true)}
            >
              <i className="fas fa-plus mr-2"></i>
              Buat Pengaduan Baru
            </button>
            <Button variant="secondary" onClick={() => void refresh()}>
              <RefreshCw size={15} className={loading ? 'animate-spin-slow' : ''} />
              Muat ulang
            </Button>
          </div>
        }
      />

      {error ? (
        <div className="alert alert-error mb-6" role="alert">
          <span>{error}</span>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tiket terbuka" value={counts?.open} icon={Ticket} tone="brand" to="/workspace/complaints/open" />
        <StatCard label="Diterima" value={counts?.received} icon={Inbox} tone="sky" to="/workspace/complaints/received-open" />
        <StatCard label="Dikirim" value={counts?.sent} icon={Send} tone="indigo" to="/workspace/complaints/sent-open" />
        <StatCard label="Selesai" value={counts?.completed} icon={CheckCircle2} tone="green" to="/workspace/complaints/completed" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader
            title="Tiket terbuka terbaru"
            subtitle="Tiket aktif yang terlihat oleh kantor Anda."
            actions={
              <Link to="/workspace/complaints/open" className="btn btn-secondary btn-sm">
                Lihat semua
              </Link>
            }
          />
          <div className="p-1 sm:p-2">
            <StateBox
              loading={loading}
              loadingLabel="Memuat tiket terbuka…"
              isEmpty={!loading && open.length === 0}
              empty={<div className="state-box border-0 shadow-none">Tidak ada tiket terbuka.</div>}
            >
              <ComplaintTable items={open} variant="open" title="terbuka" />
            </StateBox>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Follow-up jatuh tempo"
              subtitle="Belum direalisasi hari ini."
              actions={
                <Link to="/workspace/follow-ups/due-today" className="btn btn-secondary btn-sm">
                  Lihat
                </Link>
              }
            />
            <div className="p-4">
              <StateBox
                loading={loading}
                loadingLabel="Memuat follow-up…"
                isEmpty={!loading && dueToday.length === 0}
                empty={
                  <div className="state-box border-0 shadow-none">
                    <PackageCheck size={22} className="text-slate-400" />
                    Tidak ada follow-up jatuh tempo.
                  </div>
                }
              >
                <ul className="space-y-3">
                  {dueToday.map((entry) => (
                    <li
                      key={`${entry.complaint_id}-${entry.office_code}-${entry.status_code}`}
                      className="flex items-start gap-3 rounded-xl border border-slate-100 p-3"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <CalendarCheck size={16} />
                      </span>
                      <div className="min-w-0">
                        <Link
                          to={`/workspace/complaints/open/${entry.complaint_id}`}
                          className="mono text-xs font-semibold text-blue-600 hover:text-blue-700"
                        >
                          {entry.complaint_id}
                        </Link>
                        <p className="mt-1 line-clamp-1 text-sm text-slate-600">
                          {entry.plan_notes || 'Tanpa catatan rencana.'}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {entry.office_code} · {formatDateTime(entry.planned_at)}
                        </p>
                      </div>
                      <StatusBadge code={entry.status_code} />
                    </li>
                  ))}
                </ul>
              </StateBox>
            </div>
          </Card>

          <Card>
            <CardHeader title="Akses cepat" />
            <div className="grid grid-cols-2 gap-3 p-4">
              <QuickLink to="/workspace/complaints/received-open" icon={Inbox} label="Diterima" />
              <QuickLink to="/workspace/complaints/sent-open" icon={Send} label="Dikirim" />
              <QuickLink to="/workspace/complaints/completed" icon={CheckCircle2} label="Selesai" />
              <QuickLink to="/workspace/follow-ups" icon={CalendarCheck} label="Follow-up" />
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Complaint Modal */}
      <QuickComplaintModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

function QuickLink({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/50"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-blue-100 group-hover:text-blue-600">
        <Icon size={17} />
      </span>
      {label}
    </Link>
  )
}