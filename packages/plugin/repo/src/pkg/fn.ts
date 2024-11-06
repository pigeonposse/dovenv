import { Repo } from '../_super/main'

export class Packages extends Repo {

	async init() {

		const oldArgv     = this.process.argv
		this.process.argv = [
			'',
			'',
			'init',
		]
		await import( '@changesets/cli' )
		this.process.argv = oldArgv

	}

	async publish() {

		const oldArgv     = this.process.argv
		this.process.argv = [
			'',
			'',
			'init',
		]
		await import( '@changesets/cli' )
		this.process.argv = oldArgv

	}

	async version() {

		const oldArgv     = this.process.argv
		this.process.argv = [
			'',
			'',
			'version',
		]
		await import( '@changesets/cli' )
		this.process.argv = oldArgv

	}

	async updateVersion() {

		const oldArgv     = this.process.argv
		this.process.argv = [ '', '' ]
		await import( '@changesets/cli' )
		this.process.argv = oldArgv

		await this.version()

	}

}
