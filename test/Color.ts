import * as O from 'fp-ts/Option'
import * as fc from 'fast-check'
import * as assert from 'assert'
import { pipe } from 'fp-ts/function'
import { sequenceT } from 'fp-ts/Apply'
import * as C from '../src/Color'
import {
  aquamarine,
  blue,
  cyan,
  darkslateblue,
  green,
  hotpink,
  lime,
  magenta,
  pink,
  purple,
  red,
  yellow
} from '../src/X11'

describe('Color', () => {
  test('Eq instance', () => {
    expect(C.hsl(120.0, 0.3, 0.5)).toEqualColor(C.hsl(120.0, 0.3, 0.5))
    expect(C.rgba(1, 2, 3, 0.3)).toEqualColor(C.rgba(1, 2, 3, 0.3))
    expect(C.black).toEqualColor(C.hsl(0, 0, 0))
    expect(C.white).toEqualColor(C.hsl(0, 0, 1))

    expect(C.hsl(120.0, 0.3, 0.5)).toNotEqualColor(C.hsl(122.0, 0.3, 0.5))
    expect(C.hsl(120.0, 0.3, 0.5)).toNotEqualColor(C.hsl(120.0, 0.32, 0.5))
    expect(C.rgba(1, 2, 3, 0.4)).toNotEqualColor(C.rgba(2, 2, 3, 0.4))
    expect(C.rgba(1, 2, 3, 0.4)).toNotEqualColor(C.rgba(1, 1, 3, 0.4))
    expect(C.rgba(1, 2, 3, 0.4)).toNotEqualColor(C.rgba(1, 2, 4, 0.4))
    expect(C.rgba(1, 2, 3, 0.3)).toNotEqualColor(C.rgba(1, 2, 3, 0.30001))
  })

  test('RGB -> HSL conversion', () => {
    expect(C.hsl(0, 0, 1)).toEqualColor(C.rgb(255, 255, 255)) // white
    expect(C.hsl(0, 0, 0.5)).toEqualColor(C.rgb(255 / 2, 255 / 2, 255 / 2)) // gray
    expect(C.hsl(0, 0, 0)).toEqualColor(C.rgb(0, 0, 0)) // black
    expect(C.hsl(0, 1, 0.5)).toEqualColor(C.rgb(255, 0, 0)) // red
    expect(C.hsl(60.0, 1.0, 0.375)).toEqualColor(
      C.rgb(0.75 * 255, 0.75 * 255, 0)
    ) // yellow-green
    expect(C.hsl(120.0, 1.0, 0.25)).toEqualColor(C.rgb(0, 255 / 2, 0)) // green
    expect(C.hsl(240, 1.0, 0.75)).toEqualColor(C.rgb(255 / 2, 255 / 2, 255)) // blue

    expect(C.hsl(49.5, 0.893, 0.497)).toEqualColor(
      C.rgb(0.941 * 255, 0.785 * 255, 0.053 * 255)
    ) // yellow
    expect(C.hsl(162.4, 0.779, 0.447)).toEqualColor(
      C.rgb(0.099 * 255, 0.795 * 255, 0.591 * 255)
    ) // cyan
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
        O.map(([x, y]) => expect(x).toEqualColor(y))
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

  test('rgb / toRGB (HSL -> RGB -> HSL)', () => {
    const hslRoundtrip = (h: number, s: number, l: number) => {
      const c1 = C.hsl(h, s, l)
      const c2 = pipe(C.toRGBA(c1), ({ r, g, b, a }) => C.rgba(r, g, b, a))

      return C.Eq.equals(c1, c2)
    }

    fc.assert(
      fc.property(fc.integer(), fc.integer(), fc.integer(), (h, s, l) =>
        hslRoundtrip(h, s, l)
      )
    )
  })

  test('xyz / toXYZ (XYZ -> HSL -> XYZ)', () => {
    const xyzRoundtrip = (h: number, s: number, l: number) =>
      pipe(C.hsl(h, s, l), (c) =>
        expect(
          pipe(C.toXYZ(c), ({ x, y, z }) => C.xyz(x, y, z))
        ).toAlmostEqualColor(c)
      )

    expect(C.xyz(0.9505, 1.0, 1.089)).toEqualColor(C.white)
    expect(C.xyz(0.4123, 0.2126, 0.01933)).toEqualColor(red)
    expect(C.xyz(0.13123, 0.15372, 0.13174)).toEqualColor(
      C.hsl(109.999, 0.08654, 0.407843)
    )

    fc.assert(fc.property(fc.integer(), (x) => xyzRoundtrip(x, 0.2, 0.8)))
  })

  test('hsv / toHSV (HSV -> HSL -> HSV, HSL -> HSV -> HSL)', () => {
    const hsvRoundtrip = (h: number, s: number, l: number, a: number) => {
      const ai = C.hsla(h, s, l, a)
      const bi = C.hsva(h, s, l, a)
      const ao = pipe(C.toHSVA(ai), ({ h, s, v, a }) => C.hsva(h, s, v, a))
      const bo = pipe(C.toHSVA(bi), ({ h, s, v, a }) => C.hsva(h, s, v, a))

      expect(ai).toAlmostEqualColor(ao)
      expect(bi).toAlmostEqualColor(bo)
    }

    fc.assert(
      fc.property(fc.integer(), fc.integer(), fc.integer(), (h, s, v) =>
        hsvRoundtrip(h, s, v, 1.0)
      )
    )
  })

  test('lab / toLab (Lab -> HSL -> Lab)', () => {
    const hsvRoundtrip = (h: number, s: number, l: number) => {
      const a = C.hsl(h, s, l)
      const b = C.toLab(a)

      expect(C.lab(b.l, b.a, b.b)).toAlmostEqualColor(a)
    }

    expect(C.lab(53.233, 80.109, 67.22)).toEqualColor(red)

    fc.assert(fc.property(fc.integer(), (h) => hsvRoundtrip(h, 0.2, 0.8)))
  })

  test('lch / toLCh (LCh -> HSL -> LCh)', () => {
    const hsvRoundtrip = (h: number, s: number, l: number) => {
      const a = C.hsl(h, s, l)
      const b = C.toLCh(a)

      expect(C.lch(b.l, b.c, b.h)).toAlmostEqualColor(a)
    }

    expect(C.lch(24.829, 60.093, 38.18)).toEqualColor(C.hsl(0.0, 1.0, 0.245))

    fc.assert(fc.property(fc.integer(), (h) => hsvRoundtrip(h, 0.2, 0.8)))
  })

  test('toHexString (HSL -> Hex -> HSL conversion)', () => {
    const hexRoundtrip = (h: number, s: number, l: number) => {
      const a = C.hsl(h, s, l)
      const b = pipe(C.toHexString(a), C.fromHexString)

      pipe(
        b,
        O.map((b) => expect(b).toEqualColor(a))
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

  test('cssStringHSLA', () => {
    expect(C.cssStringHSLA(C.hsla(120.1, 0.33, 0.55, 0.3))).toEqual(
      'hsla(120.1, 33%, 55%, 0.3)'
    )
    expect(C.cssStringHSLA(C.hsla(120.1, 0.332, 0.549, 1.0))).toEqual(
      'hsl(120.1, 33.2%, 54.9%)'
    )
    expect(C.cssStringHSLA(C.hsla(360.0, 0.332, 0.549, 1.0))).toEqual(
      'hsl(360, 33.2%, 54.9%)'
    )
  })

  test('cssStringRGBA', () => {
    expect(C.cssStringRGBA(C.rgb(42, 103, 255))).toEqual('rgb(42, 103, 255)')
    expect(C.cssStringRGBA(C.rgba(42, 103, 255, 0.3))).toEqual(
      'rgba(42, 103, 255, 0.3)'
    )
  })

  test('graytone', () => {
    expect(C.graytone(0.0)).toEqualColor(C.black)
    expect(C.graytone(1.0)).toEqualColor(C.white)
  })

  test('rotateHue', () => {
    expect(C.rotateHue(123)(C.black)).toEqualColor(C.black)
  })

  test('complementary', () => {
    expect(C.complementary(lime)).toEqualColor(magenta)
    expect(C.complementary(red)).toEqualColor(cyan)
    expect(C.complementary(blue)).toEqualColor(yellow)
  })

  test('lighten, darken', () => {
    expect(C.lighten(1.0)(C.black)).toEqualColor(C.white)
    expect(C.darken(1.0)(green)).toEqualColor(C.black)
    expect(C.darken(0.0)(green)).toEqualColor(green)
  })

  test('saturate, desaturate', () => {
    expect(C.desaturate(1.0)(red)).toEqualColor(C.graytone(0.5))
    expect(C.desaturate(1.0)(magenta)).toEqualColor(C.graytone(0.5))
  })

  test('toGray', () => {
    const cs = [cyan, yellow, red, pink, blue, C.white, C.black]

    cs.forEach((c) => {
      expect(Math.round(100 * C.luminance(C.toGray(c)))).toEqual(
        Math.round(100 * C.luminance(c))
      )
    })
  })

  test('mix', () => {
    expect(C.mix('rgb')(red)(blue)(0.5)).toEqualColor(C.fromInt(0x800080))
  })

  test('mixRGB', () => {
    expect(C.mixRGB(red)(blue)(0.5)).toEqualColor(C.fromInt(0x800080))
  })

  test('mixHSL', () => {
    expect(C.mixHSL(red)(blue)(0.5)).toEqualColor(C.fromInt(0xff00ff))
  })

  test('brightness', () => {
    expect(C.brightness(C.white)).toEqual(1.0)
    expect(C.brightness(C.graytone(0.5))).toEqual(0.5)
    expect(C.brightness(C.black)).toEqual(0.0)
  })

  test('luminance', () => {
    expect(C.luminance(C.white)).toEqual(1.0)
    expect(Math.round(1000 * C.luminance(aquamarine))).toEqual(808)
    expect(Math.round(1000 * C.luminance(hotpink))).toEqual(347)
    expect(Math.round(1000 * C.luminance(darkslateblue))).toEqual(66)
    expect(C.brightness(C.black)).toEqual(0.0)
  })

  test('contrast', () => {
    expect(C.contrast(C.black)(C.white)).toEqual(21.0)
    expect(C.contrast(C.white)(C.white)).toEqual(1.0)
    expect(Math.round(1000.0 * C.contrast(pink)(hotpink))).toEqual(1721)
    expect(Math.round(1000.0 * C.contrast(pink)(purple))).toEqual(6124)
  })

  test('textColor', () => {
    expect(C.textColor(C.graytone(0.6))).toEqual(C.black)
    expect(C.textColor(C.graytone(0.4))).toEqual(C.white)
  })

  test('distance', () => {
    expect(C.distance(red)(red)).toEqual(0.0)
    expect(
      pipe(C.distance(C.rgb(50, 100, 200))(C.rgb(200, 10, 0)), Math.round)
    ).toEqual(123)
  })
})

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toEqualColor(actual: C.Color): R
      toNotEqualColor(actual: C.Color): R
      toAlmostEqualColor(atual: C.Color): R
    }
  }
}
