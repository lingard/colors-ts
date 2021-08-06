import { Hsla } from './Hsla'
import { clipHue } from './Hue'
import * as Lab from './Lab'
import { rad2deg } from './Math'

/**
 * A color in the CIE LCh color space.
 * Note: See documentation for `xyz`. The same restrictions apply here.
 *
 * See: https://en.wikipedia.org/wiki/Lab_color_space
 *
 * @category model
 * @since 0.1.5
 */
export interface LCh {
  readonly _tag: 'LCh'
  readonly l: number
  readonly c: number
  readonly h: number
}

/**
 * @since 0.1.5
 * @category constructors
 */
export const lch = (l: number, c: number, h: number): LCh => ({
  _tag: 'LCh',
  l,
  c,
  h
})

/**
 * @since 0.1.5
 * @category constructors
 */
export const fromHsla: (c: Hsla) => LCh = (c) => {
  const rec = Lab.fromHsla(c)
  const l = rec.l
  const a = rec.a
  const b = rec.b
  const c2 = Math.sqrt(a * a + b * b)
  const h = clipHue(Math.atan2(b, a) * rad2deg)

  return lch(l, c2, h)
}
