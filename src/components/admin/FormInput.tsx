import { useState } from 'react'

export type FormInputType = 'text' | 'email' | 'number' | 'date' | 'url' | 'password' | 'textarea' | 'select'

interface Option {
  value: string
  label: string
}

interface FormInputProps {
  label: string
  name: string
  type?: FormInputType
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  options?: Option[]
  error?: string
  disabled?: boolean
  rows?: number
}

export function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  options,
  error,
  disabled,
  rows = 4,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="form-group">
      <label htmlFor={name}>
        {label}
        {required ? <span className="field-required">*</span> : <span className="field-optional">optional</span>}
      </label>

      {type === 'textarea' && (
        <textarea
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {type === 'select' && (
        <select
          id={name}
          name={name}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled hidden={required}>
            {placeholder || 'Select…'}
          </option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {type === 'password' && (
        <div style={{ position: 'relative' }}>
          <input
            id={name}
            name={name}
            type={showPassword ? 'text' : 'password'}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            style={{ paddingRight: 60 }}
            onChange={(e) => onChange(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-secondary)',
            }}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      )}

      {type !== 'textarea' && type !== 'select' && type !== 'password' && (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {error && <div className="field-error">{error}</div>}
    </div>
  )
}
