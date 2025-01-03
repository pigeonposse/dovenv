import { defineConfig } from '@dovenv/core'

import {
	getWorkspaceConfig,
	pigeonposseTheme,
} from '../src/main'

export default defineConfig( pigeonposseTheme( {
	lint : undefined,
	core : await getWorkspaceConfig( {
		metaURL : import.meta.url,
		path    : '../../../../',
	} ),
} ) )
