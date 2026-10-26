import { useContext, useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react'
import { AuthContext } from '../../auth/auth-context.js'
import { complaintApi } from '../api/complaintApi.js'
import { fetchComplaintTypes, fetchComplaintSources, fetchShippingServices } from '../api/complaintsApi.js'
import { Button } from '../../../shared/ui/Button.jsx'

function EditComplaintForm({ detail, onClose, onUpdated }) {
  const { token } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    customerName: detail.customer_name || '',
    customerEmail: detail.customer_email || '',
    customerPhone: detail.customer_phone || '',
    customerAddress: detail.customer_address || '',
    complaintTypeCode: detail.complaint_type_code || 1,
    complaintSourceCode: detail.complaint_source_code || 2,
    shipmentTypeCode: detail.shipment_type_code || '',
    shipmentNumber: detail.shipment_number || '',
    shipmentOriginOffice: detail.shipment_origin_office_code || detail.origin_office_code || '',
    shipmentTargetOffice: detail.shipment_target_office_code || detail.destination_office_code || '',
    summary: detail.summary || '',
    description: detail.description || '',
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Master data
  const [complaintTypes, setComplaintTypes] = useState([])
  const [complaintSources, setComplaintSources] = useState([])
  const [shippingServices, setShippingServices] = useState([])
  const [_loadingMasters, setLoadingMasters] = useState(true)

  // Load masters on form mount
  useEffect(() => {
    if (!token) return
    let active = true

    async function loadMasters() {
      try {
        setLoadingMasters(true)
        const [types, sources, services] = await Promise.all([
          fetchComplaintTypes(token).catch(() => ({ data: [] })),
          fetchComplaintSources(token).catch(() => ({ data: [] })),
          fetchShippingServices(token).catch(() => ({ data: [] })),
        ])

        if (active) {
          setComplaintTypes(
            (types?.data || []).map((item) => ({
              value: item.id || item.code,
              label: item.name || item.label || item.description,
            }))
          )
          setComplaintSources(
            (sources?.data || []).map((item) => ({
              value: item.id || item.code,
              label: item.name || item.label || item.description,
            }))
          )
          setShippingServices(
            (services?.data || []).map((item) => ({
              value: item.code || item.id,
              label: item.name || item.label || item.code,
            }))
          )
        }
      } catch (err) {
        console.error('Failed to load masters for edit modal:', err)
      } finally {
        if (active) setLoadingMasters(false)
      }
    }

    loadMasters()
    return () => {
      active = false
    }
  }, [token])

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  function validate() {
    const errs = {}
    if (!formData.customerName.trim()) errs.customerName = 'Nama pelanggan wajib diisi'
    if (!formData.customerPhone.trim()) errs.customerPhone = 'Nomor HP wajib diisi'
    if (!formData.shipmentNumber.trim()) errs.shipmentNumber = 'Nomor resi wajib diisi'
    if (!formData.shipmentTypeCode) errs.shipmentTypeCode = 'Jenis kiriman wajib dipilih'
    if (!formData.summary.trim() || formData.summary.trim().length < 10) {
      errs.summary = 'Ringkasan minimal 10 karakter'
    }
    if (!formData.description.trim() || formData.description.trim().length < 20) {
      errs.description = 'Uraian pengaduan minimal 20 karakter'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate() || submitting) return

    setSubmitting(true)
    setSubmitError('')
    setSuccessMsg('')

    try {
      await complaintApi.update(token, detail.id, {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        complaintTypeCode: Number(formData.complaintTypeCode),
        complaintSourceCode: Number(formData.complaintSourceCode),
        shipmentTypeCode: formData.shipmentTypeCode,
        shipmentNumber: formData.shipmentNumber,
        shipmentOriginOffice: formData.shipmentOriginOffice,
        shipmentTargetOffice: formData.shipmentTargetOffice,
        summary: formData.summary,
        description: formData.description,
      })

      setSuccessMsg('Data pengaduan berhasil diperbarui!')
      setTimeout(() => {
        if (onUpdated) onUpdated()
        onClose()
      }, 700)
    } catch (err) {
      setSubmitError(err.message || 'Gagal menyimpan perubahan tiket pengaduan.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Ubah Data Pengaduan</h3>
            <p className="text-xs text-slate-500 font-mono">Tiket #{detail?.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 max-h-[75vh] overflow-y-auto space-y-6">
          {submitError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
              <span>{submitError}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Section: Pelanggan */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-3">
              Informasi Pelanggan
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Pelanggan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleChange('customerName', e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-sm text-slate-800 transition focus:outline-none focus:ring-2 ${
                    errors.customerName
                      ? 'border-red-300 focus:ring-red-400'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                  placeholder="Nama lengkap"
                />
                {errors.customerName && <p className="mt-1 text-xs text-red-500">{errors.customerName}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nomor HP / Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => handleChange('customerPhone', e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-sm text-slate-800 transition focus:outline-none focus:ring-2 ${
                    errors.customerPhone
                      ? 'border-red-300 focus:ring-red-400'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                  placeholder="08xxxxxxxxxx"
                />
                {errors.customerPhone && <p className="mt-1 text-xs text-red-500">{errors.customerPhone}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleChange('customerEmail', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="nama@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Alamat</label>
                <input
                  type="text"
                  value={formData.customerAddress}
                  onChange={(e) => handleChange('customerAddress', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Alamat lengkap"
                />
              </div>
            </div>
          </div>

          {/* Section: Klasifikasi */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-3">
              Klasifikasi & Saluran
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Jenis Pengaduan <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.complaintTypeCode}
                  onChange={(e) => handleChange('complaintTypeCode', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  {complaintTypes.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Sumber Saluran <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.complaintSourceCode}
                  onChange={(e) => handleChange('complaintSourceCode', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  {complaintSources.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Kiriman */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-3">
              Detail Kiriman Pos
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nomor Resi / Barcode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.shipmentNumber}
                  onChange={(e) => handleChange('shipmentNumber', e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-sm font-mono text-slate-800 transition focus:outline-none focus:ring-2 ${
                    errors.shipmentNumber
                      ? 'border-red-300 focus:ring-red-400'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                  placeholder="P2xxxxxxxxxx / POS resi"
                />
                {errors.shipmentNumber && <p className="mt-1 text-xs text-red-500">{errors.shipmentNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Layanan Kiriman <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.shipmentTypeCode}
                  onChange={(e) => handleChange('shipmentTypeCode', e.target.value)}
                  className={`w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-800 transition focus:outline-none focus:ring-2 ${
                    errors.shipmentTypeCode
                      ? 'border-red-300 focus:ring-red-400'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                >
                  <option value="">-- Pilih Layanan --</option>
                  {shippingServices.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                {errors.shipmentTypeCode && <p className="mt-1 text-xs text-red-500">{errors.shipmentTypeCode}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Kantor Asal Kiriman</label>
                <input
                  type="text"
                  value={formData.shipmentOriginOffice}
                  onChange={(e) => handleChange('shipmentOriginOffice', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono text-slate-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Kode kantor asal (misal: 40000)"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Kantor Tujuan Kiriman</label>
                <input
                  type="text"
                  value={formData.shipmentTargetOffice}
                  onChange={(e) => handleChange('shipmentTargetOffice', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono text-slate-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Kode kantor tujuan (misal: 10000)"
                />
              </div>
            </div>
          </div>

          {/* Section: Uraian */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-3">
              Isi Pengaduan
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Ringkasan / Judul Masalah <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.summary}
                  onChange={(e) => handleChange('summary', e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-sm text-slate-800 transition focus:outline-none focus:ring-2 ${
                    errors.summary
                      ? 'border-red-300 focus:ring-red-400'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                  placeholder="Ringkasan singkat kendala pelanggan (min. 10 karakter)"
                />
                {errors.summary && <p className="mt-1 text-xs text-red-500">{errors.summary}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Uraian Lengkap Masalah <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-sm text-slate-800 transition focus:outline-none focus:ring-2 ${
                    errors.description
                      ? 'border-red-300 focus:ring-red-400'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                  placeholder="Jelaskan detail komplain pelanggan (min. 20 karakter)"
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <Button variant="ghost" onClick={onClose} disabled={submitting}>
              Batal
            </Button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/** Modal wrapper that cleanly mounts/unmounts the edit form when open and keyed by complaint id */
export function EditComplaintModal({ detail, isOpen, onClose, onUpdated }) {
  if (!isOpen || !detail) return null

  return (
    <EditComplaintForm
      key={detail.id || detail.complaint_id}
      detail={detail}
      onClose={onClose}
      onUpdated={onUpdated}
    />
  )
}
