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

import { getPigeonposseData }  from './const'
import { predocsPlugin }       from './docs/build'
import { EMOJI }               from './docs/emoji'
import { pigeonSchemas }       from './schema'
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
	 * Set the pigeonposse theme constants and information.
	 *
	 * @example
	 * import { getWorkspaceConfig } from '@dovenv/theme-pigeonposse'
	 * const core = await getWorkspaceConfig({metaURL : import.meta.url, path : '../../../../'} )
	 */
	core? : ConstsConfig
}

/**
 * Merges multiple `theme-pigeonposse` configuration objects into a single configuration.
 */
export const mergeConfig = createMergeDataFn<Config>( )

/**
 * The `PigeonPosse` theme for Dovenv.
 *
 * @param   {Config}       [params] - The configuration for the theme.
 * @returns {DovenvConfig}          The merged configuration.
 *
 *                                  This theme is a fork of the Banda theme with some changes to make it more suitable for the PigeonPosse monorepo.
 *                                  It includes the same basic configuration as Banda, but adds some additional features and changes some of the defaults.
 */
export const pigeonposseTheme = ( params?: Config ): DovenvConfig => {

	const {
		web, core, ...bandaConf
	} = params || {}

	const config = mergeBandaConfig( {
		lint : {
			staged : params?.lint?.staged || { '**/*.{js,ts,jsx,tsx,json}': 'dovenv lint eslint --fix --silent' },
			custom : { pkg : async ( {
				utils, run,
			} ) => {

				const pkgs = await utils.getPkgsData()
				const pack = utils.packageManager.value

				for ( const pkg of pkgs ) {

					if ( pkg.content.private === true ) continue

					await run.publint( {
						title  : pkg.id,
						pack,
						pkgDir : pkg.dir,
						strict : true,
					} )

				}

			} },
		},
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
				deps : {
					desc   : 'Static dependencies',
					custom : async ( {
						content, path, utils,
					} ) => {

						const deps = {
							...content.devDependencies || {},
							...content.dependencies || {},
						}
						Object.entries( deps ).forEach( ( [ k, v ] ) => {

							if ( v?.startsWith( '^' ) ) throw new Error( utils.style.error.msg(
								path,
								`\n\nThe dependency version [${utils.style.error.b( k )}] (${v}) should be static for better version control and a more stable project.\n`,
							) )

						} )

					},
				},
				files : {
					desc    : 'Allowed and disallowed files',
					include : ( {
						path, utils, content,
					} ) => {

						const ext    = '.{js,ts,mts,cts,cjs,mjs}'
						const shared = [ 'package.json', 'README.md' ]
						const wsDir  = typeof utils.config?.const?.workspaceDir === 'string'
							? utils.config.const.workspaceDir
							: ''
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
						dir, utils,
					} ) => {

						const wsDir = typeof utils.config?.const?.workspaceDir === 'string'
							? utils.config.const.workspaceDir
							: ''
						if ( arePathsEqual( dir, wsDir ) )
							return [ 'src/*' ]

					},
				},
				packagejsom : {
					desc   : 'package.json schema',
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
				},
			} },
		},
	}, bandaTemplateConfig, bandaConf )

	return defineConfig(
		getPigeonposseData( core ),
		pigeonposseWebPlugin( web ),
		{ alias : {
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
		} },
		pigeonSchemas,
		bandaTheme( config ),
	)

}
export default pigeonposseTheme

export type MonorepoConfig = Config & { predocs?: PredocsConfig | false }

/**
 * The `pigeonposseMonorepoTheme` for Dovenv.
 * This theme is a fork of the Banda theme with some changes to make it more suitable for the PigeonPosse monorepo.
 * It includes the same basic configuration as Banda, but adds some additional features and changes some of the defaults.
 *
 * @param   {Config}       [params] - The configuration for the theme.
 * @returns {DovenvConfig}          The merged configuration.
 */
export const pigeonposseMonorepoTheme = ( params?: MonorepoConfig ) => {

	const {
		predocs,
		...restParams
	} = params || {}

	const defaultConf: Config = ( !restParams?.repo?.commit?.scopes )
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
		typeof predocs === 'boolean' && predocs === false ? { } : predocsPlugin( predocs ),
	)

}
