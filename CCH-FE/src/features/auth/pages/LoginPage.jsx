import { useContext, useState } from 'react'
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom'
import { KeyRound, LogIn, ShieldCheck, User, ArrowLeft } from 'lucide-react'
import { AuthContext } from '../auth-context.js'

export default function LoginPage() {
  const { login, isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from || '/workspace'

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const trimmedUsername = username.trim()
    const trimmedPassword = password.trim()

    if (!trimmedUsername) {
      setError('Username wajib diisi')
      setLoading(false)
      return
    }

    if (!trimmedPassword) {
      setError('Password wajib diisi')
      setLoading(false)
      return
    }

    try {
      // Call production auth login endpoint
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: trimmedUsername,
          password: trimmedPassword,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Login gagal')
      }

      const data = await response.json()
      
      if (!data.token) {
        throw new Error('Token tidak diterima dari server')
      }

      // Store token using AuthContext
      login(data.token)
      
      // Navigate to workspace
      void navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Login gagal. Silakan coba lagi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6 transition"
        >
          <ArrowLeft size={16} />
          Kembali ke Beranda
        </Link>

        {/* Login Card */}
        <div className="panel bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Login Staf</h1>
              <p className="text-sm text-slate-500">PT Pos Indonesia CCH</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="alert alert-info mb-6">
            <ShieldCheck size={18} />
            <div className="text-sm">
              <strong>Akses Staf Call Center</strong>
              <br />
              Masukkan username dan password Anda untuk mengakses sistem CCH.
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="form-stack">
            <label className="field">
              <span className="flex items-center gap-2">
                <User size={14} />
                Username
              </span>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Masukkan username Anda"
                disabled={loading}
              />
            </label>

            <label className="field">
              <span className="flex items-center gap-2">
                <KeyRound size={14} />
                Password
              </span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Masukkan password Anda"
                disabled={loading}
              />
            </label>

            {error ? (
              <p className="form-error" role="alert">
                ⚠️ {error}
              </p>
            ) : null}

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin-slow">⏳</span>
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Login ke Workspace
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 flex items-start gap-2">
              <ShieldCheck size={14} className="mt-0.5 flex-shrink-0" />
              <span>
                Token akan disimpan secara aman di session browser dan otomatis dihapus saat logout.
                Pastikan Anda logout setelah selesai menggunakan sistem.
              </span>
            </p>
          </div>

          {/* Dev Login Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-600">
              Mode Development?{' '}
              <Link to="/dev-login" className="text-link">
                Login tanpa password →
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Lupa password?{' '}
            <a href="#" className="text-link">
              Hubungi Administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
