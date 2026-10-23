import { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../auth/auth-context.js'
import { complaintApi } from '../api/complaintApi.js'
import { followUpsApi } from '../../followups/api/followUpsApi.js'
import { ComplaintInfoPanel } from '../components/ComplaintInfoPanel.jsx'
import { TimelinePanel } from '../components/TimelinePanel.jsx'
import { FollowUpPanel } from '../components/FollowUpPanel.jsx'
import { DocumentsPanel } from '../components/DocumentsPanel.jsx'
import { StatusActionsPanel } from '../components/StatusActionsPanel.jsx'
import { DetailError, DetailLoading } from '../components/DetailStates.jsx'
import { documentApi } from '../../documents/api/documentApi.js'
import { useWorkspaceApi } from '../useWorkspaceApi.js'
import { PageHeader } from '../../../shared/ui/PageHeader.jsx'
import { StatusBadge } from '../components/StatusBadge.jsx'

export function ComplaintDetailPage({ completed = false }) {
  const { id } = useParams()
  const { token } = useContext(AuthContext)

  const [reloadKey, setReloadKey] = useState(0)
  const reload = () => setReloadKey((key) => key + 1)

  const detail = useWorkspaceApi(() => {
    if (!id || !token) return Promise.resolve(null)
    const getter = completed ? complaintApi.getCompleted : complaintApi.getOpen
    return getter(token, id)
  }, [id, token, completed])

  const history = useWorkspaceApi(() => {
    if (!id || !token) return Promise.resolve([])
    const historyGetter = completed ? complaintApi.listCompletedHistory : complaintApi.listOpenHistory
    return historyGetter(token, id, { limit: 100 })
  }, [id, token, reloadKey, completed])

  const followUps = useWorkspaceApi(() => {
    if (!id || !token) return Promise.resolve([])
    return followUpsApi.listForTicket(token, id)
  }, [id, token, reloadKey])

  const documents = useWorkspaceApi(() => {
    if (!id || !token) return Promise.resolve([])
    return documentApi.listForTicket(token, id)
  }, [id, token, reloadKey])

  if (detail.loading) return <DetailLoading />
  if (detail.error || !detail.data) return <DetailError message={detail.error} />

  const data = detail.data

  return (
    <div>
      <PageHeader
        eyebrow="Call Center Workspace"
        backTo={completed ? '/workspace/complaints/completed' : '/workspace/complaints/open'}
        backLabel={completed ? 'Kembali ke tiket selesai' : 'Kembali ke tiket terbuka'}
        title={data.id}
        subtitle={data.summary || 'Detail tiket pengaduan'}
        actions={<StatusBadge code={data.status_code} label={data.status_description} />}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <ComplaintInfoPanel detail={data} />
          <TimelinePanel
            items={history.data || []}
            loading={history.loading}
            error={history.error}
            reload={reload}
          />
        </div>
        <aside className="space-y-6">
          {!completed ? (
            <StatusActionsPanel
              complaintId={data.id}
              statusCode={data.status_code}
              onTransitioned={reload}
            />
          ) : null}
          <FollowUpPanel
            items={followUps.data || []}
            loading={followUps.loading}
            error={followUps.error}
            reload={reload}
          />
          <DocumentsPanel items={documents.data || []} loading={documents.loading} error={documents.error} />
        </aside>
      </div>
    </div>
  )
}