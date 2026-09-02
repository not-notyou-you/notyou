// src/pages/public/passion/utils/jaggedClipPath.ts
function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}
/** Must match the card's top/bottom padding — that padding is the buffer
 *  the frame, photo and role-band flourish all tear into. */
export const CARD_CORNER_BUFFER = 40
/** The constant gap kept between the frame's edge and the photo/role-band's
 *  edge at every corner — matches the card's left/right matting thickness. */
export const CARD_MAT_MIN = 5
/** How far the photo (up) / role-band flourish (down) is allowed to poke
 *  into the buffer, capped so CARD_MAT_MIN of mat always stays visible
 *  between the frame's edge and theirs. */
export const CARD_MAX_POKE = CARD_CORNER_BUFFER - CARD_MAT_MIN
const MIN_CORNER_GAP = 6
function generateDistinctCorners(): [number, number, number, number] {
  const values: number[] = []
  for (let i = 0; i < 4; i++) {
    let v = randomBetween(0, CARD_MAX_POKE)
    let attempts = 0
    while (values.some((existing) => Math.abs(existing - v) < MIN_CORNER_GAP) && attempts < 20) {
      v = randomBetween(0, CARD_MAX_POKE)
      attempts++
    }
    values.push(v)
  }
  return values as [number, number, number, number]
}
export interface LeadershipCardShape {
  /** Clip-path for the outer frame — traces the same corners as the photo
   *  and role-band flourish, just CARD_MAT_MIN px further out, so the mat
   *  stays a constant visible width instead of a static rectangle. */
  cardClipPath: string
  /** Clip-path for the photo — reveals more of it (up to CARD_MAX_POKE px)
   *  the further this corner pokes into the top buffer. */
  photoClipPath: string
  /** Clip-path for the decorative flourish strip below the role-band —
   *  reveals more of it the further this corner pokes into the bottom buffer. */
  roleFlourishClipPath: string
}
/**
 * The frame, the photo's top edge and the role-band's bottom flourish all
 * tear along the SAME four random corner values, so their edges move in
 * lockstep — the frame is just drawn CARD_MAT_MIN px further out at every
 * corner, giving a constant, always-visible mat width instead of a static
 * rectangle behind independently-torn content. No two corners land on the
 * same amount, and the poke is capped so the mat can never disappear.
 */
export function generateLeadershipCardShape(): LeadershipCardShape {
  const [tl, tr, bl, br] = generateDistinctCorners()
  const frameTop = (i: number) => (CARD_MAX_POKE - i).toFixed(1)
  const cardClipPath = `polygon(0px ${frameTop(tl)}px, 100% ${frameTop(tr)}px, 100% calc(100% - ${frameTop(br)}px), 0px calc(100% - ${frameTop(bl)}px))`
  const photoClipPath = `polygon(0px ${frameTop(tl)}px, 100% ${frameTop(tr)}px, 100% 100%, 0px 100%)`
  const roleFlourishClipPath = `polygon(0px 0px, 100% 0px, 100% ${br.toFixed(1)}px, 0px ${bl.toFixed(1)}px)`
  return { cardClipPath, photoClipPath, roleFlourishClipPath }
}
