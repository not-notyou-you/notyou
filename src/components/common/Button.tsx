import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'ghost' | 'danger'
  size?: 'default' | 'sm'
  fullWidth?: boolean
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'default',
  size = 'default',
  fullWidth = false,
  loading = false,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const classes = [
    'admin-button',
    variant !== 'default' ? `admin-button--${variant}` : '',
    size === 'sm' ? 'admin-button--sm' : '',
    fullWidth ? 'admin-button--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {loading ? 'Please wait…' : children}
    </button>
  )
}
