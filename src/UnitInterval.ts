import * as Ord from 'fp-ts/Ord'
import * as number from 'fp-ts/number'

const clampNumber = Ord.clamp(number.Ord)

const clamp = clampNumber(0, 1)

interface UnitIntervalBrand {
  readonly UnitInterval: unique symbol
}

/**
 * A number between `0` and `1`
 *
 * @since 0.1.0
 * @category model
 */
export type UnitInterval = number & UnitIntervalBrand

export const unitInterval = (r: number): UnitInterval =>
  clamp(r) as UnitInterval
