/**
 * @since 0.1.0
 * @internal
 */

/**
 * @internal
 */
export const deg2rad = Math.PI / 180.0

/**
 * @internal
 */
export const rad2deg = 180.0 / Math.PI

/**
 * Like `%`, but always positive.
 * @internal
 */
export const modPos =
  (x: number) =>
  (y: number): number =>
    ((x % y) + y) % y
