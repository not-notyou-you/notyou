// src/pages/public/passion/components/PassionLoader.tsx
interface PassionLoaderProps {
  progress: number
}

const SIZE = 160
const STROKE = 16
const INSET = STROKE / 2
const SIDE = SIZE - STROKE
const PERIMETER = SIDE * 4

export function PassionLoader({ progress }: PassionLoaderProps) {
  const clamped = Math.min(100, Math.max(0, progress))
  const dashOffset = PERIMETER * (1 - clamped / 100)

  return (
    <div className="passion-loader">
      <svg className="passion-loader__ring" viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <rect
          className="passion-loader__track"
          x={INSET}
          y={INSET}
          width={SIDE}
          height={SIDE}
        />
        <rect
          className="passion-loader__progress"
          x={INSET}
          y={INSET}
          width={SIDE}
          height={SIDE}
          strokeDasharray={PERIMETER}
          strokeDashoffset={dashOffset}
        />
      </svg>
    </div>
  )
}