/**
 * @since 0.1.0
 */

import * as Ord from 'fp-ts/Ord'
import * as Equals from 'fp-ts/Eq'
import * as S from 'fp-ts/Show'
import * as O from 'fp-ts/Option'
import * as number from 'fp-ts/number'
import { Endomorphism, pipe } from 'fp-ts/function'

import { clipHue, Hue } from './Hue'
import * as Int from './Int'
import { sequenceT } from 'fp-ts/Apply'
import { deg2rad, interpolate, interpolateAngle, modPos, rad2deg } from './Math'

/**
 * @category internal
 */
const clampNumber = Ord.clamp(number.Ord)
const maxNumber = Ord.max(number.Ord)
const minNumber = Ord.min(number.Ord)

const clamp1 = clampNumber(0, 1)
const clamp255 = clampNumber(0, 255)

const channelRatio = (x: number) => x / 255

const clampRGB = (r: number, g: number, b: number) => [
  clamp255(r),
  clamp255(g),
  clamp255(b)
]

const strMatch = (pattern: RegExp) => (str: string) =>
  O.fromNullable(str.match(pattern))

/**
 * Note:
 * - Colors outside the sRGB gamut which cannot be displayed on a typical
 *   computer screen can not be represented by `Color`.
 *
 * @category model
 * @since 0.1.0
 */
export type Color = readonly [Hue, number, number, number]

/**
 * Create a `Color` from Hue, Saturation, Lightness and Alpha values. The
 * Hue is given in degrees, as a `Number` between 0.0 and 360.0. Saturation,
 * Lightness and Alpha are numbers between 0.0 and 1.0.
 *
 * @category constructors
 * @since 0.1.0
 */
export const hsla = (h: number, s: number, l: number, a: number): Color => [
  h,
  clamp1(s),
  clamp1(l),
  clamp1(a)
]

/**
 * Create a `Color` from Hue, Saturation, Lightness and Alpha values. The
 * Hue is given in degrees, as a `Number` between 0.0 and 360.0. Saturation,
 * Lightness and Alpha are numbers between 0.0 and 1.0.
 *
 * @category constructors
 * @since 0.1.0
 */
export const hsl = (h: number, s: number, l: number): Color => hsla(h, s, l, 1)

/**
 * Create a `Color` from integer RGB values between 0 and 255 and a floating
 * point alpha value between 0.0 and 1.0.
 *
 * @category constructors
 * @since 0.1.0
 */
export const rgba = (r: number, g: number, b: number, alpha: number): Color => {
  const [red, green, blue] = clampRGB(r, g, b)
  const maxChroma = maxNumber(maxNumber(red, green), blue)
  const minChroma = minNumber(minNumber(red, green), blue)
  const chroma = maxChroma - minChroma

  const getHue = () => {
    const r = channelRatio(red)
    const g = channelRatio(green)
    const b = channelRatio(blue)
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
 * Create a `Color` from integer RGB values between 0 and 255.
 *
 * @category constructors
 * @since 0.1.0
 */
export const rgb = (r: number, g: number, b: number): Color => rgba(r, g, b, 1)

/**
 * Create a `Color` from RGB and alpha values between 0.0 and 1.0.
 *
 * @category constructors
 * @since 0.1.0
 */
export const rgba2 = (r: number, g: number, b: number, a: number): Color =>
  rgba(Math.round(r * 255.0), Math.round(g * 255.0), Math.round(b * 255.0), a)

/**
 * Create a `Color` from RGB values between 0.0 and 1.0.
 *
 * @category constructors
 * @since 0.1.0
 */
export const rgb2 = (r: number, g: number, b: number): Color =>
  rgba2(r, g, b, 1)

/**
 * Create a `Color` from Hue, Saturation, Value and Alpha values. The
 * Hue is given in degrees, as a `Number` between 0.0 and 360.0. Saturation,
 * Value and Alpha are numbers between 0.0 and 1.0.
 *
 * @category constructors
 * @since 0.1.0
 */
export const hsva = (h: number, s: number, v: number, a: number): Color => {
  const value = clamp1(v)
  const { saturation, lightness } = pipe((2.0 - s) * value, (tmp) => ({
    saturation: (s * value) / (tmp < 1.0 ? tmp : 2.0 - tmp),
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
 * Create a `Color` from Hue, Saturation and Value values. The Hue is
 * given in degrees, as a `Number` between 0.0 and 360.0. Both Saturation and
 * Value are numbers between 0.0 and 1.0.
 *
 * @category constructors
 * @since 0.1.0
 */
export const hsv = (h: number, s: number, v: number): Color => hsva(h, s, v, 1)

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
export const xyz = (x: number, y: number, z: number): Color => {
  const f = (c: number) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1.0 / 2.4) - 0.055

  const r = f(3.2406 * x - 1.5372 * y - 0.4986 * z)
  const g = f(-0.9689 * x + 1.8758 * y + 0.0415 * z)
  const b = f(0.0557 * x - 0.204 * y + 1.057 * z)

  return rgb2(r, g, b)
}

/**
 * Illuminant D65 constants used for Lab color space conversions.
 *
 * @internal
 */
const d65 = { xn: 0.95047, yn: 1.0, zn: 1.08883 }

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
export const lab = (l: number, a: number, b: number): Color => {
  const delta = 6.0 / 29.0
  const finv = (t: number) =>
    t > delta ? Math.pow(t, 3.0) : 3.0 * delta * delta * (t - 4.0 / 29.0)

  const l2 = (l + 16.0) / 116.0
  const x = d65.xn * finv(l2 + a / 500.0)
  const y = d65.yn * finv(l2)
  const z = d65.zn * finv(l2 - b / 200.0)

  return xyz(x, y, z)
}

/**
 * Create a `Color` from lightness, chroma and hue coordinates in the CIE LCh
 * color space. This is a cylindrical transform of the Lab color space.
 * Note: See documentation for `xyz`. The same restrictions apply here.
 *
 * See: https://en.wikipedia.org/wiki/Lab_color_space
 *
 * @category constructors
 * @since 0.1.0
 */
export const lch = (l: number, c: number, h: number): Color => {
  const a = c * Math.cos(h * deg2rad)
  const b = c * Math.sin(h * deg2rad)

  return lab(l, a, b)
}

/**
 * Parse a hexadecimal RGB code of the form `#rgb` or `#rrggbb`. The `#`
 * character is required. Each hexadecimal digit is of the form `[0-9a-fA-F]`
 * (case insensitive). Returns `Option.none` if the string is in a wrong format.
 *
 * @category constructors
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
 * @category constructors
 * @since 0.1.0
 */
export const black = hsl(0.0, 0.0, 0.0)

/**
 * Pure white.
 *
 * @category constructors
 * @since 0.1.0
 */
export const white = hsl(0.0, 0.0, 1.0)

/**
 * Create a gray tone from a lightness values (0.0 is black, 1.0 is white).
 *
 * @category constructors
 * @since 0.1.0
 */
export const graytone = (l: number): Color => hsl(0.0, 0.0, l)

/**
 * Convert a `Color` to its red, green, blue and alpha values. All values
 * are numbers in the range from 0.0 to 1.0.
 *
 * @since 0.1.0
 * @category deconstructors
 */
export const toRGBA2: (c: Color) => {
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
 * Convert a `Color` to its red, green, blue and alpha values. The RGB values
 * are integers in the range from 0 to 255. The alpha channel is a number
 * between 0.0 and 1.0.
 *
 * @since 0.1.0
 * @category deconstructors
 */
export const toRGBA: (c: Color) => {
  r: number
  g: number
  b: number
  a: number
} = (c) =>
  pipe(toRGBA2(c), (c) => ({
    r: Math.round(255 * c.r),
    g: Math.round(255 * c.g),
    b: Math.round(255 * c.b),
    a: c.a
  }))

/**
 * Convert a `Color` to its Hue, Saturation, Lightness and Alpha values. See
 * `hsla` for the ranges of each channel.
 *
 * @since 0.1.0
 * @category deconstructors
 */
export const toHSLA = ([h, s, l, a]: Color): {
  h: number
  s: number
  l: number
  a: number
} => ({
  h: clipHue(h),
  s,
  l,
  a
})

/**
 * Convert a `Color` to its Hue, Saturation, Value and Alpha values. See
 * `hsva` for the ranges of each channel.
 *
 * @since 0.1.0
 * @category deconstructors
 */
export const toHSVA = ([h, s, l, a]: Color): {
  h: number
  s: number
  v: number
  a: number
} => {
  const tmp = s * (l < 0.5 ? l : 1.0 - l)
  const hue = clipHue(h)
  const saturation = (2.0 * tmp) / (l + tmp)
  const v = l + tmp

  if (l === 0) {
    return {
      h: hue,
      s: (2.0 * s) / (1.0 + s),
      v: 0.0,
      a
    }
  }

  if (s === 0 && l === 0) {
    return {
      h: hue,
      s: 0.0,
      v: 1.0,
      a
    }
  }

  return {
    h: hue,
    s: saturation,
    v,
    a
  }
}

/**
 * Get XYZ coordinates according to the CIE 1931 color space.
 *
 * See:
 * - https://en.wikipedia.org/wiki/CIE_1931_color_space
 * - https://en.wikipedia.org/wiki/SRGB
 *
 * @since 0.1.0
 * @category deconstructors
 */
export const toXYZ = (c: Color): { x: number; y: number; z: number } => {
  const finv = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)

  const rec = toRGBA(c)
  const r = finv(rec.r)
  const g = finv(rec.g)
  const b = finv(rec.b)

  const x = 0.4124 * r + 0.3576 * g + 0.1805 * b
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b
  const z = 0.0193 * r + 0.1192 * g + 0.9505 * b

  return { x, y, z }
}

/**
 * Get L, a and b coordinates according to the Lab color space.
 *
 * See: https://en.wikipedia.org/wiki/Lab_color_space
 *
 * @since 0.1.0
 * @category deconstructors
 */

export const toLab = (c: Color): { l: number; a: number; b: number } => {
  const cut = Math.pow(6.0 / 29.0, 3.0)
  const f = (t: number) =>
    t > cut
      ? Math.pow(t, 1.0 / 3.0)
      : (1.0 / 3.0) * Math.pow(29.0 / 6.0, 2.0) * t + 4.0 / 29.0

  const rec = toXYZ(c)
  const fy = f(rec.y / d65.yn)

  const l = 116.0 * fy - 16.0
  const a = 500.0 * (f(rec.x / d65.xn) - fy)
  const b = 200.0 * (fy - f(rec.z / d65.zn))

  return { l, a, b }
}

/**
 * Get L, C and h coordinates according to the CIE LCh color space.
 * See: https://en.wikipedia.org/wiki/Lab_color_space
 *
 * @since 0.1.0
 * @category deconstructors
 */
export const toLCh = (c: Color): { l: number; c: number; h: number } => {
  const rec = toLab(c)
  const l = rec.l
  const a = rec.a
  const b = rec.b
  const c2 = Math.sqrt(a * a + b * b)
  const h = modPos(Math.atan2(b, a * rad2deg))(360.0)

  return { l, c: c2, h }
}

/**
 * @since 0.1.0
 * @category deconstructors
 */
export const toHexString: (c: Color) => string = (color) => {
  const c = toRGBA(color)
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
 * A CSS representation of the color in the form `hsl(..)` or `hsla(...)`.
 *
 * @since 0.1.0
 * @category deconstructors
 */
export const cssStringHSLA = ([h, s, l, a]: Color): string => {
  const toString = (n: number) => Math.round(100.0 * n) / 100.0
  const saturation = `${toString(s * 100.0)}%`
  const lightness = `${toString(l * 100.0)}%`

  return a == 1.0
    ? `hsl(${h}, ${saturation}, ${lightness})`
    : `hsla(${h}, ${saturation}, ${lightness}, ${a})`
}

/**
 * A CSS representation of the color in the form `rgb(..)` or `rgba(...)`
 *
 * @since 0.1.0
 * @category deconstructors
 */
export const cssStringRGBA = (c: Color): string =>
  pipe(toRGBA(c), (c) =>
    c.a === 1.0
      ? `rgb(${c.r}, ${c.g}, ${c.b})`
      : `rgba(${c.r}, ${c.g}, ${c.r}, ${c.a})`
  )

/**
 * Rotate the hue of a `Color` by a certain angle (in degrees).
 *
 * @since 0.1.0
 */
export const rotateHue =
  (angle: number) =>
  ([h, s, l, a]: Color): Color =>
    hsla(h + angle, s, l, a)

/**
 * Get the complementary color (hue rotated by 180°).
 *
 * @since 0.1.0
 */
export const complementary = rotateHue(180)

/**
 * Lighten a color by adding a certain amount (number between -1.0 and 1.0)
 * to the lightness channel. If the number is negative, the color is
 * darkened.
 *
 * @since 0.1.0
 */
export const lighten =
  (f: number) =>
  ([h, s, l, a]: Color): Color =>
    hsla(h, s, l + f, a)

/**
 * Darken a color by subtracting a certain amount (number between -1.0 and
 * 1.0) from the lightness channel. If the number is negative, the color is
 * lightened.
 *
 * @since 0.1.0
 */
export const darken = (f: number): Endomorphism<Color> => lighten(-f)

/**
 * Increase the saturation of a color by adding a certain amount (number
 * between -1.0 and 1.0) to the saturation channel. If the number is
 * negative, the color is desaturated.
 *
 * @since 0.1.0
 */
export const saturate =
  (f: number) =>
  ([h, s, l, a]: Color): Color =>
    hsla(h, s + f, l, a)

/**
 * Decrease the saturation of a color by subtracting a certain amount (number
 * between -1.0 and 1.0) from the saturation channel. If the number is
 * negative, the color is saturated.
 *
 * @since 0.1.0
 */
export const desaturate = (f: number): Endomorphism<Color> => saturate(-f)

/**
 * Convert a color to a gray tone with the same perceived luminance (see `luminance`)
 *
 * @since 0.1.0
 */
export const toGray: Endomorphism<Color> = (c) =>
  pipe(toLCh(c), (c) => lch(c.l, 0.0, 0.0), desaturate(1))

/**
 * A function that interpolates between two colors. It takes a start color,
 * an end color, and a ratio in the interval [0.0, 1.0]. It returns the
 * mixed color.
 */
type Interpolator = (start: Color) => (end: Color) => (ratio: number) => Color

/**
 * Mix two colors by linearly interpolating between them in the  HSL colorspace.
 * The shortest path is chosen along the circle of hue values.
 *
 * @since 0.1.0
 */
export const mixHSL: Interpolator = (c1) => (c2) => (ratio) => {
  const f = toHSLA(c1)
  const t = toHSLA(c2)

  return hsla(
    interpolateAngle(ratio)(f.h)(t.h),
    interpolate(ratio)(f.s)(t.s),
    interpolate(ratio)(f.l)(t.l),
    interpolate(ratio)(f.a)(t.a)
  )
}

/**
 * Mix two colors by linearly interpolating between them in the RGB color space.
 *
 * @since 0.1.0
 */
export const mixRGB: Interpolator = (c1) => (c2) => (ratio) => {
  const f = toRGBA2(c1)
  const t = toRGBA2(c2)

  return rgba(
    interpolate(ratio)(f.r)(t.r),
    interpolate(ratio)(f.g)(t.g),
    interpolate(ratio)(f.b)(t.b),
    interpolate(ratio)(f.a)(t.a)
  )
}

/**
 * Mix two colors by linearly interpolating between them in the LCh color space.
 *
 * @since 0.1.0
 */
export const mixLCh: Interpolator = (c1) => (c2) => (ratio) => {
  const f = toLCh(c1)
  const t = toLCh(c2)

  return lch(
    interpolate(ratio)(f.l)(t.l),
    interpolate(ratio)(f.c)(t.c),
    interpolateAngle(ratio)(f.h)(t.h)
  )
}

/**
 * Mix two colors by linearly interpolating between them in the Lab color space.
 *
 * @since 0.1.0
 */
export const mixLab: Interpolator = (c1) => (c2) => (ratio) => {
  const f = toLab(c1)
  const t = toLab(c2)

  return lab(
    interpolate(ratio)(f.l)(t.l),
    interpolate(ratio)(f.a)(t.a),
    interpolate(ratio)(f.b)(t.b)
  )
}

/**
 * The percieved brightness of the color (A number between 0.0 and 1.0).
 * See: https://www.w3.org/TR/AERT#color-contrast
 *
 * @since 0.1.0
 */
export const brightness = (c: Color): number =>
  pipe(toRGBA2(c), (c) => (299.0 * c.r + 587.0 * c.g + 114.0 * c.b) / 1000.0)

/**
 * The relative brightness of a color (normalized to 0.0 for darkest black
 * and 1.0 for lightest white), according to the WCAG definition.
 *
 * See: https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
 *
 * @since 0.1.0
 */
export const luminance: (color: Color) => number = (c): number => {
  const rgba = toRGBA2(c)
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
 * The contrast ratio of two colors. A minimum contrast ratio of 4.5 is
 * recommended to ensure that text is readable on a colored background. The
 * contrast ratio is symmetric on both arguments:
 * `contrast c1 c2 == contrast c2 c1`.
 *
 * See http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
 *
 * @since 0.1.0
 */
export const contrast =
  (c1: Color) =>
  (c2: Color): number => {
    const l1 = luminance(c1)
    const l2 = luminance(c2)
    const o = 0.05

    return l1 > l2 ? (l1 + o) / (l2 + o) : (l2 + o) / (l1 + o)
  }

/**
 * Determine whether a color is perceived as a light color.
 *
 * @since 0.1.0
 */
export const isLight = (c: Color): boolean => brightness(c) > 0.5

/**
 * Determine whether text of one color is readable on a background of a
 * different color (see `contrast`). This function is symmetric in both
 * arguments.
 *
 * @since 0.1.0
 */
export const isReadable =
  (c1: Color) =>
  (c2: Color): boolean =>
    contrast(c1)(c2) > 4.5

/**
 * Return a readable foreground text color (either `black` or `white`) for a
 * given background color.
 *
 * @since 0.1.0
 */
export const textColor = (c: Color): Color => (isLight(c) ? black : white)

/**
 * @category instances
 * @since 0.1.0
 *
 * - The `Eq` instance compares two `Color`s by comparing their (integer) RGB
 *   values. This is different from comparing the HSL values (for example,
 *   HSL has many different representations of black (arbitrary hue and
 *   saturation values).
 */
export const Eq: Equals.Eq<Color> = {
  equals: (x, y) => {
    const cx = toRGBA(x)
    const cy = toRGBA(y)

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
