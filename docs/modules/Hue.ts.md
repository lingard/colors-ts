---
title: Hue.ts
nav_order: 3
parent: Modules
---

## Hue overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Hue (type alias)](#hue-type-alias)
  - [clipHue](#cliphue)
  - [modPos](#modpos)

---

# utils

## Hue (type alias)

**Signature**

```ts
export type Hue = number
```

Added in v0.1.0

## clipHue

Assert that the hue angle is in the interval [0, 360].

**Signature**

```ts
export declare const clipHue: (hue: Hue) => Hue
```

Added in v0.1.0

## modPos

Like `%`, but always positive.

**Signature**

```ts
export declare const modPos: (x: number) => (y: number) => number
```

Added in v0.1.0
