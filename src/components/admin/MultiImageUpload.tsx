import { ImageUpload } from './ImageUpload'
import { ImageWithFallback } from './ImageWithFallback'
import type { ImageSection } from '@/lib/imageUrl'

interface MultiImageUploadProps {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  section: ImageSection
  max?: number
}

/** A cover image (elsewhere) plus up to `max` extra gallery images, each removable. */
export function MultiImageUpload({ label, values, onChange, section, max = 3 }: MultiImageUploadProps) {
  const removeAt = (index: number) => onChange(values.filter((_, i) => i !== index))
  const addImage = (url: string) => onChange([...values, url])

  return (
    <div className="form-group">
      <label>
        {label}
        <span className="field-optional">
          optional — up to {max}, {values.length}/{max} added
        </span>
      </label>

      {values.length > 0 && (
        <div className="multi-image-grid">
          {values.map((url, index) => (
            <div key={`${url}-${index}`} className="multi-image-grid__item">
              <ImageWithFallback src={url} section={section} alt={`${label} ${index + 1}`} />
              <button
                type="button"
                className="multi-image-grid__remove"
                aria-label={`Remove image ${index + 1}`}
                onClick={() => removeAt(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {values.length < max && (
        <ImageUpload
          label={`Add image (${values.length + 1} of ${max})`}
          section={section}
          onUpload={addImage}
        />
      )}
    </div>
  )
}
