import { defineConfig }     from '@dovenv/core'
import { joinUrl }          from '@dovenv/core/utils'
import { pigeonposseTheme } from '@dovenv/theme-pigeonposse'

import CONSTS            from './const'
import { sidebar }       from './sidebar'
import { preDocsConfig } from './templates'
import {
	pkgBadges,
	socialBadges,
} from './utils'

const {
	corePkg,
	REPO_CORE_URL,
	pkg,
} = CONSTS

export default defineConfig(
	{ const : {
		...CONSTS as Record<string, unknown>,
		pkgBadges : pkgBadges( {
			pkgName  : pkg.extra.id,
			repoName : pkg.extra.collective.id + '/' + pkg.extra.repoId,
		}  ),
		socialBadges : socialBadges( {
			...pkg.extra.collective.social,
			web    : pkg.extra.collective.web,
			about  : pkg.extra.collective.about,
			donate : pkg.extra.collective.funding,
		} ) || '',
	} },
	preDocsConfig,
	pigeonposseTheme( { docs : {
		input        : '../../docs',
		output       : './build',
		version      : corePkg.version,
		changelogURL : joinUrl( REPO_CORE_URL, 'CHANGELOG.md' ),
		npmURL       : pkg.extra.libraryUrl,
		vitepress    : {
			ignoreDeadLinks : true,
			themeConfig     : { outline: { level: [ 2, 3 ] } },
			vite            : { build: { chunkSizeWarningLimit: 1000 } },
		},
		sidebar : {
			'/guide/'       : sidebar,
			'/todo/'        : sidebar,
			'/contributors' : sidebar,
		},
		autoSidebar : {
			intro     : false,
			reference : false,
		},
	} } ),
)
