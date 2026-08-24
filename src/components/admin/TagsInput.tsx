import { useState, type KeyboardEvent } from 'react'

interface TagsInputProps {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}

export function TagsInput({ label, values, onChange, placeholder }: TagsInputProps) {
  const [draft, setDraft] = useState('')

  const commit = () => {
    const trimmed = draft.trim()
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed])
    }
    setDraft('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commit()
    } else if (e.key === 'Backspace' && draft === '' && values.length > 0) {
      onChange(values.slice(0, -1))
    }
  }

  const removeTag = (tag: string) => onChange(values.filter((v) => v !== tag))

  return (
    <div className="form-group">
      <label>
        {label}
        <span className="field-optional">optional — press Enter to add</span>
      </label>
      <div className="tags-input">
        {values.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
            <button type="button" aria-label={`Remove ${tag}`} onClick={() => removeTag(tag)}>
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          placeholder={values.length === 0 ? placeholder : ''}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
        />
      </div>
    </div>
  )
}
