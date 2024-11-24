
import { Checks }  from './checks'
import { Execute } from './exec'
import { Info }    from './info/main'

import type {  ConstructorParams } from './_super/types'

export class Workspace {

	#info  : Info
	#check : Checks
	#exec  : Execute

	constructor(
		public config : ConstructorParams['config'],
		public consts : ConstructorParams['consts'],
	) {

		this.#info  = new Info( this.config, this.consts )
		this.#check = new Checks( this.config, this.consts )
		this.#exec  = new Execute( this.config, this.consts )

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

}