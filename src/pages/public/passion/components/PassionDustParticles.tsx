// src/pages/public/passion/components/PassionDustParticles.tsx
import { useMemo } from 'react'
type Phase = 'idle' | 'exiting' | 'entering'
interface Dust {
  id: number
  left: number
  top: number
  size: number
  opMin: number
  opMax: number
  driftX: number
  driftY: number
  duration: number
  delay: number
  twinkleDuration: number
  twinkleDelay: number
}
const DUST_COUNT = 240
function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}
function generateDust(): Dust[] {
  return Array.from({ length: DUST_COUNT }, (_, id) => {
    const angle = randomBetween(0, Math.PI * 2)
    const radius = randomBetween(4, 64)
    return {
      id,
      left: 50 + Math.cos(angle) * radius,
      top: 50 + Math.sin(angle) * radius,
      size: randomBetween(1, 3.4),
      opMin: randomBetween(0.05, 0.15),
      opMax: randomBetween(0.75, 1),
      driftX: randomBetween(-40, 40),
      driftY: randomBetween(-40, 40),
      duration: randomBetween(1.6, 4),
      delay: randomBetween(0, 4),
      twinkleDuration: randomBetween(0.7, 2.2),
      twinkleDelay: randomBetween(0, 3),
    }
  })
}
export function PassionDustParticles({ phase, direction }: { phase: Phase; direction: 1 | -1 }) {
  const dust = useMemo(() => generateDust(), [])
  const groupClass =
    phase === 'exiting'
      ? direction === 1
        ? 'passion-dust__group--rush-fwd'
        : 'passion-dust__group--rush-back'
      : phase === 'entering'
      ? direction === 1
        ? 'passion-dust__group--settle-fwd'
        : 'passion-dust__group--settle-back'
      : ''
  return (
    <div className={`passion-dust__group ${groupClass}`} aria-hidden="true">
      {dust.map((d) => (
        <span
          key={d.id}
          className="passion-dust__dot"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            ['--dust-dx' as string]: `${d.driftX}px`,
            ['--dust-dy' as string]: `${d.driftY}px`,
            ['--dust-dur' as string]: `${d.duration}s`,
            ['--dust-delay' as string]: `${d.delay}s`,
            ['--dust-op-min' as string]: d.opMin,
            ['--dust-op-max' as string]: d.opMax,
            ['--dust-twinkle-dur' as string]: `${d.twinkleDuration}s`,
            ['--dust-twinkle-delay' as string]: `${d.twinkleDelay}s`,
          }}
        />
      ))}
    </div>
  )
}