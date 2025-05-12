# `@dovenv/todo` - Examples

## Simple example

### Dovenv configuration file

```ts
import { defineConfig } from '@dovenv/core'
import {
	getCurrentDir,
	joinPath,
} from '@dovenv/core/utils'

import { todoPlugin } from '../src/main'

const pluginDir = joinPath( getCurrentDir( import.meta.url ), '..' )
const wsDir     = joinPath( pluginDir, '..', '..', '..' )

// const buildDir  = joinPath( pluginDir, 'build' )
export default defineConfig( todoPlugin( {
	all : {
		input     : [ joinPath( wsDir, '**/*.{ts,tsx,js,jsx,md}' ) ],
		// output    : joinPath( buildDir, 'TODO.md' ),
		inputOpts : { cwd: wsDir },
	},
	docs : {
		input      : [ joinPath( wsDir, 'docs/**/*.md' ) ],
		// output    : joinPath( buildDir, 'TODO.md' ),
		customTags : [ '\\- \\[ \\] \\s*' ],
		inputOpts  : { cwd: wsDir },
	},
} ) )

```

### Execute wia CLI

```bash
dovenv todo
```

### Execute wia CLI (only docs key)

```bash
dovenv todo -k docs
```



