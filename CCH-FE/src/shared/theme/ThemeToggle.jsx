import { Laptop, Moon, Sun } from 'lucide-react'
import { useTheme } from './useTheme.js'

/**
 * Segmented or compact theme switcher supporting Light / Dark / System modes.
 */
export function ThemeToggle({ className = '', compact = false }) {
  const { theme, setTheme } = useTheme()

  const options = [
    {
      id: 'light',
      label: 'Terang',
      icon: Sun,
      title: 'Mode Terang (Light Mode)',
      activeColor: 'text-amber-500 dark:text-amber-400',
    },
    {
      id: 'dark',
      label: 'Gelap',
      icon: Moon,
      title: 'Mode Gelap (Dark Mode)',
      activeColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      id: 'system',
      label: 'Sistem',
      icon: Laptop,
      title: 'Ikuti Tema Sistem (System OS)',
      activeColor: 'text-blue-600 dark:text-blue-400',
    },
  ]

  return (
    <div
      role="radiogroup"
      aria-label="Pilih tema tampilan"
      className={`inline-flex items-center rounded-xl border border-slate-200 bg-slate-100/90 p-1 text-xs font-medium dark:border-slate-800 dark:bg-slate-900/90 shadow-xs transition-colors ${className}`}
    >
      {options.map((opt) => {
        const Icon = opt.icon
        const isActive = theme === opt.id

        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setTheme(opt.id)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all duration-150 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
              isActive
                ? `bg-white dark:bg-slate-800 shadow-xs font-semibold ${opt.activeColor}`
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            title={opt.title}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            {!compact && <span className="hidden sm:inline">{opt.label}</span>}
          </button>
        )
      })}
    </div>
  )
}
