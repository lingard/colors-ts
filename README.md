WIP

typescript port of [https://github.com/sharkdp/purescript-colors](https://github.com/sharkdp/purescript-colors)

```sh
yarn add ts-colors
```

```typescript
import * as C from 'ts-colors/Color'
import * as X11 from 'ts-colors/X11'

const background = X11.aquamarine
const foreground = pipe(
  X11.aquamarine,
  C.textColor,
  C.toHexString
)
```
