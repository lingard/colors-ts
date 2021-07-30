import { pipe } from 'fp-ts/function'
import * as Ord from 'fp-ts/Ord'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'

export const deg2rad = Math.PI / 180.0

export const rad2deg = 180.0 / Math.PI

/**
 * Like `%`, but always positive.
 */
export const modPos =
  (x: number) =>
  (y: number): number =>
    ((x % y) + y) % y

export const dist = ({ from, to }: Path): number => Math.abs(to - from)

export const square = (x: number): number => Math.pow(x, 2.0)

export const between =
  (a: number, b: number) =>
  (n: number): boolean => {
    const min = Math.min(a, b)
    const max = Math.max(a, b)

    return n > min && n < max
  }

/**
 * Linearly interpolate between two values.
 */
export const interpolate =
  (fraction: number) =>
  (a: number) =>
  (b: number): number =>
    a + fraction * (b - a)

export type Path = {
  from: number
  to: number
}

export const ordPath: Ord.Ord<Path> = Ord.fromCompare((a, b) => {
  const da = dist(a)
  const db = dist(b)

  if (da === db) {
    return 0
  }

  return da > db ? 1 : 0
})

/**
 * Linearly interpolate between two angles. Always take the shortest path
 * along the circle.
 */
export const interpolateAngle =
  (fraction: number) =>
  (a: number) =>
  (b: number): number => {
    const paths: RNEA.ReadonlyNonEmptyArray<Path> = [
      { from: a, to: b },
      { from: a, to: b + 360.0 },
      { from: a + 360.0, to: b }
    ]
    const shortest = pipe(paths, RNEA.sort(ordPath), RNEA.head)

    return interpolate(fraction)(shortest.from)(shortest.to)
  }
