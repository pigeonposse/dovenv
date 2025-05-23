import { Packages } from './fn'

import type {
	ConfigSuper as PackageConfig,
	DovenvConfig,
} from '../_super/types'

const CMD = {
	release     : 'release',
	publish     : 'publish',
	init        : 'init',
	version     : 'version',
	prepare     : 'prepare',
	ask         : 'ask',
	showVersion : 'show-version',
	size        : 'size',
} as const

const pkgPlugin = ( conf?: PackageConfig ): DovenvConfig => {

	return { custom : { pkg : {
		desc : 'Packages commands: update, publish...',
		cmds : {
			[CMD.init]        : { desc: 'Init package(s)' },
			[CMD.ask]         : { desc: 'Ask for changes' },
			[CMD.prepare]     : { desc: 'Preprare version changelog' },
			[CMD.version]     : { desc: 'Update version of package(s)' },
			[CMD.publish]     : { desc: 'Publish package(s)' },
			[CMD.release]     : { desc: 'Update version and publish package(s)' },
			[CMD.showVersion] : {
				desc : 'Show version of package(s). (Local and NPM)',
				opts : { local : {
					desc : 'show Local version only',
					type : 'boolean',
				} },
			},
			[CMD.size] : {
				desc : 'Get package size of package. (Local and NPM)',
				opts : { input : {
					alias : 'i',
					desc  : 'Local path package directory/file or npm package name',
					type  : 'string',
				} },
			},
		},
		fn : async ( {
			utils, cmds, showHelp, opts,
		} ) => {

			const pkg = new Packages( {
				opts : conf,
				utils,
			} )
			if ( cmds?.includes( CMD.release ) )
				await pkg.release()
			else if ( cmds?.includes( CMD.publish ) )
				await pkg.publish()
			else if ( cmds?.includes( CMD.prepare ) )
				await pkg.prepare()
			else if ( cmds?.includes( CMD.init ) )
				await pkg.init()
			else if ( cmds?.includes( CMD.version ) )
				await pkg.version()
			else if ( cmds?.includes( CMD.ask ) )
				await pkg.ask()
			else if ( cmds?.includes( CMD.size ) )
				await pkg.getSize( opts?.input as string )
			else if ( cmds?.includes( CMD.showVersion ) )
				await pkg.showPackageVersion( opts?.local ? false : true )
			else showHelp()

		},
		examples : [
			{
				cmd  : `$0 pkg ${CMD.release}`,
				desc : 'Directly update version and publish packages',
			},
		],
	} } }

}

export {
	Packages,
	pkgPlugin,
}
export type { PackageConfig }
