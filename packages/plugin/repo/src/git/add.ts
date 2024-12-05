import { catchExecOutput } from '@dovenv/core/utils'

import { GitSuper } from './super'

export class GitAdd extends GitSuper {

	async ask( initialValue = '.' ) {

		return await this._prompt.text( {
			message      : 'What do you want to add?',
			placeholder  : '.',
			initialValue : initialValue,
		} ) as string

	}

	async exec( value: string ) {

		const cmd        = `git add ${value}`
		const [ e, out ] = await catchExecOutput( `git add ${value}` )
		if ( e ) console.error( this._color.red( e ) )
		else if ( out && out !== '' ) {

			const l = this.line( cmd )
			l.start()
			console.log( this._color.green( out ) )
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
