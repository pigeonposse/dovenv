
import { defineConfig } from 'dovenv'

import { run } from './run'

import type { Config as EnvAiConfig } from 'env-ai'

type Config = { ai?: { [key: string]: EnvAiConfig } }

export {
	run,
	Config,
}
export const config = ( conf?: Config ) => {

	const keys = Object.keys( conf?.ai || [] )

	return defineConfig( { custom : { ai : {
		desc : 'local AI assistant for your workspace',
		opts : { key : {
			// @ts-ignore
			type         : 'choices',
			demandOption : true,
			alias        : 'k',
			choices      : keys,
			desc         : 'AI assistant',
		} },
		fn : async ( { opts } ) => {

			const config = conf?.ai
			const key    = opts?.key as string

			if ( !key || typeof key !== 'string' ) {

				console.log( 'No chat key provided. Use "--key|-k <chat>" for execute a local assistant chat' )
				return

			}

			if ( !config ) {

				console.log( 'No AI assistant provided in your configuration' )
				return

			}
			const chat = config[key]
			await run( chat )

		},
	} } } )

}
