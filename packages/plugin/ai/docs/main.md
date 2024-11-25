# Documetantion

## CLI

Usage with:

```bash
dovenv ai
```

### Options

```bash
  -k, --key  Select a Local AI assistant config key
```

## Config

```js
import { defineConfig } from '@dovenv/core'
import { config as plugin } from '@dovenv/ai'

export default defineConfig(
 plugin( { chat : { this : { ... } } } )
)
```

## Examples

`./my-config.js`

```js
import { defineConfig } from '@dovenv/core'
import { config as plugin } from '@dovenv/ai'
export default defineConfig(
 plugin( { chat : { this : {
 input  : [ './src/*' ],
 theme  : 'custom',
 system : 'You are a code expert of this workspace.',
} } } )
)
```
