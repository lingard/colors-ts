import { constant } from 'fp-ts/function'
import { pipe } from 'fp-ts/function'
import * as C from './src/Color'

expect.extend({
  toEqualColor: (actual: C.Color, expected: C.Color) => {
    if (!C.Eq.equals(actual, expected)) {
      return {
        pass: false,
        message: () =>
          `expected \`${C.cssStringRGBA(
            expected
          )}\` recieved \`${C.cssStringRGBA(actual)}\``
      }
    }

    return {
      pass: true,
      message: constant('')
    }
  },

  toNotEqualColor: (actual: C.Color, expected: C.Color) => {
    if (C.Eq.equals(actual, expected)) {
      return {
        pass: false,
        message: () =>
          `expected \`${C.cssStringRGBA(
            expected
          )}\` to not equal \`${C.cssStringRGBA(actual)}\``
      }
    }

    return {
      pass: true,
      message: constant('')
    }
  },

  /**
   * Assert that two colors are 'almost' equal (differ in their RGB values by
   * no more than 1 part in 255).
   */
  toAlmostEqualColor: (actual: C.Color, expected: C.Color) => {
    const aE = (n1: number, n2: number) => Math.abs(n1 - n2) <= 1
    const check = (c1: C.Color, c2: C.Color) =>
      pipe(
        {
          c1: C.toRGBA(c1),
          c2: C.toRGBA(c2)
        },
        ({ c1, c2 }) => aE(c1.r, c2.r) && aE(c1.g, c2.g) && aE(c1.b, c2.b)
      )

    if (!check(expected, actual)) {
      return {
        pass: false,
        message: () => `
        expected: ${C.cssStringRGBA(expected)}
        got:      ${C.cssStringRGBA(actual)}
      `
      }
    }

    return {
      pass: true,
      message: constant('')
    }
  }
})
