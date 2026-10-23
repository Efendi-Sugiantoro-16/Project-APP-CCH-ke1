import { FileText, Loader2 } from 'lucide-react'
import { Card, CardHeader } from '../../../shared/ui/Card.jsx'
import { formatDateTime } from '../format.js'

/** Ticket document metadata list (no file contents are exposed). */
export function DocumentsPanel({ items, loading, error }) {
  return (
    <Card>
      <CardHeader title="Dokumen" subtitle="Metadata dokumen pada riwayat tiket." />
      <div className="p-4">
        {loading ? (
          <div className="state-box border-0 py-8 shadow-none">
            <Loader2 size={20} className="animate-spin-slow text-blue-500" />
            <span>Memuat dokumen…</span>
          </div>
        ) : error ? (
          <div className="alert alert-error" role="alert">
            <span>{error}</span>
          </div>
        ) : !items || items.length === 0 ? (
          <div className="state-box border-0 py-8 shadow-none">
            <span>Tidak ada dokumen.</span>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((document) => (
              <li
                key={`${document.history_id}-${document.document_type_code}`}
                className="flex items-start gap-3 rounded-xl border border-slate-100 p-3"
              >
                <span className="mt-0.5 text-blue-600">
                  <FileText size={16} />
                </span>
                <div className="min-w-0">
                  <p className="mono text-xs font-semibold text-slate-700">
                    {document.document_type_code || document.document_type}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {document.office_code ? `Kantor ${document.office_code} · ` : ''}
                    {document.added_at ? formatDateTime(document.added_at) : ''}
                    {document.file_count ? ` · ${document.file_count} berkas` : ''}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}