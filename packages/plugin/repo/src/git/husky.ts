import { execModulePath } from '@dovenv/utils'

import { GitSuper } from './super'

export class Husky extends GitSuper {

	async run( ) {

		await this.init()
		await execModulePath( {
			currentPath : import.meta.url,
			moduleEntry : 'husky',
			modulePath  : [ 'bin.js' ],
			args        : [ this.opts?.husky?.path ?? '.dovenv/.husky' ],
		} )
		console.log( '' ) // for make sure it's on a new line

	}

}
