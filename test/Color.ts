import * as C from '../src/Color'
import * as O from 'fp-ts/Option'
import * as assert from 'assert'
import { red } from '../src/Scheme/x11'
import { pipe } from 'fp-ts/function'
import { sequenceT } from 'fp-ts/Apply'

const assertEquals = (a: C.Color, b: C.Color) =>
  expect(C.Eq.equals(a, b)).toBe(true)

const assertNotEquals = (a: C.Color, b: C.Color) =>
  expect(C.Eq.equals(a, b)).toBe(false)

describe('Color', () => {
  test('Eq instance', () => {
    assertEquals(C.hsl(120.0, 0.3, 0.5), C.hsl(120.0, 0.3, 0.5))
    assertEquals(C.rgba(1, 2, 3, 0.3), C.rgba(1, 2, 3, 0.3))
    assertEquals(C.black, C.hsl(0, 0, 0))
    assertEquals(C.white, C.hsl(0, 0, 1))

    assertNotEquals(C.hsl(120.0, 0.3, 0.5), C.hsl(122.0, 0.3, 0.5))
    assertNotEquals(C.hsl(120.0, 0.3, 0.5), C.hsl(120.0, 0.32, 0.5))
    assertNotEquals(C.rgba(1, 2, 3, 0.4), C.rgba(2, 2, 3, 0.4))
    assertNotEquals(C.rgba(1, 2, 3, 0.4), C.rgba(1, 1, 3, 0.4))
    assertNotEquals(C.rgba(1, 2, 3, 0.4), C.rgba(1, 2, 4, 0.4))
    assertNotEquals(C.rgba(1, 2, 3, 0.3), C.rgba(1, 2, 3, 0.30001))
  })

  test('RGB -> HSL conversion', () => {
    assert.deepStrictEqual(C.hsl(0, 0, 1), C.rgb(255, 255, 255)) // white
    assert.deepStrictEqual(C.hsl(0, 0, 0.5), C.rgb(255 / 2, 255 / 2, 255 / 2)) // gray
    assert.deepStrictEqual(C.hsl(0, 0, 0), C.rgb(0, 0, 0)) // black
    assert.deepStrictEqual(C.hsl(0, 1, 0.5), C.rgb(255, 0, 0)) // red
    assert.deepStrictEqual(
      C.hsl(60.0, 1.0, 0.375),
      C.rgb(0.75 * 255, 0.75 * 255, 0)
    ) // yellow-green
    assert.deepStrictEqual(C.hsl(120.0, 1.0, 0.25), C.rgb(0, 255 / 2, 0)) // green
    assert.deepStrictEqual(C.hsl(240, 1.0, 0.75), C.rgb(255 / 2, 255 / 2, 255)) // blue

    assertEquals(
      C.hsl(49.5, 0.893, 0.497),
      C.rgb(0.941 * 255, 0.785 * 255, 0.053 * 255)
    ) // yellow
    assertEquals(
      C.hsl(162.4, 0.779, 0.447),
      C.rgb(0.099 * 255, 0.795 * 255, 0.591 * 255)
    ) // cyan
    // assert.deepStrictEqual(
    //   C.hsl(49.5, 0.893, 0.497),
    //   C.rgb(0.941 * 255, 0.785 * 255, 0.053 * 255)
    // ) // yellow
    // assert.deepStrictEqual(
    //   C.hsl(162.4, 0.779, 0.447),
    //   C.rgb(0.099 * 255, 0.795 * 255, 0.591 * 255)
    // ) // cyan
  })

  test('fromHexString', () => {
    assert.deepStrictEqual(C.fromHexString('#000'), O.some(C.black))
    assert.deepStrictEqual(C.fromHexString('#000000'), O.some(C.black))
    assert.deepStrictEqual(C.fromHexString('#fff'), O.some(C.white))
    assert.deepStrictEqual(C.fromHexString('#fffFFF'), O.some(C.white))
    assert.deepStrictEqual(C.fromHexString('#ffffff'), O.some(C.white))
    assert.deepStrictEqual(C.fromHexString('#f00'), O.some(red))
    assert.deepStrictEqual(
      C.fromHexString('#57A6CE'),
      O.some(C.rgb(87, 166, 206))
    )

    assert.deepStrictEqual(C.fromHexString('000'), O.none)
    assert.deepStrictEqual(C.fromHexString('000000'), O.none)
    assert.deepStrictEqual(C.fromHexString('#0'), O.none)
    assert.deepStrictEqual(C.fromHexString('#00'), O.none)
    assert.deepStrictEqual(C.fromHexString('#0000'), O.none)
    assert.deepStrictEqual(C.fromHexString('#00000'), O.none)
    assert.deepStrictEqual(C.fromHexString('#0000000'), O.none)
  })

  test('toHexString (HSL -> Hex -> HSL conversion)', () => {
    const hexRoundtrip = (h: number, s: number, l: number) => {
      const hsl = C.hsl(h, s, l)

      pipe(
        sequenceT(O.Applicative)(
          O.some(hsl),
          pipe(C.toHexString(hsl), C.fromHexString)
        ),
        O.map(([x, y]) => assertEquals(x, y))
      )
    }

    hexRoundtrip(0.0, 0.0, 1.0)
    hexRoundtrip(0.0, 0.0, 0.5)
    hexRoundtrip(0.0, 0.0, 0.0)
    hexRoundtrip(0.0, 1.0, 0.5)
    hexRoundtrip(60.0, 1.0, 0.375)
    hexRoundtrip(120.0, 1.0, 0.25)
    hexRoundtrip(240.0, 1.0, 0.75)
    hexRoundtrip(49.5, 0.893, 0.497)
    hexRoundtrip(162.4, 0.779, 0.447)
  })
})
