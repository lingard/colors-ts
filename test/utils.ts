import * as fc from 'fast-check'
import * as C from '../src/Color'
import * as S from '../src/Scale'

export const ColorArbitrary = fc
  .tuple(fc.integer(0, 360), fc.float(0, 1), fc.float(0, 1), fc.float(0, 1))
  .map(([h, s, l, a]) => C.hsla(h, s, l, a))

export const ColorStopArbitrary = fc
  .tuple(ColorArbitrary, fc.float(0.01, 0.99))
  .map(([c, i]) => S.colorStop(c, i))

export const ColorStopsArbitrary = fc
  .tuple(ColorArbitrary, fc.array(ColorStopArbitrary), ColorArbitrary)
  .map(([s, m, e]) => S.colorStops(s, m, e))
