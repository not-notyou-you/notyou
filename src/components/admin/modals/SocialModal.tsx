import { useEffect, useState } from 'react'
import { Modal } from '@/components/admin/Modal'
import { FormInput } from '@/components/admin/FormInput'
import { ToggleSwitch } from '@/components/common/ToggleSwitch'
import { Button } from '@/components/common/Button'
import type { Social } from '@/types'

interface SocialModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: Social | null
  onCreate: (payload: Partial<Social>) => Promise<unknown>
  onUpdate: (id: string, payload: Partial<Social>) => Promise<unknown>
}

const emptyForm = { platform: '', url: '', position: '0', is_visible: true }

export function SocialModal({ isOpen, onClose, initialData, onCreate, onUpdate }: SocialModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    if (initialData) {
      setForm({
        platform: initialData.platform,
        url: initialData.url || '',
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
    if (!form.platform.trim()) next.platform = 'Platform name is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    setSubmitError(null)
    try {
      const payload: Partial<Social> = {
        platform: form.platform.trim().toLowerCase(),
        url: form.url.trim() || null,
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
      setSubmitError(e instanceof Error ? e.message : 'Could not save — platform names must be unique.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title={initialData ? 'Edit social link' : 'Add social link'}
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
        label="Platform"
        name="platform"
        required
        placeholder="e.g. instagram, github, linkedin"
        value={form.platform}
        onChange={(v) => setForm((f) => ({ ...f, platform: v }))}
        error={errors.platform}
      />
      <FormInput
        label="URL"
        name="url"
        type="url"
        placeholder="https://…"
        value={form.url}
        onChange={(v) => setForm((f) => ({ ...f, url: v }))}
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
