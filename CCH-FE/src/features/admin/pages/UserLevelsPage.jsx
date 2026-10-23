import { useContext } from 'react'
import { AuthContext } from '../../auth/auth-context.js'
import { PageHeader } from '../../../shared/ui/PageHeader.jsx'
import { Card } from '../../../shared/ui/Card.jsx'
import { DataTable } from '../../../shared/ui/DataTable.jsx'
import { StateBox } from '../../../shared/ui/StateBox.jsx'
import { useWorkspaceApi } from '../../complaints/useWorkspaceApi.js'
import { adminApi } from '../api/adminApi.js'

const columns = [
  {
    key: 'id',
    header: 'ID',
    render: (row) => <span className="mono text-slate-700">{row.user_level_id}</span>,
  },
  {
    key: 'name',
    header: 'Nama level',
    render: (row) => <span className="font-medium text-slate-800">{row.user_level_name}</span>,
  },
]

/** Administrator page: read-only user-level catalog from the backend. */
export function UserLevelsPage() {
  const { token } = useContext(AuthContext)
  const { data, loading, error } = useWorkspaceApi(() => adminApi.listUserLevels(token, { limit: 50 }), [token])

  return (
    <div>
      <PageHeader
        eyebrow="Administrator"
        title="Kelola Pengguna"
        subtitle="Katalog level pengguna CCH (read-only). Mutasi user/role/permission belum tersedia di API."
      />
      <Card>
        <StateBox
          loading={loading}
          error={error}
          loadingLabel="Memuat level pengguna…"
          isEmpty={!loading && (data || []).length === 0}
          empty={<div className="state-box border-0 shadow-none">Tidak ada level pengguna.</div>}
        >
          <DataTable
            columns={columns}
            rows={data || []}
            rowKey={(row) => row.user_level_id}
            emptyMessage="Tidak ada level pengguna."
          />
        </StateBox>
      </Card>
    </div>
  )
}