import * as RGBA from '../src/RGBA'
import * as Hue from '../src/Hue'

describe('Hue', () => {
  test('blend', () => {
    expect(Hue.clipHue(0)).toEqual(0)
    expect(Hue.clipHue(180)).toEqual(180)
    expect(Hue.clipHue(360)).toEqual(360)
    expect(Hue.clipHue(361)).toEqual(1)
    expect(Hue.clipHue(380)).toEqual(20)
    expect(Hue.clipHue(720)).toEqual(0)
  })

  test('fromRGBA', () => {
    expect(Hue.fromRGBA(RGBA.rgb(255, 255, 255))).toEqual(0)
    expect(Hue.fromRGBA(RGBA.rgb(255, 0, 0))).toEqual(0)
    expect(Hue.fromRGBA(RGBA.rgb(0, 255, 0))).toEqual(120)
    expect(Hue.fromRGBA(RGBA.rgb(0, 0, 255))).toEqual(240)
    expect(Hue.fromRGBA(RGBA.rgb(0, 255, 255))).toEqual(180)
    expect(Hue.fromRGBA(RGBA.rgb(255, 255, 0))).toEqual(60)
  })
})
