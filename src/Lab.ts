/**
 * @since 0.1.5
 */
import { pipe } from 'fp-ts/function'
import * as struct from 'fp-ts/struct'
import { Hsla } from './Hsla'
import { LCh } from './LCh'
import * as XYZ from './XYZ'
import { deg2rad, interpolate } from './Math'

/**
 * Represents a color using the Lab color system
 *
 * @category model
 * @since 1.0.0
 */
export interface Lab {
  readonly l: number
  readonly a: number
  readonly b: number
}

export const lab = (l: number, a: number, b: number): Lab => ({
  l,
  a,
  b
})

/**
 * Illuminant D65 constants used for Lab color space conversions.
 *
 * @internal
 */
export const d65 = { xn: 0.95047, yn: 1.0, zn: 1.08883 }

/**
 * Get L, a and b coordinates according to the Lab color space.
 *
 * See: https://en.wikipedia.org/wiki/Lab_color_space
 *
 * @since 0.1.0
 * @category destructors
 */
export const fromHsla: (c: Hsla) => Lab = (c) => {
  const cut = Math.pow(6.0 / 29.0, 3.0)
  const f = (t: number) =>
    t > cut
      ? Math.pow(t, 1.0 / 3.0)
      : (1.0 / 3.0) * Math.pow(29.0 / 6.0, 2.0) * t + 4.0 / 29.0

  const rec = XYZ.fromHsla(c)
  const fy = f(rec.y / d65.yn)
  const l = 116.0 * fy - 16.0
  const a = 500.0 * (f(rec.x / d65.xn) - fy)
  const b = 200.0 * (fy - f(rec.z / d65.zn))

  return lab(l, a, b)
}

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
