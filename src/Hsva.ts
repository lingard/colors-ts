/**
 * A color represented by the HSV color model
 *
 * @since 0.1.5
 */
import { HSLA } from './HSLA'
import { clipHue, Hue } from './Hue'
import { unitInterval } from './UnitInterval'

/**
 * @category model
 * @since 0.1.5
 */
export interface HSVA {
  /**
   * A number between `0` and `360` representing the hue of the color in degrees.
   */
  readonly h: Hue

  /**
   * A number between `0` and `1` representing the percent saturation of the color
   * where `0` is completely denatured (grayscale) and `1` is fully saturated (full color).
   */
  readonly s: number

  /**
   * Value
   */
  readonly v: number

  /**
   * A number between `0` and `1` representing the opacity or transparency of the color
   * where `0` is fully transparent and `1` is fully opaque.
   */
  readonly a: number
}

/**
 * @since 0.1.5
 * @category constructors
 */
export const hsva = (h: number, s: number, v: number, a: number): HSVA => ({
  h: clipHue(h),
  s: unitInterval(s),
  v: unitInterval(v),
  a: unitInterval(a)
})

/**
 * @since 0.1.5
 * @category constructors
 */
export const hsv = (h: number, s: number, v: number): HSVA => hsva(h, s, v, 1.0)

/**
 * @since 0.1.5
 * @category constructors
 */
export const fromHSLA: (c: HSLA) => HSVA = ({ h, s, l, a }) => {
  const tmp = s * (l < 0.5 ? l : 1.0 - l)
  const hue = clipHue(h)
  const saturation = (2.0 * tmp) / (l + tmp)
  const v = l + tmp

  if (l === 0) {
    return hsva(hue, (2.0 * s) / (1.0 + s), 0.0, a)
  }

  if (s === 0 && l === 1) {
    return hsva(hue, 0.0, 1.0, a)
  }

  return hsva(hue, saturation, v, a)
}
