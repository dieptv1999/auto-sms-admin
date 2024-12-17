import {IconChartHistogram, IconUsers,} from '@tabler/icons-react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  // {
  //   title: 'sidebar.dashboard',
  //   label: '',
  //   href: '/',
  //   icon: <IconLayoutDashboard size={18} />,
  // },
  {
    title: 'sidebar.users',
    label: '',
    href: '/users',
    icon: <IconUsers size={18} />,
  },
  {
    title: 'sidebar.analytics',
    label: '',
    href: '/analysis',
    icon: <IconChartHistogram size={18} />,
  },
  // {
  //   title: 'sidebar.settings',
  //   label: '',
  //   href: '/settings',
  //   icon: <IconSettings size={18} />,
  // },
]
