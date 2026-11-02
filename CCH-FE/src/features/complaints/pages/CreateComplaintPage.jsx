import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../auth/auth-context.js'
import { createComplaint, fetchComplaintTypes, fetchComplaintSources, fetchShippingServices, fetchOffices } from '../api/complaintsApi.js'
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
  const { user, token } = useContext(AuthContext)
  const { formData, errors, handleChange, handleBlur, isStepValid, resetForm, setFormData } =
    useComplaintForm()

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Auto-default originOffice to logged-in user's office
  useEffect(() => {
    if (user?.office && !formData.originOffice) {
      setFormData((prev) => ({
        ...prev,
        originOffice: prev.originOffice || user.office,
      }))
    }
  }, [user, formData.originOffice, setFormData])

  const handleSelectCustomer = (customer) => {
    if (!customer) return
    setFormData((prev) => ({
      ...prev,
      customerId: customer.id ? String(customer.id) : prev.customerId,
      customerName: customer.name ?? prev.customerName,
      customerEmail: customer.email ?? prev.customerEmail,
      customerPhone: customer.phone ?? prev.customerPhone,
      customerAddress: customer.address ?? prev.customerAddress,
    }))
  }

  // Master data
  const [complaintTypes, setComplaintTypes] = useState([])
  const [complaintSources, setComplaintSources] = useState([])
  const [shippingServices, setShippingServices] = useState([])
  const [offices, setOffices] = useState([])
  const [isLoadingMasters, setIsLoadingMasters] = useState(true)

  // Load master data on mount
  useEffect(() => {
    async function loadMasterData() {
      try {
        setIsLoadingMasters(true)
        const [typesData, sourcesData, servicesData, officesData] = await Promise.all([
          fetchComplaintTypes(token).catch(() => []),
          fetchComplaintSources(token).catch(() => []),
          fetchShippingServices(token).catch(() => []),
          fetchOffices(token).catch(() => []),
        ])

        const extractList = (res) => {
          if (Array.isArray(res)) return res
          if (Array.isArray(res?.data)) return res.data
          return []
        }

        const rawTypes = extractList(typesData)
        const rawSources = extractList(sourcesData)
        const rawServices = extractList(servicesData)
        const rawOffices = extractList(officesData)

        // Transform master data to options format
        setComplaintTypes(
          rawTypes.map((item) => ({
            value: String(item.id ?? item.code ?? ''),
            label: item.description || item.name || item.label || String(item.code || item.id || ''),
          })),
        )
        setComplaintSources(
          rawSources.map((item) => ({
            value: String(item.id ?? item.code ?? ''),
            label: item.description || item.name || item.label || String(item.code || item.id || ''),
          })),
        )
        setShippingServices(
          rawServices.map((item) => ({
            value: String(item.code ?? item.id ?? ''),
            label: item.description || item.name || item.label || String(item.code || item.id || ''),
          })),
        )
        setOffices(rawOffices)
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
      // Prepare API payload - complete with customerId and office routing
      const payload = {
        customerId: formData.customerId ? parseInt(formData.customerId, 10) : 0,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail || '',
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress || '',
        originOffice: formData.originOffice || user?.office || '40005CC',
        targetOffice: formData.targetOffice || formData.shipmentTargetOffice || '',
        ccOffice: formData.ccOffice || '',
        complaintTypeCode: parseInt(formData.complaintTypeCode, 10),
        complaintSourceCode: parseInt(formData.complaintSourceCode, 10),
        shipmentTypeCode: formData.shipmentTypeCode,
        shipmentNumber: formData.shipmentNumber,
        summary: formData.summary,
        description: formData.description,
        shipmentOriginOffice: formData.shipmentOriginOffice || formData.originOffice || '',
        shipmentTargetOffice: formData.shipmentTargetOffice || formData.targetOffice || '',
      }

      const result = await createComplaint(payload, token)

      // Success!
      const createdId = result?.data?.complaintId || result?.complaintId
      if (createdId) {
        navigate(`/workspace/complaints/open/${createdId}`, {
          state: { successMessage: 'Pengaduan berhasil dibuat!' },
        })
      } else {
        throw new Error('Server tidak mengembalikan ID pengaduan yang dibuat')
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center shrink-0">
                  <i className="fas fa-plus-circle text-white text-xl sm:text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Buat Pengaduan Baru</h1>
                  <p className="text-blue-100 text-xs sm:text-sm">Form wizard untuk mencatat keluhan pelanggan</p>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-blue-100">
              <a href="/workspace" className="hover:text-white transition">Dashboard</a>
              <i className="fas fa-chevron-right text-xs"></i>
              <span className="text-white font-medium">Buat Pengaduan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Modern Responsive Card */}
      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8">
              {/* Step Indicator */}
              <StepIndicator currentStep={currentStep} steps={STEPS} />

              {/* Error Alert with Modern Styling */}
              {submitError && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg p-3 sm:p-4 flex items-start gap-3">
                  <i className="fas fa-exclamation-circle text-red-500 text-lg sm:text-xl mt-0.5"></i>
                  <div className="flex-1">
                    <h5 className="text-red-900 font-bold text-xs sm:text-sm mb-1">Terjadi Kesalahan</h5>
                    <p className="text-red-700 text-xs sm:text-sm">{submitError}</p>
                  </div>
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-600 transition p-1"
                    onClick={() => setSubmitError('')}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}

              {/* Step Content */}
              <div className="step-content mt-4 sm:mt-6">
                {currentStep === 1 && (
                  <CustomerInfoStep
                    formData={formData}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onSelectCustomer={handleSelectCustomer}
                    offices={offices}
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
                    offices={offices}
                    isLoadingMasters={isLoadingMasters}
                  />
                )}

                {currentStep === 3 && (
                  <ReviewStep
                    formData={formData}
                    complaintTypes={complaintTypes}
                    complaintSources={complaintSources}
                    shippingServices={shippingServices}
                    offices={offices}
                  />
                )}
              </div>

              {/* Modern Responsive Navigation Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200">
                <button
                  type="button"
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  <i className="fas fa-times"></i>
                  Batal
                </button>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      className="px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
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
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 text-xs sm:text-sm min-h-[42px]"
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
                      className="px-7 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-semibold transition-all shadow-md shadow-green-500/20 flex items-center justify-center gap-2 text-xs sm:text-sm min-h-[42px] disabled:opacity-50 disabled:cursor-not-allowed"
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
