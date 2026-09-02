// src/pages/public/passion/hooks/useDragToScroll.ts
import { useEffect } from 'react'
import type { RefObject } from 'react'
/** Lets the user click-and-drag (mouse) a horizontal scroller — touch already
 *  scrolls natively. Suppresses the click that would otherwise fire on a
 *  dragged-over button once the drag exceeds a small threshold. */
export function useDragToScroll(ref: RefObject<HTMLElement>, onDragStart?: () => void) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let dragging = false
    let moved = false
    let startX = 0
    let startScroll = 0
    // Deliberately not using setPointerCapture: Chromium retargets the
    // compatibility "click" event to the capturing element while a pointer
    // is captured, which would stop clicks on gallery cards from ever
    // reaching their onClick handler — even for a plain, non-drag click.
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - startX
      if (!moved && Math.abs(dx) > 3) {
        // Only now does this become a real drag — engage pointer-events:none
        // on descendants from here on. Doing this on every pointerdown
        // (even a plain click) would make the browser's click/mouseup hit-test,
        // which resolves before this handler runs, skip past the card entirely.
        moved = true
        el.classList.add('passion-scroll-h--dragging')
      }
      el.scrollLeft = startScroll - dx
      onDragStart?.()
    }
    const endDrag = () => {
      if (!dragging) return
      dragging = false
      el.classList.remove('passion-scroll-h--dragging')
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
    }
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || e.button !== 0) return
      dragging = true
      moved = false
      startX = e.clientX
      startScroll = el.scrollLeft
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', endDrag)
      window.addEventListener('pointercancel', endDrag)
    }
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault()
        e.stopPropagation()
        moved = false
      }
    }
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('click', onClickCapture, true)
    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('click', onClickCapture, true)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
    }
  }, [ref, onDragStart])
}
