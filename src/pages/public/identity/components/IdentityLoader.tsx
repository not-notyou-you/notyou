// src/pages/public/identity/components/IdentityLoader.tsx
interface IdentityLoaderProps {
  progress: number
}

export function IdentityLoader({ progress }: IdentityLoaderProps) {
  const clamped = Math.min(100, Math.max(1, progress))
  const fontSize = 28 + (clamped / 100) * 148

  return (
    <div className="identity-loader">
      <span className="identity-loader__number" style={{ fontSize }}>
        {clamped}%
      </span>
    </div>
  )
}