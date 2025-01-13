import { defineConfig } from '@dovenv/core'
import {
	getSidebar,
	pigeonposseMonorepoTheme,
	docs,
} from '@dovenv/theme-pigeonposse'

import core from '../../../.dovenv/const.js'

export default defineConfig(
	pigeonposseMonorepoTheme( {
		core,
		docs : async config => {

			const sidebar = await getSidebar( config || {} )
			const data    = await docs.getPkgConfig(
				// @ts-ignore
				config?.const?.pkg || {},
			)
			console.dir( sidebar, { depth: Infinity } )
			return {
				...data,
				input     : '../../docs',
				output    : './build',
				// logo      : 'fail',
				version   : core.corePkg?.version,
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
				// pwa : { injectRegister: 'inline' },
			}

		},
	} ),
)
