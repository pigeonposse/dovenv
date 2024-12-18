import {
	TypedError,
	catchError,
	validate,
} from '@dovenv/utils'

import { CommandSuper } from './_super'
import * as consts      from './const'

import type { ArgvParsed }      from './types'
import type { ValidateAnyType } from '@dovenv/utils'

// se tiene que definir aqui para que acepte instaceof luego
const ErroClass = class CommandError extends TypedError {}

export class Command<Opts = undefined> extends CommandSuper<Opts> {

	Error = ErroClass
	catchError = catchError
	title = 'Core'
	description = ''
	schema : ValidateAnyType = validate.unknown()
	protected consts = consts

	protected setMainTitle( title: string, desc?: string ) {

		console.log( `\n${this.style.main.h1( title )}${desc ? '\n\n' + this.style.main.p( desc ) : ''}\n` )

	}

	protected setTitle( ) {

		console.log( `\n${this.style.section.h1( this.title )} ${this.style.section.p( this.description )}\n` )

	}

	protected setTime( time: string ) {

		console.log( `\n${this.style.section.h1( this.title )} ${this.style.section.p( `Done in ${time}` )}\n` )

	}

	// @ts-ignore
	protected async validateSchema<D = unknown>( data: D ): Promise<D> {

		return await super.validateSchema<D>( this.schema, data, { showValid: true } )

	}

	protected getKeysFromArgv( avaliableKeys: string[], argv?: ArgvParsed ) {

		const id             = this.consts.OPTIONS.KEY.key
		const keys: string[] = ( argv && argv.opts && id in argv.opts && Array.isArray( argv.opts[id] ) )
			? Object.values( argv.opts[id] )
			: avaliableKeys

		return this.getKeys( {
			values  : avaliableKeys,
			pattern : keys,
		} )

	}

}
