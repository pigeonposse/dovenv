import {
	existsPath,
	resolvePath,
	getObjectFromJSFile,
	joinPath,
	process,
	catchError,
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

	throw new Error( 'Configuration route has not been provided.' )

}

export const getConfig = async ( path?: string ) => {

	try {

		if ( !path ) return await getDefaultConf()

		path = resolvePath( path )

		return await getValidatedConf( path )

	}
	catch ( error ) {

		//@ts-ignore
		console.error( error.message )

		process.exit( 0 )

	}

}
