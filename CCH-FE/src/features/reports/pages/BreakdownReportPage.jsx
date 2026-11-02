import { useState, useContext, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  ListFilter,
  Package,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { AuthContext } from '../../auth/auth-context.js'
import { complaintApi } from '../../complaints/api/complaintApi.js'
import { PageHeader } from '../../../shared/ui/PageHeader.jsx'
import { Card } from '../../../shared/ui/Card.jsx'
import { Pagination } from '../../../shared/ui/Pagination.jsx'
import { StateBox } from '../../../shared/ui/StateBox.jsx'
import { StatCard } from '../../../shared/ui/StatCard.jsx'
import { ReportFilterBar } from '../components/ReportFilterBar.jsx'
import { exportToExcel, exportToCsv } from '../../../shared/utils/excelExport.js'
import { formatDateTime } from '../../complaints/format.js'

const PAGE_SIZE = 50

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '0 hari'
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  if (days > 0) {
    return `${days} hari ${hours} jam`
  }
  if (hours > 0) {
    return `${hours} jam ${mins} mnt`
  }
  return `${mins} menit`
}

export function BreakdownReportPage() {
  const { token } = useContext(AuthContext)

  // Default dates: start of month to today
  const today = useMemo(() => new Date(), [])
  const firstDay = useMemo(() => new Date(today.getFullYear(), today.getMonth(), 1), [today])
  const formatDate = (d) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Active Modes
  const [direction, setDirection] = useState('received') // 'received' | 'sent'
  const [kind, setKind] = useState('shipment') // 'shipment' | 'problem'
  const [activeTab, setActiveTab] = useState('summary') // 'summary' | 'detail'
  const [selectedCode, setSelectedCode] = useState('') // code for detail drill-down
  const [selectedLabel, setSelectedLabel] = useState('')

  // Filters
  const [filters, setFilters] = useState({
    from: formatDate(firstDay),
    to: formatDate(today),
    regional: '',
    office: '',
    product_code: '',
    hanya_tujuan: false,
  })

  // Summary State
  const [summaryData, setSummaryData] = useState([])
  const [summaryTotal, setSummaryTotal] = useState(0)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [summaryError, setSummaryError] = useState(null)

  // Detail State
  const [detailData, setDetailData] = useState([])
  const [detailOffset, setDetailOffset] = useState(0)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState(null)

  const [refreshKey, setRefreshKey] = useState(0)

  // Load Summary Breakdown
  useEffect(() => {
    let active = true
    if (!token) return

    async function loadSummary() {
      setSummaryLoading(true)
      setSummaryError(null)
      try {
        const res = await complaintApi.listBreakdown(token, {
          direction,
          kind,
          from: filters.from,
          to: filters.to,
          regional: filters.regional,
          office: filters.office,
          product_code: kind === 'problem' ? filters.product_code : undefined,
          hanya_tujuan: direction === 'received' ? filters.hanya_tujuan : false,
          limit: 100,
          offset: 0,
        })
        if (active) {
          const items = Array.isArray(res) ? res : (res?.data ?? [])
          setSummaryData(items)
          const total = items.reduce((acc, row) => acc + (Number(row.count) || 0), 0)
          setSummaryTotal(total)
        }
      } catch (err) {
        if (active) {
          setSummaryError(err?.message || 'Gagal memuat rekap breakdown.')
        }
      } finally {
        if (active) {
          setSummaryLoading(false)
        }
      }
    }

    loadSummary()
    return () => {
      active = false
    }
  }, [token, direction, kind, filters, refreshKey])

  // Load Detail Drill-down
  useEffect(() => {
    let active = true
    if (!token) return

    async function loadDetail() {
      setDetailLoading(true)
      setDetailError(null)
      try {
        const items = await complaintApi.listBreakdownDetail(token, {
          direction,
          kind,
          code: selectedCode,
          from: filters.from,
          to: filters.to,
          regional: filters.regional,
          office: filters.office,
          hanya_tujuan: direction === 'received' ? filters.hanya_tujuan : false,
          limit: PAGE_SIZE,
          offset: detailOffset,
        })
        if (active) {
          setDetailData(Array.isArray(items) ? items : [])
        }
      } catch (err) {
        if (active) {
          setDetailError(err?.message || 'Gagal memuat rincian tiket.')
        }
      } finally {
        if (active) {
          setDetailLoading(false)
        }
      }
    }

    loadDetail()
    return () => {
      active = false
    }
  }, [token, direction, kind, selectedCode, filters, detailOffset, refreshKey])

  // Drill-down to specific category
  const handleDrillDown = (row) => {
    setSelectedCode(row.code)
    setSelectedLabel(row.label || row.code)
    setDetailOffset(0)
    setActiveTab('detail')
  }

  const handleClearCodeFilter = () => {
    setSelectedCode('')
    setSelectedLabel('')
    setDetailOffset(0)
  }

  // Handle Export
  const handleExportExcel = () => {
    const dirLabel = direction === 'sent' ? 'Dikirim' : 'Diterima'
    const kindLabel = kind === 'shipment' ? 'Jenis_Kiriman' : 'Jenis_Masalah'
    const filename = `Rekap_${dirLabel}_${kindLabel}_${filters.from}_sd_${filters.to}`

    if (activeTab === 'summary') {
      const rows = summaryData.map((row, index) => ({
        No: index + 1,
        Kode: row.code,
        [kind === 'shipment' ? 'Jenis Kiriman / Layanan' : 'Jenis Masalah Pengaduan']: row.label || row.code,
        'Jumlah Pengaduan': row.count,
        'Persentase (%)': row.percent ? `${row.percent}%` : '0%',
      }))
      exportToExcel(rows, filename, `Rekap ${dirLabel} ${kindLabel}`)
    } else {
      const rows = detailData.map((row, index) => ({
        No: detailOffset + index + 1,
        'ID Pengaduan': row.complaint_id,
        'Nomor Kiriman': row.shipment_number || '-',
        'Jenis Kiriman': row.shipment_type_code || '-',
        'Tanggal Tambah': row.complaint_created_at ? formatDateTime(row.complaint_created_at) : '-',
        [direction === 'sent' ? 'Kantor Asal' : 'Kantor Tujuan']: row.target_office_update_code || row.origin_office_update_code || '-',
        'Status Terakhir': `${row.latest_status_code || ''} - ${row.latest_status_description || ''}`,
        'Kantor Update': row.latest_status_office_code || '-',
        'Tanggal Update': row.latest_status_at ? formatDateTime(row.latest_status_at) : '-',
        'Durasi Total': formatDuration(row.duration_seconds),
      }))
      exportToExcel(rows, `${filename}_Rincian`, `Rincian ${dirLabel}`)
    }
  }

  const handleExportCsv = () => {
    const dirLabel = direction === 'sent' ? 'Dikirim' : 'Diterima'
    const kindLabel = kind === 'shipment' ? 'Jenis_Kiriman' : 'Jenis_Masalah'
    const filename = `Rekap_${dirLabel}_${kindLabel}_${filters.from}_sd_${filters.to}`

    if (activeTab === 'summary') {
      const rows = summaryData.map((row, index) => ({
        No: index + 1,
        Kode: row.code,
        Kategori: row.label || row.code,
        Jumlah: row.count,
        Persentase: row.percent ? `${row.percent}%` : '0%',
      }))
      exportToCsv(rows, filename)
    } else {
      const rows = detailData.map((row, index) => ({
        No: detailOffset + index + 1,
        ID_Pengaduan: row.complaint_id,
        Nomor_Kiriman: row.shipment_number || '-',
        Jenis_Kiriman: row.shipment_type_code || '-',
        Tanggal_Tambah: row.complaint_created_at ? formatDateTime(row.complaint_created_at) : '-',
        Kantor: row.target_office_update_code || row.origin_office_update_code || '-',
        Status_Terakhir: `${row.latest_status_code || ''} - ${row.latest_status_description || ''}`,
        Kantor_Update: row.latest_status_office_code || '-',
        Tanggal_Update: row.latest_status_at ? formatDateTime(row.latest_status_at) : '-',
        Durasi: formatDuration(row.duration_seconds),
      }))
      exportToCsv(rows, `${filename}_Rincian`)
    }
  }

  const topCategory = summaryData.length > 0 ? summaryData[0] : null

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <PageHeader
        title="Rekap & Rincian Per Jenis (Kiriman & Masalah)"
        subtitle="Laporan breakdown statistik dan drill-down rincian pengaduan yang diterima dan dikirim POSIND berdasarkan Jenis Kiriman Layanan dan Jenis Masalah Pengaduan."
        icon={Layers}
      />

      {/* Mode Switches: Arah (Direction) & Kategori (Kind) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Direction Switch */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            ARAH ALIRAN PENGADUAN:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setDirection('received')
                setDetailOffset(0)
              }}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
                direction === 'received'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <ArrowDownLeft size={16} />
              Pengaduan DITERIMA
            </button>
            <button
              type="button"
              onClick={() => {
                setDirection('sent')
                setDetailOffset(0)
              }}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
                direction === 'sent'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <ArrowUpRight size={16} />
              Pengaduan DIKIRIM
            </button>
          </div>
        </div>

        {/* Kind Switch */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            KLASIFIKASI BREAKDOWN:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setKind('shipment')
                setSelectedCode('')
                setSelectedLabel('')
                setDetailOffset(0)
              }}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
                kind === 'shipment'
                  ? 'bg-slate-900 text-white shadow-md dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Package size={16} />
              Per Jenis Kiriman (Layanan)
            </button>
            <button
              type="button"
              onClick={() => {
                setKind('problem')
                setSelectedCode('')
                setSelectedLabel('')
                setDetailOffset(0)
              }}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
                kind === 'problem'
                  ? 'bg-slate-900 text-white shadow-md dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <AlertCircle size={16} />
              Per Jenis Masalah
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title={`Total Pengaduan (${direction === 'sent' ? 'Dikirim' : 'Diterima'})`}
          value={summaryTotal.toLocaleString('id-ID')}
          subtitle={`Periode: ${filters.from} s.d. ${filters.to}`}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title={kind === 'shipment' ? 'Layanan Terbanyak' : 'Masalah Terbanyak'}
          value={topCategory ? `${topCategory.count} Tiket` : '-'}
          subtitle={topCategory ? `${topCategory.label || topCategory.code} (${topCategory.percent || 0}%)` : 'Tidak ada data'}
          icon={Sparkles}
          color="amber"
        />
        <StatCard
          title="Kategori Terdata"
          value={`${summaryData.length} Kategori`}
          subtitle={kind === 'shipment' ? 'Jenis Produk Kiriman POSIND' : 'Jenis Pengaduan / Masalah'}
          icon={Layers}
          color="emerald"
        />
      </div>

      {/* Filter Bar */}
      <ReportFilterBar
        filters={filters}
        onChange={setFilters}
        onApply={() => {
          setDetailOffset(0)
          setRefreshKey((k) => k + 1)
        }}
        onExportExcel={handleExportExcel}
        onExportCsv={handleExportCsv}
        totalItems={activeTab === 'summary' ? summaryData.length : detailData.length}
        loading={summaryLoading || detailLoading}
        showOnlyTarget={direction === 'received'}
        hideProduct={kind === 'shipment'}
      />

      {/* Navigation Tabs: Rekapitulasi vs Rincian Tiket */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
              activeTab === 'summary'
                ? 'border-red-600 text-red-600 dark:border-red-500 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <BarChart3 size={16} />
            Rekapitulasi Ringkasan ({summaryData.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('detail')}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
              activeTab === 'detail'
                ? 'border-red-600 text-red-600 dark:border-red-500 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <ListFilter size={16} />
            Rincian Tiket {selectedCode ? `(${selectedLabel || selectedCode})` : ''}
          </button>
        </div>

        {activeTab === 'detail' && selectedCode && (
          <div className="flex items-center gap-2 pb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Filter Kategori: <strong className="text-slate-800 dark:text-slate-200">{selectedLabel}</strong>
            </span>
            <button
              type="button"
              onClick={handleClearCodeFilter}
              className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <RotateCcw size={11} />
              Tampilkan Semua
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: REKAPITULASI RINGKASAN */}
      {activeTab === 'summary' && (
        <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
          {summaryLoading ? (
            <StateBox loading text="Memuat rekapitulasi data pengaduan..." />
          ) : summaryError ? (
            <StateBox error text={summaryError} />
          ) : summaryData.length === 0 ? (
            <StateBox
              icon={CheckCircle2}
              title="Tidak ada data"
              text="Tidak ditemukan pengaduan untuk kriteria filter dan periode yang dipilih."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-center w-12">No.</th>
                    <th scope="col" className="px-4 py-3 w-28">Kode</th>
                    <th scope="col" className="px-4 py-3">
                      {kind === 'shipment' ? 'Jenis Kiriman / Nama Layanan' : 'Jenis Masalah Pengaduan'}
                    </th>
                    <th scope="col" className="px-4 py-3 text-right w-36">Jumlah Tiket</th>
                    <th scope="col" className="px-4 py-3 text-right w-28">Persentase</th>
                    <th scope="col" className="px-4 py-3 w-48">Distribusi Visual</th>
                    <th scope="col" className="px-4 py-3 text-center w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {summaryData.map((row, index) => {
                    const pct = Number(row.percent) || 0
                    return (
                      <tr
                        key={row.code || index}
                        className="hover:bg-slate-50/70 transition-colors dark:hover:bg-slate-800/40"
                      >
                        <td className="px-4 py-3 text-center text-slate-400 font-mono text-[11px]">
                          {index + 1}.
                        </td>
                        <td className="px-4 py-3 font-mono font-semibold text-slate-800 dark:text-slate-100">
                          <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[11px] font-mono dark:bg-slate-800">
                            {row.code}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                          {row.label || row.code}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold font-mono text-slate-900 dark:text-slate-100">
                          {Number(row.count).toLocaleString('id-ID')}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-medium text-slate-600 dark:text-slate-400">
                          {pct.toFixed(2)}%
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-slate-100 rounded-full h-2 dark:bg-slate-800 overflow-hidden">
                              <div
                                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(pct, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleDrillDown(row)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:border-red-500 hover:text-red-600 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-red-500 dark:hover:text-red-400"
                          >
                            <ListFilter size={12} />
                            Lihat Tiket
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot className="bg-slate-50 font-semibold text-slate-900 dark:bg-slate-800/80 dark:text-slate-100 border-t-2 border-slate-200 dark:border-slate-700">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right">
                      TOTAL KESELURUHAN:
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm">
                      {summaryTotal.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm">
                      100.00%
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* TAB 2: RINCIAN TIKET */}
      {activeTab === 'detail' && (
        <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
          {detailLoading ? (
            <StateBox loading text="Memuat rincian tiket pengaduan..." />
          ) : detailError ? (
            <StateBox error text={detailError} />
          ) : detailData.length === 0 ? (
            <StateBox
              icon={CheckCircle2}
              title="Tidak ada rincian tiket"
              text={`Tidak ditemukan tiket ${selectedLabel ? `untuk ${selectedLabel}` : ''} pada periode yang dipilih.`}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-center w-12">No.</th>
                    <th scope="col" className="px-4 py-3 w-36">ID Pengaduan</th>
                    <th scope="col" className="px-4 py-3 w-40">Nomor Kiriman</th>
                    <th scope="col" className="px-4 py-3 w-28">Jenis Layanan</th>
                    <th scope="col" className="px-4 py-3 w-36">Tgl Entri</th>
                    <th scope="col" className="px-4 py-3 w-36">
                      {direction === 'sent' ? 'Kantor Asal' : 'Kantor Tujuan'}
                    </th>
                    <th scope="col" className="px-4 py-3 w-44">Status Terakhir</th>
                    <th scope="col" className="px-4 py-3 w-36">Kantor Update</th>
                    <th scope="col" className="px-4 py-3 w-36">Tgl Update</th>
                    <th scope="col" className="px-4 py-3 text-right w-32">Durasi Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {detailData.map((row, index) => {
                    const isLongDuration = (row.duration_seconds || 0) > 86400 * 3
                    const ticketLink = `/workspace/complaints/open/${row.complaint_id}`
                    return (
                      <tr
                        key={row.complaint_id || index}
                        className={`hover:bg-slate-50/70 transition-colors dark:hover:bg-slate-800/40 ${
                          isLongDuration ? 'bg-amber-50/30 dark:bg-amber-950/10' : ''
                        }`}
                      >
                        <td className="px-4 py-3 text-center text-slate-400 font-mono text-[11px]">
                          {detailOffset + index + 1}.
                        </td>
                        <td className="px-4 py-3 font-medium">
                          <Link
                            to={ticketLink}
                            className="inline-flex items-center gap-1 font-mono font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                          >
                            {row.complaint_id}
                            <ExternalLink size={11} className="opacity-70" />
                          </Link>
                        </td>
                        <td className="px-4 py-3 font-mono font-medium text-slate-800 dark:text-slate-100">
                          {row.shipment_number || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {row.shipment_type_code || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-[11px] dark:text-slate-400">
                          {row.complaint_created_at ? formatDateTime(row.complaint_created_at) : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 font-mono font-medium text-slate-700 dark:text-slate-300">
                            <Building2 size={12} className="text-slate-400" />
                            {row.target_office_update_code || row.origin_office_update_code || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                              {row.latest_status_code}
                            </span>
                            <span className="truncate max-w-[140px] text-xs text-slate-600 dark:text-slate-300" title={row.latest_status_description}>
                              {row.latest_status_description || '-'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                          {row.latest_status_office_code || '-'}
                        </td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-[11px] dark:text-slate-400">
                          {row.latest_status_at ? formatDateTime(row.latest_status_at) : '-'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[11px] font-semibold ${
                              isLongDuration
                                ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {isLongDuration ? <AlertTriangle size={11} /> : <Clock size={11} />}
                            {formatDuration(row.duration_seconds)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <Pagination
                  limit={PAGE_SIZE}
                  offset={detailOffset}
                  count={detailData.length}
                  onChange={(newOffset) => setDetailOffset(newOffset)}
                />
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
