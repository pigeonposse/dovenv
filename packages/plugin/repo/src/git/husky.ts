import { GitSuper } from './super'

export class Husky extends GitSuper {

	async run( ) {

		await this.init()
		await this._execBin( {
			name : 'husky',
			path : [ 'bin.js' ],
			args : [ this.opts?.husky?.path ?? '.dovenv/.husky' ],
		} )
		console.log( '' ) // for make sure it's on a new line

	}

}
