/* eslint-disable camelcase */
import {
	existsPath,
	joinPath,
} from '@dovenv/core/utils'
import {
	createAppleSplashScreens,
	minimal2023Preset,
} from '@vite-pwa/assets-generator/config'
import { PwaOptions } from '@vite-pwa/vitepress'

import {
	DocsData,
	RequiredDocsConfig,
} from '../../config/types'

export const setPWA = async ( conf: RequiredDocsConfig, data: DocsData ):Promise<PwaOptions | undefined> => {

	if ( !conf || !data ) {

		console.warn( 'PWA error: no config or data found\n' )
		return undefined

	}

	if ( conf.pwa === false ) return undefined

	const image     = conf.pwa?.pwaAssets?.image || 'public/logo.png'
	const imagePath = joinPath( data.srcDir, image )
	// const imageRelative = relativePath( data.srcDir, imageDir )

	console.debug( [
		'PWA',
		{
			out : data.outDir,
			src : data.srcDir,
			imagePath,
			image,
		},
	] )
	const exists = await existsPath( imagePath )

	if ( !exists ) {

		console.warn( `Disable PWA, because image [${imagePath}] does not exists\n` )
		return undefined

	}

	return {
		pwaAssets : {
			image  : image,
			preset : {
				...minimal2023Preset,
				appleSplashScreens : createAppleSplashScreens( {
					padding       : 0.3,
					resizeOptions : {
						fit        : 'contain',
						background : 'white',
					},
					darkResizeOptions : {
						fit        : 'contain',
						background : 'black',
					},
					linkMediaOptions : {
						log            : true,
						addMediaScreen : true,
						xhtml          : true,
					},
				}, [ 'iPad Air 9.7"' ] ),
			},
		},
		// mode           : 'development',
		injectRegister : 'script-defer',
		registerType   : 'autoUpdate',
		workbox        : { globPatterns: [ '**/*.{css,js,html,svg,png,ico,txt,woff2}' ] },
		injectManifest : { globPatterns: [ '**/*.{js,css,ico,png,svg,webp,woff,woff2}' ] },

		// experimental : { includeAllowlist: true },
		devOptions : {
			enabled          : true,
			suppressWarnings : true,
			navigateFallback : '/',
		},
		manifest : {
			description      : conf.desc,
			name             : conf.name,
			short_name       : conf.name,
			start_url        : '/?source=pwa',
			theme_color      : conf.styles?.color?.primary,
			background_color : conf.styles?.color?.dark?.bg,
		},
		outDir : data.outDir,
		// srcDir : data.srcDir,
	}

}
