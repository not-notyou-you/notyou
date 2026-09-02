// src/lib/downloadFile.ts
export function getFileExtension(url: string, fallback = 'jpg'): string {
  const clean = url.split('?')[0].split('#')[0]
  const match = clean.match(/\.([a-zA-Z0-9]+)$/)
  return match ? match[1] : fallback
}

export async function downloadFile(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(blobUrl)
  } catch {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}