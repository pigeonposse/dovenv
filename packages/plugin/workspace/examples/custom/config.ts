
import { defineConfig } from '@dovenv/core'
import {
	getCurrentDir,
	getObjectFromJSONFile,
	joinPath,
} from '@dovenv/core/utils'

import { workspacePlugin } from '../../src/main'

import type { PackageJSON } from '@dovenv/core/utils'

const workspaceDir = joinPath( getCurrentDir( import.meta.url ), '../../../../' )
const pkgPath      = joinPath( workspaceDir, 'package.json' )
const pkg          = await getObjectFromJSONFile<PackageJSON>( pkgPath )

export default defineConfig(
	{ const : {
		pkg,
		workspaceDir : workspaceDir,
	} },
	workspacePlugin( { custom : {
		// Utils for monorepos
		pkgs : async data => {

			const pkgs = await data.getPkgPaths()
			for ( const pkg of pkgs ) {

				// do something
				console.log( pkg ) // > {path}/package.json

			}

		},
		runtime : async data => {

			const RUNTIME = await data.getRuntime()
			if ( RUNTIME === 'bun' ) throw new Error( 'THIS WORKSPACE IS NOT SUPPORT BUN' )

		},
	} } ),
)
