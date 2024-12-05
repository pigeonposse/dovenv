// import changeset from '@changesets/cli/bin.js'

import {
	replaceConsole,
	runLocalBin,
} from '@dovenv/core/utils'

import { Repo } from '../_super/main'

export class Packages extends Repo {

	async #exec( args?: string[] ) {

		const replace = replaceConsole( { params: { 'changeset init': '$0 pkg init' } } )
		replace.start()

		await runLocalBin( {
			name : 'changeset',
			args,
		} )

		replace.stop()

	}

	async init() {

		await this.#exec( [ 'init' ] )

	}

	async publish() {

		await this.#exec( [ 'publish' ] )

	}

	async version() {

		await this.#exec( [ 'version' ] )

	}

	async prompt() {

		await this.#exec( )

	}

	async release() {

		try {

			await this.prompt()
			await this.version()
			await this.publish()

		}
		catch ( error ) {

			if ( error instanceof Error )
				console.error( 'Release failed:', error.message )
			else console.error( 'Release failed:', error )

		}

	}

}
