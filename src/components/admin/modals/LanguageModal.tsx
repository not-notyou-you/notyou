import { useEffect, useState } from 'react'
import { Modal } from '@/components/admin/Modal'
import { FormInput } from '@/components/admin/FormInput'
import { ToggleSwitch } from '@/components/common/ToggleSwitch'
import { Button } from '@/components/common/Button'
import type { Language, LanguageLevel } from '@/types'

interface LanguageModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: Language | null
  onCreate: (payload: Partial<Language>) => Promise<unknown>
  onUpdate: (id: string, payload: Partial<Language>) => Promise<unknown>
}

const LEVEL_OPTIONS = [
  { value: 'Native', label: 'Native' },
  { value: 'Fluent', label: 'Fluent' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Beginner', label: 'Beginner' },
]

const emptyForm = { name: '', level: '' as LanguageLevel | '', position: '0', is_visible: true }

export function LanguageModal({ isOpen, onClose, initialData, onCreate, onUpdate }: LanguageModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    if (initialData) {
      setForm({
        name: initialData.name,
        level: initialData.level,
        position: initialData.position?.toString() || '0',
        is_visible: initialData.is_visible,
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
    setSubmitError(null)
  }, [isOpen, initialData])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Language name is required.'
    if (!form.level) next.level = 'Proficiency level is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    setSubmitError(null)
    try {
      const payload: Partial<Language> = {
        name: form.name.trim(),
        level: form.level as LanguageLevel,
        position: Number(form.position) || 0,
        is_visible: form.is_visible,
      }
      if (initialData) {
        await onUpdate(initialData.id, payload)
      } else {
        await onCreate(payload)
      }
      onClose()
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Could not save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title={initialData ? 'Edit language' : 'Add language'}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={saving}>
            Save
          </Button>
        </>
      }
    >
      {submitError && <div className="modal-error">{submitError}</div>}
      <FormInput
        label="Language"
        name="name"
        required
        value={form.name}
        onChange={(v) => setForm((f) => ({ ...f, name: v }))}
        error={errors.name}
      />
      <FormInput
        label="Proficiency level"
        name="level"
        type="select"
        required
        options={LEVEL_OPTIONS}
        value={form.level}
        onChange={(v) => setForm((f) => ({ ...f, level: v as LanguageLevel }))}
        error={errors.level}
      />
      <FormInput
        label="Sort order"
        name="position"
        type="number"
        value={form.position}
        onChange={(v) => setForm((f) => ({ ...f, position: v }))}
      />
      <ToggleSwitch
        checked={form.is_visible}
        onChange={(v) => setForm((f) => ({ ...f, is_visible: v }))}
        label="Visible on site"
      />
    </Modal>
  )
}
