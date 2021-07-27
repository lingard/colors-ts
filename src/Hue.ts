/**
 * @since 0.1.0
 */

/**
 * @since 0.1.0
 */
export type Hue = number

/**
 * Assert that the hue angle is in the interval [0, 360].
 *
 * @since 0.1.0
 */
export const clipHue = (hue: Hue): Hue => (hue === 360 ? hue : modPos(hue)(360))

/**
 * Like `%`, but always positive.
 * @since 0.1.0
 */
export const modPos =
  (x: number) =>
  (y: number): number =>
    ((x % y) + y) % y
