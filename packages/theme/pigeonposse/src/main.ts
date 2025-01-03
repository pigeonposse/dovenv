/* eslint-disable @stylistic/object-curly-newline */

import { defineConfig }                from '@dovenv/core'
import { type Config as DovenvConfig } from '@dovenv/core'
import {
	arePathsEqual,
	createMergeDataFn,
	deepmerge,
	getDirName,
	yaml,
} from '@dovenv/core/utils'
import {
	mergeConfig as mergeBandaConfig,
	bandaTheme,
} from '@dovenv/theme-banda'
import { type Config as BandaConfig } from '@dovenv/theme-banda'

import {
	getPigeonposseData,
} from './const'
import { predocsCommand } from './docs/build'
import {
	markSchema,
	pkgSchema,
	templateMarkSchema,
	validateSchema,
	wsDirSchema,
} from './schema'

import type { ConstsConfig } from './const'
import type { PackageJSON }  from '@dovenv/core/utils'

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

export type Config = BandaConfig & {
	/** Configuration for the pigeonposse web File data */
	web? : WebConfig
} & {
	/**
	 * Set the pigeonposse theme constants and information
	 * @example
	 * import { getWorkspaceConfig } from '@dovenv/theme-pigeonposse'
	 * const core = await getWorkspaceConfig({metaURL : import.meta.url, path : '../../../../'} )
	 */
	core? : ConstsConfig
}

/**
 * Merges multiple `theme-pigeonposse` configuration objects into a single configuration.
 */
export const mergeConfig = createMergeDataFn<Config>(  )

/**
 * Plugin for set the pigeonposse web configuration.
 * @param {WebConfig} [params] - Optional parameters for the plugin.
 * @returns {DovenvConfig} - A Dovenv configuration with a "transform" command for the `.pigeonposse.yml` file.
 * @example
 * import { defineConfig } from '@dovenv/core'
 * import { pigeonposseWebPlugin } from '@dovenv/theme-pigeonposse'
 *
 * export default defineConfig( pigeonposseWebPlugin() )
 */
export const pigeonposseWebPlugin = ( params?: WebConfig ) => {

	return defineConfig( { transform : { 'pigeonposse.yml' : {

		input : [ params?.input || './.pigeonposse.yml' ],
		fn    : async ( { const: c } ) => {

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

/**
 * The `PigeonPosse` theme for Dovenv.
 * @param {Config} [params] - The configuration for the theme.
 * @returns {DovenvConfig} The merged configuration.
 *
 * This theme is a fork of the Banda theme with some changes to make it more suitable for the PigeonPosse monorepo.
 * It includes the same basic configuration as Banda, but adds some additional features and changes some of the defaults.
 */
export const pigeonposseTheme = ( params?: Config ): DovenvConfig => {

	const { web, core, ...bandaConf } = params || {}

	const config = mergeBandaConfig( { workspace : {
		exec : {
			binarium : { desc: 'Tool to create executables of your Node|Deno|Bun projects' },
			unbuild  : { desc: 'Tool to build libraries for your Node|Deno|Bun projects' },
		},
		info : {
			usefulCmds : [
				{
					desc : 'Removes unreferenced packages from the store.',
					cmd  : 'pnpm store prune',
					info : 'https://pnpm.io/cli/store#prune',
				},
				{
					desc : 'Removes unnecessary packages.',
					cmd  : 'pnpm prune',
					info : 'https://pnpm.io/cli/prune',
				},
				{
					desc : 'Deletes metadata cache for the specified package(s).',
					cmd  : 'pnpm cache delete',
					info : 'https://pnpm.io/cli/cache-delete',
				},
				{
					desc : 'Checks for outdated packages.',
					cmd  : 'pnpm -r outdated',
					info : 'https://pnpm.io/cli/outdated',
				},
				{
					desc : 'Checks for known security issues with the installed packages.',
					cmd  : 'pnpm audit',
					info : 'https://pnpm.io/cli/audit',
				},
				{
					desc : 'Find where a package is in node_modules.',
					cmd  : 'find node_modules/.pnpm -name "*dovenv*"',
				},
			],
			instructions : '# Development guide\n\n> No instructions yet.',
			structure    : { workspace : {
				'.dovenv'  : { 'main.{js,ts}': null },
				'docs'     : { '*.md': null },
				'packages' : { '*' : {
					'src'          : { '**': null },
					'examples'     : { '**': null },
					'tests'        : { '**': null },
					'README.md'    : null,
					'package.json' : null,
				} },
				'.gitignore'   : null,
				'LICENSE'      : null,
				'package.json' : null,
				'README.md'    : null,
			} },
		},
		check : { pkg : {
			include : ( {
				path, config, content,
			} ) => {

				const ext    = '.{js,ts,mts,cts,cjs,mjs}'
				const shared = [ 'package.json', 'README.md' ]
				const wsDir  = typeof config.const?.workspaceDir  === 'string'
					? config.const.workspaceDir
					:  ''
				const isWs   = arePathsEqual( getDirName( path ), wsDir )

				if ( content.private ) return shared
				else if ( isWs  && content.workspaces ) return [ 'docs/index.md', ...shared ]
				else if ( isWs ) return [
					'packages/*',
					'.gitignore',
					'LICENSE',
					'package.json',
					'README.md',
					'.dovenv/main' + ext,
				]

				//'examples/**/*' + ext,
				return [ 'src/*' + ext, ...shared ]

			},
			exclude : ( {
				dir, config,
			} ) => {

				const wsDir = typeof config.const?.workspaceDir  === 'string'
					? config.const.workspaceDir
					: ''
				if ( arePathsEqual( dir, wsDir ) )
					return [ 'src/*' ]

			},
			schema : ( {
				v, content, path,
			} ) => {

				if ( !content ) throw new Error( `No data in ${path}` )
				if ( 'private' in content ) return

				if ( !content?.keywords?.includes( 'pp' ) || !content?.keywords?.includes( 'pigeonposse' ) )
					throw new Error( `You must add "pigeonposse" and "pp" keywords in ${path}` )

				return v.object( {
					name          : v.string(),
					version       : v.string(),
					description   : v.string(),
					files         : v.array( v.string() ),
					keywords      : v.array( v.string() ),
					publishConfig : v.object( {
						access   : v.literal( 'public' ),
						registry : v.string(),
					} ),
				} )

			},
		} },

	} }, bandaConf )

	return defineConfig(
		getPigeonposseData( core ),
		pigeonposseWebPlugin( web ),
		{ check : { pigeonposseConsts : {
			type : 'custom',
			desc : 'Check schemas for PigeonPosse necessary consts',
			fn   : async ( { config } ) => {

				if ( !config?.const?.pkg ) throw new Error( 'Must exist [pkg] const in dovenv configuration' )
				if ( !config.const?.mark ) throw new Error( 'Must exist [mark] const in dovenv config.\nThis must be a text, for example a watermark, a trademark, or a simple text about the project.' )

				await validateSchema( pkgSchema, config.const.pkg, 'pkg' )
				await validateSchema( wsDirSchema, config.const.wsDir || config.const.workspaceDir, 'wsDirSchema' )

				await validateSchema( markSchema, config.const.mark, 'mark' )
				await validateSchema( templateMarkSchema, config.const.templateMark, 'templateMark' )

			},
		} } },
		bandaTheme( config ),
	)

}

/**
 * The `pigeonposseMonorepoTheme` for Dovenv.
 * This theme is a fork of the Banda theme with some changes to make it more suitable for the PigeonPosse monorepo.
 * It includes the same basic configuration as Banda, but adds some additional features and changes some of the defaults.
 * @param {Config} [params] - The configuration for the theme.
 * @returns {DovenvConfig} The merged configuration.
 */
export const pigeonposseMonorepoTheme = ( params?: Config ) => {

	return defineConfig(
		pigeonposseTheme( deepmerge(
			{
				repo : { commit : { scopes : [
					{
						value : 'core',
						desc  : 'Core package',
					},
					{
						value : 'plugin',
						desc  : 'Plugin package(s)',
					},
					{
						value : 'theme',
						desc  : 'Theme package',
					},
					{
						value : 'utils',
						desc  : 'Utils package',
					},
					{
						value : 'all',
						desc  : 'All packages',
					},
					{
						value : 'env',
						desc  : 'Only development environment',
					},
				] } },
			},
			params || {},
		) ),
		predocsCommand,
	)

}
export default pigeonposseTheme
