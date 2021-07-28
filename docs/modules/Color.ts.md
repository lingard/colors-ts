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
  - [fromHexString](#fromhexstring)
  - [graytone](#graytone)
  - [hsl](#hsl)
  - [hsla](#hsla)
  - [hsv](#hsv)
  - [hsva](#hsva)
  - [lab](#lab)
  - [lch](#lch)
  - [rgb](#rgb)
  - [rgb2](#rgb2)
  - [rgba](#rgba)
  - [rgba2](#rgba2)
  - [white](#white)
  - [xyz](#xyz)
- [deconstructors](#deconstructors)
  - [cssStringHSLA](#cssstringhsla)
  - [cssStringRGBA](#cssstringrgba)
  - [toHSLA](#tohsla)
  - [toHSVA](#tohsva)
  - [toHexString](#tohexstring)
  - [toLCh](#tolch)
  - [toLab](#tolab)
  - [toRGBA](#torgba)
  - [toRGBA2](#torgba2)
  - [toXYZ](#toxyz)
- [instances](#instances)
  - [Eq](#eq)
  - [OrdLuminance](#ordluminance)
  - [Show](#show)
- [model](#model)
  - [Color (type alias)](#color-type-alias)
- [utils](#utils)
  - [complementary](#complementary)
  - [darken](#darken)
  - [desaturate](#desaturate)
  - [lighten](#lighten)
  - [luminance](#luminance)
  - [rotateHue](#rotatehue)
  - [saturate](#saturate)
  - [toGray](#togray)

---

# constructors

## black

Pure black.

**Signature**

```ts
export declare const black: Color
```

Added in v0.1.0

## fromHexString

Parse a hexadecimal RGB code of the form `#rgb` or `#rrggbb`. The `#`
character is required. Each hexadecimal digit is of the form `[0-9a-fA-F]`
(case insensitive). Returns `Option.none` if the string is in a wrong format.

**Signature**

```ts
export declare const fromHexString: (hex: string) => O.Option<Color>
```

Added in v0.1.0

## graytone

Create a gray tone from a lightness values (0.0 is black, 1.0 is white).

**Signature**

```ts
export declare const graytone: (l: number) => Color
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

## lab

Create a `Color` from L, a and b coordinates coordinates in the Lab color
space.
Note: See documentation for `xyz`. The same restrictions apply here.

See: https://en.wikipedia.org/wiki/Lab_color_space

**Signature**

```ts
export declare const lab: (l: number, a: number, b: number) => Color
```

Added in v0.1.0

## lch

Create a `Color` from lightness, chroma and hue coordinates in the CIE LCh
color space. This is a cylindrical transform of the Lab color space.
Note: See documentation for `xyz`. The same restrictions apply here.

See: https://en.wikipedia.org/wiki/Lab_color_space

**Signature**

```ts
export declare const lch: (l: number, c: number, h: number) => Color
```

Added in v0.1.0

## rgb

Create a `Color` from integer RGB values between 0 and 255.

**Signature**

```ts
export declare const rgb: (r: number, g: number, b: number) => Color
```

Added in v0.1.0

## rgb2

Create a `Color` from RGB values between 0.0 and 1.0.

**Signature**

```ts
export declare const rgb2: (r: number, g: number, b: number) => Color
```

Added in v0.1.0

## rgba

**Signature**

```ts
export declare const rgba: (r: number, g: number, b: number, alpha: number) => Color
```

Added in v0.1.0

## rgba2

Create a `Color` from RGB and alpha values between 0.0 and 1.0.

**Signature**

```ts
export declare const rgba2: (r: number, g: number, b: number, a: number) => Color
```

Added in v0.1.0

## white

Pure white.

**Signature**

```ts
export declare const white: Color
```

Added in v0.1.0

## xyz

Create a `Color` from XYZ coordinates in the CIE 1931 color space. Note
that a `Color` always represents a color in the sRGB gamut (colors that
can be represented on a typical computer screen) while the XYZ color space
is bigger. This function will tend to create fully saturated colors at the
edge of the sRGB gamut if the coordinates lie outside the sRGB range.

See:

- https://en.wikipedia.org/wiki/CIE_1931_color_space
- https://en.wikipedia.org/wiki/SRGB

**Signature**

```ts
export declare const xyz: (x: number, y: number, z: number) => Color
```

Added in v0.1.0

# deconstructors

## cssStringHSLA

A CSS representation of the color in the form `hsl(..)` or `hsla(...)`.

**Signature**

```ts
export declare const cssStringHSLA: ([h, s, l, a]: Color) => string
```

Added in v0.1.0

## cssStringRGBA

A CSS representation of the color in the form `rgb(..)` or `rgba(...)`

**Signature**

```ts
export declare const cssStringRGBA: (c: Color) => string
```

Added in v0.1.0

## toHSLA

Convert a `Color` to its Hue, Saturation, Lightness and Alpha values. See
`hsla` for the ranges of each channel.

**Signature**

```ts
export declare const toHSLA: ([h, s, l, a]: Color) => { h: number; s: number; l: number; a: number }
```

Added in v0.1.0

## toHSVA

Convert a `Color` to its Hue, Saturation, Value and Alpha values. See
`hsva` for the ranges of each channel.

**Signature**

```ts
export declare const toHSVA: ([h, s, l, a]: Color) => { h: number; s: number; v: number; a: number }
```

Added in v0.1.0

## toHexString

**Signature**

```ts
export declare const toHexString: (c: Color) => string
```

Added in v0.1.0

## toLCh

Get L, C and h coordinates according to the CIE LCh color space.
See: https://en.wikipedia.org/wiki/Lab_color_space

**Signature**

```ts
export declare const toLCh: (c: Color) => { l: number; c: number; h: number }
```

Added in v0.1.0

## toLab

Get L, a and b coordinates according to the Lab color space.

See: https://en.wikipedia.org/wiki/Lab_color_space

**Signature**

```ts
export declare const toLab: (c: Color) => { l: number; a: number; b: number }
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

## toXYZ

Get XYZ coordinates according to the CIE 1931 color space.

See:

- https://en.wikipedia.org/wiki/CIE_1931_color_space
- https://en.wikipedia.org/wiki/SRGB

**Signature**

```ts
export declare const toXYZ: (c: Color) => { x: number; y: number; z: number }
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

## complementary

Get the complementary color (hue rotated by 180°).

**Signature**

```ts
export declare const complementary: ([h, s, l, a]: Color) => Color
```

Added in v0.1.0

## darken

Darken a color by subtracting a certain amount (number between -1.0 and
1.0) from the lightness channel. If the number is negative, the color is
lightened.

**Signature**

```ts
export declare const darken: (f: number) => Endomorphism<Color>
```

Added in v0.1.0

## desaturate

Decrease the saturation of a color by subtracting a certain amount (number
between -1.0 and 1.0) from the saturation channel. If the number is
negative, the color is saturated.

**Signature**

```ts
export declare const desaturate: (f: number) => Endomorphism<Color>
```

Added in v0.1.0

## lighten

Lighten a color by adding a certain amount (number between -1.0 and 1.0)
to the lightness channel. If the number is negative, the color is
darkened.

**Signature**

```ts
export declare const lighten: (f: number) => ([h, s, l, a]: Color) => Color
```

Added in v0.1.0

## luminance

**Signature**

```ts
export declare const luminance: (color: Color) => number
```

Added in v0.1.0

## rotateHue

Rotate the hue of a `Color` by a certain angle (in degrees).

**Signature**

```ts
export declare const rotateHue: (angle: number) => ([h, s, l, a]: Color) => Color
```

Added in v0.1.0

## saturate

Increase the saturation of a color by adding a certain amount (number
between -1.0 and 1.0) to the saturation channel. If the number is
negative, the color is desaturated.

**Signature**

```ts
export declare const saturate: (f: number) => ([h, s, l, a]: Color) => Color
```

Added in v0.1.0

## toGray

Convert a color to a gray tone with the same perceived luminance (see `luminance`)

**Signature**

```ts
export declare const toGray: Endomorphism<Color>
```

Added in v0.1.0
