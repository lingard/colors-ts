---
title: HSVA.ts
nav_order: 4
parent: Modules
---

## HSVA overview

A color represented by the HSV color model

Added in v0.1.5

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [fromHSLA](#fromhsla)
  - [hsv](#hsv)
  - [hsva](#hsva)
- [model](#model)
  - [HSVA (interface)](#hsva-interface)

---

# constructors

## fromHSLA

**Signature**

```ts
export declare const fromHSLA: (c: HSLA) => HSVA
```

Added in v0.1.5

## hsv

**Signature**

```ts
export declare const hsv: (h: number, s: number, v: number) => HSVA
```

Added in v0.1.5

## hsva

**Signature**

```ts
export declare const hsva: (h: number, s: number, v: number, a: number) => HSVA
```

Added in v0.1.5

# model

## HSVA (interface)

**Signature**

```ts
export interface HSVA {
  /**
   * A number between `0` and `360` representing the hue of the color in degrees.
   */
  readonly h: Hue

  /**
   * A number between `0` and `1` representing the percent saturation of the color
   * where `0` is completely denatured (grayscale) and `1` is fully saturated (full color).
   */
  readonly s: number

  /**
   * Value
   */
  readonly v: number

  /**
   * A number between `0` and `1` representing the opacity or transparency of the color
   * where `0` is fully transparent and `1` is fully opaque.
   */
  readonly a: number
}
```

Added in v0.1.5
