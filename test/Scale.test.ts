import * as A from 'fp-ts/Array'
import * as fc from 'fast-check'
import * as C from '../src/Color'
import * as S from '../src/Scale'
import { blue, hotpink, magenta, red, yellow } from '../src/X11'
import { pipe } from 'fp-ts/function'
import {
  ColorArbitrary,
  ColorStopArbitrary,
  ColorStopsArbitrary
} from './utils'

const scale = S.colorScale('hsl', red, [S.colorStop(blue, 0.3)], yellow)

describe('Scale', () => {
  test('stopColor', () => {
    const stop = S.colorStop(C.white, 0)

    expect(S.stopColor(stop)).toEqual(C.white)
  })

  test('stopRatio', () => {
    const stop = S.colorStop(C.white, 0)

    expect(S.stopRatio(stop)).toEqual(0)
  })

  test('addStop', () => {
    const contains =
      (c: C.Color, r: number) =>
      ([, m]: S.ColorStops) => {
        console.log('m', m)
        return m.findIndex(([c2, r2]) => c === c2 && r === r2) === 1
      }

    // TODO: Check that the stop is inserted at the correct position
    fc.assert(
      fc.property(
        ColorStopsArbitrary,
        ColorArbitrary,
        fc.float(0.01, 0.99),
        (stops, c, r) => pipe(stops, S.addStop(c, r), contains(c, r))
      )
    )
  })

  test('addScaleStop', () => {
    const contains =
      (c: C.Color, r: number) =>
      ([, stops]: S.ColorScale) => {
        const [, m] = stops

        return m.findIndex(([c2, r2]) => c === c2 && r === r2) === 1
      }

    // TODO: Check that the stop is inserted at the correct position
    fc.assert(
      fc.property(
        ColorArbitrary,
        fc.array(ColorStopArbitrary),
        ColorArbitrary,
        ColorArbitrary,
        fc.float(0.01, 0.99),
        (l, stops, r, c, ratio) =>
          pipe(
            S.colorScale('rgb', l, stops, r),
            S.addScaleStop(c, ratio),
            contains(c, ratio)
          )
      )
    )
  })

  test('colorScale, sample', () => {
    const sample = S.sample(scale)

    expect(sample(-10)).toEqualColor(red)
    expect(sample(0)).toEqualColor(red)
    expect(sample(0.0001)).toEqualColor(red)
    expect(sample(0.2999)).toEqualColor(blue)
    expect(sample(0.3)).toEqualColor(blue)
    expect(sample(0.3001)).toEqualColor(blue)
    expect(sample(0.9999)).toEqualColor(yellow)
    expect(sample(1.0)).toEqualColor(yellow)
    expect(sample(10.0)).toEqualColor(yellow)
    expect(sample(0.15)).toEqualColor(C.mixHSL(red)(blue)(0.5))
    expect(sample(0.65)).toEqualColor(C.mixHSL(blue)(yellow)(0.5))
  })

  test('uniformScale', () => {
    const uscale = S.uniformScale(A.Foldable)('hsl')(
      red,
      [hotpink, yellow, magenta],
      blue
    )

    expect(S.sample(uscale)(0.25)).toEqualColor(hotpink)
    expect(S.sample(uscale)(0.0)).toEqualColor(red)
    expect(S.sample(uscale)(0.5)).toEqualColor(yellow)
    expect(S.sample(uscale)(0.75)).toEqualColor(magenta)
    expect(S.sample(uscale)(1.0)).toEqualColor(blue)
  })

  test('colors', () => {
    expect(S.sampleColors(0)(scale)).toEqual([])
    expect(S.sampleColors(1)(scale)[0]).toEqualColor(red)
    expect(S.sampleColors(2)(scale)[1]).toEqualColor(yellow)
    expect(S.sampleColors(5)(S.grayscale)[3]).toEqualColor(C.graytone(0.75))
  })

  test('grayscale', () => {
    expect(S.sample(S.grayscale)(0.0)).toEqualColor(C.black)
    expect(S.sample(S.grayscale)(1.0)).toEqualColor(C.white)
  })

  test('minColorStops', () => {
    const length = ([, m]: S.ColorStops) => {
      console.log('m', m)
      return 2 + m.length
    }
    const sample = pipe(S.mkSimpleSampler(C.mixRGB), S.minColorStops)

    fc.assert(
      fc.property(
        fc.integer(),
        (x) => pipe(S.grayscale, ([, stops]) => stops, sample(x), length) >= x
      )
    )
  })

  describe('cssColorStops', () => {
    expect(S.cssColorStops(S.grayscale)).toEqual(
      `${C.cssStringHSLA(C.black)}, ${C.cssStringHSLA(C.white)}`
    )
  })
})
