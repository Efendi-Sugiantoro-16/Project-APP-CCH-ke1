import { useContext, useEffect, useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import { AuthContext } from '../../auth/auth-context.js'
import { complaintApi } from '../api/complaintApi.js'
import { StatusBadge } from './StatusBadge.jsx'
import { Card, CardHeader } from '../../../shared/ui/Card.jsx'
import { Button } from '../../../shared/ui/Button.jsx'
import { statusMeta, waitingForCode } from '../format.js'

function newIdempotencyKey() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/** Status transition form for an open ticket. */
export function StatusActionsPanel({ complaintId, statusCode, onTransitioned }) {
  const { token } = useContext(AuthContext)
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    complaintApi
      .listStatusOptions(token, complaintId)
      .then((rows) => {
        if (!cancelled) {
          setOptions(rows)
          setSelected(rows[0]?.code || '')
        }
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message || 'Gagal memuat opsi status.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [token, complaintId])

  const canTransition = waitingForCode(statusCode) && options.some((option) => option.code === selected)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!canTransition || submitting) return
    setSubmitting(true)
    setError('')
    try {
      await complaintApi.updateStatus(token, {
        id: complaintId,
        expectedStatusCode: statusCode,
        statusCode: selected,
        description,
        idempotencyKey: newIdempotencyKey(),
      })
      setDescription('')
      onTransitioned?.()
    } catch (transitionError) {
      setError(transitionError.message || 'Gagal memperbarui status.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader
        title="Perbarui status"
        subtitle="Transisi status tiket."
        actions={<StatusBadge code={statusCode} label={statusMeta(statusCode).label} />}
      />
      <div className="p-4">
        {loading ? (
          <div className="state-box border-0 py-8 shadow-none">
            <Loader2 size={20} className="animate-spin-slow text-blue-500" />
            <span>Memuat opsi status…</span>
          </div>
        ) : !waitingForCode(statusCode) ? (
          <p className="text-sm text-slate-500">
            Tiket ini tidak lagi menerima perubahan status (status akhir <code>{statusCode}</code>).
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              {options.map((option) => (
                <label
                  key={option.code}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                    selected === option.code ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`status-${complaintId}`}
                    value={option.code}
                    checked={selected === option.code}
                    onChange={(event) => setSelected(event.target.value)}
                    className="accent-blue-600"
                  />
                  <StatusBadge code={option.code} label={option.description} />
                </label>
              ))}
            </div>

            <div>
              <label className="label" htmlFor="status-note">
                Catatan transisi
              </label>
              <textarea
                id="status-note"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Deskripsi perubahan status (opsional)"
                className="input resize-y"
              />
            </div>

            {error ? (
              <div className="alert alert-error" role="alert">
                <span>{error}</span>
              </div>
            ) : null}

            <Button type="submit" disabled={!canTransition || submitting} className="w-full">
              {submitting ? <Loader2 size={15} className="animate-spin-slow" /> : <Send size={15} />}
              {submitting ? 'Mengirim…' : 'Simpan status'}
            </Button>
          </form>
        )}
      </div>
    </Card>
  )
}