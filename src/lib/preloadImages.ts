// src/lib/preloadImages.ts
export function collectImageUrls(records: unknown[]): string[] {
  const urls = new Set<string>()
  const isImageKey = (key: string) => /(image|photo|logo|avatar|thumbnail|cover|banner)_url$/i.test(key)
  const visit = (value: unknown) => {
    if (!value || typeof value !== 'object') return
    Object.entries(value as Record<string, unknown>).forEach(([key, val]) => {
      if (typeof val === 'string' && isImageKey(key) && /^(https?:\/\/|\/)/.test(val)) {
        urls.add(val)
      } else if (Array.isArray(val)) {
        val.forEach(visit)
      } else if (val && typeof val === 'object') {
        visit(val)
      }
    })
  }
  records.forEach(visit)
  return Array.from(urls)
}

export function preloadImagesWithProgress(
  urls: string[],
  onProgress: (ratio: number) => void,
  timeoutMs = 8000
): Promise<void> {
  const unique = Array.from(new Set(urls.filter(Boolean)))
  const total = unique.length
  if (total === 0) {
    onProgress(1)
    return Promise.resolve()
  }
  let done = 0
  const loadOne = (url: string) =>
    new Promise<void>((resolve) => {
      const img = new Image()
      const finish = () => {
        done += 1
        onProgress(done / total)
        resolve()
      }
      img.onload = finish
      img.onerror = finish
      img.src = url
    })
  const allDone = Promise.all(unique.map(loadOne)).then(() => undefined)
  const fallback = new Promise<void>((resolve) => {
    window.setTimeout(() => {
      onProgress(1)
      resolve()
    }, timeoutMs)
  })
  return Promise.race([allDone, fallback])
}