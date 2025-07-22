
import { defineConfig } from '@dovenv/core'
import {
	deepmerge,
	yaml,
} from '@dovenv/core/utils'

import type { PackageJSON } from '@dovenv/core/utils'

export * from '@dovenv/theme-banda'

export * from './utils'
export * from './predocs'

export type WebConfig = {
	/**
	 * @default '.pigeonposse.yml'
	 */
	input?        : string
	/** Override values. Set to `false` to disable default values */
	values?       : Record<string, unknown> | false
	/** Merge with general values */
	customValues? : Record<string, unknown>
	/**
	 * Version of the web.
	 *
	 * @default latest
	 */
	version?      : string
}

/**
 * Plugin for set the pigeonposse web configuration.
 *
 * @param   {WebConfig}                     [params] - Optional parameters for the plugin.
 * @returns {import('@dovenv/core').Config}          - A Dovenv configuration with a "transform" command for the `.pigeonposse.yml` file.
 * @example
 * import { defineConfig } from '@dovenv/core'
 * import { pigeonposseWebPlugin } from '@dovenv/theme-pigeonposse'
 *
 * export default defineConfig( pigeonposseWebPlugin() )
 */
export const pigeonposseWebPlugin = ( params?: WebConfig ) => {

	return defineConfig( {
		check : { 'pigeonposse.com' : {
			desc : 'Check if your workspace meets the requirements for the pigeonposse.com website',
			type : 'custom',
			fn   : async ( { utils } ) => {

				await utils.execPkgBin( '@pigeonposse/check-2025', [ '--cwd', utils.wsDir ] )

			},
		} },
		transform : { 'pigeonposse.com' : {
			desc  : 'Create your pigeonposse.yml based on the contents of your workspace pkg',
			input : params?.input ? [ params?.input ] : [ './.dovenv/pigeonposse.yml' ],
			fn    : async ( { utils } ) => {

				const c   = utils.config?.const
				const pkg = c?.pkg as PackageJSON | undefined

				if ( !pkg || typeof pkg !== 'object' ) throw new Error( `No "pkg" const in dovenv configuration` )

				const id                             = pkg.extra?.id || pkg.name
				const data : Record<string, unknown> = {}

				if ( params?.values !== false )
					data.web = { [id] : deepmerge( {
						name      : pkg.extra?.productName || id,
						version   : pkg.version,
						desc      : pkg.description,
						homepage  : pkg.homepage,
						library   : pkg.extra?.libraryURL,
						changelog : pkg.extra?.changelogURL,
						docs      : pkg.extra?.docsURL,
						container : pkg.extra.containerURL,
						type      : typeof pkg.extra?.type === 'string' ? [ pkg.extra.type ] : Array.isArray( pkg.extra?.type ) ? pkg.extra?.type : 'library',
						license   : pkg.license && ( pkg.extra.licenseURL || pkg.extra.licenseUrl )
							? {
								name : pkg.license,
								url  : pkg.extra.licenseURL || pkg.extra.licenseUrl,
							}
							: undefined,
						status : 'active',
					}, params?.values || {} ) }

				const res    = await yaml.serialize( deepmerge( data, params?.customValues || {} ) )
				const schema = `# yaml-language-server: $schema=https://www.unpkg.com/@pigeonposse/api-2025@${params?.version || 'latest'}/dist/schema/config.json`
				return schema + `\n` + ( c?.templateMark || '' ) + `\n\n` + res

			},
		} },
	} )

}
