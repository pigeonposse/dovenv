
import { defineConfig } from '@dovenv/core'
import {
	getCurrentDir,
	getObjectFromJSONFile,
	joinPath,
	arePathsEqual,
} from '@dovenv/core/utils'

import { workspacePlugin } from '../src/main'

import type { PackageJSON } from '@dovenv/core/utils'

const workspaceDir = joinPath( getCurrentDir( import.meta.url ), '../../../../' )
const pkgPath      = joinPath( workspaceDir, 'package.json' )
const pkg          = await getObjectFromJSONFile<PackageJSON>( pkgPath )

export default defineConfig(
	{ const : {
		pkg,
		workspaceDir : workspaceDir,
	} },
	workspacePlugin( {
		// exec : { binarium: { desc: 'Tool to create executables of your Node, Deno or Bun projects' } },
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
				packages : {
					'config' : { '*' : {
						'README.md'    : null,
						'package.json' : null,
					} },
					'theme' : { '*' : {
						'README.md'    : null,
						'package.json' : null,
					} },
					'plugin' : { '*' : {
						'README.md'    : null,
						'package.json' : null,
					} },
					'*' : {
						'README.md'    : null,
						'package.json' : null,
					},
				},
			} },
		},
		check : { pkg : {
			packageJSON : {
				desc   : 'Check package(s) structure',
				schema : ( {
					v, content,
				} ) => {

					if ( content.private === true ) return undefined
					if ( content.name !== 'dovenv-monorepo' ) return v.object( {
						name    : v.string(),
						version : v.string(),
					} )
					else return v.object( { extra: v.object( {} ) } )

				},
			},
			files : {
				include : ( {
					path, content,
				} ) => {

					if ( content.private === true ) return []
					const shared = [ 'package.json', 'README.md' ]

					if ( path.includes( '/config/' ) ) return shared
					else if ( path === pkgPath ) return [ 'docs/index.md', ...shared ]

					return [
						'src/*{.js,.ts}',
						'examples/**/*{.js,.ts}',
						...shared,
					]

				},
				exclude : ( { dir } ) => {

					if ( arePathsEqual( dir, workspaceDir ) )
						return [ 'src/*' ]

				},
			},
		} },
		// custom : { paths : {
		// 	desc : 'Print paths',
		// 	fn   : async ( { utils } ) => {

		// 		console.log( ( await utils.getPkgPaths() ).join( '\n' ) )

		// 	},
		// } },
	} ),
)
