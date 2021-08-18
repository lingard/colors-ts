---
title: Lab.ts
nav_order: 5
parent: Modules
---

## Lab overview

A `Color` represented L, a and b coordinates in the Lab color space.

Note: See documentation for [`xyz`](./XYZ.ts.html). The same restrictions
apply here.

Added in v0.1.5

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [fromHSLA](#fromhsla)
  - [fromLCh](#fromlch)
  - [lab](#lab)
- [model](#model)
  - [Lab (interface)](#lab-interface)
- [utils](#utils)
  - [evolve](#evolve)
  - [mix](#mix)

---

# constructors

## fromHSLA

**Signature**

```ts
export declare const fromHSLA: (c: HSLA) => Lab
```

Added in v0.1.5

## fromLCh

**Signature**

```ts
export declare const fromLCh: ({ l, c, h }: LCh) => Lab
```

Added in v0.1.5

## lab

**Signature**

```ts
export declare const lab: (l: number, a: number, b: number) => Lab
```

Added in v0.1.5

# model

## Lab (interface)

**Signature**

```ts
export interface Lab {
  /**
   * The lightness of the color. 0.0 gives absolute black and 100.0 give the brightest white.
   */
  readonly l: number

  readonly a: number

  readonly b: number
}
```

Added in v0.1.5

# utils

## evolve

**Signature**

```ts
export declare const evolve: <
  F extends { readonly l: (a: number) => number; readonly a: (a: number) => number; readonly b: (a: number) => number }
>(
  transformations: F
) => (c: Lab) => Lab
```

Added in v0.1.5

## mix

**Signature**

```ts
export declare const mix: (ratio: number) => (a: Lab) => (b: Lab) => Lab
```

Added in v0.1.5
