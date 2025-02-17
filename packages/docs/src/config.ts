import { defineConfig } from '@dovenv/core'
import {
	getSidebar,
	pigeonposseMonorepoTheme,
	docs,
} from '@dovenv/theme-pigeonposse'
import { resolve } from 'node:path'

import core from '../../../.dovenv/const.js'

export default defineConfig(
	pigeonposseMonorepoTheme( {
		core,
		docs : async utils => {

			const sidebar = await getSidebar( {
				utils,
				opts : { emojis: { 'utils-media': '📷' } },
			} )
			const pkg     = typeof utils?.config?.const?.pkg === 'object' ?  utils.config.const.pkg : {}
			const data    = await docs.getPkgConfig( pkg )
			const input   = resolve( '../../docs' )
			const output  = resolve( './build' )

			return {
				...data,
				input,
				output,
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
				pwa : { manifest : { icons : [
					{
						src   : 'pwa-64x64.png',
						sizes : '64x64',
						type  : 'image/png',
					},
					{
						src   : 'pwa-192x192.png',
						sizes : '192x192',
						type  : 'image/png',
					},
					{
						src   : 'pwa-512x512.png',
						sizes : '512x512',
						type  : 'image/png',
					},
					{
						src     : 'maskable-icon-512x512.png',
						sizes   : '512x512',
						type    : 'image/png',
						purpose : 'maskable',
					},
				] } },
			}

		},
	} ),
)
