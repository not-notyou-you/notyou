import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/common/Button'
import { FormInput } from '@/components/admin/FormInput'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (loading) return <LoadingSpinner fullPage label="Checking session…" />
  if (isAuthenticated) return <Navigate to="/admin/management" replace />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(username.trim(), password)
      navigate('/admin/management', { replace: true })
    } catch (err) {
      setError('Username or password is incorrect.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Admin sign in</h1>
        <p>Manage the Identity, Intellect, and Passion pages.</p>
        {error && <div className="modal-error">{error}</div>}
        <FormInput
          label="Username"
          name="username"
          type="text"
          required
          value={username}
          onChange={setUsername}
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          required
          value={password}
          onChange={setPassword}
        />
        <Button type="submit" variant="primary" fullWidth loading={submitting}>
          Sign in
        </Button>
      </form>
    </div>
  )
}
