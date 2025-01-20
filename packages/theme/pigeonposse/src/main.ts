
import { defineConfig }                from '@dovenv/core'
import { type Config as DovenvConfig } from '@dovenv/core'
import {
	arePathsEqual,
	createMergeDataFn,
	deepmerge,
	getDirName,
} from '@dovenv/core/utils'
import {
	mergeConfig as mergeBandaConfig,
	bandaTheme,
} from '@dovenv/theme-banda'
import { type Config as BandaConfig } from '@dovenv/theme-banda'

import { getPigeonposseData } from './const'
import { predocsPlugin }      from './docs/build'
import { EMOJI }              from './docs/emoji'
import {
	markSchema,
	pkgSchema,
	templateMarkSchema,
	validateSchema,
	wsDirSchema,
} from './schema'
import { bandaTemplateConfig } from './templates'
import {
	pigeonposseWebPlugin,
	type WebConfig,
} from './web'

import type { ConstsConfig }  from './const'
import type { PredocsConfig } from './docs/types'

export * from '@dovenv/theme-banda'

export * from './utils'
export * from './docs/main'

export {
	WebConfig,
	pigeonposseWebPlugin,
}

export type Config = BandaConfig & {
	/** Configuration for the pigeonposse web File data */
	web?  : WebConfig
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
 * The `PigeonPosse` theme for Dovenv.
 * @param {Config} [params] - The configuration for the theme.
 * @returns {DovenvConfig} The merged configuration.
 *
 * This theme is a fork of the Banda theme with some changes to make it more suitable for the PigeonPosse monorepo.
 * It includes the same basic configuration as Banda, but adds some additional features and changes some of the defaults.
 */
export const pigeonposseTheme = ( params?: Config ): DovenvConfig => {

	const {
		web, core, ...bandaConf
	} = params || {}

	const config = mergeBandaConfig( {
		lint      : { staged: { '**/*.{js,ts,jsx,tsx,json}': 'dovenv lint eslint --fix --silent' } },
		workspace : {
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

					else if ( isWs && content.workspaces ) return [ 'docs/index.md', ...shared ]
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

		},
	}, bandaTemplateConfig, bandaConf )

	return defineConfig(
		getPigeonposseData( core ),
		pigeonposseWebPlugin( web ),
		{

			alias : {
				'docs-assets' : {
					desc : 'Create documentation assets based on the path "docs/public/logo.png"',
					cmd  : async ( { exec } ) =>
						await exec.current( 'docs generate-assets --flag=\\"--preset minimal\\" --flag=\\"docs/public/logo.png\\"' ),
				},
				'binarium' : {
					desc : 'Create executables of your Node|Deno|Bun projects',
					cmd  : async ( {
						exec, data, opts,
					} ) => await exec.command( `${data.pkgManagerCmds.exec} binarium ${opts?.join( ' ' ) || ''}` ),
				},
				'unbuild' : {
					desc : 'Build libraries for your Node|Deno|Bun projects',
					cmd  : async ( {
						exec, data, opts,
					} ) => await exec.command( `${data.pkgManagerCmds.exec} unbuild ${opts?.join( ' ' ) || ''}` ),
				},
			},
			check : { 'pigeonposse-consts' : {
				type : 'custom',
				desc : 'Check schemas for PigeonPosse necessary constants',
				fn   : async ( { config } ) => {

					await validateSchema( wsDirSchema, config?.const?.wsDir || config?.const?.workspaceDir, 'wsDirSchema' )
					if ( !config?.const?.pkg ) throw new Error( 'Must exist [pkg] const in dovenv configuration' )
					if ( !config.const?.mark ) throw new Error( 'Must exist [mark] const in dovenv config.\nThis must be a text, for example a watermark, a trademark, or a simple text about the project.' )

					await validateSchema( pkgSchema, config.const.pkg, 'pkg' )
					await validateSchema( markSchema, config.const.mark, 'mark' )
					await validateSchema( templateMarkSchema, config.const.templateMark, 'templateMark' )

				},
			} },
		},
		bandaTheme( config ),
	)

}
export default pigeonposseTheme

export type MonorepoConfig = Config & { predocs?: PredocsConfig | false }

/**
 * The `pigeonposseMonorepoTheme` for Dovenv.
 * This theme is a fork of the Banda theme with some changes to make it more suitable for the PigeonPosse monorepo.
 * It includes the same basic configuration as Banda, but adds some additional features and changes some of the defaults.
 * @param {Config} [params] - The configuration for the theme.
 * @returns {DovenvConfig} The merged configuration.
 */
export const pigeonposseMonorepoTheme = ( params?: MonorepoConfig ) => {

	const {
		predocs, ...restParams
	} = params || {}

	const defaultConf = ( !restParams?.repo?.commit?.scopes )
		? { repo : { commit : { scopes : [
			{
				value : 'core',
				desc  : `Core package ${EMOJI.core}`,
			},
			{
				value : 'plugin',
				desc  : `Plugin package(s) ${EMOJI.plugin}`,
			},
			{
				value : 'theme',
				desc  : `Theme package(s) ${EMOJI.theme}`,
			},
			{
				value : 'utils',
				desc  : `Utils package(s) ${EMOJI.utils}`,
			},
			{
				value : 'all',
				desc  : `All package(s) ${EMOJI.package}`,
			},
			{
				value : 'env',
				desc  : 'Only development environment',
			},
		] } } }
		: {}

	return defineConfig(
		pigeonposseTheme( deepmerge( defaultConf, restParams ) ),
		typeof predocs === 'boolean' &&  predocs === false ? { } : predocsPlugin( predocs ),
	)

}
