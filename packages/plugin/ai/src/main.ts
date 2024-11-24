/* eslint-disable @stylistic/object-curly-newline */

import { run } from './run'

import type { Config as DoveEnvConfig } from 'dovenv'
import type { Config as EnvAiConfig }   from 'env-ai'

export type Config = {
	/** Configuration for local AI assistant chats */
	chat? : {
		[key: string] : EnvAiConfig
	} }

export { run }

export const config = ( conf?: Config ) => {

	const keys = Object.keys( conf?.chat || [] )

	const config: DoveEnvConfig =  { custom : { ai : {
		desc : 'local AI assistant for your workspace',
		opts : { key : {
			// @ts-ignore
			type    : 'choices',
			alias   : 'k',
			choices : keys,
			desc    : 'Select a Local AI assistant config key',
		} },
		fn : async ( { opts } ) => {

			const config = conf?.chat
			const key    = opts?.key as string

			if ( !key || typeof key !== 'string' ) {

				console.warn( 'No chat key provided. Use "--key|-k <chat>" for execute a local assistant chat' )
				console.info( `Available keys: ${keys.join( ', ' )}` )
				return

			}

			if ( !config ) {

				console.warn( 'No AI assistant provided in your configuration' )
				return

			}
			const chat = config[key]
			await run( chat )

		},
	} } }

	return config

}
