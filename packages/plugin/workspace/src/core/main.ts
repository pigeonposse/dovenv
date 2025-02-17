
import { Checks }  from './checks'
import { Custom }  from './custom'
import { Execute } from './exec'
import { Info }    from './info/main'

import type { Config }       from './_super/types'
import type { CommandUtils } from '@dovenv/core'

export class Workspace {

	#info
	#check
	#exec
	#custom
	opts            : Config | undefined
	protected utils : CommandUtils

	constructor( {
		opts, utils,
	}:{
		opts? : Config
		utils : CommandUtils
	} ) {

		this.opts    = opts
		this.utils   = utils
		this.#info   = new Info( opts, utils )
		this.#check  = new Checks( opts, utils )
		this.#exec   = new Execute( opts, utils )
		this.#custom = new Custom( opts, utils )

	}

	async getPkgPaths() {

		// @ts-ignore
		return await this.#exec.getPkgPaths()

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
