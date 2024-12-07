import { catchExecOutput } from '@dovenv/core/utils'

import { GitSuper } from './super'

export class GitAdd extends GitSuper {

	async ask( initialValue = '.' ) {

		return await this.prompt.text( {
			message      : 'What paths do you want to add?',
			placeholder  : '.',
			initialValue : initialValue,
		} ) as string

	}

	async exec( value: string ) {

		const cmd        = `git add ${value}`
		const [ e, out ] = await catchExecOutput( `git add ${value}` )
		if ( e ) console.error( this.style.get.error( e ) )
		else if ( out && out !== '' ) {

			console.log( this.style.get.line( cmd ) )
			console.log( this.style.get.succed( out ) )
			console.log( this.style.get.line(  ) )

		}
		// this._prompt.log.success( `Added to ${value} branch` )

	}

	async run(  ) {

		await this.init()
		const value = await this.ask()
		this.exec( value )

	}

}
