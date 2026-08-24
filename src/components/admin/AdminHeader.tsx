import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { SunIcon, MoonIcon, ArrowLeftIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/hooks/useAuth'

interface AdminHeaderProps {
  title: string
  backTo?: string
}

export function AdminHeader({ title, backTo }: AdminHeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/admin/login', { replace: true })
    } catch {
      toast.error('Could not sign out. Try again.')
    }
  }

  return (
    <header className="admin-header">
      <div className="admin-header__left">
        {backTo && (
          <button
            className="icon-button"
            aria-label="Go back"
            onClick={() => navigate(backTo)}
          >
            <ArrowLeftIcon />
          </button>
        )}
        <span className="admin-header__title">{title}</span>
      </div>
      <div className="admin-header__actions">
        <button
          className="icon-button"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <button className="icon-button" aria-label="Sign out" onClick={handleLogout}>
          <ArrowRightOnRectangleIcon />
        </button>
      </div>
    </header>
  )
}
