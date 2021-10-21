/**
 * @since 0.1.5
 */
import { flow, pipe } from 'fp-ts/function'
import * as struct from 'fp-ts/struct'
import * as Hue from './Hue'
import { unitInterval } from './UnitInterval'
import * as RGBA from './RGBA'
import { HSVA } from './HSVA'
import * as XYZ from './XYZ'
import * as Lab from './Lab'
import { interpolate, interpolateAngle } from './math'
import { Endomorphism } from 'fp-ts/Endomorphism'

/**
 * Represents a color using the HSL cylindrical-coordinate system.
 *
 * @category model
 * @since 0.1.5
 */
export interface HSLA {
  /**
   * A number between `0` and `360` representing the hue of the color in degrees.
   */
  readonly h: Hue.Hue

  /**
   * A number between `0` and `1` representing the percent saturation of the color
   * where `0` is completely denatured (grayscale) and `1` is fully saturated (full color).
   */
  readonly s: number

  /**
   * A number between `0` and `1` representing the percent lightness of the color
   * where `0` is completely dark (black) and `1` is completely light (white).
   */
  readonly l: number

  /**
   * A number between `0` and `1` representing the opacity or transparency of the color
   * where `0` is fully transparent and `1` is fully opaque.
   */
  readonly a: number
}

/**
 * @category constructors
 * @since 0.1.5
 */
export const hsla = (h: number, s: number, l: number, a: number): HSLA => ({
  h: Hue.hue(h),
  s: unitInterval(s),
  l: unitInterval(l),
  a: unitInterval(a)
})

/**
 * @category constructors
 * @since 0.1.5
 */
export const hsl = (h: number, s: number, l: number): HSLA => hsla(h, s, l, 1.0)

/**
 * @category constructors
 * @since 0.1.5
 */
export const fromRGBA: (rgba: RGBA.RGBA) => HSLA = (rgba) => {
  const maxChroma = RGBA.maxChroma(rgba)
  const minChroma = RGBA.minChroma(rgba)
  const chroma = RGBA.chroma(rgba)
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
export const fromHSVA: (hsva: HSVA) => HSLA = ({ h, s, v, a }) => {
  const { saturation, lightness } = pipe((2.0 - s) * v, (tmp) => ({
    saturation: (s * v) / (tmp < 1.0 ? tmp : 2.0 - tmp),
    lightness: tmp / 2.0
  }))

  if (v === 0) {
    return hsla(h, s / (2.0 - s), 0.0, a)
  }

  if (s === 0 && v === 1.0) {
    return hsla(h, 0.0, 1.0, a)
  }

  return hsla(h, saturation, lightness, a)
}

/**
 * @category constructors
 * @since 0.1.5
 */
export const fromXYZ = flow(RGBA.fromXYZ, fromRGBA)

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
export const rotateHue: (angle: number) => (c: HSLA) => HSLA =
  (angle: number) =>
  ({ h, s, l, a }) =>
    hsla(h + angle, s, l, a)

/**
 * get the alpha channel
 *
 * @since 0.1.7
 */
export const alpha: (c: HSLA) => number = ({ a }) => a

/**
 * set the alpha channel
 *
 * @since 0.1.7
 */
export const setAlpha: (alpha: number) => Endomorphism<HSLA> =
  (a) =>
  ({ h, s, l }) =>
    hsla(h, s, l, a)

/**
 * @since 0.1.5
 */
export const evolve: <F extends { [K in keyof HSLA]: (a: HSLA[K]) => number }>(
  transformations: F
) => (c: HSLA) => HSLA = (t) => (c) =>
  pipe(c, struct.evolve(t), ({ h, s, l, a }) => hsla(h, s, l, a))

/**
 * @since 0.1.5
 */
export const mix =
  (ratio: number) =>
  (a: HSLA) =>
  (b: HSLA): HSLA => {
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
export const toCSS: (c: HSLA) => string = ({ h, s, l, a }) => {
  const p = (n: number) =>
    pipe(Math.round(100.0 * (n * 100.0)) / 100.0, (n) => `${n}%`)
  const saturation = p(s)
  const lightness = p(l)

  return a == 1.0
    ? `hsl(${h}, ${saturation}, ${lightness})`
    : `hsla(${h}, ${saturation}, ${lightness}, ${a})`
}
