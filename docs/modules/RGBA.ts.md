---
title: RGBA.ts
nav_order: 7
parent: Modules
---

## RGBA overview

Added in v0.1.5

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [fromHSLA](#fromhsla)
  - [fromXYZ](#fromxyz)
  - [rgb](#rgb)
  - [rgba](#rgba)
- [destructors](#destructors)
  - [toCSS](#tocss)
- [instances](#instances)
  - [Eq](#eq)
  - [Show](#show)
- [model](#model)
  - [Normalized (interface)](#normalized-interface)
  - [RGBA (interface)](#rgba-interface)
- [utils](#utils)
  - [brightness](#brightness)
  - [chroma](#chroma)
  - [evolve](#evolve)
  - [luminance](#luminance)
  - [maxChroma](#maxchroma)
  - [minChroma](#minchroma)
  - [mix](#mix)

---

# constructors

## fromHSLA

**Signature**

```ts
export declare const fromHSLA: (c: HSLA) => RGBA
```

Added in v0.1.5

## fromXYZ

**Signature**

```ts
export declare const fromXYZ: ({ x, y, z }: XYZ) => RGBA
```

Added in v0.1.5

## rgb

**Signature**

```ts
export declare const rgb: (r: number, g: number, b: number) => RGBA
```

Added in v0.1.5

## rgba

**Signature**

```ts
export declare const rgba: (r: number, g: number, b: number, a: number) => RGBA
```

Added in v0.1.5

# destructors

## toCSS

A CSS representation of the color in the form `rgb(..)` or `rgba(...)`

**Signature**

```ts
export declare const toCSS: (c: RGBA) => string
```

Added in v0.1.5

# instances

## Eq

**Signature**

```ts
export declare const Eq: Equals.Eq<RGBA>
```

Added in v0.1.5

## Show

**Signature**

```ts
export declare const Show: Sh.Show<RGBA>
```

Added in v0.1.5

# model

## Normalized (interface)

A rgb color where the channels are represented by range between `0` to `1`.

TODO: Find a better name for this type as `Normalized` is probably not
technically correct.

**Signature**

```ts
export interface Normalized {
  /**
   * A number between `0` and `1` representing the red channel of the color
   */
  readonly r: UnitInterval

  /**
   * A number between `0` and `1` representing the green channel of the color
   */
  readonly g: UnitInterval

  /**
   * A number between `0` and `1` representing the blue channel of the color
   */
  readonly b: UnitInterval

  /**
   * A number between `0` and `1` representing the opacity or transparency of the color
   * where `0` is fully transparent and `1` is fully opaque.
   */
  readonly a: UnitInterval
}
```

Added in v0.1.5

## RGBA (interface)

Represents a color using the rgb color system

**Signature**

```ts
export interface RGBA {
  /**
   * A number between `0` and `255` representing the red channel of the color
   */
  readonly r: Channel

  /**
   * A number between `0` and `255` representing the green channel of the color
   */
  readonly g: Channel

  /**
   * A number between `0` and `255` representing the blue channel of the color
   */
  readonly b: Channel

  /**
   * A number between `0` and `1` representing the opacity or transparency of the color
   * where `0` is fully transparent and `1` is fully opaque.
   */
  readonly a: number
}
```

Added in v0.1.5

# utils

## brightness

The percieved brightness of the color (A number between 0.0 and 1.0).
See: [https://www.w3.org/TR/AERT#color-contrast](https://www.w3.org/TR/AERT#color-contrast)

**Signature**

```ts
export declare const brightness: (c: Normalized) => number
```

Added in v0.1.5

## chroma

**Signature**

```ts
export declare const chroma: (c: RGBA) => number
```

Added in v0.1.5

## evolve

**Signature**

```ts
export declare const evolve: <
  F extends {
    readonly r: (a: Channel) => number
    readonly g: (a: Channel) => number
    readonly b: (a: Channel) => number
    readonly a: (a: number) => number
  }
>(
  transformations: F
) => (c: RGBA) => RGBA
```

Added in v0.1.5

## luminance

The relative brightness of a color (normalized to 0.0 for darkest black
and 1.0 for lightest white), according to the WCAG definition.

See: [https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef](https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef)

**Signature**

```ts
export declare const luminance: (color: Normalized) => number
```

Added in v0.1.5

## maxChroma

**Signature**

```ts
export declare const maxChroma: (c: RGBA) => number
```

Added in v0.1.5

## minChroma

**Signature**

```ts
export declare const minChroma: (c: RGBA) => number
```

Added in v0.1.5

## mix

**Signature**

```ts
export declare const mix: (ratio: number) => (a: RGBA) => (b: RGBA) => RGBA
```

Added in v0.1.5
