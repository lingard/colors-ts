/**
 * @since 0.1.0
 */
import * as Ord from 'fp-ts/Ord'
import * as number from 'fp-ts/number'
import * as RA from 'fp-ts/ReadonlyArray'
import * as A from 'fp-ts/Array'
import * as O from 'fp-ts/Option'
import * as C from './Color'
import { constant, Endomorphism, pipe } from 'fp-ts/function'
import { Foldable1, toReadonlyArray } from 'fp-ts/Foldable'
import { Kind, URIS } from 'fp-ts/HKT'

interface RatioBrand {
  readonly Ratio: unique symbol
}

/**
 * ColorStop ratio
 *
 * @since 0.1.0
 * @category model
 */
export type Ratio = number & RatioBrand

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
export type ColorStops = readonly [C.Color, ReadonlyArray<ColorStop>, C.Color]

/**
 * A color scale is represented by a list of `ColorStops` and a `ColorSpace` that is
 * used for interpolation between the stops.
 *
 * @since 0.1.0
 * @category model
 */
export type ColorScale = [C.ColorSpace, ColorStops]

const clampNumber = Ord.clamp(number.Ord)

const clamp1 = clampNumber(0, 1)

const ratio = (r: number) => clamp1(r) as Ratio

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
  m: ColorStop[],
  r: C.Color
): ColorStops => [l, m, r]

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
  m: ColorStop[],
  r: C.Color
): ColorScale => [space, colorStops(l, m, r)]

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
 * @category deconstructors
 * @since 0.1.0
 */
export const stopRatio = ([, r]: ColorStop): Ratio => r

/**
 * Extract the color out of a ColorStop
 *
 * @category deconstructors
 * @since 0.1.0
 */
export const stopColor = ([c]: ColorStop): C.Color => c

/**
 * Like `combineColorStops`, but the width of the "transition zone" can be specified as the
 * first argument.
 *
 * Here, the color at `x` will be orange and color at `x - epsilon` will be blue.
 * If we want the color at `x` to be blue, `combineStops' epsilon (x + epsilon)` could be used.
 *
 * @example
 *
 * import * as S from 'ts-colors/Scale'
 * import * as X11 from 'ts-colors/Scheme/X11'
 *
 * const stops = S.colorStops(X11.yellow, [], X11.blue)
 *
 * S.combineStops(0.0005)(0.5)(stops)
 *
 * @since 0.1.0
 */
export const combineStops =
  (epsilon: number) =>
  (x: number) =>
  ([aStart, aMiddle, aEnd]: ColorStops) =>
  ([bStart, bMiddle, bEnd]: ColorStops): ColorStops => {
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
          (ratio) => ratio / (1.0 / (1.0 - x)),
          (ratio) => colorStop(stopColor(stop), ratio)
        )
      )
    )
    const stops = RA.flatten([startStops, midStops, endStops])

    return colorStops(aStart, stops as ColorStop[], bEnd)
  }

const epsilon = 0.000001

/**
 * Concatenates two color scales. The first argument specifies the transition point as
 * a number between zero and one. The color right at the transition point is the first
 * color of the second color scale.
 *
 * @example
 *
 * import * as S from 'ts-colors/Scale'
 * import * as X11 from 'ts-colors/Scheme/X11'
 *
 * const stops = S.colorStops(X11.yellow, [], X11.blue)

 * S.combineColorStops(0.4)(stops)
 *
 * @since 0.1.0
 */
export const combineColorStops = combineStops(epsilon)

/**
 * Takes `ColorStops` and returns reverses it
 *
 * @since 0.1.0
 */
export const reverseStops: Endomorphism<ColorStops> = ([start, stops, end]) =>
  pipe(
    stops,
    RA.reverse,
    RA.map(([c, r]) => colorStop(c, 1 - r)),
    (stops) => [end, stops, start]
  )

/**
 * Create `ColorStops` from a list of colors such that they will be evenly
 * spaced on the scale.
 *
 * @since 0.1.0
 */
export const uniformStops =
  <F extends URIS>(F: Foldable1<F>) =>
  (s: C.Color, m: Kind<F, C.Color>, e: C.Color): ColorStops => {
    const cs = toReadonlyArray(F)(m)
    const length = cs.length
    const n = 1 + length
    const makeStop = (i: number, c: C.Color) => colorStop(c, i / n)
    const stops = RA.zipWith(RA.range(1, n), cs, makeStop)

    return colorStops(s, stops as ColorStop[], e)
  }

/**
 * Create a uniform color scale from a list of colors that will be evenly
 * spaced on the scale.
 *
 * @since 0.1.0
 */
export const uniformScale =
  <F extends URIS>(F: Foldable1<F>) =>
  (mode: C.ColorSpace) =>
  (s: C.Color, m: Kind<F, C.Color>, e: C.Color): ColorScale =>
    pipe(uniformStops(F)(s, m, e), ([s, m, e]) =>
      colorScale(mode, s, m as ColorStop[], e)
    )

const insertBy =
  <A>({ compare }: Ord.Ord<A>) =>
  (a: A) =>
  (bs: ReadonlyArray<A>) => {
    return pipe(
      bs,
      RA.findIndex((b) => compare(a, b) === 1),
      O.fold(
        () => pipe(bs, RA.append(a)),
        (i) => RA.unsafeInsertAt(i, a, bs)
      )
    )
  }

const OrdColorStop = Ord.fromCompare((a: ColorStop, b: ColorStop) => {
  const ra = stopRatio(a)
  const rb = stopRatio(b)

  return number.Ord.compare(ra, rb)
})

const insertByRatio = insertBy(OrdColorStop)

/**
 * Add a stop to a list of `ColorStops`.
 *
 * @since 0.1.0
 */
export const addStop =
  ([s, m, e]: ColorStops) =>
  (c: C.Color) =>
  (r: number): ColorStops =>
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
export const addScaleStop =
  ([mode, s]: ColorScale) =>
  (c: C.Color) =>
  (r: number): ColorScale =>
    pipe(addStop(s)(c)(r), ([s, m, e]) => colorScale(mode, s, RA.toArray(m), e))

const between = Ord.between(number.Ord)

/**
 * Get the color at a specific point on the color scale (number between 0 and
 * 1). If the number is smaller than 0, the color at 0 is returned. If the
 * number is larger than 1, the color at 1 is returned.
 *
 * @since 0.1.0
 */
export const mkSimpleSampler =
  (interpolate: C.Interpolator) =>
  ([start, middle, end]: ColorStops) =>
  (x: number): C.Color => {
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
        RA.matchLeft(constant(c1), (head, rest) => {
          const [c2, right] = head

          if (!between(left, right)(x)) {
            return sample(c2, right, rest)
          }

          if (left === right) {
            return c1
          }

          const p = (x - left) / (right - left)

          return interpolate(c1)(c2)(p)
        })
      )

    const stops = pipe(middle, RA.append(colorStop(end, 1.0)))

    return sample(start, 0, stops)
  }

/**
 * Get the color at a specific point on the color scale by linearly
 * interpolating between its colors (see `mix` and `mkSimpleSampler`).
 *
 * @since 0.1.0
 */
export const sample = ([mode, scale]: ColorScale): ((x: number) => C.Color) =>
  mkSimpleSampler(C.mix(mode))(scale)

/**
 * Takes a sampling function and returns a list of colors that is sampled via
 * that function. The number of colors can be specified.
 *
 * @since 0.1.0
 */
export const colors =
  (f: (x: number) => C.Color) =>
  (n: number): C.Color[] => {
    if (n === 0) {
      return []
    }

    if (n === 1) {
      return [f(0)]
    }

    return A.makeBy(n - 1, (i: number) => f(i / (n - 1)))
  }

/**
 * A list of colors that is sampled from a color scale. The number of colors
 * can be specified.
 *
 * @since 0.1.0
 */
export const sampleColors = (scale: ColorScale): ((n: number) => C.Color[]) =>
  colors(sample(scale))

/**
 * Modify a list of  `ColorStops` by applying the given function to each color
 * stop. The first argument is the position of the color stop.
 *
 * @since 0.1.0
 */
export const modify =
  (f: (i: number, c: C.Color) => C.Color) =>
  ([start, middle, end]: ColorStops): ColorStops =>
    colorStops(
      f(0, start),
      pipe(
        middle,
        RA.map(([c, r]) => colorStop(f(r, c), r)),
        RA.toArray
      ),
      f(1, end)
    )
