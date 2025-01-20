
import { defineConfig } from '@dovenv/core'
import {
	deepmerge,
	yaml,
} from '@dovenv/core/utils'

import type { PackageJSON } from '@dovenv/core/utils'

export * from '@dovenv/theme-banda'

export * from './utils'
export * from './docs/main'

export type WebConfig = {
	/**
	 * @default '.pigeonposse.yml'
	 */
	input?        : string
	/** override values. set to `false` to disable default values */
	values?       : Record<string, unknown> | false
	/** Merge with general values */
	customValues? : Record<string, unknown>
}

/**
 * Plugin for set the pigeonposse web configuration.
 * @param {WebConfig} [params] - Optional parameters for the plugin.
 * @returns {import('@dovenv/core').Config} - A Dovenv configuration with a "transform" command for the `.pigeonposse.yml` file.
 * @example
 * import { defineConfig } from '@dovenv/core'
 * import { pigeonposseWebPlugin } from '@dovenv/theme-pigeonposse'
 *
 * export default defineConfig( pigeonposseWebPlugin() )
 */
export const pigeonposseWebPlugin = ( params?: WebConfig ) => {

	return defineConfig( { transform : { 'pigeonposse.yml' : {

		input : [ params?.input || './.pigeonposse.yml' ],
		fn    : async ( { config } ) => {

			const c   = config?.const
			const pkg = c?.pkg as PackageJSON | undefined

			if ( !pkg || typeof pkg !== 'object' ) throw new Error( `No "pkg" const in dovenv configuration` )

			const id                             = pkg.extra?.id || pkg.name
			const data : Record<string, unknown> = {}

			if ( params?.values !== false )
				data.web = [
					deepmerge( {
						id          : id,
						name        : pkg.extra?.productName || id,
						version     : pkg.version,
						description : pkg.description,
						homepage    : pkg.homepage,
						type        : pkg.extra.type,
						subtype     : pkg.extra.subtype,
						repo        : typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url,
						license     : pkg.extra.licenseURL || pkg.extra.licenseUrl,
						status      : 'active',
					}, params?.values || {} ),
				]

			const res = yaml.serialize( deepmerge( data, params?.customValues || {} ) )

			return ( c?.templateMark || '' ) + `\n` + res

		},
	} } } )

}
