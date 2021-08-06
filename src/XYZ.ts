import { Hsla } from './Hsla'
import * as Lab from './Lab'
import * as Rgba from './Rgba'

/**
 * A `Color` represented by XYZ coordinates in the CIE 1931 color space. Note
 * that a `Color` always represents a color in the sRGB gamut (colors that
 * can be represented on a typical computer screen) while the XYZ color space
 * is bigger.
 *
 * See:
 * - https://en.wikipedia.org/wiki/CIE_1931_color_space
 * - https://en.wikipedia.org/wiki/SRGB
 *
 * @category model
 * @since 0.1.5
 */
export interface XYZ {
  readonly x: number
  readonly y: number
  readonly z: number
}

/**
 * @category constructors
 * @since 0.1.5
 */
export const xyz = (x: number, y: number, z: number): XYZ => ({
  x,
  y,
  z
})

/**
 * @category constructors
 * @since 0.1.5
 */
export const fromHsla = (c: Hsla): XYZ => {
  const finv = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)

  const rec = Rgba.normalizedFromHsla(c)
  const r = finv(rec.r)
  const g = finv(rec.g)
  const b = finv(rec.b)

  const x = 0.4124 * r + 0.3576 * g + 0.1805 * b
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b
  const z = 0.0193 * r + 0.1192 * g + 0.9505 * b

  return xyz(x, y, z)
}

/**
 * @category constructors
 * @since 0.1.5
 */
export const fromLab = ({ l, a, b }: Lab.Lab): XYZ => {
  const delta = 6.0 / 29.0
  const finv = (t: number) =>
    t > delta ? Math.pow(t, 3.0) : 3.0 * delta * delta * (t - 4.0 / 29.0)

  const l2 = (l + 16.0) / 116.0
  const x = Lab.d65.xn * finv(l2 + a / 500.0)
  const y = Lab.d65.yn * finv(l2)
  const z = Lab.d65.zn * finv(l2 - b / 200.0)

  return xyz(x, y, z)
}
