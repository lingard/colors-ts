---
title: ColorSpace.ts
nav_order: 2
parent: Modules
---

## ColorSpace overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [ColorSpace (type alias)](#colorspace-type-alias)
  - [HSL (type alias)](#hsl-type-alias)
  - [LCh (type alias)](#lch-type-alias)
  - [Lab (type alias)](#lab-type-alias)
  - [RGB (type alias)](#rgb-type-alias)

---

# utils

## ColorSpace (type alias)

**Signature**

```ts
export type ColorSpace = RGB | HSL | LCh | Lab
```

Added in v0.1.0

## HSL (type alias)

**Signature**

```ts
export type HSL = {
  _tag: 'hsl'
}
```

Added in v0.1.0

## LCh (type alias)

**Signature**

```ts
export type LCh = {
  _tag: 'lch'
}
```

Added in v0.1.0

## Lab (type alias)

**Signature**

```ts
export type Lab = {
  _tag: 'lab'
}
```

Added in v0.1.0

## RGB (type alias)

**Signature**

```ts
export type RGB = {
  _tag: 'rgb'
}
```

Added in v0.1.0
