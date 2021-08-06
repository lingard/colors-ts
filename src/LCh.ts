/**
 * @since 0.1.5
 */
import { pipe } from 'fp-ts/function'
import * as struct from 'fp-ts/struct'
import { Hsla } from './Hsla'
import { clipHue } from './Hue'
import * as Lab from './Lab'
import { interpolate, interpolateAngle, rad2deg } from './Math'

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
  readonly l: number
  readonly c: number
  readonly h: number
}

/**
 * @since 0.1.5
 * @category constructors
 */
export const lch = (l: number, c: number, h: number): LCh => ({
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

/**
 * @since 0.1.5
 */
export const evolve: <F extends { [K in keyof LCh]: (a: LCh[K]) => number }>(
  transformations: F
) => (c: LCh) => LCh = (t) => (c) =>
  pipe(c, struct.evolve(t), ({ l, c, h }) => lch(l, c, h))

/**
 * @since 0.1.5
 */
export const mix =
  (ratio: number) =>
  (a: LCh) =>
  (b: LCh): LCh => {
    const i = interpolate(ratio)
    const ia = interpolateAngle(ratio)

    return pipe(
      b,
      evolve({
        l: i(a.l),
        c: i(a.c),
        h: ia(a.h)
      })
    )
  }