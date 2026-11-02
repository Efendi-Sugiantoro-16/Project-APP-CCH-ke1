import { AlertCircle, Loader2 } from 'lucide-react'

/**
 * Loading / error / empty state helper shared by data-driven pages.
 *
 * `isEmpty` is explicit (not inferred from children) so callers control exactly
 * when the empty placeholder replaces the content.
 */
export function StateBox({ loading, error, isEmpty, empty, children, loadingLabel = 'Memuat…' }) {
  if (loading) {
    return (
      <div className="state-box">
        <Loader2 size={26} className="animate-spin-slow text-blue-500" />
        <span>{loadingLabel}</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-error" role="alert">
        <AlertCircle size={18} className="mt-0.5 shrink-0" />
        <span>{error}</span>
      </div>
    )
  }

  if (isEmpty && empty) return empty
  return children
}