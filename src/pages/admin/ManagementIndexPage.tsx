import { Link } from 'react-router-dom'
import { AdminHeader } from '@/components/admin/AdminHeader'

export function ManagementIndexPage() {
  return (
    <div className="admin-shell">
      <AdminHeader title="Admin Dashboard" />
      <main className="admin-main">
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 20, margin: '0 0 4px' }}>Welcome, Admin!</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 13 }}>
            Pick a page to manage its content.
          </p>
        </div>
        <div className="nav-grid">
          <Link to="/admin/management/identity" className="nav-card section-identity">
            <div className="nav-card__title">Identity</div>
            <p className="nav-card__desc">Education, experience, languages, profile & socials.</p>
            <span className="nav-card__arrow">→</span>
          </Link>
          <Link to="/admin/management/intellect" className="nav-card section-intellect">
            <div className="nav-card__title">Intellect</div>
            <p className="nav-card__desc">Projects, skills, certifications, academic work.</p>
            <span className="nav-card__arrow">→</span>
          </Link>
          <Link to="/admin/management/passion" className="nav-card section-passion">
            <div className="nav-card__title">Passion</div>
            <p className="nav-card__desc">Leadership, creative works, carousel photos.</p>
            <span className="nav-card__arrow">→</span>
          </Link>
        </div>
      </main>
    </div>
  )
}
