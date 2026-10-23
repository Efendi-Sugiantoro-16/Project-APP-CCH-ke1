import { useContext, useState } from 'react'
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom'
import { KeyRound, LogIn, ShieldCheck, User, Building2, ArrowLeft } from 'lucide-react'
import { AuthContext } from '../auth-context.js'

export default function DevAuthLoginPage() {
  const { login, isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('081327949797')
  const [office, setOffice] = useState('40005CC')
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
    const trimmedOffice = office.trim()

    if (!trimmedUsername) {
      setError('Username wajib diisi.')
      setLoading(false)
      return
    }

    if (!trimmedOffice) {
      setError('Kode kantor wajib diisi.')
      setLoading(false)
      return
    }

    try {
      // Call DevAuth login endpoint
      const response = await fetch('/dev/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: trimmedUsername,
          office: trimmedOffice,
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
      setError(err.message || 'Login gagal. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 flex items-center justify-center p-4">
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
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dev Login</h1>
              <p className="text-sm text-slate-500">Development Mode</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="alert alert-info mb-6">
            <ShieldCheck size={18} />
            <div className="text-sm">
              <strong>🔧 Development Mode</strong>
              <br />
              Login tanpa password untuk testing. Gunakan username dan kode kantor yang valid dari database.
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
                placeholder="081327949797 atau 40005PI02"
                disabled={loading}
              />
            </label>

            <label className="field">
              <span className="flex items-center gap-2">
                <Building2 size={14} />
                Kode Kantor
              </span>
              <input
                type="text"
                autoComplete="off"
                value={office}
                onChange={(event) => setOffice(event.target.value)}
                placeholder="40005CC"
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
                  <KeyRound size={16} />
                  Login ke Workspace
                </>
              )}
            </button>
          </form>

          {/* Test Accounts */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-700 mb-2">📝 Test Accounts (Real Users):</p>
            <div className="space-y-1.5">
              <div className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                <strong>Username:</strong> <code className="text-orange-600">081327949797</code>
                <br />
                <span className="text-slate-500">Titin Maria Ulfah - Call Center</span>
              </div>
              <div className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                <strong>Username:</strong> <code className="text-orange-600">40005PI02</code>
                <br />
                <span className="text-slate-500">Galih Aprianto - Call Center</span>
              </div>
              <div className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                <strong>Office:</strong> <code className="text-blue-600">40005CC</code>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-4">
            <p className="text-xs text-slate-500 flex items-start gap-2">
              <LogIn size={14} className="mt-0.5 flex-shrink-0" />
              <span>
                Token JWT akan disimpan pada session browser dan valid selama 24 jam. 
                Token ini real dan terhubung ke database CCH.
              </span>
            </p>
          </div>

          {/* Production Login Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-600">
              Mode Production?{' '}
              <Link to="/login" className="text-link">
                Login dengan token →
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Butuh bantuan?{' '}
            <a href="#" className="text-link">
              Hubungi Administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
