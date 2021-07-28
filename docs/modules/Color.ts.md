---
title: Color.ts
nav_order: 1
parent: Modules
---

## Color overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [black](#black)
  - [hsl](#hsl)
  - [hsla](#hsla)
  - [rgb](#rgb)
  - [rgba](#rgba)
  - [white](#white)
- [deconstructors](#deconstructors)
  - [fromHexString](#fromhexstring)
  - [hsv](#hsv)
  - [hsva](#hsva)
  - [toHexString](#tohexstring)
  - [toRGBA](#torgba)
  - [toRGBA2](#torgba2)
- [instances](#instances)
  - [Eq](#eq)
  - [OrdLuminance](#ordluminance)
  - [Show](#show)
- [model](#model)
  - [Color (type alias)](#color-type-alias)
- [utils](#utils)
  - [luminance](#luminance)

---

# constructors

## black

Pure black.

**Signature**

```ts
export declare const black: Color
```

Added in v0.1.0

## hsl

Create a `Color` from Hue, Saturation, Lightness and Alpha values. The
Hue is given in degrees, as a `Number` between 0.0 and 360.0. Saturation,
Lightness and Alpha are numbers between 0.0 and 1.0.

**Signature**

```ts
export declare const hsl: (h: number, s: number, l: number) => Color
```

Added in v0.1.0

## hsla

Create a `Color` from Hue, Saturation, Lightness and Alpha values. The
Hue is given in degrees, as a `Number` between 0.0 and 360.0. Saturation,
Lightness and Alpha are numbers between 0.0 and 1.0.

**Signature**

```ts
export declare const hsla: (h: number, s: number, l: number, a: number) => Color
```

Added in v0.1.0

## rgb

**Signature**

```ts
export declare const rgb: (r: number, g: number, b: number) => Color
```

Added in v0.1.0

## rgba

**Signature**

```ts
export declare const rgba: (r: number, g: number, b: number, alpha: number) => Color
```

Added in v0.1.0

## white

Pure white.

**Signature**

```ts
export declare const white: Color
```

Added in v0.1.0

# deconstructors

## fromHexString

Parse a hexadecimal RGB code of the form `#rgb` or `#rrggbb`. The `#`
character is required. Each hexadecimal digit is of the form `[0-9a-fA-F]`
(case insensitive). Returns `Nothing` if the string is in a wrong format.

**Signature**

```ts
export declare const fromHexString: (hex: string) => O.Option<Color>
```

Added in v0.1.0

## hsv

Create a `Color` from Hue, Saturation and Value values. The Hue is
given in degrees, as a `Number` between 0.0 and 360.0. Both Saturation and
Value are numbers between 0.0 and 1.0.

**Signature**

```ts
export declare const hsv: (h: number, s: number, v: number) => Color
```

Added in v0.1.0

## hsva

Create a `Color` from Hue, Saturation, Value and Alpha values. The
Hue is given in degrees, as a `Number` between 0.0 and 360.0. Saturation,
Value and Alpha are numbers between 0.0 and 1.0.

**Signature**

```ts
export declare const hsva: (h: number, s: number, v: number, a: number) => Color
```

Added in v0.1.0

## toHexString

**Signature**

```ts
export declare const toHexString: (c: Color) => string
```

Added in v0.1.0

## toRGBA

Convert a `Color` to its red, green, blue and alpha values. All values
are numbers in the range from 0.0 to 1.0.

**Signature**

```ts
export declare const toRGBA: (c: Color) => { r: number; g: number; b: number; a: number }
```

Added in v0.1.0

## toRGBA2

Convert a `Color` to its red, green, blue and alpha values. The RGB values
are integers in the range from 0 to 255. The alpha channel is a number
between 0.0 and 1.0.

**Signature**

```ts
export declare const toRGBA2: (c: Color) => { r: number; g: number; b: number; a: number }
```

Added in v0.1.0

# instances

## Eq

**Signature**

```ts
export declare const Eq: Equals.Eq<Color>
```

Added in v0.1.0

- The `Eq` instance compares two `Color`s by comparing their (integer) RGB
  values. This is different from comparing the HSL values (for example,
  HSL has many different representations of black (arbitrary hue and
  saturation values).
- Colors outside the sRGB gamut which cannot be displayed on a typical
  computer screen can not be represented by `Color`.

## OrdLuminance

**Signature**

```ts
export declare const OrdLuminance: Ord.Ord<Color>
```

Added in v0.1.0

## Show

**Signature**

```ts
export declare const Show: S.Show<Color>
```

Added in v0.1.0

# model

## Color (type alias)

**Signature**

```ts
export type Color = readonly [Hue, number, number, number]
```

Added in v0.1.0

# utils

## luminance

**Signature**

```ts
export declare const luminance: (color: Color) => number
```

Added in v0.1.0
