import { Repo } from '../_super/main'

export class Packages extends Repo {

	async #exec( args?: string[] ) {

		// const oldArgv      = this._process.argv
		// this._process.argv = [ '', '' ]

		// if ( cmd ) this._process.argv.push( ...cmd )
		// await import( '@changesets/cli' )

		// this._process.argv = oldArgv

		await this._execBin( {
			name : '@changesets/cli',
			path : [ 'bin.js' ],
			args : args,
		} )

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

		await this.prompt( )
		await this.version()
		await this.publish()

	}

}
