
import { Checks }  from './checks'
import { Custom }  from './custom'
import { Execute } from './exec'
import { Info }    from './info/main'

import type { Config }                  from './_super/types'
import type { Config as  DovenvConfig } from '@dovenv/core'

export class Workspace {

	#info
	#check
	#exec
	#custom

	constructor( opts?: Config, config?: DovenvConfig ) {

		this.#info   = new Info( opts, config )
		this.#check  = new Checks( opts, config )
		this.#exec   = new Execute( opts, config )
		this.#custom = new Custom( opts, config )

	}

	async exec( cmd: string, opts?: string[] ) {

		await this.#exec.runPkg( cmd, opts )

	}

	async audit( fix?: boolean ) {

		await this.#exec.auditAndOutdated( fix )

	}

	async outdated(  ) {

		await this.#exec.outdated(  )

	}

	async reinstall() {

		await this.#exec.reinstall( )

	}

	async check() {

		await this.#check.run( )

	}

	async scripts( opts?: Parameters<Info['scripts']['run']>[0] ) {

		await this.#info.scripts.run( opts )

	}

	async usefulCmds() {

		await this.#info.usefulCmds.run()

	}

	async instructions() {

		await this.#info.instructions.run()

	}

	async donate( open = true ) {

		await this.#info.donate.run( open )

	}

	async size() {

		await this.#info.size.run( )

	}

	async info() {

		await this.#info.run()

	}

	async structure() {

		await this.#info.structure.run()

	}

	async custom() {

		await this.#custom.run()

	}

}
