
import { defineConfig } from '@dovenv/core'
import {
	getCurrentDir,
	joinPath,
} from '@dovenv/core/utils'
import { config as lintConfig } from '@dovenv/lint'

import pkg        from '../../../../package.json'
import { config } from '../src/main'

export default defineConfig( [

	{ const : {
		pkg,
		workspaceDir : async () => joinPath( getCurrentDir( import.meta.url ), '..', '..', '..', '..' ),
	} },
	lintConfig( { commitlint: { gitmoji: true } } ),
	config( {
		commit       : { lint: true },
		repoURL      : 'https://github.com/pigeonposse/dovenv',
		contributors : {
			role : {
				author : {
					name  : 'Author',
					emoji : '👨‍💻',
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
					ghUsername : 'dovenv',
					name       : 'Dovenv',
					avatar     : 'https://github.com/dovenv.png',
					url        : 'https://github.com/dovenv',
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
