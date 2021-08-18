import * as fc from 'fast-check'
import { pipe } from 'fp-ts/function'
import * as HSLA from '../src/HSLA'
import * as RGBA from '../src/RGBA'
import * as HSVA from '../src/HSVA'

describe('HSLA', () => {
  test('hsl', () => {
    expect(HSLA.hsl(360, 1, 1)).toEqual(HSLA.hsla(360, 1, 1, 1))
  })

  test('fromRGBA', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), fc.integer(), (r, g, b) => {
        const color = RGBA.rgb(r, g, b)

        expect(pipe(color, HSLA.fromRGBA, RGBA.fromHSLA)).toEqual(color)
      })
    )
  })

  test('fromHSVA', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), fc.integer(), (h, s, v) => {
        const color = HSVA.hsv(h, s, v)

        expect(pipe(color, HSLA.fromHSVA, HSVA.fromHSLA)).toEqual(color)
      })
    )
  })
})
