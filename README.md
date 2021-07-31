WIP

typescript port of [https://github.com/sharkdp/purescript-colors](https://github.com/sharkdp/purescript-colors)

```sh
yarn add ts-colors
```

```typescript
import * as A from 'ts-colors/fp-ts'
import * as C from 'ts-colors/Color'
import * as X11 from 'ts-colors/X11'

const background = X11.aquamarine
const foreground = pipe(
  X11.aquamarine,
  C.textColor,
  C.toHexString
)
```

```typescript
import * as C from 'ts-colors/Color'
import * as S from 'ts-colors/Scale'
import * as X11 from 'ts-colors/X11'

C.toHexString(C.hsl(200.0, 0.4, 0.5))
// => "#4d91b3"

pipe(
  X11.seagreen,
  C.lighten(0.2),
  C.saturate(0.3),
  C.cssStringHSLA
)
// => "hsl(146.45, 80.27%, 56.27%)"

pipe(
  S.colorScale('hsl', X11.hotpink, [], S.darksalmon),
  S.sampleColors(5),
  A.map(C.toHexString),
)
// => (5) ["#ff69b4", "#fa6d99", "#f47182", "#ef7d76", "#e9967a"]

pipe(
  [C.black, C.white, X11.blue, X11.lightgreen],
  A.sortBy([C.OrdLuminance]),
  A.map(C.toHexString)
)
// => (4) ["#000000", "#0000ff", "#90ee90", "#ffffff"]
```
