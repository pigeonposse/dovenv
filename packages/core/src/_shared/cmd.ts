import {
	TypedError,
	catchError,
	process,
	logger,
	performance,
	spinner,
	color,
	validate,
	icon,
	getBooleanFlagValue,
	getMatch,
	// line,
} from '@dovenv/utils'

import type { ArgvParsed } from './types'

// se tiene que definir aqui para que acepte instaceof luego
const ErroClass = class CommandError extends TypedError {}

export class Command {

	log
	performance               = performance
	spinner                   = spinner
	Error = ErroClass
	catchError = catchError
	process = process
	title = 'Core'
	description = ''
	schema : unknown = validate.unknown()

	constructor() {

		this.log = logger
		this.log.wrapConsole()
		this.log.withTag( this.title )
		this.log.options.formatOptions = {
			columns : 80,
			colors  : false,
			compact : false,
			date    : false,
		}

		if ( getBooleanFlagValue( 'verbose' ) )
			this.log.options.level = +999

	}

	protected setTitle( ) {

		// console.log( `\n${line( {
		// 	title    : color.bgCyanBright( ' ' + this.title + ' ' ),
		// 	lineChar : color.cyanBright( icon.line ),
		// } )}\n` )

		console.log( `\n${color.cyanBright.bold( icon.triangleRightSmall )} ${color.bgCyanBright( ' ' + this.title + ' ' )} ${color.gray.dim( this.description )}\n` )

	}

	protected setTime( time: string ) {

		console.log( `\n${color.cyanBright.bold( icon.triangleRightSmall )} ${color.bgCyanBright( ' ' + this.title + ' ' )} ${color.gray.dim( `Done in ${time}` )}\n` )

	}

	protected setSection( section: string ) {

		console.log( `${color.cyanBright.bold( icon.triangleRightSmall )} ${color.cyanBright( section )}\n` )

	}

	protected setContentString( key: string, desc?: string, c: 'cyan' | 'green' | 'yellow' | 'red' = 'cyan' ) {

		const title = color[c]( `${key}` ) + ( desc ? ( ': ' + desc ) : '' )

		return title

	}

	protected validateSchema<Schema>( data: unknown ): Schema {

		try {

			// @ts-ignore
			return this.schema.parse( data ) as Schema

		}
		catch ( error ) {

			// @ts-ignore
			console.error( `Config [${this.title}] has invalid Schema. Details: ${error.message}` )
			return this.process.exit()

		}

	}

	protected getKeys( avaliableKeys: string[], userkeyPattern?:  string[] ) {

		const keys: string[] = userkeyPattern ? userkeyPattern : avaliableKeys

		const userKeys = getMatch( avaliableKeys, keys )
		if ( !userKeys.length ) return undefined
		return userKeys

	}

	protected getKeysFromArgv( avaliableKeys: string[], argv?: ArgvParsed ) {

		const keys: string[] = ( argv && argv.opts && 'key' in argv.opts && Array.isArray( argv.opts.key ) )
			? Object.values( argv.opts.key )
			: avaliableKeys
		const res            = this.getKeys( avaliableKeys, keys )
		if ( !res ) this.log.warn( `The key provided does not exist. Available keys: ${color.italic.dim( avaliableKeys.join( ', ' ) )}` )
		return res

	}

}
