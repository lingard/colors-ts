---
title: Int.ts
nav_order: 4
parent: Modules
---

## Int overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Radix (type alias)](#radix-type-alias)
  - [base36](#base36)
  - [binary](#binary)
  - [decimal](#decimal)
  - [fromString](#fromstring)
  - [fromStringAs](#fromstringas)
  - [hexadecimal](#hexadecimal)
  - [octal](#octal)
  - [radix](#radix)
  - [toStringAs](#tostringas)

---

# utils

## Radix (type alias)

The number of unique digits (including zero) used to represent integers in
a specific base.

**Signature**

```ts
export type Radix = number
```

Added in v0.1.0

## base36

**Signature**

```ts
export declare const base36: number
```

Added in v0.1.0

## binary

**Signature**

```ts
export declare const binary: number
```

Added in v0.1.0

## decimal

**Signature**

```ts
export declare const decimal: number
```

Added in v0.1.0

## fromString

Parse a string to an int

**Signature**

```ts
export declare const fromString: (s: string) => O.Option<number>
```

Added in v0.1.0

## fromStringAs

Parse a string to an int with a radix

**Signature**

```ts
export declare const fromStringAs: (r: Radix) => (s: string) => O.Option<Radix>
```

**Example**

```ts
import * as Int from 'fp-ts-colors/Int'

const s = ''

Int.fromStringAs(Int.hexadecimal)(s)
```

Added in v0.1.0

## hexadecimal

**Signature**

```ts
export declare const hexadecimal: number
```

Added in v0.1.0

## octal

**Signature**

```ts
export declare const octal: number
```

Added in v0.1.0

## radix

Create a valid radix value

**Signature**

```ts
export declare const radix: (n: Int) => O.Option<Radix>
```

Added in v0.1.0

## toStringAs

**Signature**

```ts
export declare const toStringAs: (r: Radix) => (n: number) => string
```

Added in v0.1.0
