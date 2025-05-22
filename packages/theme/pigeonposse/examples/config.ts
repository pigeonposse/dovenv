import { defineConfig } from '@dovenv/core'

import {
	getWorkspaceConfig,
	pigeonposseMonorepoTheme,
} from '../src/main'

export default defineConfig( pigeonposseMonorepoTheme( {
	lint : undefined,
	core : await getWorkspaceConfig( {
		metaURL : import.meta.url,
		path    : '../../../../',
	} ),
	docs : async _c => {

		return { name: 'dovenv' }

	},
} ) )
