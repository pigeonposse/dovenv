
import { getDirName } from '@dovenv/core/utils'

import { UsefulCmds }   from './cmds'
import { Donate }       from './donate'
import { Instructions } from './instructions'
import { Scripts }      from './scripts'
import { Size }         from './size'
import { Structure }    from './structure'
import { Super }        from '../_super/main'

import type { Config }                  from '../_super/types'
import type { Config as  DovenvConfig } from '@dovenv/core'

export class Info extends Super {

	size         : Size
	instructions : Instructions
	donate       : Donate
	usefulCmds   : UsefulCmds
	structure    : Structure
	scripts      : Scripts

	constructor( opts?: Config, config?: DovenvConfig ) {

		super( opts, config )

		this.size         = new Size( opts, config )
		this.instructions = new Instructions( opts, config )
		this.donate       = new Donate( opts, config )
		this.usefulCmds   = new UsefulCmds( opts, config )
		this.structure    = new Structure( opts, config )
		this.scripts      = new Scripts( opts, config )

	}

	async #all() {

		this._title( 'Workspace Information' )

		const pkgs         = ( await this.getPkgPaths() ).map( p => getDirName( p ) )
		const pkgNum       = pkgs.length
		const size         = await this.size.get()
		const structure    = await this.structure.get()
		const instructions = await this.instructions.get()
		const cmds         = await this.usefulCmds.get()
		const scripts      = await this.scripts.get()

		const content = [
			[ 'Monorepo', this.isMonorepo() ],
			[ 'Runtime', this.getRuntime() ],
			[ 'Package manager', this.getPkgManager() ],
			[ 'Package Num', pkgNum ],
			[
				'Package Paths',
				pkgNum
					? '\n' + this.style.box( {
						data   : pkgs.map( p => this.style.section.p( p ) ).join( '\n' ),
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

			console.log( this.style.section.lk( c[0] ), c[1] )

		}

	}

	async run() {

		await this.#all( )

	}

}
