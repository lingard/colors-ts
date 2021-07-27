/**
 * @since 0.1.0
 */

import * as Ord from 'fp-ts/Ord'
import * as Equals from 'fp-ts/Eq'
import * as S from 'fp-ts/Show'
import * as O from 'fp-ts/Option'
import * as number from 'fp-ts/number'
import { pipe } from 'fp-ts/function'

import { clipHue, Hue, modPos } from './Hue'
import * as Int from './Int'
import { sequenceT } from 'fp-ts/Apply'

/**
 * utils
 */
const clampNumber = Ord.clamp(number.Ord)
const maxNumber = Ord.max(number.Ord)
const minNumber = Ord.min(number.Ord)

const clampRatio = clampNumber(0, 1)
const clampChannel = clampNumber(0, 255)

const div = (a: number) => (b: number) => a / b

/**
 * @category model
 * @since 0.1.0
 */
export type Color = readonly [Hue, number, number, number]

// export type Color = Newtype<
//   { readonly Color: unique symbol },
//   readonly [Hue, number, number, number]
// >

/**
 * @category constructors
 */

/**
 * @category constructors
 * @since 0.1.0
 *
 * Create a `Color` from Hue, Saturation, Lightness and Alpha values. The
 * Hue is given in degrees, as a `Number` between 0.0 and 360.0. Saturation,
 * Lightness and Alpha are numbers between 0.0 and 1.0.
 */
export const hsla = (h: number, s: number, l: number, a: number): Color => [
  h,
  clampRatio(s),
  clampRatio(l),
  clampRatio(a)
]

/**
 * @category constructors
 * @since 0.1.0
 *
 * Create a `Color` from Hue, Saturation, Lightness and Alpha values. The
 * Hue is given in degrees, as a `Number` between 0.0 and 360.0. Saturation,
 * Lightness and Alpha are numbers between 0.0 and 1.0.
 */
export const hsl = (h: number, s: number, l: number): Color => hsla(h, s, l, 1)

const toChannel = (x: number) => div(x)(255)

const clampChannels = (r: number, g: number, b: number) => [
  clampChannel(r),
  clampChannel(g),
  clampChannel(b)
]

/**
 * @since 0.1.0
 */
export const rgba = (r: number, g: number, b: number, alpha: number): Color => {
  const [red, green, blue] = clampChannels(r, g, b)
  const maxChroma = maxNumber(maxNumber(red, green), blue)
  const minChroma = minNumber(minNumber(red, green), blue)
  const chroma = maxChroma - minChroma

  const getHue = () => {
    const r = toChannel(red)
    const g = toChannel(green)
    const b = toChannel(blue)
    const c = chroma / 255

    if (c === 0) {
      return 0
    }

    if (maxChroma === red) {
      return pipe((g - b) / c, (x) => modPos(x)(6.0))
    }

    if (maxChroma === green) {
      return (b - r) / c + 2.0
    }

    return (r - g) / c + 4.0
  }

  const hue = 60.0 * getHue()
  const lightness = (maxChroma + minChroma) / (255.0 * 2.0)

  const getSaturation = () => {
    const c = chroma / 255

    if (chroma === 0) {
      return 0
    }

    return c / (1.0 - Math.abs(2.0 * lightness - 1.0))
  }

  const saturation = getSaturation()

  return [hue, saturation, lightness, alpha]
}

/**
 * @since 0.1.0
 */
export const rgb = (r: number, g: number, b: number): Color => rgba(r, g, b, 1)

/**
 * Create a `Color` from Hue, Saturation, Value and Alpha values. The
 * Hue is given in degrees, as a `Number` between 0.0 and 360.0. Saturation,
 * Value and Alpha are numbers between 0.0 and 1.0.
 *
 * @since 0.1.0
 */
export const hsva = (h: number, s: number, v: number, a: number): Color =>
  pipe(
    (2.0 - s) * v,
    (tmp) => ({
      s: (s * v) / (tmp < 1.0 ? tmp : 2.0 - tmp),
      l: tmp / 2.0
    }),
    ({ s, l }) => hsla(h, s, l, a)
  )

/**
 * Create a `Color` from Hue, Saturation and Value values. The Hue is
 * given in degrees, as a `Number` between 0.0 and 360.0. Both Saturation and
 * Value are numbers between 0.0 and 1.0.
 *
 * @since 0.1.0
 */
export const hsv = (h: number, s: number, v: number): Color => hsva(h, s, v, 1)

const strMatch = (pattern: RegExp) => (str: string) =>
  O.fromNullable(str.match(pattern))

/**
 * Parse a hexadecimal RGB code of the form `#rgb` or `#rrggbb`. The `#`
 * character is required. Each hexadecimal digit is of the form `[0-9a-fA-F]`
 * (case insensitive). Returns `Nothing` if the string is in a wrong format.
 *
 * @since 0.1.0
 */
export const fromHexString: (hex: string) => O.Option<Color> = (str) => {
  const isShort = str.length == 4
  const digit = '[0-9a-fA-F]'
  const single = `(${digit})`
  const pair = `(${digit}${digit})`
  const variant = isShort
    ? `${single}${single}${single}`
    : `${pair}${pair}${pair}`
  const mPattern = `^#(?:${variant})$`
  const parseHex = Int.fromStringAs(Int.hexadecimal)

  return pipe(
    str,
    strMatch(new RegExp(mPattern)),
    O.chain((groups) =>
      sequenceT(O.Applicative)(
        parseHex(groups[1]),
        parseHex(groups[2]),
        parseHex(groups[3])
      )
    ),
    O.map(([r, g, b]) => {
      if (isShort) {
        return rgb(16 * r + r, 16 * g + g, 16 * b + b)
      }

      return rgb(r, g, b)
    })
  )
}

/**
 * Pure black.
 *
 * @since 0.1.0
 */
export const black = hsl(0.0, 0.0, 0.0)

/**
 * Pure white.
 *
 * @since 0.1.0
 */
export const white = hsl(0.0, 0.0, 1.0)

/**
 * Convert a `Color` to its red, green, blue and alpha values. The RGB values
 * are integers in the range from 0 to 255. The alpha channel is a number
 * between 0.0 and 1.0.
 *
 * @since 0.1.0
 */
export const toRGBA2: (c: Color) => {
  r: number
  g: number
  b: number
  a: number
} = (c) =>
  pipe(toRGBA(c), (c) => ({
    r: Math.round(255 * c.r),
    g: Math.round(255 * c.g),
    b: Math.round(255 * c.b),
    a: c.a
  }))

/**
 * Convert a `Color` to its red, green, blue and alpha values. All values
 * are numbers in the range from 0.0 to 1.0.
 *
 * @since 0.1.0
 */
export const toRGBA: (c: Color) => {
  r: number
  g: number
  b: number
  a: number
} = ([hue, s, l, a]) => {
  const h = clipHue(hue / 60.0)
  const chr = (1.0 - Math.abs(2.0 * l - 1.0)) * s
  const m = l - chr / 2.0
  const x = chr * (1.0 - Math.abs((h % 2.0) - 1.0))

  const getCol = () => {
    if (h < 1.0) {
      return { r: chr, g: x, b: 0.0 }
    }

    if (1.0 <= h && h < 2.0) {
      return { r: x, g: chr, b: 0.0 }
    }

    if (2.0 <= h && h < 3.0) {
      return { r: 0.0, g: chr, b: x }
    }

    if (3.0 <= h && h < 4.0) {
      return { r: 0.0, g: x, b: chr }
    }

    if (4.0 <= h && h < 5.0) {
      return { r: x, g: 0.0, b: chr }
    }

    return { r: chr, g: 0.0, b: x }
  }

  const col = getCol()

  return { r: col.r + m, g: col.g + m, b: col.b + m, a }
}

/**
 * @since 0.1.0
 */
export const toHexString: (c: Color) => string = (color) => {
  const c = toRGBA2(color)
  const toHex = (n: number) => {
    const repr = Int.toStringAs(Int.hexadecimal)(n)

    if (repr.length === 1) {
      return `0${repr}`
    }

    return repr
  }

  return `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`
}

/**
 * @since 0.1.0
 */
export const luminance: (color: Color) => number = (c) => {
  const rgba = toRGBA(c)
  const f = (c: number) => {
    if (c <= 0.03928) {
      return c / 12.92
    }

    return Math.pow((c + 0.055) / 1.055, 2.4)
  }

  const r = f(rgba.r)
  const g = f(rgba.g)
  const b = f(rgba.b)

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * @category instances
 * @since 0.1.0
 *
 * - The `Eq` instance compares two `Color`s by comparing their (integer) RGB
 *   values. This is different from comparing the HSL values (for example,
 *   HSL has many different representations of black (arbitrary hue and
 *   saturation values).
 * - Colors outside the sRGB gamut which cannot be displayed on a typical
 *   computer screen can not be represented by `Color`.
 */
export const Eq: Equals.Eq<Color> = {
  equals: (x, y) => {
    const cx = toRGBA2(x)
    const cy = toRGBA2(y)

    return cx.r == cy.r && cx.g == cy.g && cx.b == cy.b && cx.a == cy.a
  }
}

/**
 * @category instances
 * @since 0.1.0
 */
export const OrdLuminance: Ord.Ord<Color> = {
  equals: Eq.equals,
  compare: (x, y) => {
    const lx = luminance(x)
    const ly = luminance(y)

    return number.Ord.compare(lx, ly)
  }
}

/**
 * @category instances
 * @since 0.1.0
 */
export const Show: S.Show<Color> = {
  show: ([r, g, b, a]) => `${r}, ${g}, ${b}, ${a}`
}
