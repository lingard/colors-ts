import * as C from '../src/Color'
import * as S from '../src/Scale'
import * as A from 'fp-ts/Array'
import { blue, hotpink, magenta, red, yellow } from '../src/X11'

const scale = S.colorScale('hsl', red, [S.colorStop(blue, 0.3)], yellow)

describe('Scale', () => {
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
})
