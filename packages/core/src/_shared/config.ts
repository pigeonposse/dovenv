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
} from '@dovenv/utils'

import { CONFIG_EXTS } from './const'

import type { ObjectValues } from '@dovenv/utils'

const TITLE_ERROR = `${icon.cross} Configuration:`
const ERROR       = {
	NO_ROUTE          : 'NO_ROUTE',
	NO_DEFAULT_ROUTE  : 'NO_DEFAULT_ROUTE',
	CONFIG_FILE_ERROR : 'JS_FILE_ERROR',
	UNEXPECTED_ERROR  : 'UNEXPECTED_ERROR',
} as const

class ErrorConfig extends TypedError<ObjectValues<typeof ERROR>, { data: string }> {}

const pathsNames = [ 'dovenv/main', 'dovenv.config' ]
const root       = process.cwd()
const exts       = CONFIG_EXTS

const paths = pathsNames
	.flatMap( name => exts.flatMap( ext => [ `.${name}.${ext}`, `${name}.${ext}` ] ) )
	.sort( a => a.startsWith( '.'  ) ? -1 : 1 )
	.map( file => joinPath( root, file ) )

const errorInfo = `  ${icon.dot} You can create a configuration file in the following paths and it will be automatically detected: 

${[ ...pathsNames.map( p => `.${p}` ), ...pathsNames ].map( p => `    ${icon.dot} ${color.dim.italic( p.replace( root, '.' ) + `.{${exts.join( ',' )}}` )}` ).join( '\n' )}

  ${icon.dot} Or use a custom route with: ${color.dim.italic( '$0 --config <config-path>' )}
  
  ${icon.dot} For more information, see: ${color.underline.dim.italic( 'https://github.com/dovenv/dovenv' )}
	`
const getValidatedConf = async ( path: string ) => {

	path        = resolvePath( path )
	const exist = await existsPath( path )
	if ( !exist ) throw new ErrorConfig( ERROR.NO_ROUTE, { data: `The configuration path [${path}] does not exist\n\n${errorInfo}` } )

	const [ error, config ] = await catchError( getObjectFromJSFile( path ) )
	if ( error ) throw new ErrorConfig( ERROR.CONFIG_FILE_ERROR, { data: `${error.message}\n\n${errorInfo}` } )

	return {
		config : config,
		path   : path,
	}

}

const getDefaultConf = async () => {

	const errors = []

	for ( const path of paths ) {

		const [ e, res ] = await catchError( getValidatedConf( path ) )

		if ( !e ) return res
		else if ( e instanceof ErrorConfig && e.message === ERROR.CONFIG_FILE_ERROR ) errors.push( e )
		else if ( !( e instanceof ErrorConfig ) ) errors.push( e )

	}

	if ( errors.length ) throw errors[0]
	else
		throw new ErrorConfig( ERROR.NO_DEFAULT_ROUTE, { data: `Configuration path not found or not provided.\n\n${errorInfo}` } )

}

export const getConfig = async ( path?: string ) => {

	try {

		if ( !path ) return await getDefaultConf()

		path = resolvePath( path )

		return await getValidatedConf( path )

	}
	catch ( e ) {

		const set = ( msg: string ) => new Error( `${TITLE_ERROR}\n\n  ${msg}` )
		if ( e instanceof ErrorConfig ) throw set( e.data?.data || e.message || 'Unexpected error' )
		else if ( e instanceof Error )	throw set( e.message || 'Unexpected error' )
		throw set( 'Unexpected error' )

	}

}
