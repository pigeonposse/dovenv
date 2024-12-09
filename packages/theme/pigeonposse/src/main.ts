
import {
	arePathsEqual,
	createMergeDataFn,
	getDirName,
} from '@dovenv/core/utils'
import {
	config as bandaConfig,
	mergeConfig as bandaMergeConfig,
} from '@dovenv/theme-banda'

export * from '@dovenv/theme-banda'

export type Config = Parameters< typeof bandaConfig>[ 0 ] & { workspaceDir?: string }

/**
 * Merges multiple configuration objects into a single configuration.
 */
export const mergeConfig = createMergeDataFn<Config>(  )

export const config = ( params?: Config ) => {

	const config = bandaMergeConfig( { workspace : {
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
			structure    : { dovenv : {
				docs     : { '*.md': null },
				packages : { '*' : {
					'src'          : { '**': null },
					'examples'     : { '**': null },
					'README.md'    : null,
					'package.json' : null,
				} },
			} },
		},
		check : { pkg : {
			include : ( { path } ) => {

				const shared = [ 'package.json', 'README.md' ]

				if ( path.includes( '/config/' ) ) return shared
				else if ( arePathsEqual( getDirName( path ), params?.workspaceDir || '' ) )  return [ 'docs/index.md', ...shared ]

				return [
					'src/*{.js,.ts}',
					'examples/**/*{.js,.ts}',
					...shared,
				]

			},
			exclude : ( { dir } ) => {

				if ( arePathsEqual( dir, params?.workspaceDir || '' ) )
					return [ 'src/*' ]

			},
			schema : ( {
				v, content, path,
			} ) => {

				// if ( content.name !== 'dovenv-monorepo' ) return v.object( {
				// 	name    : v.string(),
				// 	version : v.string(),
				// } )
				// else return v.object( { extra: v.object( {} ) } )

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

	} }, params || {} )

	return bandaConfig( config )

}
