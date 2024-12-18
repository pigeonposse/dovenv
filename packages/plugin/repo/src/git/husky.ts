import {
	catchError,
	existsDir,
	joinPath,
} from '@dovenv/core/utils'
import indexHusky from 'husky'

import { GitSuper } from './_super'

export class Husky extends GitSuper {

	async #fn( path:string ) {

		const exist = await existsDir( path )

		console.debug( {
			path,
			exist,
		} )

		if ( exist ) return true

		await this.init()

		const result = await indexHusky( path )
		// if result exist is a error
		if ( result ) throw new Error( result )

		return false

	}

	async run( ) {

		const path = this.opts?.husky?.path ?? joinPath( this.wsDir, '.dovenv/husky' )

		const [ error, res ] = await catchError( ( async () => this.#fn( path ) )() )

		if ( error ) return console.log( this.style.error.msg( error.message ) )

		if ( res ) console.log( this.style.success.msg( `Husky exists in:`, path ) )
		else console.log( this.style.success.msg( `Husky folder is now in`, path ) )
		console.log( this.style.success.p( `\nAdd now you Git hooks!\nMore info: ${this.style.a( 'https://typicode.github.io/husky' )}` ) )

	}

}
