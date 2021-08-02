import * as M from '../src/Math'
import * as fc from 'fast-check'

describe('Math', () => {
  test('square', () => {
    fc.assert(fc.property(fc.integer(), (x) => M.square(x) === x * x))
  })

  describe('between', () => {
    test('between', () => {
      fc.assert(
        fc.property(
          fc.integer(0, 249),
          fc.integer(501, 1000),
          fc.integer(250, 500),
          (x, y, z) => M.between(x, y)(z)
        )
      )
    })

    test('never between itself', () => {
      fc.assert(
        fc.property(fc.integer(), (x) => {
          const between = M.between(x, x)(x)

          return between === false
        })
      )
    })
  })
})
