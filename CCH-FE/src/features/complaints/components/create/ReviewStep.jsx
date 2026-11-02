import { CheckCircle2, AlertTriangle, User, Package, MapPin, FileText } from 'lucide-react'

/**
 * Step 3: Review & Submit
 * Display summary of all entered data before submission with modern responsive design
 */
export function ReviewStep({ formData, complaintTypes = [], complaintSources = [], shippingServices = [], offices = [] }) {
  // Find labels from master data
  const complaintTypeLabel =
    complaintTypes.find((t) => t.value === formData.complaintTypeCode)?.label || '-'
  const complaintSourceLabel =
    complaintSources.find((s) => s.value === formData.complaintSourceCode)?.label || '-'
  const shipmentTypeLabel =
    shippingServices.find((s) => s.value === formData.shipmentTypeCode)?.label || '-'

  const formatOffice = (code) => {
    if (!code) return '-'
    const office = offices.find(
      (o) => String(o.code).toLowerCase() === String(code).toLowerCase()
    )
    return office ? `[${office.code}] ${office.name}` : code
  }

  return (
    <div className="review-step space-y-6">
      {/* Modern Section Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Konfirmasi & Tinjau Data</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Periksa kembali seluruh informasi sebelum menyimpan tiket pengaduan
            </p>
          </div>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="flex items-start gap-2.5 p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-xl text-xs sm:text-sm text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-amber-950">Perhatian:</strong> Pastikan data identitas pengadu, nomor resi, dan rute kantor sudah benar. Setelah disimpan, nomor tiket unik akan diterbitkan dan langsung diteruskan ke kantor tujuan investigasi.
        </div>
      </div>

      {/* Customer Information Card */}
      <div className="border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs bg-white">
        <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200/70 font-semibold text-slate-700 flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs sm:text-sm">
            <User className="w-4 h-4 text-blue-600" />
            Informasi Pelanggan
          </span>
          {formData.customerId ? (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-mono font-bold">
              ID #{formData.customerId}
            </span>
          ) : (
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
              Pelanggan Baru
            </span>
          )}
        </div>
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="text-slate-400 font-medium sm:w-28 shrink-0">Nama Lengkap:</span>
                <span className="text-slate-800 font-semibold">{formData.customerName || '-'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="text-slate-400 font-medium sm:w-28 shrink-0">Nomor Telepon:</span>
                <span className="text-slate-800 font-mono">{formData.customerPhone || '-'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="text-slate-400 font-medium sm:w-28 shrink-0">Email:</span>
                <span className="text-slate-800">{formData.customerEmail || '-'}</span>
              </div>
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="text-slate-400 font-medium sm:w-28 shrink-0">Alamat:</span>
                <span className="text-slate-800 leading-relaxed">{formData.customerAddress || '-'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="text-slate-400 font-medium sm:w-28 shrink-0">Kantor Asal:</span>
                <span className="text-slate-800 font-medium">{formatOffice(formData.originOffice)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="text-slate-400 font-medium sm:w-28 shrink-0">Kantor Tujuan:</span>
                <span className="text-slate-800 font-medium">{formatOffice(formData.targetOffice)}</span>
              </div>
              {formData.ccOffice && (
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                  <span className="text-slate-400 font-medium sm:w-28 shrink-0">Tembusan (CC):</span>
                  <span className="text-slate-800 font-medium">{formatOffice(formData.ccOffice)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Complaint Details Card */}
      <div className="border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs bg-white">
        <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200/70 font-semibold text-slate-700 flex items-center gap-2 text-xs sm:text-sm">
          <Package className="w-4 h-4 text-orange-500" />
          Detail Kiriman & Ringkasan Masalah
        </div>
        <div className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm">
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="text-slate-400 font-medium sm:w-28 shrink-0">Jenis Aduan:</span>
                <span className="font-semibold text-slate-800">{complaintTypeLabel}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="text-slate-400 font-medium sm:w-28 shrink-0">Sumber:</span>
                <span className="text-slate-800">{complaintSourceLabel}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="text-slate-400 font-medium sm:w-28 shrink-0">Layanan:</span>
                <span className="text-slate-800">{shipmentTypeLabel}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="text-slate-400 font-medium sm:w-28 shrink-0">Nomor Resi:</span>
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 inline-block">
                  {formData.shipmentNumber || '-'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="text-slate-400 font-medium sm:w-28 shrink-0">Asal Kiriman:</span>
                <span className="text-slate-800 font-medium">{formatOffice(formData.shipmentOriginOffice)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="text-slate-400 font-medium sm:w-28 shrink-0">Tujuan Kiriman:</span>
                <span className="text-slate-800 font-medium">{formatOffice(formData.shipmentTargetOffice)}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200/70 text-xs sm:text-sm space-y-2">
            <div>
              <span className="text-slate-400 font-medium block mb-1">Ringkasan Masalah:</span>
              <p className="font-semibold text-slate-900 text-sm sm:text-base">{formData.summary || '-'}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium block mb-1">Uraian Lengkap:</span>
              <div className="text-slate-700 whitespace-pre-wrap bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200/80 text-xs sm:text-sm leading-relaxed font-sans">
                {formData.description || '-'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
