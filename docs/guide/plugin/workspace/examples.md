# `@dovenv/workspace` - Examples

## Simple example

This is a simple example for create and run workspace commands

### Dovenv configuration file

```ts

import { defineConfig } from '@dovenv/core'
import {
	getCurrentDir,
	getObjectFromJSONFile,
	joinPath,
	arePathsEqual,
} from '@dovenv/core/utils'

import { workspacePlugin } from '../src/main'

import type { PackageJSON } from '@dovenv/core/utils'

const workspaceDir = joinPath( getCurrentDir( import.meta.url ), '../../../../' )
const pkgPath      = joinPath( workspaceDir, 'package.json' )
const pkg          = await getObjectFromJSONFile<PackageJSON>( pkgPath )

export default defineConfig(
	{ const : {
		pkg,
		workspaceDir : workspaceDir,
	} },
	workspacePlugin( {
		// exec : { binarium: { desc: 'Tool to create executables of your Node, Deno or Bun projects' } },
		info : {
			usefulCmds : [
				{
					desc : 'Removes unreferenced packages from the store.',
					cmd  : 'pnpm store prune',
					info : 'https://pnpm.io/cli/store#prune',
				},
				{
					desc : 'Removes unnecessary packages.',
					cmd  : 'pnpm prune',
					info : 'https://pnpm.io/cli/prune',
				},
				{
					desc : 'Deletes metadata cache for the specified package(s).',
					cmd  : 'pnpm cache delete',
					info : 'https://pnpm.io/cli/cache-delete',
				},
				{
					desc : 'Checks for outdated packages.',
					cmd  : 'pnpm -r outdated',
					info : 'https://pnpm.io/cli/outdated',
				},
				{
					desc : 'Checks for known security issues with the installed packages.',
					cmd  : 'pnpm audit',
					info : 'https://pnpm.io/cli/audit',
				},
				{
					desc : 'Find where a package is in node_modules.',
					cmd  : 'find node_modules/.pnpm -name "*dovenv*"',
				},
			],
			instructions : '# Development guide\n\n> No instructions yet.',
			structure    : { dovenv : {
				docs     : { '*.md': null },
				packages : {
					'config' : { '*' : {
						'README.md'    : null,
						'package.json' : null,
					} },
					'theme' : { '*' : {
						'README.md'    : null,
						'package.json' : null,
					} },
					'plugin' : { '*' : {
						'README.md'    : null,
						'package.json' : null,
					} },
					'*' : {
						'README.md'    : null,
						'package.json' : null,
					},
				},
			} },
		},
		check : { pkg : {
			include : ( { path } ) => {

				const shared = [ 'package.json', 'README.md' ]

				if (  path.includes( '/config/' ) ) return shared
				else if ( path === pkgPath )  return [ 'docs/index.md', ...shared ]

				return [
					'src/*{.js,.ts}',
					'examples/**/*{.js,.ts}',
					...shared,
				]

			},
			exclude : ( { dir } ) => {

				if ( arePathsEqual( dir, workspaceDir ) )
					return [ 'src/*' ]

			},
			schema : ( {
				v, content,
			} ) => {

				if ( content.name !== 'dovenv-monorepo' ) return v.object( {
					name    : v.string(),
					version : v.string(),
				} )
				else return v.object( { extra: v.object( {} ) } )

			},
		} },
	},
	),
)

```

### Execute `binarium` package without installing it

```bash
dovenv ws exec binarium
```

### Retrive the workspace information

```bash
dovenv ws info
```

### Audit the workspace dependencies

```bash
dovenv ws audit
```

### Run the workspace check functions

```bash
dovenv check -k ws
```



## Advanced example

This is a example for create and run workspace CUSTOM commands

### Dovenv configuration file

```ts

import { defineConfig } from '@dovenv/core'
import {
	getCurrentDir,
	getObjectFromJSONFile,
	joinPath,
} from '@dovenv/core/utils'

import { workspacePlugin } from '../../src/main'

import type { PackageJSON } from '@dovenv/core/utils'

const workspaceDir = joinPath( getCurrentDir( import.meta.url ), '../../../../' )
const pkgPath      = joinPath( workspaceDir, 'package.json' )
const pkg          = await getObjectFromJSONFile<PackageJSON>( pkgPath )

export default defineConfig(
	{ const : {
		pkg,
		workspaceDir : workspaceDir,
	} },
	workspacePlugin( { custom : {
		// Utils for monorepos
		pkgs : async data => {

			const pkgs = await data.getPkgPaths()
			for ( const pkg of pkgs ) {

				// do something
				console.log( pkg ) // > {path}/package.json

			}

		},
		runtime : async data => {

			const RUNTIME = await data.getRuntime()
			if ( RUNTIME === 'bun' ) throw new Error( 'THIS WORKSPACE IS NOT SUPPORT BUN' )

		},
	} } ),
)

```

### Run ALL workspace custom functions

```bash
dovenv ws custom
```



