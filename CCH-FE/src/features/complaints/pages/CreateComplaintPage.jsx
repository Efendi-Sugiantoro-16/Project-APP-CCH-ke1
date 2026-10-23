import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../auth/auth-context.js'
import { createComplaint, fetchComplaintTypes, fetchComplaintSources, fetchShippingServices } from '../api/complaintsApi.js'
import { useComplaintForm } from '../hooks/useComplaintForm.js'
import { StepIndicator } from '../components/create/StepIndicator.jsx'
import { CustomerInfoStep } from '../components/create/CustomerInfoStep.jsx'
import { ComplaintDetailsStep } from '../components/create/ComplaintDetailsStep.jsx'
import { ReviewStep } from '../components/create/ReviewStep.jsx'

const STEPS = [
  { id: 'customer', label: 'Info Pelanggan' },
  { id: 'complaint', label: 'Detail Pengaduan' },
  { id: 'review', label: 'Konfirmasi' },
]

/**
 * Main Create Complaint Page - Multi-Step Wizard
 */
export function CreateComplaintPage() {
  const navigate = useNavigate()
  const { token } = useContext(AuthContext)
  const { formData, errors, handleChange, handleBlur, validateStep, isStepValid, resetForm } =
    useComplaintForm()

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Master data
  const [complaintTypes, setComplaintTypes] = useState([])
  const [complaintSources, setComplaintSources] = useState([])
  const [shippingServices, setShippingServices] = useState([])
  const [isLoadingMasters, setIsLoadingMasters] = useState(true)

  // Load master data on mount
  useEffect(() => {
    async function loadMasterData() {
      try {
        setIsLoadingMasters(true)
        const [typesData, sourcesData, servicesData] = await Promise.all([
          fetchComplaintTypes(token).catch(() => ({ data: [] })),
          fetchComplaintSources(token).catch(() => ({ data: [] })),
          fetchShippingServices(token).catch(() => ({ data: [] })),
        ])

        // Transform master data to options format
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
  }, [token])

  const handleNext = () => {
    if (isStepValid(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    // Final validation
    if (!isStepValid(1) || !isStepValid(2)) {
      setSubmitError('Terdapat kesalahan pada form. Silakan periksa kembali.')
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      // Prepare API payload - convert string IDs to integers where needed
      const payload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail || '',
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress || '',
        complaintTypeCode: parseInt(formData.complaintTypeCode, 10),
        complaintSourceCode: parseInt(formData.complaintSourceCode, 10),
        shipmentTypeCode: formData.shipmentTypeCode,
        shipmentNumber: formData.shipmentNumber,
        summary: formData.summary,
        description: formData.description,
        shipmentOriginOffice: formData.shipmentOriginOffice || '',
        shipmentTargetOffice: formData.shipmentTargetOffice || '',
      }

      const result = await createComplaint(payload, token)

      // Success!
      if (result?.data?.complaintId) {
        // Navigate to complaint detail page
        navigate(`/workspace/complaints/open/${result.data.complaintId}`, {
          state: { successMessage: 'Pengaduan berhasil dibuat!' },
        })
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('Submit error:', error)
      setSubmitError(
        error.message || 'Gagal membuat pengaduan. Silakan coba lagi atau hubungi administrator.',
      )
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan? Data yang diisi akan hilang.')) {
      resetForm()
      navigate('/workspace')
    }
  }

  return (
    <div className="create-complaint-page min-h-screen bg-slate-50">
      {/* Modern Page Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                  <i className="fas fa-plus-circle text-white text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Buat Pengaduan Baru</h1>
                  <p className="text-blue-100 text-sm">Form wizard untuk mencatat keluhan pelanggan</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-100">
              <a href="/workspace" className="hover:text-white transition">Dashboard</a>
              <i className="fas fa-chevron-right text-xs"></i>
              <span className="text-white font-medium">Buat Pengaduan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Modern Card */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-8">
              {/* Step Indicator */}
              <StepIndicator currentStep={currentStep} steps={STEPS} />

              {/* Error Alert with Modern Styling */}
              {submitError && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 flex items-start gap-3">
                  <i className="fas fa-exclamation-circle text-red-500 text-xl mt-0.5"></i>
                  <div className="flex-1">
                    <h5 className="text-red-900 font-bold mb-1">Terjadi Kesalahan</h5>
                    <p className="text-red-700 text-sm">{submitError}</p>
                  </div>
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-600 transition"
                    onClick={() => setSubmitError('')}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}

              {/* Step Content */}
              <div className="step-content mt-6">
                {currentStep === 1 && (
                  <CustomerInfoStep
                    formData={formData}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                )}

                {currentStep === 2 && (
                  <ComplaintDetailsStep
                    formData={formData}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    complaintTypes={complaintTypes}
                    complaintSources={complaintSources}
                    shippingServices={shippingServices}
                    isLoadingMasters={isLoadingMasters}
                  />
                )}

                {currentStep === 3 && (
                  <ReviewStep
                    formData={formData}
                    complaintTypes={complaintTypes}
                    complaintSources={complaintSources}
                    shippingServices={shippingServices}
                  />
                )}
              </div>

              {/* Modern Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  <i className="fas fa-times"></i>
                  Batal
                </button>
                
                <div className="flex gap-3">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      className="px-6 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                      onClick={handlePrevious}
                      disabled={isSubmitting}
                    >
                      <i className="fas fa-arrow-left"></i>
                      Sebelumnya
                    </button>
                  )}
                  
                  {currentStep < STEPS.length && (
                    <button
                      type="button"
                      className="px-8 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
                      onClick={handleNext}
                      disabled={isSubmitting}
                    >
                      Selanjutnya
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  )}
                  
                  {currentStep === STEPS.length && (
                    <button
                      type="button"
                      className="px-8 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-green-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane"></i>
                          Submit Pengaduan
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
