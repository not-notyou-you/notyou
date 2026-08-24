import { useEffect, useState } from 'react'
import { Modal } from '@/components/admin/Modal'
import { FormInput } from '@/components/admin/FormInput'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { Button } from '@/components/common/Button'
import type { Profile } from '@/types'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: Profile | null
  onSave: (payload: Partial<Profile>) => Promise<unknown>
}

const emptyForm = { name: '', short_bio: '', full_description: '', email: '', phone: '', location: '', photo_url: '' }

export function ProfileModal({ isOpen, onClose, initialData, onSave }: ProfileModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setForm({
      name: initialData?.name || '',
      short_bio: initialData?.short_bio || '',
      full_description: initialData?.full_description || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      location: initialData?.location || '',
      photo_url: initialData?.photo_url || '',
    })
    setErrors({})
    setSubmitError(null)
  }, [isOpen, initialData])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Name is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    setSubmitError(null)
    try {
      await onSave({
        name: form.name.trim(),
        short_bio: form.short_bio.trim() || null,
        full_description: form.full_description.trim() || null,
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        location: form.location.trim() || null,
        photo_url: form.photo_url.trim() || null,
      })
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
      title="Edit profile"
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
        label="Full name"
        name="name"
        required
        value={form.name}
        onChange={(v) => setForm((f) => ({ ...f, name: v }))}
        error={errors.name}
      />
      <FormInput
        label="Short bio"
        name="short_bio"
        type="textarea"
        rows={2}
        value={form.short_bio}
        onChange={(v) => setForm((f) => ({ ...f, short_bio: v }))}
      />
      <FormInput
        label="Full description"
        name="full_description"
        type="textarea"
        value={form.full_description}
        onChange={(v) => setForm((f) => ({ ...f, full_description: v }))}
      />
      <div className="form-row">
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
        />
        <FormInput
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
        />
      </div>
      <FormInput
        label="Location"
        name="location"
        value={form.location}
        onChange={(v) => setForm((f) => ({ ...f, location: v }))}
      />
      <ImageUpload
        label="Profile photo"
        section="identity"
        currentImage={form.photo_url || null}
        onUpload={(url) => setForm((f) => ({ ...f, photo_url: url }))}
      />
    </Modal>
  )
}
