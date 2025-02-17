import { defineConfig } from '../main'

const workspaceExample = ( desc?: string ) => defineConfig( { custom : { ws : {
	desc : desc || 'Workspace functions',
	cmds : {
		'path' : {
			desc : 'Get workspace Path',
			opts : { input : {
				desc  : 'Set input',
				alias : [ 'i' ],
			} },
		},
		'manager'   : { desc: 'Get package Manager' },
		'pkg-paths' : { desc: 'Gets the paths of the packages in the workspace.' },
		'runtime'   : { desc: 'Determines the runtime of the current package.' },
	},
	fn : async ( {
		cmds, opts, utils,
	} ) => {

		if ( cmds?.includes( 'path' ) ) {

			if ( !opts?.input ) throw Error( 'Input flag must exists' )
			const path = await utils.getWsPath( opts.input as string )
			console.log( path )

		}
		else if ( cmds?.includes( 'manager' ) )
			console.log( await utils.getPkgManager() )
		else if ( cmds?.includes( 'pkg-paths' ) )
			console.log( await utils.getPkgPaths() )
		else if ( cmds?.includes( 'runtime' ) )
			console.log( await utils.getRuntime() )

	},
} } } )

console.log( workspaceExample( 'Custom desc' ) )

