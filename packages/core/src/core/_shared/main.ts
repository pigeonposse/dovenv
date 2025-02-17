import {
	TypedError,
	catchError,
} from '@dovenv/utils'

import { CommandSuper } from '../../_shared/cmd'
import * as consts      from '../../_shared/const'

import type { ArgvParsed }      from '../../_shared/types'
import type { ValidateAnyType } from '@dovenv/utils'

// You have to define here to accept instacolef later
const ErroClass = class CommandError extends TypedError {}

export class Command<Opts = undefined> {

	schema : ValidateAnyType
	Error = ErroClass
	catchError = catchError
	description = ''
	protected consts = consts

	constructor( public opts:Opts | undefined, protected utils : CommandSuper ) {

		this.utils.title = 'core'
		this.schema      = this.utils.validate.unknown()

	}

	protected setMainTitle( title: string, desc?: string ) {

		const { style } = this.utils
		console.log( `\n${style.main.h1( title )}${desc ? '\n\n' + style.main.p( desc ) : ''}\n` )

	}

	protected setTitle( ) {

		const {
			style, title,
		} = this.utils
		console.log( `\n${style.section.h1( title )} ${style.section.p( this.description )}\n` )

	}

	protected setTime( time: string ) {

		const {
			style, title,
		} = this.utils
		console.log( `\n${style.section.h1( title )} ${style.section.p( `Done in ${time}` )}\n` )

	}

	protected async validateSchema<D = unknown>( data: D ): Promise<D> {

		return await this.utils.validateSchema<D>( this.schema, data, { showValid: true } )

	}

	protected getKeysFromArgv( avaliableKeys: string[], argv?: ArgvParsed ) {

		const id             = this.consts.OPTIONS.KEY.key
		const keys: string[] = ( argv && argv.opts && id in argv.opts && Array.isArray( argv.opts[id] ) )
			? Object.values( argv.opts[id] )
			: avaliableKeys

		return this.utils.getKeys( {
			input   : avaliableKeys,
			pattern : keys,
		} )

	}

}
