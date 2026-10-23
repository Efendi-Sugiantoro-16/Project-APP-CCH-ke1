import {
  Building2,
  CalendarCheck,
  CheckCircle2,
  Inbox,
  LayoutDashboard,
  Send,
  Users,
} from 'lucide-react'

/** Workspace navigation model. Grouped like the reference design. */
export const WORKSPACE_NAV = [
  {
    label: 'Monitoring',
    items: [
      { to: '/workspace', end: true, icon: LayoutDashboard, label: 'Dasbor' },
      { to: '/workspace/complaints/open', icon: Inbox, label: 'Tiket Terbuka' },
      { to: '/workspace/complaints/received-open', icon: Building2, label: 'Diterima' },
      { to: '/workspace/complaints/sent-open', icon: Send, label: 'Dikirim' },
      { to: '/workspace/complaints/completed', icon: CheckCircle2, label: 'Selesai' },
      { to: '/workspace/follow-ups', icon: CalendarCheck, label: 'Follow Up' },
    ],
  },
  {
    label: 'Administrator',
    items: [{ to: '/admin/users', icon: Users, label: 'Kelola Pengguna' }],
  },
]