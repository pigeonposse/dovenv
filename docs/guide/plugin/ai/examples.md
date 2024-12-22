# `@dovenv/ai` - Examples

## Simple example

This is a simple example for create a AI chat that use your source code for awnser

### Dovenv configuration file

```ts
import { Dovenv }      from '@dovenv/core'
import { resolvePath } from '@dovenv/core/utils'

import aiPlugin from '../src/main'

const config = aiPlugin( { chat : { this : {
	input  : [ resolvePath( './src/*' ) ],
	theme  : 'custom',
	system : 'You are a code expert of this code.',
} } } )

// Run dovenv with js
const dovenv = new Dovenv( { config } )
await dovenv.run( process.argv.slice( 2 ) )

```

### Use in CLI

```bash
dovenv -c config.ts ai -k this
```



