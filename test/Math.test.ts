import * as M from '../src/math'
import * as fc from 'fast-check'

describe('Math', () => {
  test('square', () => {
    fc.assert(fc.property(fc.integer(), (x) => M.square(x) === x * x))
  })
})
