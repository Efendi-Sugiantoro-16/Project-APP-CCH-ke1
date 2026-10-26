import { useContext, useState } from 'react'
import { AlertCircle, CheckCircle2, Edit3, Loader2, X } from 'lucide-react'
import { AuthContext } from '../../auth/auth-context.js'
import { usersApi } from '../api/usersApi.js'
import { Button } from '../../../shared/ui/Button.jsx'

function EditUserForm({ user, onClose, onUpdated, levels = [], offices = [] }) {
  const { token } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    username: user.username || '',
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    phone: user.phone || '',
    user_level_id: String(user.user_level_id || '3'),
    office_code: user.office_code || '',
    report_to: user.report_to || '',
    activated: user.activated || 'Y',
    locked: user.locked || 'N',
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const errs = {}
    if (!formData.user_level_id) {
      errs.user_level_id = 'Level / role pengguna wajib dipilih.'
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Format email tidak valid.'
    }
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setSuccessMsg('')

    const valErrors = validate()
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors)
      return
    }

    setSubmitting(true)
    try {
      await usersApi.updateUser(token, formData.username, {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        user_level_id: String(formData.user_level_id),
        office_code: formData.office_code.trim(),
        report_to: formData.report_to.trim(),
        activated: formData.activated,
        locked: formData.locked,
      })

      setSuccessMsg(`Data pengguna "${formData.username}" berhasil diperbarui!`)
      setTimeout(() => {
        if (onUpdated) onUpdated()
        onClose()
      }, 900)
    } catch (err) {
      setSubmitError(err.message || 'Gagal memperbarui data pengguna.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Edit3 size={20} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Ubah Data Pengguna</h2>
              <p className="text-xs text-slate-500">Edit informasi profil, unit kantor, dan peran petugas.</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {submitError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
              <span>{submitError}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-700">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Read-only Username Banner */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Username Akun</p>
              <p className="text-base font-bold text-slate-800 font-mono mt-0.5">{formData.username}</p>
            </div>
            <span className="badge border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1">
              {user.user_level_name || `Level ${user.user_level_id}`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Nama Depan
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Nama depan petugas"
                className="input w-full"
                disabled={submitting}
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Nama Belakang
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Nama belakang petugas"
                className="input w-full"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nama@posindonesia.co.id"
                className={`input w-full ${errors.email ? 'border-red-400 focus:border-red-500' : ''}`}
                disabled={submitting}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                No. Telepon / WhatsApp
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="08123456789"
                className="input w-full"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Role / Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Role / Level Akses <span className="text-red-500">*</span>
              </label>
              <select
                name="user_level_id"
                value={formData.user_level_id}
                onChange={handleChange}
                className="input w-full bg-white"
                disabled={submitting}
              >
                {levels.length > 0 ? (
                  levels.map((lvl) => (
                    <option key={lvl.id} value={String(lvl.id)}>
                      {lvl.name} (Level {lvl.id})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="-1">Administrator</option>
                    <option value="1">UPT</option>
                    <option value="3">Call Center</option>
                    <option value="9">Admin UPT</option>
                    <option value="10">Regional</option>
                    <option value="19">Admin Regional</option>
                    <option value="20">Kantor Pusat</option>
                    <option value="29">Admin Pusat</option>
                  </>
                )}
              </select>
            </div>

            {/* Office Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Kode Kantor / Unit
              </label>
              <input
                type="text"
                name="office_code"
                value={formData.office_code}
                onChange={handleChange}
                placeholder="misal: 40005CC atau 40000"
                className="input w-full"
                list="edit-office-options"
                disabled={submitting}
              />
              <datalist id="edit-office-options">
                {offices.map((off) => (
                  <option key={off.office_code || off.code} value={off.office_code || off.code}>
                    {off.office_name || off.name || off.office_code}
                  </option>
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status Aktivasi */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Status Aktivasi
              </label>
              <select
                name="activated"
                value={formData.activated}
                onChange={handleChange}
                className="input w-full bg-white"
                disabled={submitting}
              >
                <option value="Y">Aktif (Dapat Login)</option>
                <option value="N">Non-aktif (Tidak Dapat Login)</option>
              </select>
            </div>

            {/* Status Terkunci */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Status Akun
              </label>
              <select
                name="locked"
                value={formData.locked}
                onChange={handleChange}
                className="input w-full bg-white"
                disabled={submitting}
              >
                <option value="N">Normal</option>
                <option value="Y">Terkunci (Locked)</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              className="btn btn-ghost text-slate-600 hover:bg-slate-100"
              onClick={onClose}
              disabled={submitting}
            >
              Batal
            </button>
            <Button
              type="submit"
              tone="primary"
              disabled={submitting}
              className="flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Memperbarui…
                </>
              ) : (
                <>
                  <Edit3 size={16} />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function EditUserModal({ user, isOpen, onClose, onUpdated, levels = [], offices = [] }) {
  if (!isOpen || !user) return null

  return (
    <EditUserForm
      key={user.username}
      user={user}
      onClose={onClose}
      onUpdated={onUpdated}
      levels={levels}
      offices={offices}
    />
  )
}
