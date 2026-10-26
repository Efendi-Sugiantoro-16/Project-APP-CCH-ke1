import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './layouts/AppShell.jsx'
import { RequireAuth } from './guards/RequireAuth.jsx'
import LoginPage from '../features/auth/pages/LoginPage.jsx'
import DevAuthLoginPage from '../features/auth/pages/DevAuthLoginPage.jsx'
import LandingPage from '../features/home/pages/LandingPage.jsx'
import GuestIntakePage from '../features/intake/submission/pages/GuestIntakePage.jsx'
import IntakeResultPage from '../features/intake/submission/pages/IntakeResultPage.jsx'
import ReviewQueuePage from '../features/intake/review/pages/ReviewQueuePage.jsx'
import ReviewDraftPage from '../features/intake/review/pages/ReviewDraftPage.jsx'
import { WorkspaceLayout } from '../features/workspace/WorkspaceLayout.jsx'
import { WorkspaceDashboard } from '../features/complaints/pages/WorkspaceDashboard.jsx'
import {
  OpenComplaintsPage,
  CompletedComplaintsPage,
  ReceivedOpenComplaintsPage,
  SentOpenComplaintsPage,
} from '../features/complaints/pages/ComplaintListPages.jsx'
import { ComplaintDetailPage } from '../features/complaints/pages/ComplaintDetailPage.jsx'
import { CreateComplaintPage } from '../features/complaints/pages/CreateComplaintPage.jsx'
import { FollowUpsWorkspacePage } from '../features/followups/pages/FollowUpsWorkspacePage.jsx'
import {
  OfficeFollowUpsPage,
  DueTodayFollowUpsPage,
} from '../features/followups/pages/FollowUpPages.jsx'
import { UserLevelsPage } from '../features/admin/pages/UserLevelsPage.jsx'
import { UsersManagementPage } from '../features/admin/pages/UsersManagementPage.jsx'

export const AppRoutes = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'dev-login', element: <DevAuthLoginPage /> },
      { path: 'intake', element: <GuestIntakePage /> },
      { path: 'intake/result', element: <IntakeResultPage /> },
      {
        path: 'review',
        element: (
          <RequireAuth>
            <ReviewQueuePage />
          </RequireAuth>
        ),
      },
      {
        path: 'review/drafts/:id',
        element: (
          <RequireAuth>
            <ReviewDraftPage />
          </RequireAuth>
        ),
      },
    ],
  },
  {
    // Dedicated workspace shell: dark sidebar + topbar, nested pages.
    path: '/workspace',
    element: (
      <RequireAuth>
        <WorkspaceLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <WorkspaceDashboard /> },
      { path: 'follow-ups', element: <FollowUpsWorkspacePage /> },
      { path: 'follow-ups/all', element: <OfficeFollowUpsPage /> },
      { path: 'follow-ups/due-today', element: <DueTodayFollowUpsPage /> },
      { path: 'complaints/create', element: <CreateComplaintPage /> },
      { path: 'complaints/open', element: <OpenComplaintsPage /> },
      { path: 'complaints/completed', element: <CompletedComplaintsPage /> },
      { path: 'complaints/received-open', element: <ReceivedOpenComplaintsPage /> },
      { path: 'complaints/sent-open', element: <SentOpenComplaintsPage /> },
      { path: 'complaints/open/:id', element: <ComplaintDetailPage /> },
      { path: 'complaints/completed/:id', element: <ComplaintDetailPage completed /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <WorkspaceLayout />
      </RequireAuth>
    ),
    children: [
      { path: 'users', element: <UsersManagementPage /> },
      { path: 'user-levels', element: <UserLevelsPage /> },
    ],
  },
])