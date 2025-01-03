import {
	color,
	existsPath,
	isAbsolutePath,
	joinPath,
} from '@dovenv/core/utils'

import { mergeConfig } from './_utils'
import {
	fixedDefConf,
	getDefaultConf,
} from './default'
import { getStylesConfig } from './styles'

import type {
	DocsConfig,
	RequiredDocsConfig,
} from './types'

export const setConfig = async ( {
	root, fnConfig, pathConfig, packageConfig,
}:{
	root           : string
	fnConfig?      : DocsConfig
	/** configuration in init process. Usefull for update data */
	initConfig?    : DocsConfig
	pathConfig?    : DocsConfig
	packageConfig? : DocsConfig
} ): Promise<{
	config  : RequiredDocsConfig
	default : RequiredDocsConfig
	srcDir  : string
	outDir  : string
}> => {

	// the order is important
	const initConf = mergeConfig(
		fixedDefConf,
		packageConfig || {},
		pathConfig || {},
		fnConfig || {},
	)
	// console.log( {
	// 	fixedDefConf,
	// 	packageConfig,
	// 	pathConfig,
	// 	fnConfig,
	// } )
	const styledConf  = await getStylesConfig( initConf, initConf.input, initConf.logo )
	const defaultConf = await getDefaultConf( styledConf )

	const conf = await mergeConfig( defaultConf, styledConf ) as RequiredDocsConfig

	const srcDir    = isAbsolutePath( conf.input ) ? conf.input : joinPath( root, conf.input )
	const outDir    = isAbsolutePath( conf.output ) ? conf.output : joinPath( root, conf.output )
	const existDocs = await existsPath( srcDir )
	if ( !existDocs ) {

		console.error( color.red( `Docs path not found in ${srcDir}\n` ) )
		process.exit( 1 )

	}
	if ( conf.contributors ) {

		const seenNames   = new Set<string>()
		conf.contributors = conf.contributors.filter( item => {

			if ( item.name && !seenNames.has( item.name ) ) {

				seenNames.add( item.name )
				return true

			}
			return false

		} )

	}
	return {
		config  : conf,
		default : defaultConf,
		srcDir,
		outDir,
	}

}
