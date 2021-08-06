/**
 * @since 0.1.5
 */
import { flow, pipe } from 'fp-ts/function'
import * as Hue from './Hue'
import { UnitInterval, unitInterval } from './UnitInterval'
import * as Rgba from './Rgba'
import { Hsva } from './Hsva'
import * as XYZ from './XYZ'
import * as Lab from './Lab'

/**
 * Represents a color using the HSL cylindrical-coordinate system.
 *
 * @category model
 * @since 1.0.0
 */
export interface Hsla {
  readonly _tag: 'hsla'

  /**
   * A number between `0` and `360` representing the hue of the color in degrees.
   */
  readonly h: Hue.Hue

  /**
   * A number between `0` and `1` representing the percent saturation of the color
   * where `0` is completely denatured (grayscale) and `1` is fully saturated (full color).
   */
  readonly s: UnitInterval

  /**
   * A number between `0` and `1` representing the percent lightness of the color
   * where `0` is completely dark (black) and `1` is completely light (white).
   */
  readonly l: UnitInterval

  /**
   * A number between `0` and `1` representing the opacity or transparency of the color
   * where `0` is fully transparent and `1` is fully opaque.
   */
  readonly a: UnitInterval
}

export const hsla = (h: number, s: number, l: number, a: number): Hsla => ({
  _tag: 'hsla',
  h: Hue.clipHue(h),
  s: unitInterval(s),
  l: unitInterval(l),
  a: unitInterval(a)
})

export const fromRgba = (rgba: Rgba.Rgba): Hsla => {
  const maxChroma = Rgba.maxChroma(rgba)
  const minChroma = Rgba.minChroma(rgba)
  const chroma = Rgba.chroma(rgba)
  const hue = Hue.fromRGBA(rgba)
  const lightness = (maxChroma + minChroma) / (255.0 * 2.0)
  const saturation =
    chroma === 0 ? 0 : chroma / 255 / (1.0 - Math.abs(2.0 * lightness - 1.0))

  return hsla(hue, saturation, lightness, rgba.a)
}

/**
 * Create a `Color` from Hue, Saturation, Value and Alpha values. The
 * Hue is given in degrees, as a `Number` between 0.0 and 360.0. Saturation,
 * Value and Alpha are numbers between 0.0 and 1.0.
 *
 * @category constructors
 * @since 0.1.0
 */
export const fromHsva = ({ h, s, v, a }: Hsva): Hsla => {
  if (v === 0) {
    return hsla(h, s / (2.0 - s), 0.0, a)
  }

  if (s === 0 && v === 1.0) {
    return hsla(h, 0.0, 1.0, a)
  }

  const { saturation, lightness } = pipe((2.0 - s) * v, (tmp) => ({
    saturation: (s * v) / (tmp < 1.0 ? tmp : 2.0 - tmp),
    lightness: tmp / 2.0
  }))

  return hsla(h, saturation, lightness, a)
}

/**
 * Create a `Color` from XYZ coordinates in the CIE 1931 color space. Note
 * that a `Color` always represents a color in the sRGB gamut (colors that
 * can be represented on a typical computer screen) while the XYZ color space
 * is bigger. This function will tend to create fully saturated colors at the
 * edge of the sRGB gamut if the coordinates lie outside the sRGB range.
 *
 * See:
 * - https://en.wikipedia.org/wiki/CIE_1931_color_space
 * - https://en.wikipedia.org/wiki/SRGB
 *
 * @category constructors
 * @since 0.1.0
 */
export const fromXYZ = ({ x, y, z }: XYZ.XYZ): Hsla => {
  const f = (c: number) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1.0 / 2.4) - 0.055

  const r = f(3.2406 * x - 1.5372 * y - 0.4986 * z)
  const g = f(-0.9689 * x + 1.8758 * y + 0.0415 * z)
  const b = f(0.0557 * x - 0.204 * y + 1.057 * z)

  return pipe(Rgba.rgb(r * 255, g * 255, b * 255), fromRgba)
}

/**
 * Create a `Color` from L, a and b coordinates coordinates in the Lab color
 * space.
 * Note: See documentation for `xyz`. The same restrictions apply here.
 *
 * See: https://en.wikipedia.org/wiki/Lab_color_space
 *
 * @category constructors
 * @since 0.1.0
 */
export const fromLab = flow(XYZ.fromLab, fromXYZ)

export const fromLCh = flow(Lab.fromLCh, fromLab)
