/**
 * Step 3: Review & Submit
 * Display summary of all entered data before submission
 */
export function ReviewStep({ formData, complaintTypes, complaintSources, shippingServices }) {
  // Find labels from master data
  const complaintTypeLabel =
    complaintTypes.find((t) => t.value === formData.complaintTypeCode)?.label || '-'
  const complaintSourceLabel =
    complaintSources.find((s) => s.value === formData.complaintSourceCode)?.label || '-'
  const shipmentTypeLabel =
    shippingServices.find((s) => s.value === formData.shipmentTypeCode)?.label || '-'

  return (
    <div className="review-step">
      <div className="card-header bg-success text-white mb-3">
        <h5 className="mb-0">
          <i className="fas fa-check-circle mr-2"></i>
          Konfirmasi Data
        </h5>
      </div>

      <div className="alert alert-warning">
        <i className="fas fa-exclamation-triangle mr-2"></i>
        <strong>Perhatian:</strong> Pastikan semua data sudah benar sebelum submit. Data yang sudah
        disubmit tidak dapat diubah.
      </div>

      {/* Customer Information */}
      <div className="card mb-3">
        <div className="card-header bg-light">
          <strong>
            <i className="fas fa-user mr-2"></i>
            Informasi Pelanggan
          </strong>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <dl className="row mb-0">
                <dt className="col-sm-4">Nama:</dt>
                <dd className="col-sm-8">{formData.customerName || '-'}</dd>
                <dt className="col-sm-4">Telepon:</dt>
                <dd className="col-sm-8">{formData.customerPhone || '-'}</dd>
              </dl>
            </div>
            <div className="col-md-6">
              <dl className="row mb-0">
                <dt className="col-sm-4">Email:</dt>
                <dd className="col-sm-8">{formData.customerEmail || '-'}</dd>
                <dt className="col-sm-4">Alamat:</dt>
                <dd className="col-sm-8">{formData.customerAddress || '-'}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Complaint Details */}
      <div className="card mb-3">
        <div className="card-header bg-light">
          <strong>
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Detail Pengaduan
          </strong>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <dl className="row mb-0">
                <dt className="col-sm-5">Jenis Pengaduan:</dt>
                <dd className="col-sm-7">{complaintTypeLabel}</dd>
                <dt className="col-sm-5">Sumber:</dt>
                <dd className="col-sm-7">{complaintSourceLabel}</dd>
                <dt className="col-sm-5">Jenis Kiriman:</dt>
                <dd className="col-sm-7">{shipmentTypeLabel}</dd>
              </dl>
            </div>
            <div className="col-md-6">
              <dl className="row mb-0">
                <dt className="col-sm-5">Nomor Resi:</dt>
                <dd className="col-sm-7">{formData.shipmentNumber || '-'}</dd>
                <dt className="col-sm-5">Kantor Asal:</dt>
                <dd className="col-sm-7">{formData.shipmentOriginOffice || '-'}</dd>
                <dt className="col-sm-5">Kantor Tujuan:</dt>
                <dd className="col-sm-7">{formData.shipmentTargetOffice || '-'}</dd>
              </dl>
            </div>
          </div>
          <hr />
          <dl className="row mb-0">
            <dt className="col-sm-2">Ringkasan:</dt>
            <dd className="col-sm-10">{formData.summary || '-'}</dd>
            <dt className="col-sm-2">Uraian:</dt>
            <dd className="col-sm-10" style={{ whiteSpace: 'pre-wrap' }}>
              {formData.description || '-'}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  )
}
