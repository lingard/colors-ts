import * as fc from 'fast-check'
import { Ord } from 'fp-ts/number'
import { between } from 'fp-ts/Ord'
import { unitInterval } from '../src/UnitInterval'

describe('UnitInterval', () => {
  test('unitInterval', () => {
    fc.assert(
      fc.property(fc.float(-5, 10), (x) => {
        const r = unitInterval(x)

        if (x >= 0 && x <= 1) {
          return r === x
        }

        return between(Ord)(0, 1)(r)
      })
    )
  })
})
