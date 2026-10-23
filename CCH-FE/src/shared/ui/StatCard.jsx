import { formatCount } from '../../features/complaints/format.js'
import { cx } from './cx.js'

const TONES = {
  brand: 'bg-blue-50 text-blue-600',
  sky: 'bg-sky-50 text-sky-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  green: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
}

/** Dashboard statistic tile: label, value, and an optional leading icon. */
export function StatCard({ label, value, icon: Icon, tone = 'brand', hint, to, onClick }) {
  const Wrapper = to ? 'a' : onClick ? 'button' : 'div'
  const wrapperProps = to ? { href: to } : onClick ? { type: 'button', onClick } : {}

  return (
    <Wrapper
      {...wrapperProps}
      className={cx(
        'group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all',
        (to || onClick) && 'hover:-translate-y-0.5 hover:shadow-md',
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <h4 className="mt-1 text-3xl font-bold text-slate-800">{formatCount(value)}</h4>
        {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
      </div>
      {Icon ? (
        <span
          className={cx(
            'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110',
            TONES[tone] || TONES.brand,
          )}
          aria-hidden="true"
        >
          <Icon size={24} strokeWidth={2} />
        </span>
      ) : null}
    </Wrapper>
  )
}