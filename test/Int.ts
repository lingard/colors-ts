import * as Int from '../src/Int'
import * as O from 'fp-ts/Option'
import * as assert from 'assert'

describe('Int', () => {
  describe('fromString', () => {
    it('should read integers', () => {
      assert.deepStrictEqual(Int.fromString('0'), O.some(0))
      assert.deepStrictEqual(Int.fromString('9467'), O.some(9467))
      assert.deepStrictEqual(Int.fromString('-6'), O.some(-6))
      assert.deepStrictEqual(Int.fromString('+6'), O.some(6))
    })

    it('should fail to read floats', () => {
      assert.deepStrictEqual(Int.fromString('0.1'), O.none)
      assert.deepStrictEqual(Int.fromString('42.000000000000001'), O.none)
    })

    it('should fail to read integers outside of the int32 range', () => {
      assert.deepStrictEqual(Int.fromString('2147483648'), O.none)
      assert.deepStrictEqual(Int.fromString('-2147483649'), O.none)
    })

    it('should fail to read strings with other non-integer values', () => {
      assert.deepStrictEqual(Int.fromString(''), O.none)
      assert.deepStrictEqual(Int.fromString('a'), O.none)
      assert.deepStrictEqual(Int.fromString('5a'), O.none)
      assert.deepStrictEqual(Int.fromString('42,12'), O.none)
    })
  })

  describe('fromStringAs', () => {
    it('should read integers in different bases', () => {
      assert.deepStrictEqual(Int.fromStringAs(Int.binary)('100'), O.some(4))
      assert.deepStrictEqual(
        Int.fromStringAs(Int.hexadecimal)('100'),
        O.some(256)
      )
      assert.deepStrictEqual(
        Int.fromStringAs(Int.hexadecimal)('EF'),
        O.some(239)
      )
      assert.deepStrictEqual(
        Int.fromStringAs(Int.hexadecimal)('+ef'),
        O.some(239)
      )
      assert.deepStrictEqual(
        Int.fromStringAs(Int.hexadecimal)('-ef'),
        O.some(-239)
      )
      assert.deepStrictEqual(
        Int.fromStringAs(Int.hexadecimal)('+7fffffff'),
        O.some(2147483647)
      )
      assert.deepStrictEqual(
        Int.fromStringAs(Int.hexadecimal)('-80000000'),
        O.some(-2147483648)
      )
      assert.deepStrictEqual(Int.fromStringAs(Int.binary)('10'), O.some(2))

      // assert $ fromStringAs (unsafePartial $ fromJust $ radix 3) "10" == Just 3
      // assert $ fromStringAs (unsafePartial $ fromJust $ radix 11) "10" == Just 11
      // assert $ fromStringAs (unsafePartial $ fromJust $ radix 12) "10" == Just 12
      // assert $ fromStringAs (unsafePartial $ fromJust $ radix 36) "10" == Just 36
    })

    it('should fail on unknown digits', () => {
      assert.deepStrictEqual(Int.fromStringAs(Int.binary)('12'), O.none)
      assert.deepStrictEqual(Int.fromStringAs(Int.octal)('8'), O.none)
      assert.deepStrictEqual(Int.fromStringAs(Int.hexadecimal)('1g'), O.none)
    })
  })
})
