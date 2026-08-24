import { useEffect, useState } from 'react'
import { Modal } from '@/components/admin/Modal'
import { FormInput } from '@/components/admin/FormInput'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { ToggleSwitch } from '@/components/common/ToggleSwitch'
import { Button } from '@/components/common/Button'
import type { PageContent } from '@/types'
import type { ImageSection } from '@/lib/imageUrl'

interface PageContentModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: PageContent | null
  section: ImageSection
  onSave: (payload: Partial<PageContent>) => Promise<unknown>
}

const emptyForm = { greeting_text: '', quote_text: '', subtitle_text: '', image_url: '', is_published: true }

export function PageContentModal({ isOpen, onClose, initialData, section, onSave }: PageContentModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setForm({
      greeting_text: initialData?.greeting_text || '',
      quote_text: initialData?.quote_text || '',
      subtitle_text: initialData?.subtitle_text || '',
      image_url: initialData?.image_url || '',
      is_published: initialData?.is_published ?? true,
    })
    setSubmitError(null)
  }, [isOpen, initialData])

  const handleSubmit = async () => {
    setSaving(true)
    setSubmitError(null)
    try {
      await onSave({
        greeting_text: form.greeting_text.trim() || null,
        quote_text: form.quote_text.trim() || null,
        subtitle_text: form.subtitle_text.trim() || null,
        image_url: form.image_url.trim() || null,
        is_published: form.is_published,
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
      title="Edit page greeting & quote"
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
        label="Greeting"
        name="greeting_text"
        placeholder='e.g. "Say Hello to my workspace"'
        value={form.greeting_text}
        onChange={(v) => setForm((f) => ({ ...f, greeting_text: v }))}
      />
      <FormInput
        label="Quote"
        name="quote_text"
        type="textarea"
        rows={2}
        value={form.quote_text}
        onChange={(v) => setForm((f) => ({ ...f, quote_text: v }))}
      />
      <FormInput
        label="Subtitle"
        name="subtitle_text"
        type="textarea"
        rows={2}
        value={form.subtitle_text}
        onChange={(v) => setForm((f) => ({ ...f, subtitle_text: v }))}
      />
      <ImageUpload
        label="Photo"
        section={section}
        currentImage={form.image_url || null}
        onUpload={(url) => setForm((f) => ({ ...f, image_url: url }))}
      />
      <ToggleSwitch
        checked={form.is_published}
        onChange={(v) => setForm((f) => ({ ...f, is_published: v }))}
        label="Published"
      />
    </Modal>
  )
}
