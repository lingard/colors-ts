import * as C from '../src/Color'
import { blend } from '../src/Blending'

describe('Blending', () => {
  test('blend', () => {
    const b = C.rgb(255, 102, 0)
    const f = C.rgb(51, 51, 51)

    expect(blend('multiply')(b)(f)).toEqualColor(C.rgb(51, 20, 0))
    expect(blend('screen')(b)(f)).toEqualColor(C.rgb(255, 133, 51))
    expect(blend('overlay')(b)(f)).toEqualColor(C.rgb(255, 41, 0))
  })
})
