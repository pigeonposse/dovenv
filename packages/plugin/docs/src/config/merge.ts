import {
	existsPath,
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
	pathConfig?    : DocsConfig
	packageConfig? : DocsConfig
} ): Promise<{
	config  : RequiredDocsConfig
	default : RequiredDocsConfig
}> => {

	// the order is important
	const initConf = mergeConfig(
		fixedDefConf,
		packageConfig || {},
		pathConfig || {},
		fnConfig || {},
	)

	const styledConf  = await getStylesConfig( initConf, initConf.in, initConf.logo )
	const defaultConf = await getDefaultConf( styledConf )
	// @ts-ignore
	const conf = await mergeConfig( defaultConf, styledConf ) as RequiredDocsConfig

	const docsPath  = joinPath( root, conf.in )
	const existDocs = await existsPath( docsPath )
	if ( !existDocs ) {

		console.error( `Docs path not found in ${docsPath}` )
		process.exit( 1 )

	}

	return {
		config  : conf,
		default : defaultConf,
	}

}
