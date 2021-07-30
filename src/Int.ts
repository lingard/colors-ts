/**
 * @since 0.1.0
 */
import * as O from 'fp-ts/Option'

type Int = number

/**
 * The number of unique digits (including zero) used to represent integers in
 * a specific base.
 *
 * @since 0.1.0
 */
export type Radix = number

/**
 * @since 0.1.0
 */
export const binary: Radix = 2

/**
 * @since 0.1.0
 */
export const octal: Radix = 8

/**
 * @since 0.1.0
 */
export const decimal: Radix = 10

/**
 * @since 0.1.0
 */
export const hexadecimal: Radix = 16

/**
 * @since 0.1.0
 */
export const base36: Radix = 36

/**
 * Create a valid radix value
 *
 * @since 0.1.0
 */
export const radix = (n: Int): O.Option<Radix> =>
  n >= 2 && n <= 36 ? O.some(n) : O.none

/**
 * Parse a string to an int with a radix
 *
 * @example
 *
 * import * as Int orsfrom 'ts-colors/Int'
 *
 * const s = ''
 *
 * Int.fromStringAs(Int.hexadecimal)(s)
 *
 * @since 0.1.0
 */
export const fromStringAs: (r: Radix) => (s: string) => O.Option<Radix> = (
  radix
) => {
  let digits

  if (radix < 11) {
    digits = '[0-' + (radix - 1).toString() + ']'
  } else if (radix === 11) {
    digits = '[0-9a]'
  } else {
    digits = '[0-9a-' + String.fromCharCode(86 + radix) + ']'
  }

  const pattern = new RegExp('^[\\+\\-]?' + digits + '+$', 'i')

  return (s: string) => {
    if (pattern.test(s)) {
      const i = parseInt(s, radix)

      return (i | 0) === i ? O.some(i) : O.none
    }

    return O.none
  }
}

/**
 * Parse a string to an int
 *
 * @since 0.1.0
 */
export const fromString = fromStringAs(decimal)

/**
 * @since 0.1.0
 */
export const toStringAs =
  (r: Radix) =>
  (n: number): string =>
    n.toString(r)
