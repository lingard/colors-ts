/**
 * @since 0.1.0
 */
import * as Ord from 'fp-ts/Ord'
import * as number from 'fp-ts/number'
import * as RA from 'fp-ts/ReadonlyArray'
import * as A from 'fp-ts/Array'
import * as O from 'fp-ts/Option'
import * as boolean from 'fp-ts/boolean'
import * as string from 'fp-ts/string'
import * as C from './Color'
import { constant, flow, pipe } from 'fp-ts/function'
import { Endomorphism } from 'fp-ts/Endomorphism'
import { intercalate } from 'fp-ts/Foldable'
import { red, yellow } from './X11'
import { unitInterval, UnitInterval } from './UnitInterval'

type Ratio = UnitInterval

const ratio = unitInterval

/**
 * A point on the color scale.
 *
 * @since 0.1.0
 * @category model
 */
export type ColorStop = readonly [C.Color, Ratio]

/**
 * Represents all `ColorStops` in a color scale. The first `Color` defines the left end
 * (color at ratio 0.0), the list of stops defines possible intermediate steps
 * and the second `Color` argument defines the right end point (color at ratio 1.0).
 *
 * @since 0.1.0
 * @category model
 */
export type ColorStops = readonly [
  first: C.Color,
  middle: ReadonlyArray<ColorStop>,
  last: C.Color
]

/**
 * A color scale is represented by a list of `ColorStops` and a `ColorSpace` that is
 * used for interpolation between the stops.
 *
 * @since 0.1.0
 * @category model
 */
export type ColorScale = {
  readonly mode: C.ColorSpace
  readonly stops: ColorStops
}

/**
 * Create a color stop from a given `Color` and a number between 0 and 1.
 * If the number is outside this range, it is clamped.
 *
 * @category constructors
 * @since 0.1.0
 */
export const colorStop = (c: C.Color, r: number): ColorStop => [c, ratio(r)]

/**
 * @category constructors
 * @since 0.1.0
 */
export const colorStops = (
  l: C.Color,
  m: ReadonlyArray<readonly [C.Color, number]>,
  r: C.Color
): ColorStops =>
  pipe(
    m,
    // clamp color stop ratios
    RA.map(([c, r]) => colorStop(c, r)),
    // sort stops by ratio
    RA.sort(OrdColorStop),
    (m) => [l, m, r]
  )

/**
 * Create a color scale. The color space is used for interpolation between
 * different stops. The first `Color` defines the left end (color at ratio
 * 0.0), the list of stops defines possible intermediate steps and the second
 * `Color` argument defines the right end point (color at ratio 1.0).
 *
 * @category constructors
 * @since 0.1.0
 */
export const colorScale = (
  space: C.ColorSpace,
  l: C.Color,
  m: ReadonlyArray<readonly [C.Color, number]>,
  r: C.Color
): ColorScale => ({
  mode: space,
  stops: colorStops(l, m, r)
})

/**
 * A scale of colors from black to white.
 *
 * @category constructors
 * @since 0.1.0
 */
export const grayscale = colorScale('rgb', C.black, [], C.white)

/**
 * Extract the ratio out of a ColorStop
 *
 * @category destructors
 * @since 0.1.0
 */
export const stopRatio: (s: ColorStop) => Ratio = ([, r]) => r

/**
 * Extract the color out of a ColorStop
 *
 * @category destructors
 * @since 0.1.0
 */
export const stopColor: (s: ColorStop) => C.Color = ([c]) => c

const OrdColorStop: Ord.Ord<ColorStop> = Ord.contramap(stopRatio)(number.Ord)

/**
 * Extract the color out of a ColorStop
 *
 * @category destructors
 * @since 0.1.6
 */
export const stops: (s: ColorScale) => ColorStops = ({ stops }: ColorScale) =>
  stops

/**
 * get the first color of the scale
 *
 * @since 0.1.4
 */
export const first: (c: ColorScale) => C.Color = flow(stops, ([first]) => first)

/**
 * get the last color of the scale
 *
 * @since 0.1.4
 */
export const last: (c: ColorScale) => C.Color = flow(
  stops,
  ([, , last]) => last
)

/**
 * get the middle colors of the scale
 *
 * @since 0.1.4
 * @internal
 */
export const middle: (c: ColorScale) => readonly ColorStop[] = flow(
  stops,
  ([, middle]) => middle
)

/**
 * get the `ColorSpace` mode of the scale
 *
 * @since 0.1.4
 */
export const mode: (s: ColorScale) => C.ColorSpace = (s) => s.mode

/**
 * change the `ColorSpace` mode of the scale
 *
 * @since 0.1.4
 */
export const changeMode: (
  space: C.ColorSpace
) => (scale: ColorScale) => ColorScale =
  (space) =>
  ({ stops }) =>
    colorScale(space, ...stops)

/**
 * transform a scale to an ReadonlyArray of ColorStops
 *
 * @category destructors
 * @since 0.1.4
 */
export const toReadonlyArray: (s: ColorScale) => ReadonlyArray<ColorStop> = (
  scale
) =>
  pipe(
    middle(scale),
    RA.prepend(colorStop(first(scale), 0)),
    RA.append(colorStop(last(scale), 1))
  )

/**
 * transform a scale to an Array of ColorStops
 *
 * @category destructors
 * @since 0.1.0
 * @deprecated use toReadonlyArray
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toArray: (s: ColorScale) => ColorStop[] = toReadonlyArray as any

/**
 * returns the amount of color stops in the scale
 *
 * @category destructors
 * @since 0.1.4
 */
export const length: (s: ColorScale) => number = flow(
  toReadonlyArray,
  (x) => x.length
)

/**
 * Like `combineColorStops`, but the width of the "transition zone" can be specified as the
 * first argument.
 *
 * @example
 *
 * import * as S from 'ts-colors/Scale'
 * import * as X11 from 'ts-colors/X11'
 *
 * const stops = S.colorStops(X11.yellow, [], X11.blue)
 *
 * S.combineStops(0.0005)(0.5)(stops)
 *
 * @since 0.1.0
 */
export const combineStops: (
  e: number
) => (x: number) => (a: ColorStops) => (b: ColorStops) => ColorStops =
  (epsilon) =>
  (x) =>
  ([aStart, aMiddle, aEnd]) =>
  ([bStart, bMiddle, bEnd]) => {
    const startStops = pipe(
      aMiddle,
      RA.map((stop) =>
        pipe(
          stopRatio(stop),
          (ratio) => ratio / (1.0 / x),
          (ratio) => colorStop(stopColor(stop), ratio)
        )
      )
    )
    const midStops = [colorStop(aEnd, x - epsilon), colorStop(bStart, x)]
    const endStops = pipe(
      bMiddle,
      RA.map((stop) =>
        pipe(
          stopRatio(stop),
          (ratio) => x + ratio / (1.0 / (1.0 - x)),
          (ratio) => colorStop(stopColor(stop), ratio)
        )
      )
    )
    const stops = [...startStops, ...midStops, ...endStops]

    return colorStops(aStart, stops, bEnd)
  }

/**
 * @internal
 * @since 0.1.4
 */
export const epsilon = 0.000001

/**
 * Concatenates two color scales. The first argument specifies the transition point as
 * a number between zero and one. The color right at the transition point is the first
 * color of the second color scale.
 *
 * @example
 *
 * import * as S from 'ts-colors/Scale'
 * import * as X11 from 'ts-colors/X11'
 *
 * const stops = S.colorStops(X11.yellow, [], X11.blue)

 * S.combineColorStops(0.4)(stops)
 *
 * @since 0.1.0
 */
export const combineColorStops = combineStops(epsilon)

/**
 * Concatenates two color scales. The first argument specifies the transition point as
 * a number between zero and one. The color right at the transition point is the first
 * color of the second color scale.
 *
 * @since 0.1.4
 */
export const combine: (
  e: number
) => (a: ColorScale) => (b: ColorScale) => ColorScale = (e) => (a) => (b) => {
  const c = combineColorStops(e)

  return pipe(b.stops, c(a.stops), (s) => colorScale(a.mode, ...s))
}

/**
 * reverses `ColorStops`
 *
 * @since 0.1.0
 * @internal
 */
export const reverseStops: Endomorphism<ColorStops> = ([start, stops, end]) =>
  pipe(
    stops,
    RA.reverse,
    RA.map(([c, r]) => colorStop(c, 1 - r)),
    (stops) => [end, stops, start]
  )

/**
 * Reverses a color scale
 *
 * @since 0.1.4
 */
export const reverse: Endomorphism<ColorScale> = ({ mode, stops }) =>
  colorScale(mode, ...reverseStops(stops))

/**
 * Create `ColorStops` from a list of colors such that they will be evenly
 * spaced on the scale.
 *
 * @since 0.1.0
 * @internal
 */
export const uniformStops = (
  s: C.Color,
  m: C.Color[],
  e: C.Color
): ColorStops => {
  const length = m.length
  const n = 1 + length
  const stops = A.zipWith(A.range(1, n), m, (i: number, c: C.Color) =>
    colorStop(c, i / n)
  )

  return colorStops(s, stops, e)
}

/**
 * Create a uniform color scale from a list of colors that will be evenly
 * spaced on the scale.
 *
 * @since 0.1.0
 */
export const uniformScale =
  (mode: C.ColorSpace) =>
  (s: C.Color, m: C.Color[], e: C.Color): ColorScale =>
    pipe(uniformStops(s, m, e), (stops) => colorScale(mode, ...stops))

const insertBy =
  <A>({ compare }: Ord.Ord<A>) =>
  (a: A) =>
  (bs: ReadonlyArray<A>) =>
    pipe(
      bs,
      RA.findIndex((b) => compare(a, b) === 1),
      O.fold(
        () => pipe(bs, RA.append(a)),
        (i) => RA.unsafeInsertAt(i, a, bs)
      )
    )

const insertByRatio = insertBy(OrdColorStop)

/**
 * Add a stop to a list of `ColorStops`.
 *
 * @since 0.1.0
 * @internal
 */
export const insertStop =
  (c: C.Color, r: number) =>
  ([s, m, e]: ColorStops): ColorStops =>
    pipe(
      colorStop(c, r),
      (stop) => pipe(m, insertByRatio(stop)),
      (stops) => colorStops(s, RA.toArray(stops), e)
    )

/**
 * Add a stop to a color scale.
 *
 * @since 0.1.0
 */
export const addStop: (c: C.Color, r: number) => (s: ColorScale) => ColorScale =

    (c, r) =>
    ({ mode, stops }) =>
      pipe(stops, insertStop(c, r), ([s, m, e]) =>
        colorScale(mode, s, RA.toArray(m), e)
      )

const between = Ord.between(number.Ord)

/**
 * Get the color at a specific point on the color scale (number between 0 and
 * 1). If the number is smaller than 0, the color at 0 is returned. If the
 * number is larger than 1, the color at 1 is returned.
 *
 * @since 0.1.0
 * @internal
 */
export const simpleSampler: (
  i: C.Interpolator
) => (s: ColorStops) => (x: number) => C.Color =
  (interpolate) =>
  ([start, middle, end]) =>
  (x) => {
    if (x < 0) {
      return start
    }

    if (x > 1) {
      return end
    }

    const sample = (
      c1: C.Color,
      left: number,
      cs: ReadonlyArray<ColorStop>
    ): C.Color =>
      pipe(
        cs,
        RA.matchLeft(constant(c1), ([c2, right], rest) => {
          /* istanbul ignore next */
          if (left === right) {
            return c1
          }

          return pipe(
            x,
            between(left, right),
            boolean.fold(
              () => sample(c2, right, rest),
              () => {
                const p = (x - left) / (right - left)

                return interpolate(c1)(c2)(p)
              }
            )
          )
        })
      )

    const stops = pipe(middle, RA.append(colorStop(end, 1.0)))

    return sample(start, 0, stops)
  }

/**
 * Get the color at a specific point on the color scale by linearly
 * interpolating between its colors.
 *
 * @since 0.1.0
 */
export const sample: (s: ColorScale) => (x: number) => C.Color = ({
  mode,
  stops
}) => pipe(stops, simpleSampler(C.mix(mode)))

/**
 * Takes a sampling function and returns a list of colors that is sampled via
 * that function. The number of colors can be specified.
 *
 * @since 0.1.0
 * @internal
 */
export const makeColors =
  (f: (x: number) => C.Color) =>
  (n: number): C.Color[] => {
    if (n === 0) {
      return []
    }

    if (n === 1) {
      return [f(0)]
    }

    return A.makeBy(n, (i: number) => f(i / (n - 1)))
  }

/**
 * A list of colors that is sampled from a color scale. The number of colors
 * can be specified.
 *
 * @since 0.1.0
 */
export const sampleColors =
  (x: number) =>
  (scale: ColorScale): C.Color[] =>
    pipe(x, makeColors(sample(scale)))

/**
 * Modify a list of  `ColorStops` by applying the given function to each color
 * stop. The first argument is the position of the color stop.
 *
 * @since 0.1.0
 * @internal
 */
export const modifyColorStops: (
  f: (i: number, c: C.Color) => C.Color
) => (s: ColorStops) => ColorStops =
  (f) =>
  ([start, middle, end]) =>
    colorStops(
      f(0, start),
      pipe(
        middle,
        RA.map(([c, r]) => colorStop(f(r, c), r)),
        RA.toArray
      ),
      f(1, end)
    )

/**
 * Modify the colors of a scale by applying the given function to each
 * color stop. The first argument is the position of the color stop.
 *
 * @since 0.1.4
 */
export const modify: (
  f: (i: number, c: C.Color) => C.Color
) => (s: ColorScale) => ColorScale =
  (f) =>
  ({ mode, stops }) =>
    pipe(stops, modifyColorStops(f), (stops) => colorScale(mode, ...stops))

/**
 * A spectrum of fully saturated hues (HSL color space).
 *
 * @since 0.1.0
 */
export const spectrum = pipe(
  {
    end: C.hsl(0.0, 1.0, 0.5),
    stops: pipe(
      A.range(1, 35),
      A.map((i) => colorStop(C.hsl(10.0 * i, 1.0, 0.5), i / 36.0))
    )
  },
  ({ end, stops }) => colorScale('hsl', end, stops, end)
)

/**
 * A perceptually-uniform, diverging color scale from blue to red, similar to
 * the ColorBrewer scale 'RdBu'.
 *
 * @since 0.1.0
 */
export const blueToRed = pipe(
  {
    gray: C.fromInt(0xf7f7f7),
    red: C.fromInt(0xb2182b),
    blue: C.fromInt(0x2166ac)
  },
  ({ red, gray, blue }) => uniformScale('Lab')(blue, [gray], red)
)

/**
 * A perceptually-uniform, multi-hue color scale from yellow to red, similar
 * to the ColorBrewer scale YlOrRd.
 *
 * @since 0.1.0
 */
export const yellowToRed = pipe(
  {
    yellow: C.fromInt(0xffffcc),
    orange: C.fromInt(0xfd8d3c),
    red: C.fromInt(0x800026)
  },
  ({ yellow, orange, red }) => uniformScale('Lab')(yellow, [orange], red)
)

/**
 * A color scale that represents 'hot' colors.
 *
 * @since 0.1.0
 */
export const hot = colorScale(
  'rgb',
  C.black,
  [colorStop(red, 0.5), colorStop(yellow, 0.75)],
  C.white
)

/**
 * A color scale that represents 'cool' colors.
 *
 * @since 0.1.0
 */
export const cool = colorScale(
  'rgb',
  C.hsl(180.0, 1.0, 0.6),
  [],
  C.hsl(300.0, 1.0, 0.5)
)

/**
 * Takes number of stops `ColorStops` should contain, function to generate
 * missing colors and `ColorStops` itself.
 *
 * @since 0.1.0
 * @internal
 */
export const minColorStops =
  (sampler: (stops: ColorStops) => (n: number) => C.Color) =>
  (n: number) =>
  (stops: ColorStops): ColorStops => {
    if (n === 0) {
      return stops
    }

    const additionalStops = pipe(
      n > 2,
      boolean.fold(constant([]), () =>
        pipe(
          A.range(1, n - 1),
          A.map((step) => {
            const frac = ratio(step / n)

            return pipe(frac, sampler(stops), (c) => colorStop(c, frac))
          })
        )
      )
    )

    return pipe(
      additionalStops,
      A.reduce(stops, (stops, [c, r]) => pipe(stops, insertStop(c, r)))
    )
  }

const intercalateAS = intercalate(string.Monoid, RA.Foldable)

const cssColorStopsRGB: (s: ColorStops) => string = ([s, m, e]) => {
  if (RA.isEmpty(m)) {
    return `${C.toCSSHsla(s)}, ${C.toCSSHsla(e)}`
  }

  const percentage = (r: number) => `${r * 100.0}%`
  const toString = ([c, r]: ColorStop) => `${C.toCSSHsla(c)} ${percentage(r)}`
  const stops = pipe(m, RA.map(toString), (stop) => intercalateAS(', ', stop))

  return `${C.toCSSHsla(s)}, ${stops}, ${C.toCSSHsla(e)}`
}

/**
 * A CSS representation of the color scale in the form of a comma-separated
 * list of color stops. This list can be used in a `linear-gradient` or
 * a similar construct.
 *
 * Note that CSS uses the RGB space for color interpolation. Consequently, if
 * the color scale is in RGB mode, this is just a list of all defined color
 * stops.
 *
 * For other color spaces, the color scale is sampled at (at least) 10
 * different points. This should give a reasonable approximation to the true
 * gradient in the specified color space.
 *
 * @since 0.1.0
 */
export const cssColorStops: (s: ColorScale) => string = ({ mode, stops }) => {
  if (mode === 'rgb') {
    return cssColorStopsRGB(stops)
  }

  const interpolate = C.mix(mode)
  const sample = simpleSampler(interpolate)
  const sampleSteps = minColorStops(sample)

  return pipe(stops, sampleSteps(10), cssColorStopsRGB)
}
