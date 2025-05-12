import {
	copyDir,
	existsPath,
	joinPath,
	removePathIfExist,
} from '@dovenv/core/utils'

import {
	DocsData,
	RequiredDocsConfig,
} from './types'

export const validateConfig = async ( {
	config, data,
}:{
	config : RequiredDocsConfig
	data   : DocsData
} ) => {

	if ( !config ) {

		console.error( 'Unexpected: DOVENV configuration not found' )
		return process.exit( 1 )

	}
	if ( !data ) {

		console.error( 'Unexpected: DOVENV data not found' )
		return process.exit( 1 )

	}

	if ( !data.devMode && !config?.experimental?.noTempDirOnBuild ) {

		console.debug( 'Copy dir to temp dir' )
		await copyDir( {
			input  : data.srcDir,
			output : data.tempDir,
		} )

		data.srcDir = data.tempDir
		process.on( 'exit', async () => {

			console.debug( 'Remove temp dir' )
			await removePathIfExist( data.tempDir )

		} )

	}

	const { srcDir } = data

	// LOGO & FAVICON CHECK
	if ( config.logo ) {

		const logoSrc = joinPath( srcDir, 'public', config.logo )
		console.debug( { logoSrc } )
		const exists = await existsPath( logoSrc )

		if ( !exists ) {

			console.warn( `Disable "logo" because it does not exist at path [${logoSrc}].` )
			// @ts-ignore
			conf.logo = conf.logo = undefined

		}

	}

	if ( config.favicon ) {

		const faviconSrc = joinPath( srcDir, 'public', config.favicon )
		console.debug( { faviconSrc } )
		const exists = await existsPath( faviconSrc )

		if ( !exists ) {

			console.warn( `Disable "favicon" because it does not exist at path [${faviconSrc}].` )

			if ( config.logo ) console.info( 'Changed the "favicon" path to the "logo" path because the "logo" path exists' )

			config.favicon = config.logo

		}

	}

	if ( config.favicon && !config.logo ) {

		console.info( 'Changed the "logo" path to the "favicon" path because the "favicon" path exists' )
		config.logo = config.favicon

	}
	return {
		data,
		config,
	}

}
