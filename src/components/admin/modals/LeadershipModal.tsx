import { useEffect, useState } from 'react'
import { Modal } from '@/components/admin/Modal'
import { FormInput } from '@/components/admin/FormInput'
import { ToggleSwitch } from '@/components/common/ToggleSwitch'
import { Button } from '@/components/common/Button'
import type { Leadership } from '@/types'

interface LeadershipModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: Leadership | null
  onCreate: (payload: Partial<Leadership>) => Promise<unknown>
  onUpdate: (id: string, payload: Partial<Leadership>) => Promise<unknown>
}

const ICON_OPTIONS = [
  'Award',
  'Users',
  'ExternalLink',
  'Heart',
  'Mic',
  'Shield',
  'Play',
  'Truck',
  'Star',
  'Flag',
].map((v) => ({ value: v, label: v }))

const emptyForm = {
  organization: '',
  position: '',
  description: '',
  period: '',
  start_date: '',
  end_date: '',
  achievements: '',
  icon_type: '',
  position_order: '0',
  is_visible: true,
}

export function LeadershipModal({ isOpen, onClose, initialData, onCreate, onUpdate }: LeadershipModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    if (initialData) {
      setForm({
        organization: initialData.organization,
        position: initialData.position,
        description: initialData.description,
        period: initialData.period || '',
        start_date: initialData.start_date || '',
        end_date: initialData.end_date || '',
        achievements: (initialData.achievements || []).join('\n'),
        icon_type: initialData.icon_type || '',
        position_order: initialData.position_order?.toString() || '0',
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
    if (!form.organization.trim()) next.organization = 'Organization is required.'
    if (!form.position.trim()) next.position = 'Position/role is required.'
    if (!form.description.trim()) next.description = 'Description is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    setSubmitError(null)
    try {
      const achievementsList = form.achievements
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
      const payload: Partial<Leadership> = {
        organization: form.organization.trim(),
        position: form.position.trim(),
        description: form.description.trim(),
        period: form.period.trim() || null,
        start_date: form.start_date.trim() || null,
        end_date: form.end_date.trim() || null,
        achievements: achievementsList.length ? achievementsList : null,
        icon_type: form.icon_type || null,
        position_order: Number(form.position_order) || 0,
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
      title={initialData ? 'Edit leadership role' : 'Add leadership role'}
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
      <div className="form-row">
        <FormInput
          label="Organization"
          name="organization"
          required
          value={form.organization}
          onChange={(v) => setForm((f) => ({ ...f, organization: v }))}
          error={errors.organization}
        />
        <FormInput
          label="Role"
          name="position"
          required
          value={form.position}
          onChange={(v) => setForm((f) => ({ ...f, position: v }))}
          error={errors.position}
        />
      </div>
      <FormInput
        label="Description"
        name="description"
        type="textarea"
        required
        value={form.description}
        onChange={(v) => setForm((f) => ({ ...f, description: v }))}
        error={errors.description}
      />
      <FormInput
        label="Period"
        name="period"
        placeholder="e.g. 01/2025 - Present"
        value={form.period}
        onChange={(v) => setForm((f) => ({ ...f, period: v }))}
      />
      <div className="form-row">
        <FormInput
          label="Start date"
          name="start_date"
          value={form.start_date}
          onChange={(v) => setForm((f) => ({ ...f, start_date: v }))}
        />
        <FormInput
          label="End date"
          name="end_date"
          value={form.end_date}
          onChange={(v) => setForm((f) => ({ ...f, end_date: v }))}
        />
      </div>
      <FormInput
        label="Achievements"
        name="achievements"
        type="textarea"
        placeholder="One per line"
        value={form.achievements}
        onChange={(v) => setForm((f) => ({ ...f, achievements: v }))}
      />
      <div className="form-row">
        <FormInput
          label="Icon"
          name="icon_type"
          type="select"
          options={ICON_OPTIONS}
          value={form.icon_type}
          onChange={(v) => setForm((f) => ({ ...f, icon_type: v }))}
        />
        <FormInput
          label="Sort order"
          name="position_order"
          type="number"
          value={form.position_order}
          onChange={(v) => setForm((f) => ({ ...f, position_order: v }))}
        />
      </div>
      <ToggleSwitch
        checked={form.is_visible}
        onChange={(v) => setForm((f) => ({ ...f, is_visible: v }))}
        label="Visible on site"
      />
    </Modal>
  )
}
