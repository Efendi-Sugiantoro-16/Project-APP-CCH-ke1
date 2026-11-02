import { useState, useRef } from 'react'
import {
  AlertCircle,
  FileText,
  Package,
  Paperclip,
  UploadCloud,
  X,
  Truck,
  CheckCircle2,
} from 'lucide-react'
import { FormInput } from '../form/FormInput.jsx'
import { FormSelect } from '../form/FormSelect.jsx'
import { FormTextarea } from '../form/FormTextarea.jsx'
import { OfficeCombobox } from '../form/OfficeCombobox.jsx'

/**
 * Step 2: Complaint Details
 * Clean, structured, and responsive layout for complaint categorization, shipment routing, and description
 */
export function ComplaintDetailsStep({
  formData,
  errors,
  onChange,
  onBlur,
  complaintTypes = [],
  complaintSources = [],
  shippingServices = [],
  offices = [],
  isLoadingMasters = false,
}) {
  // File attachments state for cchentridok
  const [selectedFiles, setSelectedFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFilesSelected = (files) => {
    const fileList = Array.from(files)
    const validFiles = fileList.filter((f) => f.size <= 5 * 1024 * 1024)
    setSelectedFiles((prev) => [...prev, ...validFiles].slice(0, 5))
  }

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="complaint-details-step space-y-6">
      {/* Modern Section Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Detail & Kronologi Pengaduan</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Klasifikasi pengaduan, informasi kiriman paket Pos, dan uraian kronologi masalah
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Kategori & Sumber Pengaduan */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            placeholder={isLoadingMasters ? 'Memuat jenis...' : '-- Pilih Jenis Pengaduan --'}
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
            placeholder={isLoadingMasters ? 'Memuat sumber...' : '-- Pilih Sumber Pengaduan --'}
          />
        </div>
      </div>

      {/* Section 2: Data Kiriman & Rute Pos (Structured Sub-Card) */}
      <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/80 to-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200/60">
          <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
              Informasi & Rute Kiriman Pos
            </h4>
            <p className="text-[11px] text-slate-500">
              Identitas paket fisik yang diadukan beserta rute kantor asal dan tujuan
            </p>
          </div>
        </div>

        {/* Shipment Type & Receipt Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <FormSelect
            label="Jenis Layanan Kiriman"
            name="shipmentTypeCode"
            value={formData.shipmentTypeCode}
            onChange={onChange}
            onBlur={onBlur}
            error={errors.shipmentTypeCode}
            options={shippingServices}
            required
            disabled={isLoadingMasters}
            placeholder={isLoadingMasters ? 'Memuat layanan...' : '-- Pilih Jenis Kiriman --'}
          />
          <FormInput
            label="Nomor Resi / Connote"
            name="shipmentNumber"
            value={formData.shipmentNumber}
            onChange={onChange}
            onBlur={onBlur}
            error={errors.shipmentNumber}
            placeholder="Contoh: PO123456789ID"
            required
            maxLength={35}
            className="font-mono"
          />
        </div>

        {/* Shipment Offices Route */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <OfficeCombobox
            label="Kantor Asal Kiriman"
            name="shipmentOriginOffice"
            value={formData.shipmentOriginOffice}
            onChange={onChange}
            onBlur={onBlur}
            error={errors.shipmentOriginOffice}
            offices={offices}
            placeholder="Cari kantor asal paket..."
            required
          />
          <OfficeCombobox
            label="Kantor Tujuan Kiriman"
            name="shipmentTargetOffice"
            value={formData.shipmentTargetOffice}
            onChange={onChange}
            onBlur={onBlur}
            error={errors.shipmentTargetOffice}
            offices={offices}
            placeholder="Cari kantor tujuan paket..."
            required
          />
        </div>
      </div>

      {/* Section 3: Kronologi & Deskripsi Pengaduan */}
      <div className="space-y-4">
        <FormInput
          label="Ringkasan Singkat Masalah"
          name="summary"
          value={formData.summary}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.summary}
          placeholder="Tuliskan intisari keluhan secara padat (min. 10 karakter)"
          required
          maxLength={120}
          showCharCount={true}
        />

        <FormTextarea
          label="Uraian Lengkap Kronologi Kejadian"
          name="description"
          value={formData.description}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.description}
          placeholder="Jelaskan detail kronologi, waktu kejadian, isi kiriman, atau kendala yang dialami penerima/pengirim..."
          required
          rows={3}
          maxLength={2000}
          showCharCount={true}
        />
      </div>

      {/* Section 4: Bukti & Dokumen Pendukung (cchentridok - Modern Interactive Dropzone) */}
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-4 transition-colors hover:border-blue-400">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-slate-700">
              Lampiran Bukti / Foto Kerusakan (cchentridok - Opsional)
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Maks. 5 file, @5MB</span>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFilesSelected(e.target.files)}
          multiple
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="hidden"
        />

        {/* Dropzone Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`py-3 px-4 rounded-lg border border-dashed text-center cursor-pointer transition flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50'
              : 'border-slate-200 bg-white hover:bg-blue-50/30 hover:border-blue-300'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <UploadCloud className="w-4 h-4" />
          </div>
          <div className="text-left text-xs">
            <span className="font-semibold text-blue-600 hover:underline">
              Klik untuk unggah
            </span>{' '}
            <span className="text-slate-500">atau seret file resi/kemasan ke sini</span>
            <div className="text-[10px] text-slate-400">Format: JPG, PNG, PDF</div>
          </div>
        </div>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedFiles.map((file, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="max-w-[150px] truncate font-medium">{file.name}</span>
                <span className="text-[10px] text-blue-500">({formatFileSize(file.size)})</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFile(idx)
                  }}
                  className="p-0.5 hover:bg-blue-200/50 rounded text-blue-400 hover:text-blue-700 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 5: Compact Tip / Notice */}
      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="leading-relaxed">
          Pastikan <strong>Nomor Resi</strong> dan <strong>Kantor Tujuan Kiriman</strong> telah terverifikasi dengan benar agar unit investigasi di kantor pemeriksa dapat segera menindaklanjuti.
        </span>
      </div>
    </div>
  )
}
