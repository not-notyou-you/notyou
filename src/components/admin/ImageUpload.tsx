import { useRef, useState, type DragEvent } from 'react'
import toast from 'react-hot-toast'
import { useImageUpload } from '@/hooks/useImageUpload'
import { ImageWithFallback } from './ImageWithFallback'
import { isLikelyUrl, normalizeImageUrl, type ImageSection } from '@/lib/imageUrl'

interface ImageUploadProps {
  onUpload: (url: string) => void
  currentImage?: string | null
  label?: string
  maxSizeMB?: number
  section: ImageSection
}

type Mode = 'upload' | 'link'

export function ImageUpload({ onUpload, currentImage, label = 'Image', maxSizeMB = 5, section }: ImageUploadProps) {
  const { upload, uploading, progress } = useImageUpload(maxSizeMB)
  const [mode, setMode] = useState<Mode>('upload')
  const [dragging, setDragging] = useState(false)
  const [linkDraft, setLinkDraft] = useState('')
  const [linkError, setLinkError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    const url = await upload(file)
    if (url) {
      onUpload(url)
      toast.success('Image uploaded.')
    } else {
      toast.error('Could not upload image. Check the file and try again.')
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const handleUseLink = () => {
    if (!isLikelyUrl(linkDraft)) {
      setLinkError('Paste a full link starting with http:// or https://')
      return
    }
    const normalized = normalizeImageUrl(linkDraft)
    onUpload(normalized)
    setLinkError(null)
    setLinkDraft('')
    toast.success('Image link saved.')
  }

  return (
    <div className="form-group">
      <label>
        {label}
        <span className="field-optional">optional — any image format, up to {maxSizeMB}MB</span>
      </label>

      <div className="image-upload__tabs">
        <button
          type="button"
          className={`image-upload__tab ${mode === 'upload' ? 'image-upload__tab--active' : ''}`}
          onClick={() => setMode('upload')}
        >
          Upload file
        </button>
        <button
          type="button"
          className={`image-upload__tab ${mode === 'link' ? 'image-upload__tab--active' : ''}`}
          onClick={() => setMode('link')}
        >
          Paste a link
        </button>
      </div>

      {currentImage && (
        <ImageWithFallback src={currentImage} section={section} alt="Current" className="image-upload__preview" />
      )}

      {mode === 'upload' && (
        <div
          className={`image-upload ${dragging ? 'image-upload--dragging' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div className="image-upload__hint">
            {uploading ? `Uploading… ${progress}%` : 'Click or drop an image here'}
          </div>
          {uploading && (
            <div className="image-upload__progress">
              <div className="image-upload__progress-bar" style={{ width: `${progress}%` }} />
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      )}

      {mode === 'link' && (
        <div>
          <div className="image-upload__link-row">
            <input
              type="url"
              placeholder="https://drive.google.com/file/d/…/view or any direct image link"
              value={linkDraft}
              onChange={(e) => {
                setLinkDraft(e.target.value)
                setLinkError(null)
              }}
            />
            <button type="button" className="admin-button admin-button--sm" onClick={handleUseLink}>
              Use link
            </button>
          </div>
          {linkError && <div className="field-error">{linkError}</div>}
          <div className="image-upload__hint" style={{ marginTop: 6 }}>
            Google Drive links are converted automatically — just make sure the file is
            shared as "Anyone with the link".
          </div>
        </div>
      )}
    </div>
  )
}
