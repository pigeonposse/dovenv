import { defineConfig } from '@dovenv/core'
import {
	getSidebar,
	pigeonposseMonorepoTheme,
	docs,
} from '@dovenv/theme-pigeonposse'
import { resolve } from 'node:path'

import core from '../../../.dovenv/const.js'

const emojis = { 'utils-media': '📷' }

const conf = defineConfig(

	pigeonposseMonorepoTheme( {
		core,
		predocs : { emoji: emojis },
		docs    : async utils => {

			const sidebar = await getSidebar( {
				utils,
				opts : { emojis },
			} )

			const pkg    = typeof utils?.config?.const?.pkg === 'object' ? utils.config.const.pkg : {}
			const data   = await docs.getPkgConfig( pkg )
			const input  = resolve( '../../docs' )
			const output = resolve( './build' )

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
			}

		},
	} ),
)
// console.dir( conf )
export default conf
