import { useEffect, useState } from 'react'
import { Modal } from '@/components/admin/Modal'
import { FormInput } from '@/components/admin/FormInput'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { ToggleSwitch } from '@/components/common/ToggleSwitch'
import { Button } from '@/components/common/Button'
import type { Skill, SkillCategory } from '@/types'

interface SkillModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: Skill | null
  onCreate: (payload: Partial<Skill>) => Promise<unknown>
  onUpdate: (id: string, payload: Partial<Skill>) => Promise<unknown>
}

const CATEGORY_OPTIONS = [
  { value: 'Programming Languages', label: 'Programming Languages' },
  { value: 'Frameworks', label: 'Frameworks' },
  { value: 'Tools', label: 'Tools' },
]

const emptyForm = {
  skill_name: '',
  category: '' as SkillCategory | '',
  image_url: '',
  position: '0',
  is_visible: true,
}

export function SkillModal({ isOpen, onClose, initialData, onCreate, onUpdate }: SkillModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    if (initialData) {
      setForm({
        skill_name: initialData.skill_name,
        category: initialData.category,
        image_url: initialData.image_url || '',
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
    if (!form.skill_name.trim()) next.skill_name = 'Skill name is required.'
    if (!form.category) next.category = 'Category is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    setSubmitError(null)
    try {
      const payload: Partial<Skill> = {
        skill_name: form.skill_name.trim(),
        category: form.category as SkillCategory,
        image_url: form.image_url.trim() || null,
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
      title={initialData ? 'Edit skill' : 'Add skill'}
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
        label="Skill name"
        name="skill_name"
        required
        value={form.skill_name}
        onChange={(v) => setForm((f) => ({ ...f, skill_name: v }))}
        error={errors.skill_name}
      />
      <FormInput
        label="Category"
        name="category"
        type="select"
        required
        options={CATEGORY_OPTIONS}
        value={form.category}
        onChange={(v) => setForm((f) => ({ ...f, category: v as SkillCategory }))}
        error={errors.category}
      />
      <FormInput
        label="Sort order"
        name="position"
        type="number"
        value={form.position}
        onChange={(v) => setForm((f) => ({ ...f, position: v }))}
      />
      <ImageUpload
        label="Logo"
        section="intellect"
        currentImage={form.image_url || null}
        onUpload={(url) => setForm((f) => ({ ...f, image_url: url }))}
      />
      <ToggleSwitch
        checked={form.is_visible}
        onChange={(v) => setForm((f) => ({ ...f, is_visible: v }))}
        label="Visible on site"
      />
    </Modal>
  )
}
