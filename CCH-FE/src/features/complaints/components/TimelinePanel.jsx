import { Clock3, Loader2 } from 'lucide-react'
import { StatusBadge } from './StatusBadge.jsx'
import { Card, CardHeader } from '../../../shared/ui/Card.jsx'
import { Button } from '../../../shared/ui/Button.jsx'
import { formatDateTime, formatDuration } from '../format.js'

function TimelineItem({ entry }) {
  return (
    <li className="relative pb-5 pl-6 last:pb-1">
      <span
        className="absolute left-1 top-2 h-[calc(100%-0.5rem)] w-0.5 rounded-full bg-slate-200 last:h-4"
        aria-hidden="true"
      />
      <div className="flex flex-wrap items-center gap-2.5">
        <StatusBadge code={entry.status_code} label={entry.status_description} />
        <span className="text-xs text-slate-400">{formatDateTime(entry.updated_at)}</span>
      </div>
      <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
        <p className="break-words text-sm text-slate-700">{entry.description || 'Tidak ada catatan.'}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
          <span>Oleh {entry.updated_by || '—'}</span>
          <span>Kantor {entry.origin_office_code || '—'}</span>
          {entry.duration_seconds !== null && entry.duration_seconds !== undefined ? (
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Clock3 size={12} />
              {formatDuration(entry.duration_seconds)}
            </span>
          ) : null}
        </div>
      </div>
    </li>
  )
}

/** Status history timeline for a complaint ticket. */
export function TimelinePanel({ items, loading, error, reload }) {
  return (
    <Card>
      <CardHeader
        title="Timeline status"
        subtitle="Riwayat perubahan status tiket."
        actions={
          <Button variant="secondary" size="sm" onClick={reload}>
            Muat ulang
          </Button>
        }
      />
      <div className="p-5">
        {loading ? (
          <div className="state-box border-0 py-8 shadow-none">
            <Loader2 size={22} className="animate-spin-slow text-blue-500" />
            <span>Memuat riwayat…</span>
          </div>
        ) : error ? (
          <div className="alert alert-error" role="alert">
            <span>{error}</span>
          </div>
        ) : !items || items.length === 0 ? (
          <div className="state-box border-0 py-8 shadow-none">
            <span>Belum ada riwayat status.</span>
          </div>
        ) : (
          <ol>
            {items.map((entry) => (
              <TimelineItem key={`${entry.history_id || entry.updated_at}-${entry.status_code}`} entry={entry} />
            ))}
          </ol>
        )}
      </div>
    </Card>
  )
}