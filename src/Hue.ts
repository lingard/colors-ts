/**
 * @since 0.1.0
 */

import { modPos } from './Math'

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
