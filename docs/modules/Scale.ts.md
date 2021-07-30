---
title: Scale.ts
nav_order: 4
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
- [deconstructors](#deconstructors)
  - [stopColor](#stopcolor)
  - [stopRatio](#stopratio)
- [model](#model)
  - [ColorScale (type alias)](#colorscale-type-alias)
  - [ColorStop (type alias)](#colorstop-type-alias)
  - [ColorStops (type alias)](#colorstops-type-alias)
  - [Ratio (type alias)](#ratio-type-alias)
- [utils](#utils)
  - [addScaleStop](#addscalestop)
  - [addStop](#addstop)
  - [colors](#colors)
  - [combineColorStops](#combinecolorstops)
  - [combineStops](#combinestops)
  - [mkSimpleSampler](#mksimplesampler)
  - [modify](#modify)
  - [reverseStops](#reversestops)
  - [sample](#sample)
  - [sampleColors](#samplecolors)
  - [uniformScale](#uniformscale)
  - [uniformStops](#uniformstops)

---

# constructors

## colorScale

Create a color scale. The color space is used for interpolation between
different stops. The first `Color` defines the left end (color at ratio
0.0), the list of stops defines possible intermediate steps and the second
`Color` argument defines the right end point (color at ratio 1.0).

**Signature**

```ts
export declare const colorScale: (space: C.ColorSpace, l: C.Color, m: ColorStop[], r: C.Color) => ColorScale
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
export declare const colorStops: (l: C.Color, m: ColorStop[], r: C.Color) => ColorStops
```

Added in v0.1.0

## grayscale

A scale of colors from black to white.

**Signature**

```ts
export declare const grayscale: ColorScale
```

Added in v0.1.0

# deconstructors

## stopColor

Extract the color out of a ColorStop

**Signature**

```ts
export declare const stopColor: ([c]: ColorStop) => C.Color
```

Added in v0.1.0

## stopRatio

Extract the ratio out of a ColorStop

**Signature**

```ts
export declare const stopRatio: ([, r]: ColorStop) => Ratio
```

Added in v0.1.0

# model

## ColorScale (type alias)

A color scale is represented by a list of `ColorStops` and a `ColorSpace` that is
used for interpolation between the stops.

**Signature**

```ts
export type ColorScale = [C.ColorSpace, ColorStops]
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
export type ColorStops = readonly [C.Color, ReadonlyArray<ColorStop>, C.Color]
```

Added in v0.1.0

## Ratio (type alias)

ColorStop ratio

**Signature**

```ts
export type Ratio = number & RatioBrand
```

Added in v0.1.0

# utils

## addScaleStop

Add a stop to a color scale.

**Signature**

```ts
export declare const addScaleStop: ([mode, s]: ColorScale) => (c: C.Color) => (r: number) => ColorScale
```

Added in v0.1.0

## addStop

Add a stop to a list of `ColorStops`.

**Signature**

```ts
export declare const addStop: ([s, m, e]: ColorStops) => (c: C.Color) => (r: number) => ColorStops
```

Added in v0.1.0

## colors

Takes a sampling function and returns a list of colors that is sampled via
that function. The number of colors can be specified.

**Signature**

```ts
export declare const colors: (f: (x: number) => C.Color) => (n: number) => C.Color[]
```

Added in v0.1.0

## combineColorStops

Concatenates two color scales. The first argument specifies the transition point as
a number between zero and one. The color right at the transition point is the first
color of the second color scale.

**Signature**

```ts
export declare const combineColorStops: (
  x: number
) => ([aStart, aMiddle, aEnd]: ColorStops) => ([bStart, bMiddle, bEnd]: ColorStops) => ColorStops
```

**Example**

```ts
import * as S from 'colors-ts/Scale'
import * as X11 from 'colors-ts/Scheme/X11'

const stops = S.colorStops(X11.yellow, [], X11.blue)

S.combineColorStops(0.4)(stops)
```

Added in v0.1.0

## combineStops

Like `combineColorStops`, but the width of the "transition zone" can be specified as the
first argument.

Here, the color at `x` will be orange and color at `x - epsilon` will be blue.
If we want the color at `x` to be blue, `combineStops' epsilon (x + epsilon)` could be used.

**Signature**

```ts
export declare const combineStops: (
  epsilon: number
) => (x: number) => ([aStart, aMiddle, aEnd]: ColorStops) => ([bStart, bMiddle, bEnd]: ColorStops) => ColorStops
```

**Example**

```ts
import * as S from 'colors-ts/Scale'
import * as X11 from 'colors-ts/Scheme/X11'

const stops = S.colorStops(X11.yellow, [], X11.blue)

S.combineStops(0.0005)(0.5)(stops)
```

Added in v0.1.0

## mkSimpleSampler

Get the color at a specific point on the color scale (number between 0 and
1). If the number is smaller than 0, the color at 0 is returned. If the
number is larger than 1, the color at 1 is returned.

**Signature**

```ts
export declare const mkSimpleSampler: (
  interpolate: C.Interpolator
) => ([start, middle, end]: ColorStops) => (x: number) => C.Color
```

Added in v0.1.0

## modify

Modify a list of `ColorStops` by applying the given function to each color
stop. The first argument is the position of the color stop.

**Signature**

```ts
export declare const modify: (f: (i: number, c: C.Color) => C.Color) => ([start, middle, end]: ColorStops) => ColorStops
```

Added in v0.1.0

## reverseStops

Takes `ColorStops` and returns reverses it

**Signature**

```ts
export declare const reverseStops: Endomorphism<ColorStops>
```

Added in v0.1.0

## sample

Get the color at a specific point on the color scale by linearly
interpolating between its colors (see `mix` and `mkSimpleSampler`).

**Signature**

```ts
export declare const sample: ([mode, scale]: ColorScale) => (x: number) => C.Color
```

Added in v0.1.0

## sampleColors

A list of colors that is sampled from a color scale. The number of colors
can be specified.

**Signature**

```ts
export declare const sampleColors: (scale: ColorScale) => (n: number) => C.Color[]
```

Added in v0.1.0

## uniformScale

Create a uniform color scale from a list of colors that will be evenly
spaced on the scale.

**Signature**

```ts
export declare const uniformScale: <
  F extends
    | 'Option'
    | 'ReadonlyRecord'
    | 'Eq'
    | 'Ord'
    | 'ReadonlyNonEmptyArray'
    | 'ReadonlyArray'
    | 'NonEmptyArray'
    | 'Array'
>(
  F: Foldable1<F>
) => (mode: C.ColorSpace) => (s: C.Color, m: Kind<F, C.Color>, e: C.Color) => ColorScale
```

Added in v0.1.0

## uniformStops

Create `ColorStops` from a list of colors such that they will be evenly
spaced on the scale.

**Signature**

```ts
export declare const uniformStops: <
  F extends
    | 'Option'
    | 'ReadonlyRecord'
    | 'Eq'
    | 'Ord'
    | 'ReadonlyNonEmptyArray'
    | 'ReadonlyArray'
    | 'NonEmptyArray'
    | 'Array'
>(
  F: Foldable1<F>
) => (s: C.Color, m: Kind<F, C.Color>, e: C.Color) => ColorStops
```

Added in v0.1.0
