/**
 * @since 0.1.5
 */
import * as Ord from 'fp-ts/Ord'
import * as number from 'fp-ts/number'
import { UnitInterval, unitInterval } from './UnitInterval'
import { pipe } from 'fp-ts/function'
import { Hsla } from './Hsla'
import { clipHue } from './Hue'

const clampChannel = Ord.clamp(number.Ord)(0, 255)

interface ChannelBrand {
  readonly Channel: unique symbol
}

type Channel = number & ChannelBrand

const channel = (n: number) => clampChannel(n) as Channel

export const channelFromUnitInterval = (n: number): number =>
  pipe(Math.round(n * 255.0), channel)

/**
 * Represents a color using the rgb color system
 *
 * @category model
 * @since 0.1.5
 */
export interface Rgba {
  readonly _tag: 'rgba'

  /**
   * A number between `0` and `255` representing the red channel of the color
   */
  readonly r: Channel

  /**
   * A number between `0` and `255` representing the green channel of the color
   */
  readonly g: Channel

  /**
   * A number between `0` and `255` representing the blue channel of the color
   */
  readonly b: Channel

  /**
   * A number between `0` and `1` representing the opacity or transparency of the color
   * where `0` is fully transparent and `1` is fully opaque.
   */
  readonly a: UnitInterval
}

/**
 * @since 0.1.5
 * @category constructors
 */
export const rgba = (r: number, g: number, b: number, a: number): Rgba => ({
  _tag: 'rgba',
  r: channel(r),
  g: channel(g),
  b: channel(b),
  a: unitInterval(a)
})

export const rgb = (r: number, g: number, b: number): Rgba => rgba(r, g, b, 1.0)

/**
 * @since 0.1.5
 * @category constructors
 */
export const fromHSLA2: (c: Hsla) => {
  r: number
  g: number
  b: number
  a: number
} = ({ h, s, l, a }) => {
  const ch = clipHue(h) / 60.0
  const chr = (1.0 - Math.abs(2.0 * l - 1.0)) * s
  const m = l - chr / 2.0
  const x = chr * (1.0 - Math.abs((ch % 2.0) - 1.0))

  const getChannels = () => {
    if (ch < 1.0) {
      return { r: chr, g: x, b: 0.0 }
    }

    if (1.0 <= ch && ch < 2.0) {
      return { r: x, g: chr, b: 0.0 }
    }

    if (2.0 <= ch && ch < 3.0) {
      return { r: 0.0, g: chr, b: x }
    }

    if (3.0 <= ch && ch < 4.0) {
      return { r: 0.0, g: x, b: chr }
    }

    if (4.0 <= ch && ch < 5.0) {
      return { r: x, g: 0.0, b: chr }
    }

    return { r: chr, g: 0.0, b: x }
  }

  const rgb = getChannels()

  return { r: rgb.r + m, g: rgb.g + m, b: rgb.b + m, a }
}

/**
 * @since 0.1.5
 * @category constructors
 */
export const fromHSLA: (c: Hsla) => Rgba = (c) =>
  pipe(fromHSLA2(c), (c) =>
    rgba(
      channelFromUnitInterval(c.r),
      channelFromUnitInterval(c.g),
      channelFromUnitInterval(c.b),
      c.a
    )
  )

export const maxChroma: (c: Rgba) => number = ({ r, g, b }) =>
  Math.max(Math.max(r, g), b)

export const minChroma: (c: Rgba) => number = ({ r, g, b }) =>
  Math.min(Math.min(r, g), b)

export const chroma: (c: Rgba) => number = (c) => maxChroma(c) - minChroma(c)
