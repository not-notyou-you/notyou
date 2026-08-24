// Unsigned upload straight from the browser to Cloudinary.
// Requires an unsigned upload preset (see BACKEND_SETUP_GUIDE.md step 3) —
// no API secret ever touches the frontend.

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export interface UploadOptions {
  onProgress?: (percent: number) => void
  maxSizeMB?: number
}

export class CloudinaryUploadError extends Error {}

export function validateImageFile(file: File, maxSizeMB = 5): void {
  if (!file.type.startsWith('image/')) {
    throw new CloudinaryUploadError('Only image files are allowed.')
  }
  const maxBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxBytes) {
    throw new CloudinaryUploadError(`Image is larger than ${maxSizeMB}MB. Pick a smaller file.`)
  }
}

export function uploadToCloudinary(file: File, options: UploadOptions = {}): Promise<string> {
  const { onProgress, maxSizeMB = 5 } = options

  return new Promise((resolve, reject) => {
    try {
      validateImageFile(file, maxSizeMB)
    } catch (err) {
      reject(err)
      return
    }

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      reject(
        new CloudinaryUploadError(
          'Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.'
        )
      )
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    // Folder is set on the preset itself (Cloudinary "asset folder"),
    // not passed here — unsigned presets in Dynamic Folder Mode can
    // reject/override requests that also send a `folder` field.

    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText)
        if (xhr.status >= 200 && xhr.status < 300 && response.secure_url) {
          resolve(response.secure_url as string)
        } else {
          reject(new CloudinaryUploadError(response.error?.message || 'Upload failed. Try again.'))
        }
      } catch {
        reject(new CloudinaryUploadError('Unexpected response from Cloudinary.'))
      }
    }

    xhr.onerror = () => reject(new CloudinaryUploadError('Network error during upload.'))
    xhr.send(formData)
  })
}
