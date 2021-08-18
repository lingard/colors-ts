import * as XYZ from '../src/XYZ'
import * as HSLA from '../src/HSLA'
import { pipe } from 'fp-ts/function'

describe('XYZ', () => {
  test('fromHSLA', () => {
    expect(pipe(HSLA.hsl(0, 0, 0), XYZ.fromHSLA)).toEqual(XYZ.xyz(0, 0, 0))
    expect(pipe(HSLA.hsl(360, 0, 0), XYZ.fromHSLA)).toEqual(XYZ.xyz(0, 0, 0))
    expect(pipe(HSLA.hsl(360, 0.5, 0), XYZ.fromHSLA)).toEqual(XYZ.xyz(0, 0, 0))
    expect(pipe(HSLA.hsl(360, 0.5, 0.5), XYZ.fromHSLA)).toEqual(
      XYZ.xyz(1.0, 15.114791419996397, 6.450681750870427)
    )
  })
})
