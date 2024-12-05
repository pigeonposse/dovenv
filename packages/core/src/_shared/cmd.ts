import {
	TypedError,
	catchError,
	process,
	logger,
	performance,
	spinner,
	validate,
	icon,
	getBooleanFlagValue,
	getMatch,
	formatValidationError,
	promptLineProps,
	// line,
} from '@dovenv/utils'

import * as consts      from './const'
import { CommandStyle } from './style'

import type { ArgvParsed } from './types'

// se tiene que definir aqui para que acepte instaceof luego
const ErroClass = class CommandError extends TypedError {}

export class CommandSuper {

	log
	prompt : typeof promptLineProps = promptLineProps
	performance  = performance
	spinner  = spinner
	style  = new CommandStyle()
	title = ''

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
		const copy                     = this.log.options.reporters
		this.log.options.reporters     = [
			{ log : ( logObj, ctx ) => {

				if ( logObj.type === 'debug' ) this.style.onDebug( ...logObj.args )
				else copy[0].log( logObj, ctx )

			} },
		]

		if ( getBooleanFlagValue( consts.GLOBAL_OPTIONS.VERBOSE.key ) )
			this.log.options.level = +999

	}

}

export class Command extends CommandSuper {

	Error = ErroClass
	catchError = catchError
	process = process
	title = 'Core'
	description = ''
	schema : unknown = validate.unknown()
	protected consts = consts

	protected setTitle( ) {

		const { color } = this.style

		console.log( `\n${color.cyanBright.bold( icon.triangleRightSmall )} ${color.bgCyanBright( ' ' + this.title + ' ' )} ${color.gray.dim( this.description )}\n` )

	}

	protected setTime( time: string ) {

		const { color } = this.style
		console.log( `\n${color.cyanBright.bold( icon.triangleRightSmall )} ${color.bgCyanBright( ' ' + this.title + ' ' )} ${color.gray.dim( `Done in ${time}` )}\n` )

	}

	protected setSection( section: string ) {

		const { color } = this.style
		console.log( `${color.cyanBright.bold( icon.triangleRightSmall )} ${color.cyanBright( section )}\n` )

	}

	protected setContentString( key: string, desc?: string, c: 'cyan' | 'green' | 'yellow' | 'red' = 'cyan' ) {

		const { color } = this.style
		const title     = color[c]( `${key}` ) + ( desc ? ( ': ' + desc ) : '' )

		return title

	}

	protected validateSchema<Schema>( data: unknown ): Schema {

		const { color } = this.style
		try {

			// @ts-ignore
			return this.schema.parse( data ) as Schema

		}
		catch ( error ) {

			console.error( color.red( `Configuration has invalid Schema` ) )
			console.log( color.red(  icon.cross + ' ' ) + color.red.dim( formatValidationError( error ) ) )
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

		const { color }      = this.style
		const id             = this.consts.OPTIONS.KEY.key
		const keys: string[] = ( argv && argv.opts && id in argv.opts && Array.isArray( argv.opts[id] ) )
			? Object.values( argv.opts[id] )
			: avaliableKeys
		const res            = this.getKeys( avaliableKeys, keys )
		if ( !res ) this.log.warn( `The key provided does not exist. Available keys: ${color.italic.dim( avaliableKeys.join( ', ' ) )}` )
		return res

	}

}
