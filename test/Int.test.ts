import * as Int from '../src/Int'
import * as O from 'fp-ts/Option'
import * as assert from 'assert'

describe('Int', () => {
  describe('radix', () => {
    test('only returns some for valid values', () => {
      assert.deepStrictEqual(Int.radix(Int.binary), O.some(Int.binary))
      assert.deepStrictEqual(Int.radix(Int.decimal), O.some(Int.decimal))
      assert.deepStrictEqual(
        Int.radix(Int.hexadecimal),
        O.some(Int.hexadecimal)
      )
      assert.deepStrictEqual(Int.radix(Int.octal), O.some(Int.octal))
      assert.deepStrictEqual(Int.radix(Int.base36), O.some(Int.base36))

      assert.deepStrictEqual(Int.radix(123), O.none)
      assert.deepStrictEqual(Int.radix(1), O.none)
      assert.deepStrictEqual(Int.radix(1000), O.none)
    })
  })

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
      assert.deepStrictEqual(Int.fromStringAs(3 as Int.Radix)('10'), O.some(3))
      assert.deepStrictEqual(
        Int.fromStringAs(11 as Int.Radix)('10'),
        O.some(11)
      )
      assert.deepStrictEqual(
        Int.fromStringAs(12 as Int.Radix)('10'),
        O.some(12)
      )
      assert.deepStrictEqual(
        Int.fromStringAs(36 as Int.Radix)('10'),
        O.some(36)
      )
    })

    it('should fail on unknown digits', () => {
      assert.deepStrictEqual(Int.fromStringAs(Int.binary)('12'), O.none)
      assert.deepStrictEqual(Int.fromStringAs(Int.octal)('8'), O.none)
      assert.deepStrictEqual(Int.fromStringAs(Int.hexadecimal)('1g'), O.none)
    })
  })
})
