import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <LoadingSpinner fullPage label="Checking session…" />
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />

  return <>{children}</>
}
