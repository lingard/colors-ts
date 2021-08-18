---
title: LCh.ts
nav_order: 6
parent: Modules
---

## LCh overview

CIE LCh, a polar version of [`Lab`](./Lab.ts.html).
Note: See documentation for [`xyz`](./XYZ.ts.html). The same restrictions apply here.

See: [https://en.wikipedia.org/wiki/Lab_color_space](https://en.wikipedia.org/wiki/Lab_color_space)

Added in v0.1.5

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [fromHSLA](#fromhsla)
  - [lch](#lch)
- [model](#model)
  - [LCh (interface)](#lch-interface)
- [utils](#utils)
  - [evolve](#evolve)
  - [mix](#mix)

---

# constructors

## fromHSLA

**Signature**

```ts
export declare const fromHSLA: (c: HSLA) => LCh
```

Added in v0.1.5

## lch

**Signature**

```ts
export declare const lch: (l: number, c: number, h: number) => LCh
```

Added in v0.1.5

# model

## LCh (interface)

**Signature**

```ts
export interface LCh {
  /**
   * The lightness of the color, 0.0 gives absolute black and 100.0 gives the brightest white.
   */
  readonly l: number

  /**
   * Chroma, the colorfulness of the color. It's similar to saturation.
   */
  readonly c: number

  /**
   * A number between `0` and `360` representing the hue of the color in degrees.
   */
  readonly h: Hue
}
```

Added in v0.1.5

# utils

## evolve

**Signature**

```ts
export declare const evolve: <
  F extends { readonly l: (a: number) => number; readonly c: (a: number) => number; readonly h: (a: Hue) => number }
>(
  transformations: F
) => (c: LCh) => LCh
```

Added in v0.1.5

## mix

**Signature**

```ts
export declare const mix: (ratio: number) => (a: LCh) => (b: LCh) => LCh
```

Added in v0.1.5
