import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../auth/auth-context.js'
import { createComplaint, fetchComplaintTypes, fetchComplaintSources, fetchShippingServices } from '../../api/complaintsApi.js'

/**
 * Quick Complaint Modal - Simplified single-step form
 * For quick complaint entry with option to switch to full wizard
 */
export function QuickComplaintModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { token } = useContext(AuthContext)
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    complaintTypeCode: '',
    complaintSourceCode: '',
    shipmentTypeCode: '',
    shipmentNumber: '',
    summary: '',
    description: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Master data
  const [complaintTypes, setComplaintTypes] = useState([])
  const [complaintSources, setComplaintSources] = useState([])
  const [shippingServices, setShippingServices] = useState([])
  const [isLoadingMasters, setIsLoadingMasters] = useState(true)

  // Load master data
  useEffect(() => {
    if (!isOpen) return

    async function loadMasterData() {
      try {
        setIsLoadingMasters(true)
        const [typesData, sourcesData, servicesData] = await Promise.all([
          fetchComplaintTypes(token).catch(() => ({ data: [] })),
          fetchComplaintSources(token).catch(() => ({ data: [] })),
          fetchShippingServices(token).catch(() => ({ data: [] })),
        ])

        setComplaintTypes(
          (typesData?.data || []).map((item) => ({
            value: item.id || item.code,
            label: item.name || item.label,
          })),
        )
        setComplaintSources(
          (sourcesData?.data || []).map((item) => ({
            value: item.id || item.code,
            label: item.name || item.label,
          })),
        )
        setShippingServices(
          (servicesData?.data || []).map((item) => ({
            value: item.code,
            label: item.name || item.label,
          })),
        )
      } catch (error) {
        console.error('Failed to load master data:', error)
      } finally {
        setIsLoadingMasters(false)
      }
    }

    loadMasterData()
  }, [token, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.customerName.trim()) newErrors.customerName = 'Nama pelanggan wajib diisi'
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Nomor telepon wajib diisi'
    if (!formData.complaintTypeCode) newErrors.complaintTypeCode = 'Jenis pengaduan wajib dipilih'
    if (!formData.complaintSourceCode) newErrors.complaintSourceCode = 'Sumber wajib dipilih'
    if (!formData.shipmentTypeCode) newErrors.shipmentTypeCode = 'Jenis kiriman wajib dipilih'
    if (!formData.shipmentNumber.trim()) newErrors.shipmentNumber = 'Nomor resi wajib diisi'
    if (formData.summary.length < 10) newErrors.summary = 'Ringkasan minimal 10 karakter'
    if (formData.description.length < 20) newErrors.description = 'Uraian minimal 20 karakter'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setSubmitError('Mohon lengkapi semua field yang wajib diisi')
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const payload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail || '',
        customerPhone: formData.customerPhone,
        customerAddress: '',
        complaintTypeCode: parseInt(formData.complaintTypeCode, 10),
        complaintSourceCode: parseInt(formData.complaintSourceCode, 10),
        shipmentTypeCode: formData.shipmentTypeCode,
        shipmentNumber: formData.shipmentNumber,
        summary: formData.summary,
        description: formData.description,
        shipmentOriginOffice: '',
        shipmentTargetOffice: '',
      }

      const result = await createComplaint(payload, token)

      if (result?.data?.complaintId) {
        onClose()
        navigate(`/workspace/complaints/open/${result.data.complaintId}`, {
          state: { successMessage: 'Pengaduan berhasil dibuat!' },
        })
      }
    } catch (error) {
      console.error('Submit error:', error)
      setSubmitError(error.message || 'Gagal membuat pengaduan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFullForm = () => {
    onClose()
    navigate('/workspace/complaints/create')
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 9998,
          backdropFilter: 'blur(2px)'
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          display: 'block',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999,
          overflow: 'auto',
          padding: '20px'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <div
          className="modal-dialog modal-xl"
          style={{ margin: '30px auto', maxWidth: '900px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content bg-white" style={{ borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            {/* Header */}
            <div className="modal-header bg-primary text-white" style={{ borderRadius: '8px 8px 0 0' }}>
              <h5 className="modal-title font-weight-bold">
                <i className="fas fa-plus-circle mr-2"></i>
                Buat Pengaduan Baru
              </h5>
              <button
                type="button"
                className="close text-white"
                onClick={onClose}
                disabled={isSubmitting}
                style={{ opacity: 1 }}
              >
                <span style={{ fontSize: '28px' }}>&times;</span>
              </button>
            </div>

            {/* Body */}
            <div style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto', padding: '1.5rem' }}>
              {submitError && (
                <div className="alert alert-danger alert-dismissible mb-4">
                  <button
                    type="button"
                    className="close"
                    onClick={() => setSubmitError('')}
                  >
                    <span>&times;</span>
                  </button>
                  <i className="icon fas fa-ban mr-2"></i>
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* LEFT COLUMN: Data Pelanggan & Lokasi */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                      <i className="fa-regular fa-id-card text-blue-500 mr-2"></i>
                      Data Pelanggan & Lokasi
                    </h3>
                  
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Nama Pelanggan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder="Cari atau ketik nama..."
                        required
                        maxLength={100}
                        className={`w-full bg-white border ${errors.customerName ? 'border-red-500' : 'border-slate-300'} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
                      />
                      {errors.customerName && (
                        <small className="text-red-500 text-xs mt-1 block">{errors.customerName}</small>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Nomor HP <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="customerPhone"
                          value={formData.customerPhone}
                          onChange={handleChange}
                          placeholder="08..."
                          required
                          maxLength={15}
                          className={`w-full bg-white border ${errors.customerPhone ? 'border-red-500' : 'border-slate-300'} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
                        />
                        {errors.customerPhone && (
                          <small className="text-red-500 text-xs">{errors.customerPhone}</small>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                        <input
                          type="email"
                          name="customerEmail"
                          value={formData.customerEmail}
                          onChange={handleChange}
                          placeholder="opsional@mail.com"
                          maxLength={100}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Detail Kiriman & Keluhan */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                      <i className="fa-solid fa-box-open text-blue-500 mr-2"></i>
                      Detail Kiriman & Keluhan
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Nomor Kiriman/Resi <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="shipmentNumber"
                          value={formData.shipmentNumber}
                          onChange={handleChange}
                          placeholder="P2510..."
                          required
                          maxLength={30}
                          className={`w-full bg-white border ${errors.shipmentNumber ? 'border-red-500' : 'border-slate-300'} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none uppercase`}
                        />
                        {errors.shipmentNumber && (
                          <small className="text-red-500 text-xs">{errors.shipmentNumber}</small>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Jenis Kiriman <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="shipmentTypeCode"
                          value={formData.shipmentTypeCode}
                          onChange={handleChange}
                          required
                          disabled={isLoadingMasters}
                          className={`w-full bg-white border ${errors.shipmentTypeCode ? 'border-red-500' : 'border-slate-300'} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
                        >
                          <option value="">Pilih Jenis</option>
                          {shippingServices.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        {errors.shipmentTypeCode && (
                          <small className="text-red-500 text-xs">{errors.shipmentTypeCode}</small>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Jenis Pengaduan <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="complaintTypeCode"
                        value={formData.complaintTypeCode}
                        onChange={handleChange}
                        required
                        disabled={isLoadingMasters}
                        className={`w-full bg-white border ${errors.complaintTypeCode ? 'border-red-500' : 'border-slate-300'} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
                      >
                        <option value="">Pilih Kategori</option>
                        {complaintTypes.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {errors.complaintTypeCode && (
                        <small className="text-red-500 text-xs">{errors.complaintTypeCode}</small>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Sumber Keluhan <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="complaintSourceCode"
                        value={formData.complaintSourceCode}
                        onChange={handleChange}
                        required
                        disabled={isLoadingMasters}
                        className={`w-full bg-white border ${errors.complaintSourceCode ? 'border-red-500' : 'border-slate-300'} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
                      >
                        <option value="">-- Pilih --</option>
                        {complaintSources.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {errors.complaintSourceCode && (
                        <small className="text-red-500 text-xs">{errors.complaintSourceCode}</small>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Ringkasan (Subjek) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        placeholder="Cth: Paket rusak saat diterima..."
                        required
                        maxLength={200}
                        className={`w-full bg-white border ${errors.summary ? 'border-red-500' : 'border-slate-300'} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
                      />
                      {errors.summary && (
                        <small className="text-red-500 text-xs">{errors.summary}</small>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Uraian Detail <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Ceritakan detail keluhan pelanggan..."
                        required
                        rows={3}
                        maxLength={2000}
                        className={`w-full bg-white border ${errors.description ? 'border-red-500' : 'border-slate-300'} rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none`}
                      />
                      {errors.description && (
                        <small className="text-red-500 text-xs">{errors.description}</small>
                      )}
                    </div>
                  </div>

                {/* Info Alert - Full width at bottom */}
                <div className="col-span-full">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
                    <i className="fas fa-info-circle text-info text-xl"></i>
                    <div>
                      <strong className="text-sm">Butuh form yang lebih lengkap?</strong>
                      <br />
                      <button
                        type="button"
                        className="btn btn-link p-0 text-info text-sm underline"
                        onClick={handleFullForm}
                        disabled={isSubmitting}
                      >
                        Gunakan form wizard lengkap
                        <i className="fas fa-arrow-right ml-1"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="modal-footer bg-light" style={{ borderTop: '2px solid #e9ecef' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                <i className="fas fa-times mr-1"></i>
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={handleSubmit}
                disabled={isSubmitting || isLoadingMasters}
                style={{ minWidth: '180px' }}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Simpan Pengaduan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
