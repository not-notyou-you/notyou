// src/pages/public/intellect/components/GeometricBackground.tsx
import { useEffect, useMemo, useRef } from 'react'

type ShapeKind = 'orbit' | 'triangle' | 'square' | 'pentagon'

interface ShapeSpec {
  id: number
  kind: ShapeKind
  planetCount: number
  x: number
  y: number
  size: number
  duration: number
  reverse: boolean
  opacity: number
  strokeWidth: number
}

const SHAPE_KINDS: ShapeKind[] = ['orbit', 'triangle', 'square', 'pentagon']
const PLANET_COUNTS = [2, 4, 5]
const BOOST_PER_SCROLL_PX = 0.9
const MAX_VELOCITY = 1400
const DECAY_PER_SECOND = 0.06

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function randomInt(min: number, max: number) {
  return Math.floor(randomBetween(min, max + 1))
}

function distance(ax: number, ay: number, bx: number, by: number) {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2)
}

function generateShapes(): ShapeSpec[] {
  const count = randomInt(7, 13)
  const shapes: ShapeSpec[] = []
  let attempts = 0
  let nextId = 0
  while (shapes.length < count && attempts < count * 60) {
    attempts += 1
    const size = randomBetween(10, 26)
    const x = randomBetween(6, 94)
    const y = randomBetween(6, 94)
    const radius = size / 2 + 3
    const overlaps = shapes.some((s) => distance(x, y, s.x, s.y) < radius + s.size / 2 + 3)
    if (overlaps) continue
    shapes.push({
      id: nextId,
      kind: SHAPE_KINDS[randomInt(0, SHAPE_KINDS.length - 1)],
      planetCount: PLANET_COUNTS[randomInt(0, PLANET_COUNTS.length - 1)],
      x,
      y,
      size,
      duration: randomBetween(6, 16),
      reverse: Math.random() < 0.5,
      opacity: randomBetween(0.3, 0.6),
      strokeWidth: randomBetween(2.4, 4.8),
    })
    nextId += 1
  }
  return shapes
}

function polygonPoints(sides: number, radius: number) {
  const points: string[] = []
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2
    const px = 50 + radius * Math.cos(angle)
    const py = 50 + radius * Math.sin(angle)
    points.push(`${px.toFixed(2)},${py.toFixed(2)}`)
  }
  return points.join(' ')
}

function orbitPlanets(count: number, radius: number) {
  const planets: { cx: number; cy: number }[] = []
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2
    planets.push({
      cx: 50 + radius * Math.cos(angle),
      cy: 50 + radius * Math.sin(angle),
    })
  }
  return planets
}

function ShapeSvg({ kind, planetCount }: { kind: ShapeKind; planetCount: number }) {
  if (kind === 'orbit') {
    const orbitRadius = 40
    const planetRadius = 6
    const planets = orbitPlanets(planetCount, orbitRadius)
    return (
      <>
        <circle className="intellect-orbit-ring" cx="50" cy="50" r={orbitRadius} />
        {planets.map((planet, index) => (
          <circle
            key={index}
            className="intellect-orbit-planet"
            cx={planet.cx}
            cy={planet.cy}
            r={planetRadius}
          />
        ))}
      </>
    )
  }
  if (kind === 'square') return <rect x="12" y="12" width="76" height="76" />
  if (kind === 'triangle') return <polygon points={polygonPoints(3, 46)} />
  return <polygon points={polygonPoints(5, 44)} />
}

export function GeometricBackground() {
  const shapes = useMemo(() => generateShapes(), [])
  const spinRefs = useRef<Array<HTMLDivElement | null>>([])
  const rotationRef = useRef<number[]>(shapes.map(() => 0))
  const velocityRef = useRef(0)
  const lastScrollYRef = useRef(0)
  const frameRef = useRef(0)

  useEffect(() => {
    lastScrollYRef.current = window.scrollY

    const onScroll = () => {
      const currentY = window.scrollY
      const delta = Math.abs(currentY - lastScrollYRef.current)
      lastScrollYRef.current = currentY
      velocityRef.current = Math.min(MAX_VELOCITY, velocityRef.current + delta * BOOST_PER_SCROLL_PX)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    let lastTime = performance.now()
    const tick = (time: number) => {
      const dt = Math.min(48, time - lastTime) / 1000
      lastTime = time
      velocityRef.current *= Math.pow(DECAY_PER_SECOND, dt)
      if (velocityRef.current < 0.5) velocityRef.current = 0
      if (velocityRef.current > 0) {
        shapes.forEach((shape, index) => {
          const direction = shape.reverse ? -1 : 1
          rotationRef.current[index] += direction * velocityRef.current * dt
          const node = spinRefs.current[index]
          if (node) node.style.transform = `rotate(${rotationRef.current[index]}deg)`
        })
      }
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frameRef.current)
    }
  }, [shapes])

  return (
    <div className="intellect-shapes" aria-hidden="true">
      {shapes.map((shape, index) => (
        <div
          key={shape.id}
          className="intellect-shape"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.size}vmin`,
            height: `${shape.size}vmin`,
            opacity: shape.opacity,
            animationDuration: `${shape.duration}s`,
            animationDirection: shape.reverse ? 'reverse' : 'normal',
            ['--shape-stroke' as string]: shape.strokeWidth,
          }}
        >
          <div
            className="intellect-shape__scroll"
            ref={(node) => {
              spinRefs.current[index] = node
            }}
          >
            <svg viewBox="0 0 100 100">
              <ShapeSvg kind={shape.kind} planetCount={shape.planetCount} />
            </svg>
          </div>
        </div>
      ))}
    </div>
  )
}