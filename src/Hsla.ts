/**
 * @since 0.1.5
 */
import { flow, pipe } from 'fp-ts/function'
import * as struct from 'fp-ts/struct'
import * as Hue from './Hue'
import { UnitInterval, unitInterval } from './UnitInterval'
import * as Rgba from './Rgba'
import { Hsva } from './Hsva'
import * as XYZ from './XYZ'
import * as Lab from './Lab'
import { interpolate, interpolateAngle } from './Math'

/**
 * Represents a color using the HSL cylindrical-coordinate system.
 *
 * @category model
 * @since 0.1.5
 */
export interface Hsla {
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

/**
 * @category constructors
 * @since 0.1.5
 */
export const hsla = (h: number, s: number, l: number, a: number): Hsla => ({
  h: Hue.hue(h),
  s: unitInterval(s),
  l: unitInterval(l),
  a: unitInterval(a)
})

/**
 * @category constructors
 * @since 0.1.5
 */
export const fromRgba: (rgba: Rgba.Rgba) => Hsla = (rgba) => {
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
 * @category constructors
 * @since 0.1.5
 */
export const fromHsva: (hsva: Hsva) => Hsla = ({ h, s, v, a }) => {
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
 * @category constructors
 * @since 0.1.5
 */
export const fromXYZ = flow(Rgba.fromXYZ, fromRgba)

/**
 * @category constructors
 * @since 0.1.5
 */
export const fromLab = flow(XYZ.fromLab, fromXYZ)

/**
 * @category constructors
 * @since 0.1.5
 */
export const fromLCh = flow(Lab.fromLCh, fromLab)

/**
 * Rotate the hue by a certain angle (in degrees).
 *
 * @since 0.1.5
 */
export const rotateHue: (angle: number) => (c: Hsla) => Hsla =
  (angle: number) =>
  ({ h, s, l, a }) =>
    hsla(h + angle, s, l, a)

/**
 * @since 0.1.5
 */
export const evolve: <F extends { [K in keyof Hsla]: (a: Hsla[K]) => number }>(
  transformations: F
) => (c: Hsla) => Hsla = (t) => (c) =>
  pipe(c, struct.evolve(t), ({ h, s, l, a }) => hsla(h, s, l, a))

/**
 * @since 0.1.5
 */
export const mix =
  (ratio: number) =>
  (a: Hsla) =>
  (b: Hsla): Hsla => {
    const i = interpolate(ratio)
    const ia = interpolateAngle(ratio)

    return pipe(
      b,
      evolve({
        h: ia(a.h),
        s: i(a.s),
        l: i(a.l),
        a: i(a.a)
      })
    )
  }

/**
 * A CSS representation of the color in the form `hsl(..)` or `hsla(...)`.
 *
 * @since 0.1.5
 * @category destructors
 */
export const toCSS: (c: Hsla) => string = ({ h, s, l, a }) => {
  const p = (n: number) =>
    pipe(Math.round(100.0 * (n * 100.0)) / 100.0, (n) => `${n}%`)
  const saturation = p(s)
  const lightness = p(l)

  return a == 1.0
    ? `hsl(${h}, ${saturation}, ${lightness})`
    : `hsla(${h}, ${saturation}, ${lightness}, ${a})`
}
