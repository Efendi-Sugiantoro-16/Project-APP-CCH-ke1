import { ChevronLeft, ChevronRight } from 'lucide-react'

/** Offset-based pagination control matching the backend's limit/offset contract. */
export function Pagination({ offset, count, perPage = 25, loading, onPage, label = 'baris' }) {
  if (loading || !count) return null

  const page = Math.floor(offset / perPage) + 1
  const hasPrevious = offset > 0
  const hasNext = count === perPage

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
      <span>
        Menampilkan {offset + 1}–{offset + count} · {count} {label}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          disabled={!hasPrevious}
          onClick={() => onPage(offset - perPage)}
        >
          <ChevronLeft size={14} /> Sebelumnya
        </button>
        <span className="font-medium text-slate-600">Halaman {page}</span>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          disabled={!hasNext}
          onClick={() => onPage(offset + perPage)}
        >
          Berikutnya <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}