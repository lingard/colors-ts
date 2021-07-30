WIP

typescript port of [https://github.com/sharkdp/purescript-colors](https://github.com/sharkdp/purescript-colors)

```typescript
import * as C from 'colors-ts/Color'
import * as X11 from 'colors-ts/X11'

const background = X11.aquamarine
const foreground = pipe(
  X11.aquamarine,
  C.textColor,
  C.toHexString
)
```
