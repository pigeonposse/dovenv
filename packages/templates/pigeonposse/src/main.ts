/* eslint-disable @stylistic/object-curly-newline */

import { config as bandaConfig } from '@dovenv/theme-banda'
import { defineConfig }          from 'dovenv'

type Config =  Parameters<typeof bandaConfig>[0]
export const config = ( opts?: Config ) => defineConfig( [
	{
		// pigeonposse config
	},
	bandaConfig( opts ),
] )
