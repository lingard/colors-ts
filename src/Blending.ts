/**
 * @since 0.1.0
 */
import { absurd } from 'fp-ts/function'
import { Color, rgba2 } from './Color'
import { fromHSLA2 } from './Rgba'

/**
 * @category model
 * @since 0.1.0
 */
export type BlendMode = 'multiply' | 'screen' | 'overlay'

/**
 * Blend two RGB channel values (numbers between 0.0 and 1.0).
 *
 * @internal
 * @since 0.1.0
 */
export const blendChannel =
  (mode: BlendMode) =>
  (a: number) =>
  (b: number): number => {
    switch (mode) {
      case 'multiply': {
        return a * b
      }

      case 'screen': {
        return 1.0 - (1.0 - a) * (1.0 - b)
      }

      case 'overlay': {
        if (a < 0.5) {
          return 2.0 * (a * b)
        }

        return 1.0 - 2.0 * (1.0 - a) * (1.0 - b)
      }

      default: {
        return absurd(mode)
      }
    }
  }

/**
 * Blend two colors with a specified blend mode. The first color is the
 * background color, the second one is the foreground color. The resulting
 * alpha value is calculated as arithmetic mean.
 *
 * @since 0.1.0
 */
export const blend =
  (mode: BlendMode) =>
  (a: Color) =>
  (b: Color): Color => {
    const ac = fromHSLA2(a)
    const bc = fromHSLA2(b)
    const bcm = blendChannel(mode)

    return rgba2(
      bcm(ac.r)(bc.r),
      bcm(ac.g)(bc.g),
      bcm(ac.b)(bc.b),
      (ac.a + bc.a) / 2.0
    )
  }

/**
 * @since 0.1.0
 */
export const multiply = blend('multiply')

/**
 * @since 0.1.0
 */
export const screen = blend('screen')

/**
 * @since 0.1.0
 */
export const overlay = blend('overlay')
