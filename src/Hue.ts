/**
 * @since 0.1.0
 */
import { pipe } from 'fp-ts/function'
import { modPos } from './Math'
import * as Rgba from './Rgba'

interface HueBrand {
  readonly Hue: unique symbol
}

/**
 * A number between `0` and `360` representing the hue of a color in degrees.
 *
 * @since 0.1.0
 */
export type Hue = number & HueBrand

export const hue: (n: number) => Hue = (n: number) => clipHue(n)

/**
 * Assert that the hue angle is in the interval [0, 360].
 *
 * @since 0.1.0
 */
export const clipHue: (n: number) => Hue = (hue) =>
  (hue === 360 ? hue : modPos(hue)(360)) as Hue

/**
 * @category constructors
 * @since 0.1.5
 */
export const fromRGBA = (rgba: Rgba.Rgba): Hue => {
  const chroma = Rgba.chroma(rgba)
  const maxChroma = Rgba.maxChroma(rgba)

  const r = rgba.r / 255
  const g = rgba.g / 255
  const b = rgba.b / 255
  const c = chroma / 255
  const n = (x: number) => hue(60.0 * x)

  if (chroma === 0) {
    return hue(0)
  }

  if (maxChroma === rgba.r) {
    return pipe((g - b) / c, (x) => modPos(x)(6.0), n)
  }

  if (maxChroma === rgba.g) {
    return n((b - r) / c + 2.0)
  }

  return n((r - g) / c + 4.0)
}
