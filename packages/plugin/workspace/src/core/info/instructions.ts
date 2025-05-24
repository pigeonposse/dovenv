import {
	getMD,
	md2terminal,
} from '@dovenv/core/utils'

import { Super } from '../_super/main'

import type { InfoInterface } from './_super'

export class Instructions extends Super implements InfoInterface {

	async get() {

		const opts = this.opts?.info?.instructions
		if ( !opts ) return undefined
		const content = await getMD( opts )
		return ( await md2terminal( content ) ).trim( ) + '\n'

	}

	async #fn() {

		this._title( 'Instructions' )

		const content = await this.get( )
		if ( !content ) return console.warn( this.utils.style.warn.msg( 'No instructions found' ) )

		console.log( content )

	}

	async run( ) {

		return await this._envolvefn( this.#fn( ) )

	}

}
