
import { getDirName } from '@dovenv/core/utils'

import { UsefulCmds }   from './cmds'
import { Donate }       from './donate'
import { Instructions } from './instructions'
import { Scripts }      from './scripts'
import { Size }         from './size'
import { Structure }    from './structure'
import { Super }        from '../_super/main'

import type { Config }       from '../_super/types'
import type { CommandUtils } from '@dovenv/core'

export class Info extends Super {

	size         : Size
	instructions : Instructions
	donate       : Donate
	usefulCmds   : UsefulCmds
	structure    : Structure
	scripts      : Scripts

	constructor( opts: Config | undefined, utils: CommandUtils ) {

		super( opts, utils )

		this.size         = new Size( opts, utils )
		this.instructions = new Instructions( opts, utils )
		this.donate       = new Donate( opts, utils )
		this.usefulCmds   = new UsefulCmds( opts, utils )
		this.structure    = new Structure( opts, utils )
		this.scripts      = new Scripts( opts, utils )

	}

	async #all() {

		this._title( 'Workspace Information' )

		const pkgs         = ( await this.utils.getPkgPaths() ).map( p => getDirName( p ) )
		const pkgNum       = pkgs.length
		const size         = await this.size.get()
		const structure    = await this.structure.get()
		const instructions = await this.instructions.get()
		const cmds         = await this.usefulCmds.get()
		const scripts      = await this.scripts.get()

		const content = [
			[ 'Monorepo', this.utils.monorepo ],
			[ 'Runtime', this.utils.runtime ],
			[ 'Package manager', this.utils.packageManager ],
			[ 'Package Num', pkgNum ],
			[
				'Package Paths',
				pkgNum
					? '\n' + this.utils.style.box( {
						data   : pkgs.map( p => this.utils.style.section.p( p ) ).join( '\n' ),
						border : false,
					} ) + '\n'
					: 'none',
			],
			[ 'Structure', structure ? '\n' + structure : 'none' ],
			[ 'Files', size?.files ],
			[ 'Words', size?.words ],
			[ 'Chars', size?.chars ],
			[ 'Scripts', scripts ? '\n' + scripts : 'none' ],
			[ 'Instructions', instructions ? '\n\n' + instructions : 'none' ],
			[ 'Useful commands', cmds ? '\n' + cmds : 'none' ],
			[ 'Donate', await this.donate.get() ],
		]

		for ( const c of content ) {

			console.log( this.utils.style.section.lk( c[0] ), c[1] )

		}

	}

	async run() {

		await this.#all( )

	}

}
