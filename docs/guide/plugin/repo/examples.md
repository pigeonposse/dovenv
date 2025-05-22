# `@dovenv/repo` - Examples

## CLI example

Some examples of using the repository plugin

### git push

Execute a complete prompt for push your project to github

```bash
dovenv git push
```

### pkg release

Update version an publish package(s)

```bash
dovenv pkg release
```

### git husky

Init Husky configuration

```bash
dovenv git husky
```

### gh download

Download part or all of the repository from GitHub

```bash
dovenv gh download -i https://github.com/pigeonposse/bepp/tree/main/packages -o build
```



## Contributors example

### Dovenv configuration file

```ts

import { defineConfig } from '@dovenv/core'
import {
	getCurrentDir,
	joinPath,
} from '@dovenv/core/utils'

import pkg            from '../../../../package.json'
import { repoPlugin } from '../src/main'

export default defineConfig( [
	{ const : {
		pkg,
		workspaceDir : joinPath( getCurrentDir( import.meta.url ), '..', '..', '..', '..' ),
	} },
	// lintPlugin( { commitlint: { gitmoji: true } } ),
	repoPlugin( {
		URL          : 'https://github.com/pigeonposse/dovenv',
		contributors : {
			role : {
				author : {
					name  : 'Author',
					emoji : '👑',
				},
				organization : {
					name  : 'Organization',
					emoji : '🏢',
				},
				sponsor : {
					name  : 'Sponsor',
					emoji : '🤝',
				},
			},
			member : [
				{
					role       : 'author',
					ghUsername : 'angelespejo',
					name       : 'Angelespejo',
					avatar     : 'https://github.com/angelespejo.png',
					url        : 'https://github.com/angelespejo',
				},
				{
					role       : 'organization',
					ghUsername : 'pigeonposse',
					name       : 'PigeonPosse',
					avatar     : 'https://github.com/pigeonposse.png',
					url        : 'https://github.com/pigeonposse',
				},
			],
		},
	} ),
] )

```

### Execute wia CLI

```bash
dovenv contributors
```



