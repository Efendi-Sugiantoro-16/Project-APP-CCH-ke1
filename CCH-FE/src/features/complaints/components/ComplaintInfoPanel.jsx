import { Building2, Mail, MapPin, Package, Phone, User } from 'lucide-react'
import { StatusBadge } from './StatusBadge.jsx'
import { Card } from '../../../shared/ui/Card.jsx'
import { formatDateTime } from '../format.js'

function Field({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      {Icon ? (
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <Icon size={15} />
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
        <p className="break-words text-sm font-semibold text-slate-800">{value || '—'}</p>
      </div>
    </div>
  )
}

/** Read-only ticket header + customer/shipment detail card. */
export function ComplaintInfoPanel({ detail }) {
  if (!detail) return null

  return (
    <Card className="p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Informasi tiket</p>
          <h3 className="mono mt-1 text-lg font-bold text-slate-800">{detail.id}</h3>
        </div>
        <StatusBadge code={detail.status_code} label={detail.status_description} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field icon={User} label="Pelanggan" value={detail.customer_name} />
        <Field icon={Phone} label="Telepon" value={detail.customer_phone} />
        <Field icon={Mail} label="Email" value={detail.customer_email} />
        <Field icon={MapPin} label="Alamat" value={detail.customer_address} />
        <Field icon={Building2} label="Kantor asal" value={detail.origin_office_code} />
        <Field icon={Building2} label="Kantor tujuan" value={detail.destination_office_code} />
        <Field icon={Building2} label="Tembusan" value={detail.copy_office_codes} />
        <Field icon={Package} label="Kiriman" value={detail.shipment_number} />
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Ringkasan</p>
        <p className="mt-2 text-sm text-slate-600">{detail.summary || 'Tidak ada ringkasan.'}</p>
        {detail.description ? (
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">{detail.description}</p>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-400">
        <span>Status sejak {formatDateTime(detail.status_date)}</span>
        <span>Update kantor {detail.status_office_code || '—'}</span>
      </div>
    </Card>
  )
}