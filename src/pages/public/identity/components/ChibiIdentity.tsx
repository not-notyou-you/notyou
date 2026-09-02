// src/pages/public/identity/components/ChibiIdentity.tsx
import { useEffect, useRef, RefObject } from 'react'
import idle from '../assets/idle.webp'
import idle2 from '../assets/idle2.webp'
import idle3 from '../assets/idle3.webp'
import theRage from '../assets/the_rage.webp'
import toRage1 from '../assets/to_rage1.webp'
import toRage2 from '../assets/to_rage2.webp'
import toRage3 from '../assets/to_rage3.webp'
import toRage4 from '../assets/to_rage4.webp'
import toRage5 from '../assets/to_rage5.webp'
import toWalk1 from '../assets/to_walk1.webp'
import toWalk2 from '../assets/to_walk2.webp'
import walkContact1 from '../assets/walk_contact1.webp'
import walkContact2 from '../assets/walk_contact2.webp'
import walkHigh1 from '../assets/walk_high1.webp'
import walkHigh2 from '../assets/walk_high2.webp'
import walkPassing1 from '../assets/walk_passing1.webp'
import walkPassing2 from '../assets/walk_passing2.webp'
import walkRecoil1 from '../assets/walk_recoil1.webp'
import walkRecoil2 from '../assets/walk_recoil2.webp'
import glitch1 from '../assets/glitch1.webp'
import glitch2 from '../assets/glitch2.webp'
import glitch3 from '../assets/glitch3.webp'
import glitch4 from '../assets/glitch4.webp'
import glitch5 from '../assets/glitch5.webp'
import glitch6 from '../assets/glitch6.webp'

const SPRITE_URLS: Record<string, string> = {
  'idle.webp': idle,
  'idle2.webp': idle2,
  'idle3.webp': idle3,
  'the_rage.webp': theRage,
  'to_rage1.webp': toRage1,
  'to_rage2.webp': toRage2,
  'to_rage3.webp': toRage3,
  'to_rage4.webp': toRage4,
  'to_rage5.webp': toRage5,
  'to_walk1.webp': toWalk1,
  'to_walk2.webp': toWalk2,
  'walk_contact1.webp': walkContact1,
  'walk_contact2.webp': walkContact2,
  'walk_high1.webp': walkHigh1,
  'walk_high2.webp': walkHigh2,
  'walk_passing1.webp': walkPassing1,
  'walk_passing2.webp': walkPassing2,
  'walk_recoil1.webp': walkRecoil1,
  'walk_recoil2.webp': walkRecoil2,
  'glitch1.webp': glitch1,
  'glitch2.webp': glitch2,
  'glitch3.webp': glitch3,
  'glitch4.webp': glitch4,
  'glitch5.webp': glitch5,
  'glitch6.webp': glitch6,
}

export const CHIBI_IMAGE_URLS = Object.values(SPRITE_URLS)

const FLOAT_H = 100
const PUSH = 0.9
const CHASE = 2.6
const CENTER_EPS = 1.4
const RAGE_AFTER_LOOPS = 8
const PULSE_MS = 2600
const RAGE_BOB = 26
const RAGE_BOB_MS = 1500
const GLITCH_MS = 130
const DRAG_THRESH = 6
const ODD = [1, 3, 5]
const EVEN = [2, 4, 6]
const GLITCH_FILES = ['glitch1.webp', 'glitch2.webp', 'glitch3.webp', 'glitch4.webp', 'glitch5.webp', 'glitch6.webp']

const GLOW = {
  dark: { grad: 'radial-gradient(circle, rgba(190,235,255,.95) 0%, rgba(150,210,255,.5) 35%, rgba(120,190,255,0) 70%)', sh: '175,225,255' },
  light: { grad: 'radial-gradient(circle, rgba(0,0,0,.85) 0%, rgba(0,0,0,.45) 35%, rgba(0,0,0,0) 70%)', sh: '0,0,0' },
}

type Clip = { seq: string[]; fps: number; loop: boolean; front: boolean }

const CLIPS: Record<string, Clip> = {
  idle: { seq: ['idle.webp', 'idle2.webp', 'idle3.webp', 'idle2.webp'], fps: 3, loop: true, front: true },
  to_walk_out: { seq: ['to_walk1.webp', 'to_walk2.webp'], fps: 9, loop: false, front: false },
  to_walk_in: { seq: ['to_walk2.webp', 'to_walk1.webp'], fps: 9, loop: false, front: false },
  walk: {
    seq: ['walk_contact1.webp', 'walk_recoil1.webp', 'walk_passing1.webp', 'walk_high1.webp', 'walk_contact2.webp', 'walk_recoil2.webp', 'walk_passing2.webp', 'walk_high2.webp'],
    fps: 12, loop: true, front: false,
  },
  pivot: { seq: ['idle.webp'], fps: 6, loop: false, front: true },
  to_rage: { seq: ['to_rage1.webp', 'to_rage2.webp', 'to_rage3.webp', 'to_rage4.webp', 'to_rage5.webp'], fps: 5, loop: false, front: true },
  rage: { seq: ['the_rage.webp'], fps: 2, loop: true, front: true },
  rage_land: { seq: ['the_rage.webp'], fps: 2, loop: true, front: true },
  from_rage: { seq: ['to_rage5.webp', 'to_rage4.webp', 'to_rage3.webp', 'to_rage2.webp', 'to_rage1.webp'], fps: 7, loop: false, front: true },
}

const ALL_FILES = Array.from(new Set(Object.values(CLIPS).flatMap((c) => c.seq)))
const ROMAN = 'IVXLCDM'

function randNum() {
  const len = 1 + Math.floor(Math.random() * 3)
  let r = ''
  for (let i = 0; i < len; i++) r += ROMAN[Math.floor(Math.random() * 7)]
  return r
}

export function ChibiIdentity({
  scrollerRef,
  dark = false,
  footerHeight = 64,
}: {
  scrollerRef: RefObject<HTMLDivElement>
  dark?: boolean
  footerHeight?: number
}) {
  const chibiRef = useRef<HTMLDivElement>(null)
  const floatRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const numsRef = useRef<HTMLDivElement>(null)
  const darkRef = useRef(dark)
  darkRef.current = dark
  const footRef = useRef(footerHeight)
  footRef.current = footerHeight

  useEffect(() => {
    if (glowRef.current) glowRef.current.style.background = (dark ? GLOW.dark : GLOW.light).grad
  }, [dark])

  useEffect(() => {
    ALL_FILES.forEach((f) => {
      const im = new Image()
      im.src = SPRITE_URLS[f]
    })
    const available = new Set<string>()
    GLITCH_FILES.forEach((f) => {
      const im = new Image()
      im.onload = () => available.add(f)
      im.src = SPRITE_URLS[f]
    })

    const s = {
      clip: 'idle', frame: 0, timer: 0, loops: 0, facing: 1, offset: 0,
      prevSL: scrollerRef.current ? scrollerRef.current.scrollLeft : 0,
      maxOff: window.innerWidth * 1.3, floatY: 0, floatTarget: 0, glow: 0, glowTarget: 0, dragY: 0,
    }

    const onResize = () => (s.maxOff = window.innerWidth * 1.3)
    window.addEventListener('resize', onResize)

    const transition = (clip: string, facing?: number) => {
      s.clip = clip
      s.frame = 0
      s.timer = 0
      s.loops = 0
      const c = CLIPS[clip]
      if (!c.front && facing !== undefined) s.facing = facing
      if (clip === 'to_rage') {
        s.floatTarget = -FLOAT_H
        s.glowTarget = 1
      } else if (clip === 'rage') {
        return
      } else if (clip === 'rage_land') {
        s.floatTarget = 0
        s.glowTarget = 0
      } else {
        s.floatTarget = 0
        s.glowTarget = 0
      }
    }

    const onEnd = (m: boolean, df: number) => {
      switch (s.clip) {
        case 'to_walk_out':
          transition('walk', s.facing)
          break
        case 'to_walk_in':
          if (m) {
            if (df !== s.facing) transition('pivot')
            else transition('to_walk_out', df)
          } else transition('idle')
          break
        case 'pivot':
          if (m) transition('to_walk_out', df)
          else transition('idle')
          break
        case 'to_rage':
          transition('rage')
          break
        case 'from_rage':
          if (m) transition('to_walk_out', df)
          else transition('idle')
          break
        default:
          break
      }
    }

    const spawnNumeral = () => {
      if (!numsRef.current) return
      const n = document.createElement('div')
      n.textContent = randNum()
      const size = 22 + Math.random() * 118
      const dur = 1200 + Math.random() * 1500
      const op = (0.3 + Math.random() * 0.2).toFixed(3)
      n.style.cssText =
        'position:absolute;left:' + (4 + Math.random() * 88) + '%;top:' + (6 + Math.random() * 74) + '%;' +
        'transform:translate(-50%,-50%);font-family:\'Times New Roman\',Georgia,serif;font-weight:700;' +
        'font-size:' + size.toFixed(0) + 'px;letter-spacing:2px;color:' + (darkRef.current ? '#ffffff' : '#000000') + ';' +
        'opacity:' + op + ';pointer-events:none;user-select:none;transition:opacity ' + dur.toFixed(0) + 'ms linear;'
      numsRef.current.appendChild(n)
      requestAnimationFrame(() => {
        n.style.opacity = '0'
      })
      window.setTimeout(() => n.remove(), dur + 80)
    }

    let glitchUntil = 0
    let glitchFile = ''
    let glitchParity = true
    const doGlitch = () => {
      if (s.clip !== 'idle') return
      s.loops = 0
      const cnt = 1 + Math.floor(Math.random() * 3)
      for (let i = 0; i < cnt; i++) spawnNumeral()
      const grp = glitchParity ? ODD : EVEN
      const idx = grp[Math.floor(Math.random() * 3)]
      glitchFile = 'glitch' + idx + '.webp'
      glitchUntil = performance.now() + GLITCH_MS
      glitchParity = !glitchParity
    }

    let pressed = false
    let dragging = false
    let moved = false
    let startX = 0
    let startY = 0
    let ptrX = 0
    let ptrY = 0

    const onDown = (e: PointerEvent) => {
      if (s.clip !== 'idle') return
      const el = floatRef.current || chibiRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        pressed = true
        dragging = false
        moved = false
        startX = ptrX = e.clientX
        startY = ptrY = e.clientY
      }
    }

    const onMove = (e: PointerEvent) => {
      if (!pressed) return
      ptrX = e.clientX
      ptrY = e.clientY
      if (!moved && Math.hypot(e.clientX - startX, e.clientY - startY) > DRAG_THRESH) {
        moved = true
        dragging = true
      }
    }

    const onUp = () => {
      if (!pressed) return
      pressed = false
      document.body.style.cursor = ''
      if (dragging) dragging = false
      else doGlitch()
    }

    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)

    let raf = 0
    let last = performance.now()
    let curFile = ''
    let nextSpawn = 0

    const loop = (t: number) => {
      const dt = Math.min(48, t - last)
      last = t
      const kF = 1 - Math.exp((-2.2 * dt) / 1000)
      const kG = 1 - Math.exp((-1.8 * dt) / 1000)
      const kDrag = 1 - Math.exp((-5 * dt) / 1000)
      let idleForced = false

      if (dragging) {
        const par = (chibiRef.current && (chibiRef.current.offsetParent as HTMLElement)) || document.body
        const pr = par.getBoundingClientRect()
        const cx = pr.left + pr.width / 2
        const hy = pr.top + pr.height - footRef.current - 100
        s.offset = ptrX - cx
        s.dragY = Math.min(0, Math.max(pr.top + 10 - hy, ptrY - hy))
        if (s.clip !== 'idle') transition('idle')
        s.loops = 0
        idleForced = true
        s.floatY += (0 - s.floatY) * kF
        s.glow += (0 - s.glow) * kG
        document.body.style.cursor = 'grabbing'
      } else {
        if (pressed) s.loops = 0
        const sl = scrollerRef.current ? scrollerRef.current.scrollLeft : 0
        const dSL = sl - s.prevSL
        s.prevSL = sl
        if (dSL !== 0) s.offset -= dSL * PUSH
        s.offset = Math.max(-s.maxOff, Math.min(s.maxOff, s.offset))
        const ch = CHASE * (dt / 16)
        if (Math.abs(s.offset) <= ch) s.offset = 0
        else s.offset -= Math.sign(s.offset) * ch
        s.floatY += (s.floatTarget - s.floatY) * kF
        s.glow += (s.glowTarget - s.glow) * kG
        s.dragY += (0 - s.dragY) * kDrag
      }

      const m = Math.abs(s.offset) > CENTER_EPS
      const df = s.offset > 0 ? -1 : 1
      const c = CLIPS[s.clip]
      const fd = 1000 / c.fps
      s.timer += dt
      let g0 = 0
      while (s.timer >= fd) {
        if (g0++ > 500) break
        s.timer -= fd
        s.frame++
        if (s.frame >= c.seq.length) {
          if (c.loop) {
            s.frame = 0
            s.loops++
          } else {
            s.frame = c.seq.length - 1
            if (!idleForced) onEnd(m, df)
            else s.frame = 0
            break
          }
        }
      }

      if (!idleForced) {
        switch (s.clip) {
          case 'idle':
            if (m) transition('to_walk_out', df)
            else if (s.loops >= RAGE_AFTER_LOOPS) transition('to_rage')
            break
          case 'walk':
            if (!m) transition('to_walk_in', s.facing)
            else if (df !== s.facing) transition('to_walk_in', s.facing)
            break
          case 'rage':
            if (m) transition('rage_land')
            break
          case 'rage_land':
            s.floatTarget = 0
            s.glowTarget = 0
            if (s.floatY > -3 && s.glow < 0.05) transition('from_rage')
            break
          default:
            break
        }
        if (s.clip === 'rage' && t >= nextSpawn) {
          const cnt = 1 + Math.floor(Math.random() * 3)
          for (let i = 0; i < cnt; i++) spawnNumeral()
          nextSpawn = t + 220 + Math.random() * 520
        }
      }

      const cc = CLIPS[s.clip]
      const normalFile = cc.seq[Math.min(s.frame, cc.seq.length - 1)]
      const glitching = t < glitchUntil && s.clip === 'idle' && !dragging
      const hasImg = glitching && available.has(glitchFile)
      const displayFile = hasImg ? glitchFile : normalFile

      if (imgRef.current && displayFile !== curFile) {
        curFile = displayFile
        imgRef.current.src = SPRITE_URLS[displayFile]
      }

      const flip = !cc.front && s.facing < 0 ? -1 : 1
      if (imgRef.current) {
        if (glitching) {
          const jx = (Math.random() * 2 - 1) * 3
          imgRef.current.style.transform = `scaleX(${flip}) translateX(${jx.toFixed(1)}px)`
        } else {
          imgRef.current.style.transform = `scaleX(${flip})`
        }
      }

      if (chibiRef.current) chibiRef.current.style.transform = `translateX(${s.offset.toFixed(2)}px)`

      const rageAmt = Math.min(1, Math.max(0, -s.floatY / FLOAT_H))
      const bob = idleForced ? 0 : RAGE_BOB * rageAmt * Math.sin((t / RAGE_BOB_MS) * Math.PI * 2)
      if (floatRef.current) floatRef.current.style.transform = `translateY(${(s.floatY + s.dragY + bob).toFixed(2)}px)`

      const pulse = 0.32 + 0.68 * (0.5 + 0.5 * Math.sin((t / PULSE_MS) * Math.PI * 2))
      const g = Math.max(0, s.glow) * pulse
      if (glowRef.current) glowRef.current.style.opacity = g.toFixed(3)

      if (imgRef.current) {
        const inv = darkRef.current ? 'invert(1) ' : ''
        const sh = (darkRef.current ? GLOW.dark : GLOW.light).sh
        imgRef.current.style.filter = (
          inv + (g > 0.02 ? `drop-shadow(0 0 ${(8 + 14 * g).toFixed(1)}px rgba(${sh},${(0.85 * g).toFixed(3)}))` : '')
        ).trim()
      }

      raf = requestAnimationFrame(loop)
    }

    if (imgRef.current) {
      imgRef.current.src = SPRITE_URLS['idle.webp']
      imgRef.current.style.filter = darkRef.current ? 'invert(1)' : ''
    }
    if (glowRef.current) glowRef.current.style.background = (darkRef.current ? GLOW.dark : GLOW.light).grad

    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      if (numsRef.current) numsRef.current.innerHTML = ''
    }
  }, [scrollerRef])

  return (
    <>
      <div ref={numsRef} className="identity-chibi-numerals" />
      <div ref={chibiRef} className="identity-chibi-anchor" style={{ bottom: footerHeight }}>
        <div ref={floatRef} className="identity-chibi-float">
          <div ref={glowRef} className="identity-chibi-glow" />
          <img ref={imgRef} alt="" draggable={false} className="identity-chibi-img" />
        </div>
      </div>
    </>
  )
}

export default ChibiIdentity