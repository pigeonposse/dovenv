# `@dovenv/lint` - Examples

## Eslint example

### Check

```bash
dovenv lint eslint
```

### Fix

```bash
dovenv lint eslint --fix
```



## Complete example

This is a example that contains a lot of lint configuration

### Dovenv configuration file

```ts
import { defineConfig } from '@dovenv/core'

import { lintPlugin } from '../src/main'

export default defineConfig( lintPlugin( {
	commitlint : { gitmoji: true },
	stylelint  : {
		configFile : 'stylelint.config.js',
		files      : '**/*.css',
	},
	staged  : { '**/*.{js,ts,jsx,tsx}': 'eslint' },
	publint : {
		this     : {},
		examples : { pkgDir: '../examples' },
	},
	custom : {
		test : async ( { run } ) => {

			await run.staged( { '**/*.{js,ts,jsx,tsx}': 'eslint' } )

		},
		test2 : async ( { run } ) => {

			await run.eslint( { flags: [ '--fix' ] } )

		},
	},
} ) )

```

### Use in CLI

```bash
dovenv lint [cmd]
```



