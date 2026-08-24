import { useState } from 'react'
import { uploadToCloudinary } from '@/lib/cloudinary'

export function useImageUpload(maxSizeMB = 5) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const upload = async (file: File): Promise<string | null> => {
    setUploading(true)
    setProgress(0)
    setError(null)
    try {
      const url = await uploadToCloudinary(file, { maxSizeMB, onProgress: setProgress })
      return url
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.')
      return null
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading, progress, error }
}
