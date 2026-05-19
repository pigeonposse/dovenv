
import { defineConfig } from '@dovenv/core'
import {
	getCurrentDir,
	joinPath,
} from '@dovenv/core/utils'

import pkg            from '../../../../package.json'
import { repoPlugin } from '../src/main'

export default defineConfig( [
	{
		const : {
			pkg,
			workspaceDir : joinPath( getCurrentDir( import.meta.url ), '..', '..', '..', '..' ),
		},
	},
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
