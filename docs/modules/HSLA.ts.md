---
title: HSLA.ts
nav_order: 3
parent: Modules
---

## HSLA overview

Added in v0.1.5

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [fromHSVA](#fromhsva)
  - [fromLCh](#fromlch)
  - [fromLab](#fromlab)
  - [fromRGBA](#fromrgba)
  - [fromXYZ](#fromxyz)
  - [hsl](#hsl)
  - [hsla](#hsla)
- [destructors](#destructors)
  - [toCSS](#tocss)
- [model](#model)
  - [HSLA (interface)](#hsla-interface)
- [utils](#utils)
  - [evolve](#evolve)
  - [mix](#mix)
  - [rotateHue](#rotatehue)

---

# constructors

## fromHSVA

**Signature**

```ts
export declare const fromHSVA: (hsva: HSVA) => HSLA
```

Added in v0.1.5

## fromLCh

**Signature**

```ts
export declare const fromLCh: (a_0: LCh) => HSLA
```

Added in v0.1.5

## fromLab

**Signature**

```ts
export declare const fromLab: (a_0: Lab.Lab) => HSLA
```

Added in v0.1.5

## fromRGBA

**Signature**

```ts
export declare const fromRGBA: (rgba: RGBA.RGBA) => HSLA
```

Added in v0.1.5

## fromXYZ

**Signature**

```ts
export declare const fromXYZ: (a_0: XYZ.XYZ) => HSLA
```

Added in v0.1.5

## hsl

**Signature**

```ts
export declare const hsl: (h: number, s: number, l: number) => HSLA
```

Added in v0.1.5

## hsla

**Signature**

```ts
export declare const hsla: (h: number, s: number, l: number, a: number) => HSLA
```

Added in v0.1.5

# destructors

## toCSS

A CSS representation of the color in the form `hsl(..)` or `hsla(...)`.

**Signature**

```ts
export declare const toCSS: (c: HSLA) => string
```

Added in v0.1.5

# model

## HSLA (interface)

Represents a color using the HSL cylindrical-coordinate system.

**Signature**

```ts
export interface HSLA {
  /**
   * A number between `0` and `360` representing the hue of the color in degrees.
   */
  readonly h: Hue.Hue

  /**
   * A number between `0` and `1` representing the percent saturation of the color
   * where `0` is completely denatured (grayscale) and `1` is fully saturated (full color).
   */
  readonly s: number

  /**
   * A number between `0` and `1` representing the percent lightness of the color
   * where `0` is completely dark (black) and `1` is completely light (white).
   */
  readonly l: number

  /**
   * A number between `0` and `1` representing the opacity or transparency of the color
   * where `0` is fully transparent and `1` is fully opaque.
   */
  readonly a: number
}
```

Added in v0.1.5

# utils

## evolve

**Signature**

```ts
export declare const evolve: <
  F extends {
    readonly h: (a: Hue.Hue) => number
    readonly s: (a: number) => number
    readonly l: (a: number) => number
    readonly a: (a: number) => number
  }
>(
  transformations: F
) => (c: HSLA) => HSLA
```

Added in v0.1.5

## mix

**Signature**

```ts
export declare const mix: (ratio: number) => (a: HSLA) => (b: HSLA) => HSLA
```

Added in v0.1.5

## rotateHue

Rotate the hue by a certain angle (in degrees).

**Signature**

```ts
export declare const rotateHue: (angle: number) => (c: HSLA) => HSLA
```

Added in v0.1.5
