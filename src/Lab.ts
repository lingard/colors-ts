/**
 * A `Color` represented L, a and b coordinates in the Lab color space.
 *
 * Note: See documentation for [`xyz`](./XYZ.ts.html). The same restrictions
 * apply here.
 *
 * @since 0.1.5
 */
import { pipe } from 'fp-ts/function'
import * as struct from 'fp-ts/struct'
import { HSLA } from './HSLA'
import { LCh } from './LCh'
import * as XYZ from './XYZ'
import { deg2rad, interpolate } from './math'

/**
 * @category model
 * @since 0.1.5
 */
export interface Lab {
  /**
   * The lightness of the color. 0.0 gives absolute black and 100.0 give the brightest white.
   */
  readonly l: number

  readonly a: number

  readonly b: number
}

/**
 * @category constructors
 * @since 0.1.5
 */
export const lab = (l: number, a: number, b: number): Lab => ({
  l,
  a,
  b
})

/**
 * @since 0.1.5
 * @category constructors
 */
export const fromHSLA: (c: HSLA) => Lab = (c) => {
  const cut = Math.pow(6.0 / 29.0, 3.0)
  const f = (t: number) =>
    t > cut
      ? Math.pow(t, 1.0 / 3.0)
      : (1.0 / 3.0) * Math.pow(29.0 / 6.0, 2.0) * t + 4.0 / 29.0

  const rec = XYZ.fromHSLA(c)
  const fy = f(rec.y / XYZ.D65.yn)
  const l = 116.0 * fy - 16.0
  const a = 500.0 * (f(rec.x / XYZ.D65.xn) - fy)
  const b = 200.0 * (fy - f(rec.z / XYZ.D65.zn))

  return lab(l, a, b)
}

/**
 * @category constructors
 * @since 0.1.5
 */
export const fromLCh = ({ l, c, h }: LCh): Lab => {
  const a = c * Math.cos(h * deg2rad)
  const b = c * Math.sin(h * deg2rad)

  return lab(l, a, b)
}

/**
 * @since 0.1.5
 */
export const evolve: <F extends { [K in keyof Lab]: (a: Lab[K]) => number }>(
  transformations: F
) => (c: Lab) => Lab = (t) => (c) =>
  pipe(c, struct.evolve(t), ({ l, a, b }) => lab(l, a, b))

/**
 * @since 0.1.5
 */
export const mix =
  (ratio: number) =>
  (a: Lab) =>
  (b: Lab): Lab => {
    const i = interpolate(ratio)

    return pipe(
      b,
      evolve({
        l: i(a.l),
        a: i(a.a),
        b: i(a.b)
      })
    )
  }
