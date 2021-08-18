/**
 * CIE LCh, a polar version of [`Lab`](./Lab.ts.html).
 * Note: See documentation for [`xyz`](./XYZ.ts.html). The same restrictions apply here.
 *
 * See: [https://en.wikipedia.org/wiki/Lab_color_space](https://en.wikipedia.org/wiki/Lab_color_space)
 *
 * @since 0.1.5
 */
import { pipe } from 'fp-ts/function'
import * as struct from 'fp-ts/struct'
import { HSLA } from './HSLA'
import { clipHue, Hue, hue } from './Hue'
import * as Lab from './Lab'
import { interpolate, interpolateAngle, rad2deg } from './math'

/**
 * @category model
 * @since 0.1.5
 */
export interface LCh {
  /**
   * The lightness of the color, 0.0 gives absolute black and 100.0 gives the brightest white.
   */
  readonly l: number

  /**
   * Chroma, the colorfulness of the color. It's similar to saturation.
   */
  readonly c: number

  /**
   * A number between `0` and `360` representing the hue of the color in degrees.
   */
  readonly h: Hue
}

/**
 * @since 0.1.5
 * @category constructors
 */
export const lch = (l: number, c: number, h: number): LCh => ({
  l,
  c,
  h: hue(h)
})

/**
 * @since 0.1.5
 * @category constructors
 */
export const fromHSLA: (c: HSLA) => LCh = (hsla) => {
  const { l, a, b } = Lab.fromHSLA(hsla)
  const c = Math.sqrt(a * a + b * b)
  const h = clipHue(Math.atan2(b, a) * rad2deg)

  return lch(l, c, h)
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
