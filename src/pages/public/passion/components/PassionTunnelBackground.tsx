// src/pages/public/passion/components/PassionTunnelBackground.tsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
interface Point {
  x: number
  y: number
}
type Phase = 'idle' | 'exiting' | 'entering'
interface BeamDef {
  id: 'tl' | 'tr' | 'bl' | 'br'
  corner: Point
  portalCorner: Point
}
interface WaveComponent {
  cycles: number
  phase: number
  ampScale: number
  halfWindow: number
  centerShift: number
}
const BEAM_IDS: BeamDef['id'][] = ['tl', 'tr', 'bl', 'br']
const INTERIOR_POINTS = 9
const PORTAL_RATIO = 0.24
const NEAR_HALF_WIDTH = 9
const FAR_HALF_WIDTH = 0.4
const NEAR_OPACITY = 0.55
const FAR_OPACITY = 0.02
const WAVE_COMPONENTS = 5
const SHOCK_MS = 900
function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}
function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}
function generateWaveComponents(): WaveComponent[] {
  return Array.from({ length: WAVE_COMPONENTS }, () => ({
    cycles: randomBetween(1.3, 2.6),
    phase: randomBetween(0, Math.PI * 2),
    ampScale: randomBetween(0.7, 1.3),
    halfWindow: randomBetween(0.1, 0.24),
    centerShift: randomBetween(-0.2, 0.2),
  }))
}
function buildStraightSpine(corner: Point, portalCorner: Point): Point[] {
  const dx = portalCorner.x - corner.x
  const dy = portalCorner.y - corner.y
  const points: Point[] = [corner]
  for (let i = 1; i <= INTERIOR_POINTS; i++) {
    const t = i / (INTERIOR_POINTS + 1)
    points.push({ x: corner.x + dx * t, y: corner.y + dy * t })
  }
  points.push(portalCorner)
  return points
}
function buildPulseSpine(
  corner: Point,
  portalCorner: Point,
  maxAmp: number,
  progress: number,
  direction: 1 | -1,
  components: WaveComponent[]
): Point[] {
  const dx = portalCorner.x - corner.x
  const dy = portalCorner.y - corner.y
  const len = Math.hypot(dx, dy) || 1
  const perpX = -dy / len
  const perpY = dx / len
  const points: Point[] = [corner]
  for (let i = 1; i <= INTERIOR_POINTS; i++) {
    const t = i / (INTERIOR_POINTS + 1)
    const baseX = corner.x + dx * t
    const baseY = corner.y + dy * t
    let sum = 0
    for (const c of components) {
      const start = direction === 1 ? 1 + c.halfWindow + c.centerShift : -c.halfWindow + c.centerShift
      const end = direction === 1 ? -c.halfWindow + c.centerShift : 1 + c.halfWindow + c.centerShift
      const center = start + (end - start) * progress
      const u = (t - center) / c.halfWindow
      if (Math.abs(u) <= 1) {
        const envelope = Math.cos((u * Math.PI) / 2)
        sum += c.ampScale * envelope * Math.sin(u * Math.PI * c.cycles + c.phase)
      }
    }
    const offset = (maxAmp * sum) / Math.sqrt(WAVE_COMPONENTS)
    points.push({ x: baseX + perpX * offset, y: baseY + perpY * offset })
  }
  points.push(portalCorner)
  return points
}
function buildShockSpine(
  corner: Point,
  portalCorner: Point,
  maxAmp: number,
  progress: number,
  components: WaveComponent[]
): Point[] {
  const dx = portalCorner.x - corner.x
  const dy = portalCorner.y - corner.y
  const len = Math.hypot(dx, dy) || 1
  const perpX = -dy / len
  const perpY = dx / len
  const decay = 1 - progress
  const points: Point[] = [corner]
  for (let i = 1; i <= INTERIOR_POINTS; i++) {
    const t = i / (INTERIOR_POINTS + 1)
    const baseX = corner.x + dx * t
    const baseY = corner.y + dy * t
    let sum = 0
    for (const c of components) {
      const envelope = Math.sin(Math.PI * t)
      sum += c.ampScale * envelope * Math.sin(t * c.cycles * Math.PI * 2 + c.phase + progress * 8)
    }
    const offset = (maxAmp * decay * sum) / Math.sqrt(WAVE_COMPONENTS)
    points.push({ x: baseX + perpX * offset, y: baseY + perpY * offset })
  }
  points.push(portalCorner)
  return points
}
function ribbonPath(spine: Point[]): string {
  const n = spine.length
  const left: Point[] = []
  const right: Point[] = []
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    const halfWidth = NEAR_HALF_WIDTH + (FAR_HALF_WIDTH - NEAR_HALF_WIDTH) * t
    const prev = spine[Math.max(0, i - 1)]
    const next = spine[Math.min(n - 1, i + 1)]
    const dx = next.x - prev.x
    const dy = next.y - prev.y
    const len = Math.hypot(dx, dy) || 1
    const px = -dy / len
    const py = dx / len
    left.push({ x: spine[i].x + px * halfWidth, y: spine[i].y + py * halfWidth })
    right.push({ x: spine[i].x - px * halfWidth, y: spine[i].y - py * halfWidth })
  }
  const forward = left.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')
  const backward = right
    .slice()
    .reverse()
    .map((p) => `L ${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(' ')
  return `${forward} ${backward} Z`
}
function buildBeams(width: number, height: number): BeamDef[] {
  const pw = width * PORTAL_RATIO
  const ph = height * PORTAL_RATIO
  const px0 = (width - pw) / 2
  const py0 = (height - ph) / 2
  return [
    { id: 'tl', corner: { x: 0, y: 0 }, portalCorner: { x: px0, y: py0 } },
    { id: 'tr', corner: { x: width, y: 0 }, portalCorner: { x: px0 + pw, y: py0 } },
    { id: 'bl', corner: { x: 0, y: height }, portalCorner: { x: px0, y: py0 + ph } },
    { id: 'br', corner: { x: width, y: height }, portalCorner: { x: px0 + pw, y: py0 + ph } },
  ]
}
export function PassionTunnelBackground({
  phase,
  direction,
  exitDurationMs,
  shockKey,
}: {
  phase: Phase
  direction: 1 | -1
  exitDurationMs: number
  shockKey: number
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRefs = useRef<Array<SVGPathElement | null>>([])
  const dimsRef = useRef({ width: 0, height: 0 })
  const beamsRef = useRef<BeamDef[]>([])
  const rafRef = useRef(0)
  const prevPhaseRef = useRef<Phase>('idle')
  const shockMountRef = useRef(0)
  const [portalRect, setPortalRect] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const applyPaths = (spines: Point[][]) => {
    spines.forEach((spine, i) => {
      const el = pathRefs.current[i]
      if (el) el.setAttribute('d', ribbonPath(spine))
    })
  }
  const applyStraight = () => {
    const spines = beamsRef.current.map((b) => buildStraightSpine(b.corner, b.portalCorner))
    applyPaths(spines)
  }
  const measure = () => {
    const el = svgRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const width = Math.max(1, rect.width)
    const height = Math.max(1, rect.height)
    dimsRef.current = { width, height }
    el.setAttribute('viewBox', `0 0 ${width} ${height}`)
    beamsRef.current = buildBeams(width, height)
    const pw = width * PORTAL_RATIO
    const ph = height * PORTAL_RATIO
    setPortalRect({ x: (width - pw) / 2, y: (height - ph) / 2, width: pw, height: ph })
  }
  useLayoutEffect(() => {
    measure()
    applyStraight()
    const onResize = () => {
      measure()
      if (prevPhaseRef.current !== 'exiting') applyStraight()
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])
  useEffect(() => {
    const startedExiting = phase === 'exiting' && prevPhaseRef.current !== 'exiting'
    prevPhaseRef.current = phase
    if (!startedExiting) {
      if (phase !== 'exiting') {
        cancelAnimationFrame(rafRef.current)
        applyStraight()
      }
      return
    }
    if (prefersReducedMotion()) {
      applyStraight()
      return
    }
    const beamComponents: WaveComponent[][] = beamsRef.current.map(() => generateWaveComponents())
    const maxAmp = Math.min(dimsRef.current.width, dimsRef.current.height) * 0.09
    const start = performance.now()
    cancelAnimationFrame(rafRef.current)
    const step = (t: number) => {
      const progress = Math.min(1, (t - start) / exitDurationMs)
      const spines = beamsRef.current.map((b, i) =>
        buildPulseSpine(b.corner, b.portalCorner, maxAmp, progress, direction, beamComponents[i])
      )
      applyPaths(spines)
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
  }, [phase, direction, exitDurationMs])
  useEffect(() => {
    shockMountRef.current += 1
    if (shockMountRef.current === 1) return
    if (prefersReducedMotion()) return
    const beamComponents: WaveComponent[][] = beamsRef.current.map(() => generateWaveComponents())
    const maxAmp = Math.min(dimsRef.current.width, dimsRef.current.height) * 0.05
    const start = performance.now()
    cancelAnimationFrame(rafRef.current)
    const step = (t: number) => {
      const progress = Math.min(1, (t - start) / SHOCK_MS)
      const spines = beamsRef.current.map((b, i) => buildShockSpine(b.corner, b.portalCorner, maxAmp, progress, beamComponents[i]))
      applyPaths(spines)
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
      else applyStraight()
    }
    rafRef.current = requestAnimationFrame(step)
  }, [shockKey])
  return (
    <div className="passion-wave-bg" aria-hidden="true">
      <svg ref={svgRef} preserveAspectRatio="none">
        <defs>
          {BEAM_IDS.map((id) => {
            const beam = beamsRef.current.find((b) => b.id === id)
            const c = beam?.corner || { x: 0, y: 0 }
            const p = beam?.portalCorner || { x: 0, y: 0 }
            return (
              <linearGradient key={id} id={`passion-beam-${id}`} gradientUnits="userSpaceOnUse" x1={c.x} y1={c.y} x2={p.x} y2={p.y}>
                <stop offset="0%" style={{ stopColor: 'var(--p-line-color)', stopOpacity: NEAR_OPACITY }} />
                <stop offset="100%" style={{ stopColor: 'var(--p-line-color)', stopOpacity: FAR_OPACITY }} />
              </linearGradient>
            )
          })}
          <filter id="passion-portal-blur">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <g className="passion-tunnel__beams">
          {BEAM_IDS.map((id, i) => (
            <path
              key={id}
              ref={(node) => {
                pathRefs.current[i] = node
              }}
              style={{ fill: `url(#passion-beam-${id})` }}
            />
          ))}
        </g>
        {portalRect.width > 0 && (
          <rect
            className="passion-tunnel__portal"
            x={portalRect.x}
            y={portalRect.y}
            width={portalRect.width}
            height={portalRect.height}
            filter="url(#passion-portal-blur)"
          />
        )}
      </svg>
    </div>
  )
}