import { execChild } from '@dovenv/core/utils'

import { Repo } from '../_super/main'

export class GHSuper extends Repo {

	async getRepositories( opts?: {
		archived?   : boolean
		fork?       : boolean
		visibility? : 'public' | 'private' | 'internal'
	} ) {

		const {
			archived,
			fork,
			visibility,
		} = opts || {}
		const flags: string[] = []

		await this.init()
		await this.initGH()

		if ( archived === true ) flags.push( '--archived' )
		else if ( archived === false ) flags.push( '--no-archived' )

		if ( fork === true ) flags.push( '--fork' )
		else if ( fork === false ) flags.push( '--source' )

		if ( visibility ) flags.push( `--visibility ${visibility}` )

		const { stdout } = await execChild( flags.length ? `gh repo list ${flags.join( ' ' )}` : `gh repo list` )

		return ' ' + stdout.trim()

	}

}
