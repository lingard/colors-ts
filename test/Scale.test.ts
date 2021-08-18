import * as fc from 'fast-check'
import * as C from '../src/Color'
import * as S from '../src/Scale'
import { blue, green, hotpink, magenta, red, yellow } from '../src/X11'
import { constant, pipe } from 'fp-ts/function'
import {
  ColorArbitrary,
  ColorScaleArbitrary,
  ColorStopArbitrary
} from './utils'

const scale = S.colorScale('HSL', red, [[blue, 0.3]], yellow)

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
      ({ stops }: S.ColorScale) => {
        const [, m] = stops

        return m.findIndex(([c2, r2]) => c === c2 && r === r2) !== -1
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
            S.colorScale('RGB', l, stops, r),
            S.addStop(c, ratio),
            contains(c, ratio)
          )
      )
    )
  })

  test('first', () => {
    expect(S.first(scale)).toEqualColor(red)
  })

  test('last', () => {
    expect(S.last(scale)).toEqualColor(yellow)
  })

  test('middle', () => {
    expect(S.middle(scale)).toEqual([S.colorStop(blue, 0.3)])
  })

  test('mode', () => {
    expect(S.mode(scale)).toEqual('HSL')
  })

  test('length', () => {
    expect(S.length(scale)).toEqual(3)
  })

  test('changeMode', () => {
    expect(pipe(scale, S.changeMode('RGB'), S.mode)).toEqual('RGB')
  })

  test('toReadonlyArray', () => {
    expect(S.toReadonlyArray(scale)).toEqual([
      S.colorStop(red, 0.0),
      S.colorStop(blue, 0.3),
      S.colorStop(yellow, 1.0)
    ])
  })

  test('toArray', () => {
    expect(S.toArray(scale)).toEqual([
      S.colorStop(red, 0.0),
      S.colorStop(blue, 0.3),
      S.colorStop(yellow, 1.0)
    ])
  })

  test('reverse', () => {
    expect(pipe(S.reverse(scale), S.toReadonlyArray)).toEqual([
      S.colorStop(yellow, 0.0),
      S.colorStop(blue, 0.7),
      S.colorStop(red, 1.0)
    ])
  })

  test('modify', () => {
    expect(pipe(scale, S.modify(constant(C.black)), S.toReadonlyArray)).toEqual(
      [
        S.colorStop(C.black, 0.0),
        S.colorStop(C.black, 0.3),
        S.colorStop(C.black, 1.0)
      ]
    )
  })

  test('simpleSampler', () => {
    const sample = S.simpleSampler(C.mix('RGB'))(
      S.colorStops(red, [[yellow, 0.5]], blue)
    )

    expect(sample(0)).toEqualColor(red)
    expect(sample(0.5)).toEqualColor(yellow)
    expect(sample(1)).toEqualColor(blue)
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
    const uscale = S.uniformScale('HSL')(red, [hotpink, yellow, magenta], blue)

    expect(S.sample(uscale)(0.25)).toEqualColor(hotpink)
    expect(S.sample(uscale)(0.0)).toEqualColor(red)
    expect(S.sample(uscale)(0.5)).toEqualColor(yellow)
    expect(S.sample(uscale)(0.75)).toEqualColor(magenta)
    expect(S.sample(uscale)(1.0)).toEqualColor(blue)
  })

  test('makeColors', () => {
    const make = S.makeColors(S.sample(S.blueToRed))

    expect(make(0).length).toEqual(0)

    fc.assert(fc.property(fc.integer(0, 100), (x) => make(x).length === x))
  })

  test('sampleColors', () => {
    expect(S.sampleColors(0)(scale)).toEqual([])
    expect(S.sampleColors(1)(scale)[0]).toEqualColor(red)
    expect(S.sampleColors(2)(scale)[1]).toEqualColor(yellow)
    expect(S.sampleColors(5)(S.grayscale)[3]).toEqualColor(C.graytone(0.75))
  })

  test('grayscale', () => {
    expect(S.sample(S.grayscale)(0.0)).toEqualColor(C.black)
    expect(S.sample(S.grayscale)(1.0)).toEqualColor(C.white)
  })

  test('combine', () => {
    const a = S.colorScale('RGB', red, [[green, 0.5]], blue)
    const b = S.colorScale('RGB', blue, [[green, 0.5]], red)

    expect(pipe(S.combine(0.5)(a)(b), S.toReadonlyArray)).toEqual([
      [red, 0],
      [green, 0.25],
      [blue, 0.5 - S.epsilon],
      [blue, 0.5],
      [green, 0.75],
      [red, 1.0]
    ])
  })

  test('minColorStops', () => {
    const length = ([, m]: S.ColorStops) => {
      return 2 + m.length
    }
    const min = pipe(S.simpleSampler(C.mixRGB), S.minColorStops)

    fc.assert(
      fc.property(
        ColorScaleArbitrary,
        fc.integer(0, 200),
        (s, x) => pipe(S.stops(s), min(x), length) >= x
      )
    )
  })

  test('cssColorStops', () => {
    expect(S.cssColorStops(S.grayscale)).toEqual(
      `${C.toHSLAString(C.black)}, ${C.toHSLAString(C.white)}`
    )

    expect(S.cssColorStops(S.colorScale('RGB', C.black, [], C.white))).toEqual(
      `${C.toHSLAString(C.black)}, ${C.toHSLAString(C.white)}`
    )

    expect(
      S.cssColorStops(S.colorScale('RGB', red, [[blue, 0.5]], green))
    ).toEqual(
      `${C.toHSLAString(red)}, ${C.toHSLAString(blue)} 50%, ${C.toHSLAString(
        green
      )}`
    )

    expect(
      S.cssColorStops(
        S.colorScale(
          'RGB',
          red,
          [
            [blue, 0.25],
            [green, 0.75]
          ],
          green
        )
      )
    ).toEqual(
      `${C.toHSLAString(red)}, ${C.toHSLAString(blue)} 25%, ${C.toHSLAString(
        green
      )} 75%, ${C.toHSLAString(green)}`
    )

    expect(S.cssColorStops(S.colorScale('HSL', C.black, [], C.white))).toEqual(
      `hsl(0, 0%, 0%), hsl(0, 0%, 10%) 10%, hsl(0, 0%, 20%) 20%, hsl(0, 0%, 30%) 30%, hsl(0, 0%, 40%) 40%, hsl(0, 0%, 50%) 50%, hsl(0, 0%, 60%) 60%, hsl(0, 0%, 70%) 70%, hsl(0, 0%, 80%) 80%, hsl(0, 0%, 90%) 90%, hsl(0, 0%, 100%)`
    )
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
