---
title: Blending.ts
nav_order: 1
parent: Modules
---

## Blending overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [model](#model)
  - [BlendMode (type alias)](#blendmode-type-alias)
- [utils](#utils)
  - [blend](#blend)
  - [blendChannel](#blendchannel)
  - [multiply](#multiply)
  - [overlay](#overlay)
  - [screen](#screen)

---

# model

## BlendMode (type alias)

**Signature**

```ts
export type BlendMode = 'multiply' | 'screen' | 'overlay'
```

Added in v0.1.0

# utils

## blend

Blend two colors with a specified blend mode. The first color is the
background color, the second one is the foreground color. The resulting
alpha value is calculated as arithmetic mean.

**Signature**

```ts
export declare const blend: (mode: BlendMode) => (a: Color) => (b: Color) => Color
```

Added in v0.1.0

## blendChannel

Blend two RGB channel values (numbers between 0.0 and 1.0).

**Signature**

```ts
export declare const blendChannel: (mode: BlendMode) => (a: number) => (b: number) => number
```

Added in v0.1.0

## multiply

**Signature**

```ts
export declare const multiply: (a: Color) => (b: Color) => Color
```

Added in v0.1.0

## overlay

**Signature**

```ts
export declare const overlay: (a: Color) => (b: Color) => Color
```

Added in v0.1.0

## screen

**Signature**

```ts
export declare const screen: (a: Color) => (b: Color) => Color
```

Added in v0.1.0
