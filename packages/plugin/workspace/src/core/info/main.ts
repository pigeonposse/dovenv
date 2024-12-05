
import { getDirName } from '@dovenv/core/utils'

import { UsefulCmds }   from './cmds'
import { Donate }       from './donate'
import { Instructions } from './instructions'
import { Scripts }      from './scripts'
import { Size }         from './size'
import { Structure }    from './structure'
import { Super }        from '../_super/main'

import type { ConstructorParams } from '../_super/types'

export class Info extends Super {

	size         : Size
	instructions : Instructions
	donate       : Donate
	usefulCmds   : UsefulCmds
	structure    : Structure
	scripts      : Scripts

	constructor( config?: ConstructorParams['config'], consts?: ConstructorParams['consts'] ) {

		super( config, consts )
		this.size         = new Size( config, consts )
		this.instructions = new Instructions( this.config, this.consts )
		this.donate       = new Donate( this.config, this.consts )
		this.usefulCmds   = new UsefulCmds( this.config, this.consts )
		this.structure    = new Structure( this.config, this.consts )
		this.scripts      = new Scripts( this.config, this.consts )

	}

	async #all() {

		this._title( 'Workspace Information' )
		const pkgs         = ( await this._getPkgPaths() ).map( p => getDirName( p ) )
		const pkgNum       = pkgs.length
		const size         = await this.size.get()
		const structure    = await this.structure.get()
		const instructions = await this.instructions.get()
		const cmds         = await this.usefulCmds.get()
		const scripts      = await this.scripts.get()

		this._sectionList( [
			[ 'Monorepo', this._isMonorepo() ],
			[ 'Runtime', this._getRuntime() ],
			[ 'Package manager', this._getPkgManager() ],
			[ 'Package Num', pkgNum ],
			[ 'Package Paths', pkgNum ? '\n - ' + pkgs.join( '\n - ' ) : 'none' ],
			[ 'Structure', structure ? structure : 'none' ],
			[ 'Files', size?.files ],
			[ 'Words', size?.words ],
			[ 'Chars', size?.chars ],
			[ 'Scripts', scripts ? '\n' + scripts : 'none' ],
			[ 'Instructions', instructions ? '\n' + this._box( { data: instructions } ) : 'none' ],
			[ 'Useful commands', cmds ? '\n' + cmds : 'none' ],
			[ 'Donate', await this.donate.get() ],
		] )

	}

	async run() {

		await this.#all( )

	}

}
