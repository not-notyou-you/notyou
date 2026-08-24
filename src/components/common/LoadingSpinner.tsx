interface LoadingSpinnerProps {
  fullPage?: boolean
  label?: string
}

export function LoadingSpinner({ fullPage = false, label }: LoadingSpinnerProps) {
  const content = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span className="spinner" role="status" aria-label={label || 'Loading'} />
      {label && <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>}
    </div>
  )

  if (fullPage) {
    return <div className="spinner-page">{content}</div>
  }

  return content
}
