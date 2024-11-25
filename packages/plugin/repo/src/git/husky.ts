import { existsDir } from '@dovenv/utils'

import { GitSuper } from './super'

export class Husky extends GitSuper {

	async run( ) {

		const path  = this.opts?.husky?.path ?? '.dovenv/husky'
		const exist = await existsDir( path )
		if ( !exist ) {

			await this.init()
			await this._execBin( {
				name : 'husky',
				path : [ 'bin.js' ],
				args : [ path ],
			} )

			this._succedMsg( `Husky folder is now in: ${path}` )

		}
		else this._succedMsg( `Husky exists in: ${path}` )

		this._succedDesc( `Add now you Git hooks!\nMore info: ${this._style.link( 'https://typicode.github.io/husky' )}` )

	}

}
