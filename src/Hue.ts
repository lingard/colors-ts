/**
 * @since 0.1.0
 */
import { pipe } from 'fp-ts/function'
import { Ord } from 'fp-ts/number'
import { between } from 'fp-ts/Ord'
import { mod } from './math'
import * as RGBA from './RGBA'

interface HueBrand {
  readonly Hue: unique symbol
}

/**
 * A number between `0` and `360` representing the hue of a color in degrees.
 *
 * @since 0.1.0
 */
export type Hue = number & HueBrand

/**
 * A number between `0` and `360` representing the hue of a color in degrees.
 *
 * @since 0.1.5
 */
export const hue: (n: number) => Hue = (n: number) => clipHue(n)

/**
 * Assert that the hue angle is in the interval [0, 360].
 *
 * @since 0.1.0
 */
export const clipHue: (n: number) => Hue = (hue) =>
  (between(Ord)(0, 360)(hue) ? hue : mod(hue)(360)) as Hue

/**
 * @category constructors
 * @since 0.1.5
 */
export const fromRGBA = (rgba: RGBA.RGBA): Hue => {
  const chroma = RGBA.chroma(rgba)
  const maxChroma = RGBA.maxChroma(rgba)

  const r = rgba.r / 255
  const g = rgba.g / 255
  const b = rgba.b / 255
  const c = chroma / 255
  const n = (x: number) => hue(60.0 * x)

  if (chroma === 0) {
    return hue(0)
  }

  if (maxChroma === rgba.r) {
    return pipe((g - b) / c, (x) => mod(x)(6.0), n)
  }

  if (maxChroma === rgba.g) {
    return n((b - r) / c + 2.0)
  }

  return n((r - g) / c + 4.0)
}
