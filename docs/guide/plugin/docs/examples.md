# `@dovenv/docs` - Examples

## Simple example

This is a example that use plugin in dovenv config for add a docs builder in dovenv

### Dovenv configuration with the docs plugin.

```ts
import { defineConfig } from '@dovenv/core'
import {
	getCurrentDir,
	joinPath,
	relativePath,
} from '@dovenv/core/utils'

import { docsPlugin } from '../../src/main'

const currDir = joinPath( getCurrentDir( import.meta.url ) )
const pkgDir  = joinPath( currDir, '..', '..' )

export default defineConfig( docsPlugin( {
	input  : relativePath( process.cwd(), joinPath( currDir, 'docs' ) ),
	output : relativePath( process.cwd(), joinPath( pkgDir, 'build', 'simple' ) ),
	name   : 'simple-example',
} ) )

```

### Run dev server

```bash
dovenv docs dev
```

### Build docs page

```bash
dovenv docs build
```

### Preview docs page

```bash
dovenv docs preview --port 1312
```



## Simple example using `dovenv-docs`

This is perfect if you want to use `dovenv-docs` directly without `dovenv`

### Dovenv configuration file

```js

/** @type {import( '../../src/main' ).Config} */
export default {
	input  : '../../../docs',
	output : './build/bin',
}


```

### Run dev server

```bash
dovenv-docs dev
```

### Build docs page

```bash
dovenv-docs build
```

### Preview docs page

```bash
dovenv-docs preview --port 1312
```



## Custom configuration example

This is a example that use more configuration in dovenv config

### Dovenv configuration file

```ts

import { defineConfig } from '@dovenv/core'
import {
	fontAwesomeSolidIcons,
	fa2svg,
} from '@dovenv/utils-media/client'

import coreConfig     from '../../../../../.dovenv/main' // Get another configuration for use
import { docsPlugin } from '../../src/main'

const {
	faBook,
	faCode,
	faDownload,
	faGlobe,
} = fontAwesomeSolidIcons

export default defineConfig(
	coreConfig,
	docsPlugin( {
		input    : '../../../docs',
		output   : './build/ws',
		name     : 'dovenvff',
		// styles : { color : {
		// 	primary   : '#6f42c1',
		// 	secondary : '#f59e0b',
		// } },
		// oldVersions : [
		// 	{
		// 		name : 'v1.0',
		// 		url  : 'https://github.com/pigeonposse/super8/releases/latest',
		// 	},
		// ],
		npmURL   : 'https://www.npmjs.com/package/dovenv',
		navLinks : [
			{
				icon : 'githubactions',
				link : 'https://github.com/pigeonposse/dovenv',
			},
		],
		download : {
			groups : {
				extension : 'Extensions',
				desktop   : 'Apps',
			},
			items : {
				chromiumMv2 : {
					url  : 'https://github.com/pigeonposse/super8/releases/latest/download/super8-chromium-mv2.zip',
					name : 'Chromium (Manifest 2) Extension',
					logo : 'googlechrome',
					type : 'extension',
				},

				macosUniversal : {
					name : 'MacOS App (Universal)',
					logo : 'apple',
					url  : 'https://github.com/pigeonposse/super8/releases/latest/download/Super8_x64.app.tar.gz',
					type : 'desktop',
				},
				macosIntel : {
					name : 'MacOS App (Intel)',
					logo : 'apple',
					url  : 'https://github.com/pigeonposse/super8/releases/latest/download/Super8_x64.app.tar.gz',
					type : 'desktop',
				},
				macosArm : {
					name : 'MacOS App (ARM)',
					logo : 'apple',
					url  : 'https://github.com/pigeonposse/super8/releases/latest/download/Super8_aarch64.app.tar.gz',
					type : 'desktop',
				},
			},
		},
		pwa : { manifest : { icons : [
			{
				src   : 'pwa-64x64.png',
				sizes : '64x64',
				type  : 'image/png',
			},
			{
				src   : 'pwa-192x192.png',
				sizes : '192x192',
				type  : 'image/png',
			},
			{
				src   : 'pwa-512x512.png',
				sizes : '512x512',
				type  : 'image/png',
			},
			{
				src     : 'maskable-icon-512x512.png',
				sizes   : '512x512',
				type    : 'image/png',
				purpose : 'maskable',
			},
		] } },
		links : [
			{
				text  : 'Project',
				desc  : 'See more information about the project',
				// icon  : 'home',
				items : [
					{
						text : 'Website',
						icon : { svg: fa2svg( faGlobe ) as string  },
						desc : 'Enjoy our application!',
						link : 'https://super8.pigeonposse.com',
					},
					{
						text : 'Docs',
						icon : { svg: fa2svg( faBook )  as string },
						desc : 'Read our documentation!',
						link : 'https://docs.super8.pigeonposse.com',
					},
					{
						text : 'Repo',
						icon : { svg: fa2svg(  faCode ) as string },
						desc : 'Star us on GitHub!',
						link : 'https://github.com/pigeonposse/super8',
					},
					{
						text : 'Releases',
						icon : { svg: fa2svg( faDownload )  as string },
						desc : 'Check out our releases!',
						link : 'https://github.com/pigeonposse/super8/releases',
					},
				],
			},
			{
				text  : 'Collective',
				desc  : 'See more information about the collective',
				items : [
					{
						text : 'Twitter',
						icon : 'twitter',
						desc : 'Follow us on Twitter!',
						link : 'https://twitter.com/pigeonposse',
					},
					{
						text : 'GitHub',
						icon : 'github',
						desc : 'Star us on GitHub!',
						link : 'https://github.com/pigeonposse/super8',
					},
					{
						text : 'Medium',
						icon : 'medium',
						desc : 'Read us on Medium!',
						link : 'https://medium.com/@pigeonposse',
					},
				],
			},
		],
		autoSidebar : { contribute: false },
	} ),
)

```

### Use in CLI

```bash
dovenv docs dev
```



