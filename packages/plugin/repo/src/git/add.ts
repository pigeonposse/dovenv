import { catchExecOutput } from '@dovenv/core/utils'

import { GitSuper } from './super'

export class GitAdd extends GitSuper {

	async ask( initialValue = '.' ) {

		return await this.prompt.text( {
			message      : 'What do you want to add?',
			placeholder  : '.',
			initialValue : initialValue,
		} ) as string

	}

	async exec( value: string ) {

		const cmd        = `git add ${value}`
		const [ e, out ] = await catchExecOutput( `git add ${value}` )
		if ( e ) console.error( this.style.get.error( e ) )
		else if ( out && out !== '' ) {

			const l = this.style.get.line( cmd )
			l.start()
			console.log( this.style.get.succed( out ) )
			l.stop()

		}
		// this._prompt.log.success( `Added to ${value} branch` )

	}

	async run(  ) {

		await this.init()
		const value = await this.ask()
		this.exec( value )

	}

}
