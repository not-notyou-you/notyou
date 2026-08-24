interface ToggleSwitchProps {
  checked: boolean
  onChange: (value: boolean) => void
  label?: string
  disabled?: boolean
}

export function ToggleSwitch({ checked, onChange, label, disabled }: ToggleSwitchProps) {
  return (
    <div className="toggle-row">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        className={`toggle-switch ${checked ? 'toggle-switch--on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="toggle-switch__knob" />
      </button>
      {label && <span style={{ fontSize: 13 }}>{label}</span>}
    </div>
  )
}
