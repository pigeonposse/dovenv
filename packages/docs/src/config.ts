import { defineConfig }      from '@dovenv/core'
import { joinUrl }           from '@dovenv/core/utils'
import {
	getSidebar,
	pigeonposseMonorepoTheme,
} from '@dovenv/theme-pigeonposse'

import core from '../../../.dovenv/const.js'

export default defineConfig(
	pigeonposseMonorepoTheme( {
		core,
		docs : async config => {

			const sidebar = await getSidebar( config || {} )

			return {
				input        : '../../docs',
				output       : './build',
				version      : core.corePkg?.version,
				changelogURL : joinUrl(
					// @ts-ignore
					core.corePkg.repository.url || '',
					'CHANGELOG.md',
				),
				npmURL    : core.pkg?.extra.libraryUrl,
				vitepress : {
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
			}

		},
	} ),
)
