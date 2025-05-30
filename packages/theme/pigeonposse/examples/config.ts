import { defineConfig } from '@dovenv/core'

import {
	getWorkspaceConfig,
	pigeonposseMonorepoTheme,
} from '../src/main'

// TYPE.config = 'configuration'
// // @ts-ignore
// delete TYPE.plugin

export default defineConfig( pigeonposseMonorepoTheme( {
	lint : undefined,
	core : await getWorkspaceConfig( {
		metaURL : import.meta.url,
		path    : '../../../../',
	} ),
	docs : async _c => {

		return { name: 'dovenv' }

	},
	// predocs: async instance => {

	// }
} ) )
