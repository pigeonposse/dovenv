/* eslint-disable @stylistic/object-curly-newline */

import { run } from './run'

import type { Config as DovenvConfig } from '@dovenv/core'
import type { Config as EnvAiConfig }  from 'env-ai'

export type Config = {
	/** Configuration for local AI assistant chats */
	chat? : Record<string, EnvAiConfig>
}

export { run }

/**
 * Local AI assistant plugin for dovenv.
 *
 * This function generates a configuration for a local AI assistant, allowing
 * users to select different chat configurations using keys. The configuration
 * includes a description and options for selecting a specific chat configuration
 * by key. The function also defines the behavior for running the assistant
 * with the selected configuration.
 *
 * ---
 * @param {Config} [conf] - Optional configuration object for the plugin.
 * @returns {DovenvConfig} - Dovenv configuration for the plugin.
 */
export const aiPlugin = ( conf?: Config ): DovenvConfig => {

	return  { custom : { ai : {
		desc : 'local AI assistant for your workspace',
		opts : { key : {
			// @ts-ignore
			type    : 'choices',
			alias   : 'k',
			choices : Object.keys( conf?.chat || [] ),
			desc    : 'Select a Local AI assistant config key',
		} },
		fn : async ( { opts, utils } ) => {

			const config = conf?.chat
			const key    = opts?.key as string

			const userKey = await utils.getOptsKeys( {
				input   : config,
				pattern : typeof key === 'string' ? key : undefined,
			} )

			if ( !userKey || !config ) return
			const chat = config[userKey as string]
			await run( chat )

		},
	} } }

}

export default aiPlugin
