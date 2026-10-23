import { useContext, useState } from 'react'
import { Inbox } from 'lucide-react'
import { AuthContext } from '../../auth/auth-context.js'
import { PageHeader } from '../../../shared/ui/PageHeader.jsx'
import { Card } from '../../../shared/ui/Card.jsx'
import { Pagination } from '../../../shared/ui/Pagination.jsx'
import { StateBox } from '../../../shared/ui/StateBox.jsx'
import { ComplaintTable } from './ComplaintTable.jsx'
import { useWorkspaceApi } from '../useWorkspaceApi.js'

const PAGE_SIZE = 25

/**
 * Shared complaint list screen.
 *
 * One implementation backs the open / completed / received / sent list pages,
 * which differ only by their data source and copy. Keeping the layout here
 * avoids four near-identical files.
 */
export function ComplaintListScreen({ eyebrow, title, subtitle, loadPage, variant, emptyTitle }) {
  const { token } = useContext(AuthContext)
  const [offset, setOffset] = useState(0)
  const { data, loading, error } = useWorkspaceApi(
    () => loadPage(token, { limit: PAGE_SIZE, offset }),
    [token, offset, loadPage],
  )
  const items = data || []

  return (
    <div>
      <PageHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <Card>
        <StateBox
          loading={loading}
          error={error}
          loadingLabel="Memuat tiket…"
          isEmpty={!loading && items.length === 0}
          empty={
            <div className="state-box border-0 shadow-none">
              <Inbox size={26} className="text-slate-400" />
              <strong className="text-slate-700">{emptyTitle}</strong>
              <span className="text-sm">Tiket akan tampil di sini sesuai scope kantor Anda.</span>
            </div>
          }
        >
          <ComplaintTable items={items} variant={variant} title={title} />
          <Pagination
            offset={offset}
            count={items.length}
            perPage={PAGE_SIZE}
            loading={loading}
            onPage={setOffset}
          />
        </StateBox>
      </Card>
    </div>
  )
}