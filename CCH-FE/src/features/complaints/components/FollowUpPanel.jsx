import { CalendarClock, CheckCircle2, Loader2 } from 'lucide-react'
import { StatusBadge } from './StatusBadge.jsx'
import { Card, CardHeader } from '../../../shared/ui/Card.jsx'
import { Button } from '../../../shared/ui/Button.jsx'
import { formatDateTime } from '../format.js'

/** Follow-up plan/realization panel for a ticket. */
export function FollowUpPanel({ items, loading, error, reload }) {
  return (
    <Card>
      <CardHeader
        title="Follow-up"
        subtitle="Rencana dan realisasi tindak lanjut."
        actions={
          <Button variant="secondary" size="sm" onClick={reload}>
            Muat ulang
          </Button>
        }
      />
      <div className="p-4">
        {loading ? (
          <div className="state-box border-0 py-8 shadow-none">
            <Loader2 size={22} className="animate-spin-slow text-blue-500" />
            <span>Memuat follow-up…</span>
          </div>
        ) : error ? (
          <div className="alert alert-error" role="alert">
            <span>{error}</span>
          </div>
        ) : !items || items.length === 0 ? (
          <div className="state-box border-0 py-8 shadow-none">
            <span>Tidak ada rencana follow-up.</span>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((entry) => (
              <li
                key={`${entry.complaint_id}-${entry.office_code}-${entry.status_code}`}
                className="flex items-start gap-3 rounded-xl border border-slate-100 p-3"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  {entry.realized_at ? <CheckCircle2 size={16} /> : <CalendarClock size={16} />}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge code={entry.status_code} />
                    <span className="mono text-xs text-slate-400">{entry.office_code}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-slate-600">{entry.plan_notes || 'Tidak ada catatan rencana.'}</p>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span>Rencana {formatDateTime(entry.planned_at)}</span>
                    {entry.realized_at ? (
                      <span className="font-medium text-emerald-600">Realisasi {formatDateTime(entry.realized_at)}</span>
                    ) : (
                      <span className="font-medium text-amber-600">Belum direalisasi</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}