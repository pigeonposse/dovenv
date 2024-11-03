import { validate } from '@dovenv/utils'

import { Command } from '../_shared/cmd'

import type { ArgvParsed } from '../_shared/types'
import type { Constant }   from '../const/main'

export type TemplateConfig = Record<string, {
	input  : string
	output : string[]
}>

export class Template extends Command {

	props
	constInstance
	argv
	schema = validate.record(
		validate.string(),
		validate.object( {
			input  : validate.string(),
			output : validate.array( validate.string() ).nonempty(),
		} ),
	)

	constructor(  argv? : ArgvParsed, constant?: Constant ) {

		super()
		this.constInstance = constant
		// @ts-ignore
		this.props = ( argv?.config?.template || undefined ) as TemplateConfig
		this.argv  = argv

	}

	async #set() {

		const constants = this.constInstance ? await this.constInstance.get() : {}
		console.log( constants )

	}

	async run( ) {

		if ( !this.props ) return

		this.validateSchema( this.props )
		await this.#set()

	}

}
