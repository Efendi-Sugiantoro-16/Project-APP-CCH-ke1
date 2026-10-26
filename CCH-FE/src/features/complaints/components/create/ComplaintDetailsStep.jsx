import { FormInput } from '../form/FormInput.jsx'
import { FormSelect } from '../form/FormSelect.jsx'
import { FormTextarea } from '../form/FormTextarea.jsx'

/**
 * Step 2: Complaint Details
 * Collect complaint type, source, shipment info, and description
 */
export function ComplaintDetailsStep({
  formData,
  errors,
  onChange,
  onBlur,
  complaintTypes = [],
  complaintSources = [],
  shippingServices = [],
  isLoadingMasters = false,
}) {
  return (
    <div className="complaint-details-step">
      {/* Modern Section Header */}
      <div className="mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20">
            <i className="fas fa-exclamation-triangle text-white text-lg"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Detail Pengaduan</h3>
            <p className="text-sm text-slate-500">Informasi lengkap mengenai jenis dan kronologi pengaduan</p>
          </div>
        </div>
      </div>

      {/* Complaint Type & Source Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormSelect
          label="Jenis Pengaduan"
          name="complaintTypeCode"
          value={formData.complaintTypeCode}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.complaintTypeCode}
          options={complaintTypes}
          required
          disabled={isLoadingMasters}
          placeholder={isLoadingMasters ? 'Memuat data...' : '-- Pilih Jenis Pengaduan --'}
        />
        <FormSelect
          label="Sumber Pengaduan"
          name="complaintSourceCode"
          value={formData.complaintSourceCode}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.complaintSourceCode}
          options={complaintSources}
          required
          disabled={isLoadingMasters}
          placeholder={isLoadingMasters ? 'Memuat data...' : '-- Pilih Sumber Pengaduan --'}
        />
      </div>

      {/* Shipment Type & Number Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormSelect
          label="Jenis Kiriman"
          name="shipmentTypeCode"
          value={formData.shipmentTypeCode}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.shipmentTypeCode}
          options={shippingServices}
          required
          disabled={isLoadingMasters}
          placeholder={isLoadingMasters ? 'Memuat data...' : '-- Pilih Jenis Kiriman --'}
        />
        <FormInput
          label="Nomor Resi"
          name="shipmentNumber"
          value={formData.shipmentNumber}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.shipmentNumber}
          placeholder="Masukkan nomor resi kiriman"
          required
          maxLength={30}
        />
      </div>

      {/* Shipment Office Section */}
      <div className="mt-6 mb-4 pb-3 border-b border-slate-200">
        <h4 className="text-base font-semibold text-slate-700 flex items-center gap-2">
          <i className="fas fa-truck text-orange-500"></i>
          Routing Kantor Kiriman
        </h4>
        <p className="text-sm text-slate-500 mt-1">Informasi kantor asal dan tujuan dari kiriman yang diadukan</p>
      </div>

      {/* Shipment Offices Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormInput
          label="Kantor Asal Kiriman"
          name="shipmentOriginOffice"
          value={formData.shipmentOriginOffice}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.shipmentOriginOffice}
          placeholder="Kode kantor asal kiriman"
          required
          maxLength={7}
        />
        <FormInput
          label="Kantor Tujuan Kiriman"
          name="shipmentTargetOffice"
          value={formData.shipmentTargetOffice}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.shipmentTargetOffice}
          placeholder="Kode kantor tujuan kiriman"
          required
          maxLength={7}
        />
      </div>

      {/* Description Section */}
      <div className="mt-6 mb-4 pb-3 border-b border-slate-200">
        <h4 className="text-base font-semibold text-slate-700 flex items-center gap-2">
          <i className="fas fa-file-alt text-blue-500"></i>
          Deskripsi Pengaduan
        </h4>
        <p className="text-sm text-slate-500 mt-1">Ringkasan dan uraian detail kronologi masalah</p>
      </div>

      {/* Summary Full Width */}
      <div className="mb-4">
        <FormInput
          label="Ringkasan Pengaduan"
          name="summary"
          value={formData.summary}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.summary}
          placeholder="Tuliskan ringkasan singkat pengaduan (min. 10 karakter)"
          required
          maxLength={200}
        />
      </div>

      {/* Description Full Width */}
      <div className="mb-4">
        <FormTextarea
          label="Uraian Lengkap Pengaduan"
          name="description"
          value={formData.description}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.description}
          placeholder="Jelaskan detail kronologi dan permasalahan yang dialami (min. 20 karakter)"
          required
          rows={5}
          maxLength={2000}
        />
      </div>

      {/* Warning Alert with Modern Styling */}
      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4 flex gap-3">
        <i className="fas fa-lightbulb text-amber-500 text-lg mt-0.5"></i>
        <div>
          <p className="text-sm font-semibold text-amber-900">Penting untuk Diperhatikan</p>
          <p className="text-sm text-amber-700 mt-1">
            Berikan deskripsi yang jelas dan detail agar pengaduan dapat ditindaklanjuti dengan tepat dan cepat.
          </p>
        </div>
      </div>
    </div>
  )
}
