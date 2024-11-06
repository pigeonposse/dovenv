import {
	existsPath,
	resolvePath,
	getObjectFromJSFile,
	joinPath,
	process,
	catchError,
	icon,
	color,
} from '@dovenv/utils'

const getValidatedConf = async ( path: string ) => {

	path        = resolvePath( path )
	const exist = await existsPath( path )
	if ( !exist ) throw new Error( `Configuration route [${path}] has not exist` )

	return await getObjectFromJSFile( path )

}

const getDefaultConf = async () => {

	const pathsNames = [ 'dovenv/main', 'dovenv.config' ]
	const paths      = pathsNames.flatMap( name =>
		[
			`.${name}.js`,
			`.${name}.mjs`,
			`${name}.js`,
			`${name}.mjs`,
		].map( ext => joinPath( process.cwd(), ext ) ),
	)
	for ( const path of paths ) {

		const [ e, res ] = await catchError( getValidatedConf( path ) )

		if ( !e ) return res

	}

	throw new Error( color.red( `${icon.cross} Configuration:

  Configuration path not found and not provided.
		
  ${icon.dot} You can create a configuration file in the following paths and it will be automatically detected: 

${paths.map( p => `    ${icon.dot} ${color.dim.italic( p )}` ).join( '\n' )}

  ${icon.dot} Or use a custom route with: ${color.dim.italic( '$0 --config <config-path>' )}
  
  ${icon.dot} For more information, see: ${color.underline.dim.italic( 'https://github.com/dovenv/dovenv' )}
` ) )

}

export const getConfig = async ( path?: string ) => {

	if ( !path ) return await getDefaultConf()

	path = resolvePath( path )

	return await getValidatedConf( path )

}
