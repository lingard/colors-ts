import { pipe } from 'fp-ts/function'
import * as fc from 'fast-check'
import * as RGBA from '../src/RGBA'
import { unitInterval } from '../src/UnitInterval'

export const RgbaArbitrary = fc
  .tuple(fc.integer(0, 360), fc.float(0, 1), fc.float(0, 1), fc.float(0, 1))
  .map(([h, s, l, a]) => RGBA.rgba(h, s, l, a))

describe('Rgba', () => {
  test('normalization', () => {
    const roundtrip = (a: RGBA.RGBA, c: fc.ContextValue) => {
      const b = pipe(RGBA.normalize(a), RGBA.fromNormalized)

      c.log(`a: ${RGBA.Show.show(a)}`)
      c.log(`b: ${RGBA.Show.show(b)}`)

      return RGBA.Eq.equals(a, b)
    }

    fc.assert(
      fc.property(
        fc.float(0, 300),
        fc.float(0, 300),
        fc.float(0, 300),
        fc.context(),
        (r, g, b, c) => roundtrip(RGBA.rgb(r, g, b), c)
      ),
      {
        verbose: true
      }
    )

    fc.assert(
      fc.property(RgbaArbitrary, (c) =>
        expect(RGBA.normalize(c)).toEqual({
          r: c.r / 255,
          g: c.g / 255,
          b: c.b / 255,
          a: c.a
        })
      )
    )

    fc.assert(
      fc.property(
        fc.float(0, 255),
        fc.float(0, 255),
        fc.float(0, 255),
        (r, g, b) =>
          expect(RGBA.normalized(r / 255, g / 255, b / 255, 1)).toEqual({
            r: unitInterval(r / 255),
            g: unitInterval(g / 255),
            b: unitInterval(b / 255),
            a: 1
          })
      )
    )
  })
})
