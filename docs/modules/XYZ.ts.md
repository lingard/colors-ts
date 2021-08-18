---
title: XYZ.ts
nav_order: 10
parent: Modules
---

## XYZ overview

A `Color` represented by XYZ coordinates in the CIE 1931 color space. Note
that a `Color` always represents a color in the sRGB gamut (colors that
can be represented on a typical computer screen) while the XYZ color space
is bigger.

See:

- [https://en.wikipedia.org/wiki/CIE_1931_color_space](https://en.wikipedia.org/wiki/CIE_1931_color_space)
- [https://en.wikipedia.org/wiki/SRGB](https://en.wikipedia.org/wiki/SRGB)

Added in v0.1.5

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [fromHSLA](#fromhsla)
  - [fromLab](#fromlab)
  - [xyz](#xyz)
- [model](#model)
  - [XYZ (interface)](#xyz-interface)

---

# constructors

## fromHSLA

**Signature**

```ts
export declare const fromHSLA: (c: HSLA) => XYZ
```

Added in v0.1.5

## fromLab

**Signature**

```ts
export declare const fromLab: ({ l, a, b }: Lab.Lab) => XYZ
```

Added in v0.1.5

## xyz

**Signature**

```ts
export declare const xyz: (x: number, y: number, z: number) => XYZ
```

Added in v0.1.5

# model

## XYZ (interface)

**Signature**

```ts
export interface XYZ {
  /**
   * X is the scale of what can be seen as a response curve for the cone
   * cells in the human eye. Its range depends
   * on the white point and goes from 0.0 to 0.95047 for the default D65.
   */
  readonly x: number

  /**
   * Y is the luminance of the color, where 0.0 is black and 1.0 is white.
   */
  readonly y: number

  /**
   * Z is the scale of what can be seen as the blue stimulation. Its range
   * depends on the white point and goes from 0.0 to 1.08883 for the
   * default D65.
   */
  readonly z: number
}
```

Added in v0.1.5
