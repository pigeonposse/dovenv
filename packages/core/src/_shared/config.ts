import {
	existsPath,
	resolvePath,
	getObjectFromJSFile,
	joinPath,
	process,
	catchError,
	icon,
	color,
	TypedError,
	box,
	indent,
} from '@dovenv/utils'

import {
	CONFIG_EXTS,
	HELP_URL,
} from './const'

import type { ObjectValues } from '@dovenv/utils'

const TITLE_ERROR = color.inverse( ` ${icon.cross} Configuration Error ` )
const ERROR       = {
	NO_ROUTE          : 'NO_ROUTE',
	NO_DEFAULT_ROUTE  : 'NO_DEFAULT_ROUTE',
	CONFIG_FILE_ERROR : 'JS_FILE_ERROR',
	UNEXPECTED_ERROR  : 'UNEXPECTED_ERROR',
} as const

class ErrorConfig extends TypedError<ObjectValues<typeof ERROR>, { data: string }> {}

const pathsNames = [
	'dovenv/main',
	'dovenv/index',
	'dovenv.config',
]
const root       = process.cwd()
const exts       = CONFIG_EXTS

const paths = pathsNames
	.flatMap( name => exts.flatMap( ext => [ `.${name}.${ext}`, `${name}.${ext}` ] ) )
	.sort( a => a.startsWith( '.' ) ? -1 : 1 )
	.map( file => joinPath( root, file ) )

const boxProps  = {
	dimBorder   : true,
	padding     : 1,
	borderStyle : {
		bottom      : icon.line,
		top         : icon.line,
		left        : '',
		right       : '',
		bottomRight : icon.line,
		topRight    : icon.line,
		bottomLeft  : icon.line,
		topLeft     : icon.line,
	},
}
const erroStack = ( err: Error ) => {

	let res = ''

	if ( err.cause ) res += `\n${box( color.dim.italic( err.cause.toString() ), {
		title : 'Cause',
		...boxProps,
	} )}`

	res += `\n${box( color.dim.italic( err.stack ), {
		title : 'Details',
		...boxProps,
	} )}\n`

	return res

}
const errorInfoMore       = `${icon.dot} For more information, see: ${color.underline.dim.italic( HELP_URL )}`
const errorInfoConfigPath = `${icon.dot} Or use a custom route with: ${color.dim.italic( '$0 --config <config-path>' )}`
const errorInfo           = box( `${icon.dot} You can create a configuration file in the following paths and it will be automatically detected: 

${[ ...pathsNames.map( p => `.${p}` ), ...pathsNames ].map( p => indent( `${icon.dot} ${color.dim.italic( p.replace( root, '.' ) + `.{${exts.join( ',' )}}` )}` ) ).join( '\n' )}

${errorInfoConfigPath}`, {
	title : 'Info',
	...boxProps,
} ) + '\n'

const getValidatedConf = async ( path: string ) => {

	path             = resolvePath( path )
	const exist      = await existsPath( path )
	const errorTilte = `The configuration path [${path}] does not exist`

	if ( !exist ) throw new ErrorConfig( ERROR.NO_ROUTE, { data: `${color.bold( errorTilte )}\n\n${errorInfo}\n${errorInfoMore}` } )

	const [ error, config ] = await catchError( getObjectFromJSFile( path ) )
	if ( error ) throw new ErrorConfig( ERROR.CONFIG_FILE_ERROR, { data: `${error.message.trim()}\n${error.stack ? erroStack( error ) : ''}\n${errorInfoMore}` } )

	return {
		config : config,
		path   : path,
	}

}

const getDefaultConf = async () => {

	const errors     = []
	const errorTilte = 'Configuration path not found or not provided.'

	for ( const path of paths ) {

		const [ e, res ] = await catchError( getValidatedConf( path ) )

		if ( !e ) return res
		else if ( e instanceof ErrorConfig && e.message === ERROR.CONFIG_FILE_ERROR ) errors.push( e )
		else if ( !( e instanceof ErrorConfig ) ) errors.push( e )

	}

	if ( errors.length ) throw errors[0]
	else
		throw new ErrorConfig( ERROR.NO_DEFAULT_ROUTE, { data: `${color.bold( errorTilte )}\n\n${errorInfo}` } )

}

export const getConfig = async ( path?: string ) => {

	try {

		if ( !path ) return await getDefaultConf()

		path = resolvePath( path )

		return await getValidatedConf( path )

	}
	catch ( e ) {

		const set = ( msg: string ) => new Error( `${TITLE_ERROR}\n\n${msg}` )
		if ( e instanceof ErrorConfig ) throw set( e.data?.data || e.message || 'Unexpected error' )
		else if ( e instanceof Error )	throw set( e.message || 'Unexpected error' )
		throw set( 'Unexpected error' )

	}

}
