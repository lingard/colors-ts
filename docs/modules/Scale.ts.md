---
title: Scale.ts
nav_order: 8
parent: Modules
---

## Scale overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [colorScale](#colorscale)
  - [colorStop](#colorstop)
  - [colorStops](#colorstops)
  - [grayscale](#grayscale)
- [destructors](#destructors)
  - [length](#length)
  - [stopColor](#stopcolor)
  - [stopRatio](#stopratio)
  - [stops](#stops)
  - [toReadonlyArray](#toreadonlyarray)
  - [~~toArray~~](#toarray)
- [model](#model)
  - [ColorScale (type alias)](#colorscale-type-alias)
  - [ColorStop (type alias)](#colorstop-type-alias)
  - [ColorStops (type alias)](#colorstops-type-alias)
- [utils](#utils)
  - [addStop](#addstop)
  - [blueToRed](#bluetored)
  - [changeMode](#changemode)
  - [combine](#combine)
  - [combineColorStops](#combinecolorstops)
  - [combineStops](#combinestops)
  - [cool](#cool)
  - [cssColorStops](#csscolorstops)
  - [first](#first)
  - [hot](#hot)
  - [last](#last)
  - [mode](#mode)
  - [modify](#modify)
  - [reverse](#reverse)
  - [sample](#sample)
  - [sampleColors](#samplecolors)
  - [spectrum](#spectrum)
  - [uniformScale](#uniformscale)
  - [yellowToRed](#yellowtored)

---

# constructors

## colorScale

Create a color scale. The color space is used for interpolation between
different stops. The first `Color` defines the left end (color at ratio
0.0), the list of stops defines possible intermediate steps and the second
`Color` argument defines the right end point (color at ratio 1.0).

**Signature**

```ts
export declare const colorScale: (
  space: C.ColorSpace,
  l: C.Color,
  m: ReadonlyArray<readonly [C.Color, number]>,
  r: C.Color
) => ColorScale
```

Added in v0.1.0

## colorStop

Create a color stop from a given `Color` and a number between 0 and 1.
If the number is outside this range, it is clamped.

**Signature**

```ts
export declare const colorStop: (c: C.Color, r: number) => ColorStop
```

Added in v0.1.0

## colorStops

**Signature**

```ts
export declare const colorStops: (l: C.Color, m: ReadonlyArray<readonly [C.Color, number]>, r: C.Color) => ColorStops
```

Added in v0.1.0

## grayscale

A scale of colors from black to white.

**Signature**

```ts
export declare const grayscale: ColorScale
```

Added in v0.1.0

# destructors

## length

returns the amount of color stops in the scale

**Signature**

```ts
export declare const length: (s: ColorScale) => number
```

Added in v0.1.4

## stopColor

Extract the color out of a ColorStop

**Signature**

```ts
export declare const stopColor: (s: ColorStop) => C.Color
```

Added in v0.1.0

## stopRatio

Extract the ratio out of a ColorStop

**Signature**

```ts
export declare const stopRatio: (s: ColorStop) => Ratio
```

Added in v0.1.0

## stops

Extract the color out of a ColorStop

**Signature**

```ts
export declare const stops: (s: ColorScale) => ColorStops
```

Added in v0.1.6

## toReadonlyArray

transform a scale to an ReadonlyArray of ColorStops

**Signature**

```ts
export declare const toReadonlyArray: (s: ColorScale) => ReadonlyArray<ColorStop>
```

Added in v0.1.4

## ~~toArray~~

Use [toReadonlyArray](#toReadonlyArray)

**Signature**

```ts
export declare const toArray: (s: ColorScale) => ColorStop[]
```

Added in v0.1.0

# model

## ColorScale (type alias)

A color scale is represented by a list of `ColorStops` and a `ColorSpace` that is
used for interpolation between the stops.

**Signature**

```ts
export type ColorScale = {
  readonly mode: C.ColorSpace
  readonly stops: ColorStops
}
```

Added in v0.1.0

## ColorStop (type alias)

A point on the color scale.

**Signature**

```ts
export type ColorStop = readonly [C.Color, Ratio]
```

Added in v0.1.0

## ColorStops (type alias)

Represents all `ColorStops` in a color scale. The first `Color` defines the left end
(color at ratio 0.0), the list of stops defines possible intermediate steps
and the second `Color` argument defines the right end point (color at ratio 1.0).

**Signature**

```ts
export type ColorStops = readonly [first: C.Color, middle: ReadonlyArray<ColorStop>, last: C.Color]
```

Added in v0.1.0

# utils

## addStop

Add a stop to a color scale.

**Signature**

```ts
export declare const addStop: (c: C.Color, r: number) => (s: ColorScale) => ColorScale
```

Added in v0.1.0

## blueToRed

A perceptually-uniform, diverging color scale from blue to red, similar to
the ColorBrewer scale 'RdBu'.

**Signature**

```ts
export declare const blueToRed: ColorScale
```

Added in v0.1.0

## changeMode

change the `ColorSpace` mode of the scale

**Signature**

```ts
export declare const changeMode: (space: C.ColorSpace) => (scale: ColorScale) => ColorScale
```

Added in v0.1.4

## combine

Concatenates two color scales. The first argument specifies the transition point as
a number between zero and one. The color right at the transition point is the first
color of the second color scale.

**Signature**

```ts
export declare const combine: (e: number) => (a: ColorScale) => (b: ColorScale) => ColorScale
```

Added in v0.1.4

## combineColorStops

Concatenates two color scales. The first argument specifies the transition point as
a number between zero and one. The color right at the transition point is the first
color of the second color scale.

**Signature**

```ts
export declare const combineColorStops: (x: number) => (a: ColorStops) => (b: ColorStops) => ColorStops
```

**Example**

```ts
import * as S from 'ts-colors/Scale'
import * as X11 from 'ts-colors/X11'

const stops = S.colorStops(X11.yellow, [], X11.blue)

S.combineColorStops(0.4)(stops)
```

Added in v0.1.0

## combineStops

Like `combineColorStops`, but the width of the "transition zone" can be specified as the
first argument.

**Signature**

```ts
export declare const combineStops: (e: number) => (x: number) => (a: ColorStops) => (b: ColorStops) => ColorStops
```

**Example**

```ts
import * as S from 'ts-colors/Scale'
import * as X11 from 'ts-colors/X11'

const stops = S.colorStops(X11.yellow, [], X11.blue)

S.combineStops(0.0005)(0.5)(stops)
```

Added in v0.1.0

## cool

A color scale that represents 'cool' colors.

**Signature**

```ts
export declare const cool: ColorScale
```

Added in v0.1.0

## cssColorStops

A CSS representation of the color scale in the form of a comma-separated
list of color stops. This list can be used in a `linear-gradient` or
a similar construct.

Note that CSS uses the RGB space for color interpolation. Consequently, if
the color scale is in RGB mode, this is just a list of all defined color
stops.

For other color spaces, the color scale is sampled at (at least) 10
different points. This should give a reasonable approximation to the true
gradient in the specified color space.

**Signature**

```ts
export declare const cssColorStops: (s: ColorScale) => string
```

Added in v0.1.0

## first

get the first color of the scale

**Signature**

```ts
export declare const first: (c: ColorScale) => C.Color
```

Added in v0.1.4

## hot

A color scale that represents 'hot' colors.

**Signature**

```ts
export declare const hot: ColorScale
```

Added in v0.1.0

## last

get the last color of the scale

**Signature**

```ts
export declare const last: (c: ColorScale) => C.Color
```

Added in v0.1.4

## mode

get the `ColorSpace` mode of the scale

**Signature**

```ts
export declare const mode: (s: ColorScale) => C.ColorSpace
```

Added in v0.1.4

## modify

Modify the colors of a scale by applying the given function to each
color stop. The first argument is the position of the color stop.

**Signature**

```ts
export declare const modify: (f: (i: number, c: C.Color) => C.Color) => (s: ColorScale) => ColorScale
```

Added in v0.1.4

## reverse

Reverses a color scale

**Signature**

```ts
export declare const reverse: Endomorphism<ColorScale>
```

Added in v0.1.4

## sample

Get the color at a specific point on the color scale by linearly
interpolating between its colors.

**Signature**

```ts
export declare const sample: (s: ColorScale) => (x: number) => C.Color
```

Added in v0.1.0

## sampleColors

A list of colors that is sampled from a color scale. The number of colors
can be specified.

**Signature**

```ts
export declare const sampleColors: (x: number) => (scale: ColorScale) => C.Color[]
```

Added in v0.1.0

## spectrum

A spectrum of fully saturated hues (HSL color space).

**Signature**

```ts
export declare const spectrum: ColorScale
```

Added in v0.1.0

## uniformScale

Create a uniform color scale from a list of colors that will be evenly
spaced on the scale.

**Signature**

```ts
export declare const uniformScale: (mode: C.ColorSpace) => (s: C.Color, m: C.Color[], e: C.Color) => ColorScale
```

Added in v0.1.0

## yellowToRed

A perceptually-uniform, multi-hue color scale from yellow to red, similar
to the ColorBrewer scale YlOrRd.

**Signature**

```ts
export declare const yellowToRed: ColorScale
```

Added in v0.1.0
