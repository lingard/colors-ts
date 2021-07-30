import * as C from '../src/Color'
import * as S from '../src/Scale'
import * as A from 'fp-ts/Array'
import { blue, hotpink, magenta, red, yellow } from '../src/X11'

const scale = S.colorScale('hsl', red, [S.colorStop(blue, 0.3)], yellow)

describe('Scale', () => {
  test('colorScale, sample', () => {
    expect(S.sample(scale)(-10)).toEqualColor(red)
    expect(S.sample(scale)(0)).toEqualColor(red)
    expect(S.sample(scale)(0.0001)).toEqualColor(red)
    expect(S.sample(scale)(0.2999)).toEqualColor(blue)
    expect(S.sample(scale)(0.3)).toEqualColor(blue)
    expect(S.sample(scale)(0.3001)).toEqualColor(blue)
    expect(S.sample(scale)(0.9999)).toEqualColor(yellow)
    expect(S.sample(scale)(1.0)).toEqualColor(yellow)
    expect(S.sample(scale)(10.0)).toEqualColor(yellow)
    expect(S.sample(scale)(0.15)).toEqualColor(C.mixHSL(red)(blue)(0.5))
    expect(S.sample(scale)(0.65)).toEqualColor(C.mixHSL(blue)(yellow)(0.5))
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
    expect(S.sampleColors(scale)(0)).toEqual([])
    expect(S.sampleColors(scale)(1)).toEqual([red])
    expect(S.sampleColors(scale)(2)).toEqual([red, yellow])
    expect(S.sampleColors(S.grayscale)(5)).toEqual([
      C.black,
      C.graytone(0.25),
      C.graytone(0.5),
      C.graytone(0.75),
      C.white
    ])
  })

  test('grayscale', () => {
    expect(S.sample(S.grayscale)(0.0)).toEqualColor(C.black)
    expect(S.sample(S.grayscale)(1.0)).toEqualColor(C.white)
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
