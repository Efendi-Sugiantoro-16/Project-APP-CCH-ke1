import { cx } from './cx.js'

const TONES = {
  neutral: 'border-slate-200 bg-slate-100 text-slate-600',
  brand: 'border-blue-200 bg-blue-50 text-blue-600',
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
  sky: 'border-sky-200 bg-sky-50 text-sky-700',
  indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  violet: 'border-violet-200 bg-violet-50 text-violet-700',
  green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  red: 'border-red-200 bg-red-50 text-red-700',
}

export function Badge({ tone = 'neutral', className, children }) {
  return <span className={cx('badge', TONES[tone] || TONES.neutral, className)}>{children}</span>
}