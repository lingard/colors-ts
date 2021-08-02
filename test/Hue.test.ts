import { clipHue } from '../src/Hue'

describe('Blending', () => {
  test('blend', () => {
    expect(clipHue(0)).toEqual(0)
    expect(clipHue(180)).toEqual(180)
    expect(clipHue(360)).toEqual(360)
    expect(clipHue(361)).toEqual(1)
    expect(clipHue(380)).toEqual(20)
    expect(clipHue(720)).toEqual(0)
  })
})
