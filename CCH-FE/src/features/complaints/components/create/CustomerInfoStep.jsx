import { FormInput } from '../form/FormInput.jsx'
import { FormTextarea } from '../form/FormTextarea.jsx'

/**
 * Step 1: Customer Information
 * Collect customer name, contact details, and address
 */
export function CustomerInfoStep({ formData, errors, onChange, onBlur }) {
  return (
    <div className="customer-info-step">
      {/* Modern Section Header */}
      <div className="mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <i className="fas fa-user text-white text-lg"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Informasi Pelanggan</h3>
            <p className="text-sm text-slate-500">Data identitas dan kontak pelanggan yang mengadu</p>
          </div>
        </div>
      </div>

      {/* Customer ID & Name Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormInput
          label="ID Pelanggan"
          name="customerId"
          value={formData.customerId}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.customerId}
          placeholder="ID Pelanggan (opsional)"
          maxLength={20}
        />
        <FormInput
          label="Nama Pelanggan"
          name="customerName"
          value={formData.customerName}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.customerName}
          placeholder="Masukkan nama lengkap pelanggan"
          required
          maxLength={100}
        />
      </div>

      {/* Email & Phone Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormInput
          label="Email"
          name="customerEmail"
          type="email"
          value={formData.customerEmail}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.customerEmail}
          placeholder="email@example.com (opsional)"
          maxLength={100}
        />
        <FormInput
          label="Nomor Telepon"
          name="customerPhone"
          type="tel"
          value={formData.customerPhone}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.customerPhone}
          placeholder="08xx xxxx xxxx"
          required
          maxLength={15}
        />
      </div>

      {/* Address Full Width */}
      <div className="mb-4">
        <FormTextarea
          label="Alamat"
          name="customerAddress"
          value={formData.customerAddress}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.customerAddress}
          placeholder="Masukkan alamat lengkap pelanggan"
          required
          rows={3}
          maxLength={255}
        />
      </div>

      {/* Office Routing Section */}
      <div className="mt-6 mb-4 pb-3 border-b border-slate-200">
        <h4 className="text-base font-semibold text-slate-700 flex items-center gap-2">
          <i className="fas fa-building text-blue-500"></i>
          Routing Kantor Pengirim
        </h4>
        <p className="text-sm text-slate-500 mt-1">Informasi kantor asal, tujuan, dan tembusan pengaduan</p>
      </div>

      {/* Office Codes Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <FormInput
          label="Kantor Asal"
          name="originOffice"
          value={formData.originOffice}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.originOffice}
          placeholder="Kode kantor asal"
          required
          maxLength={7}
        />
        <FormInput
          label="Kantor Tujuan"
          name="targetOffice"
          value={formData.targetOffice}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.targetOffice}
          placeholder="Kode kantor tujuan"
          required
          maxLength={7}
        />
        <FormInput
          label="Kantor Tembusan"
          name="ccOffice"
          value={formData.ccOffice}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.ccOffice}
          placeholder="Kode kantor tembusan (opsional)"
          maxLength={7}
        />
      </div>

      {/* Info Alert with Modern Styling */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 flex gap-3">
        <i className="fas fa-info-circle text-blue-500 text-lg mt-0.5"></i>
        <div>
          <p className="text-sm font-semibold text-blue-900">Tips Pengisian Data</p>
          <p className="text-sm text-blue-700 mt-1">
            Pastikan data pelanggan dan kode kantor akurat untuk memudahkan proses tindak lanjut pengaduan.
          </p>
        </div>
      </div>
    </div>
  )
}
