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
	promptLine,
	promptLineGroup,
	// line,
} from '@dovenv/utils'

import * as consts      from './const'
import { CommandStyle } from './style'

import type { ArgvParsed } from './types'

// se tiene que definir aqui para que acepte instaceof luego
const ErroClass = class CommandError extends TypedError {}

export class CommandSuper {

	protected log
	protected prompt      : typeof promptLine  = promptLine
	protected promptGroup : typeof promptLineGroup  = promptLineGroup
	protected performance  = performance
	protected spinner  = spinner
	protected process = process
	protected style  = new CommandStyle()

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

	protected onCancel = async () => {

		this.prompt.log.step( '' )
		this.prompt.cancel( 'Process cancelled 💔' )

		process.exit( 0 )

	}

}

export class Command extends CommandSuper {

	Error = ErroClass
	catchError = catchError
	title = 'Core'
	description = ''
	schema : unknown = validate.unknown()
	protected consts = consts

	protected setTitle( ) {

		console.log( `\n${this.style.get.title( this.title )} ${this.style.get.desc( this.description )}\n` )

	}

	protected setMainTitle( title: string, desc?: string ) {

		const text = `${this.style.get.title( title )}${this.style.get.desc( desc ? '\n\n' + desc : '' )}`
		console.log( `\n${this.style.get.bold( text )}\n` )

	}

	protected setTime( time: string ) {

		console.log( `\n${this.style.get.title( this.title )} ${this.style.get.desc( `Done in ${time}` )}\n` )

	}

	protected setSection( section: string ) {

		console.log( `${this.style.get.section( section )}\n` )

	}

	protected setContentString( key: string, desc?: string, c: 'cyan' | 'green' | 'yellow' | 'red' = 'cyan' ) {

		const title = this.style.color[c]( `${key}` ) + ( desc ? ( ': ' + desc ) : '' )

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
