import * as fc from 'fast-check'
import * as C from '../src/Color'
import { blend, blendChannel } from '../src/Blending'

describe('Blending', () => {
  test('blend', () => {
    const b = C.rgb(255, 102, 0)
    const f = C.rgb(51, 51, 51)

    expect(blend('multiply')(b)(f)).toEqualColor(C.rgb(51, 20, 0))
    expect(blend('screen')(b)(f)).toEqualColor(C.rgb(255, 133, 51))
    expect(blend('overlay')(b)(f)).toEqualColor(C.rgb(255, 41, 0))
    // @ts-expect-error - valid blend mode required
    expect(() => blend('foo')(b)(f)).toThrowError()
  })

  describe('blendChannel', () => {
    test('overlay', () => {
      fc.assert(
        fc.property(fc.float(0, 1), (b) => {
          blendChannel('overlay')(0.5)(b) === 2.0 * (0.5 * b)
        })
      )
    })
  })
})
