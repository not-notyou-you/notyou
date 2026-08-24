import type { ReactNode } from 'react'
import { AdminHeader } from './AdminHeader'

interface AdminLayoutProps {
  title: string
  backTo?: string
  /** Sets the accent color scope: identity (neutral), intellect (blue), passion (red) */
  section?: 'identity' | 'intellect' | 'passion'
  children: ReactNode
}

export function AdminLayout({ title, backTo, section, children }: AdminLayoutProps) {
  const sectionClass = section ? `section-${section}` : ''

  return (
    <div className={`admin-shell ${sectionClass}`}>
      <AdminHeader title={title} backTo={backTo} />
      <main className="admin-main">{children}</main>
    </div>
  )
}
