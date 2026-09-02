// src/pages/public/intellect/components/IntellectLoader.tsx
interface IntellectLoaderProps {
  progress: number
}

export function IntellectLoader({ progress }: IntellectLoaderProps) {
  const clamped = Math.min(100, Math.max(0, progress))
  const full = clamped >= 100
  const glowSize = 6 + (clamped / 100) * 26

  return (
    <div className="intellect-loader">
      <div className="intellect-loader__track">
        <div
          className={`intellect-loader__fill${full ? ' intellect-loader__fill--full' : ''}`}
          style={{ width: `${clamped}%`, ['--il-glow' as string]: `${glowSize}px` }}
        />
      </div>
    </div>
  )
}