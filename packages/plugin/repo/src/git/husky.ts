import { existsDir } from '@dovenv/core/utils'
import indexHusky    from 'husky'

import { GitSuper } from './super'

export class Husky extends GitSuper {

	async run( ) {

		const path  = this.opts?.husky?.path ?? '.dovenv/husky'
		const exist = await existsDir( path )
		const style = this.style.get
		if ( !exist ) {

			await this.init()

			await indexHusky( path )

			console.log( style.succed( 'Husky folder is now in:', style.bold( path ) ) )

		}
		else console.log( style.succed( `Husky exists in:`, style.bold( path ) ) )

		console.log( style.succed( `Add now you Git hooks!','More info: ${style.link( 'https://typicode.github.io/husky' )}` ) )

	}

}
