
import {
	getCurrentDir,
	joinPath,
} from '@dovenv/utils'
import { defineConfig } from 'dovenv'

import pkg        from '../../../../package.json'
import { config } from '../src/main'

export default defineConfig( [
	{ const : {
		pkg,
		workspaceDir : async () => joinPath( getCurrentDir( import.meta.url ), '..', '..', '..', '..' ),
	} },
	config( {
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
