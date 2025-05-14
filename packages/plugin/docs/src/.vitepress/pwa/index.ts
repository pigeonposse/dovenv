/* eslint-disable camelcase */
import {
	existsPath,
	joinPath,
	relativePath,
	deepmergeCustom,
} from '@dovenv/core/utils'
import {
	createAppleSplashScreens,
	minimal2023Preset,
} from '@vite-pwa/assets-generator/config'
import {
	VitePluginPWAAPI,
	VitePWA,
} from 'vite-plugin-pwa'

import { ConfigResponse } from '../../config/types'

import type { PwaOptions } from './types'
import type { UserConfig } from 'vitepress'

const merge = deepmergeCustom<PwaOptions>( {} )
/**
 * Configuration for auto PWA assets generation.
 *
 * **Requires**: `@vite-pwa/assets-generator`.
 *
 * @type {PwaOptions['pwaAssets']}
 * @example
 * const docsConfig = {
 *  pwa: {
 *    pwaAssets: autoPWAConfig
 *  }
 * }
 */
export const autoPWAConfig: PwaOptions['pwaAssets'] = {
	image                 : 'public/logo.png',
	overrideManifestIcons : true,
	includeHtmlHeadLinks  : true,
	preset                : {
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
}

export const getPWAConfig = async ( opts: ConfigResponse ):Promise<PwaOptions | undefined> => {

	const {
		config: conf,
		data,
	} = opts

	if ( !conf || !data ) {

		console.warn( 'PWA error: no config or data found\n' )
		return undefined

	}

	if ( conf.pwa === false ) return undefined

	const image     = conf.pwa?.pwaAssets?.image || 'public/logo.png'
	const imagePath = joinPath( data.srcDir, image )
	// const imageRelative = relativePath( data.srcDir, imageDir )

	console.debug( [
		'PWA [paths]',
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

	let res: PwaOptions = {
		pwaAssets : {
			...autoPWAConfig,
			image,
			integration : {
				baseUrl   : '/',
				publicDir : joinPath( data.srcDir, 'public' ),
				outDir    : data.outDir,
			},
		},
		mode           : 'development',
		injectRegister : 'script-defer',
		registerType   : 'autoUpdate',
		strategies     : 'generateSW',
		workbox        : {
			globDirectory : relativePath( process.cwd(), data.srcDir ),
			globPatterns  : [ '**/*.{css,js,html,svg,png,ico,txt,woff2}' ],
			swDest        : joinPath( data.outDir, 'sw.js' ),
		},
		// experimental : { includeAllowlist: true },
		devOptions : {
			enabled          : true,
			// suppressWarnings : true,
			navigateFallback : '/',
		},
		manifest : {
			description      : conf.desc,
			name             : conf.name,
			short_name       : conf.name,
			start_url        : '/?source=pwa',
			theme_color      : conf.styles?.color?.primary,
			background_color : conf.styles?.color?.dark?.bg,
			id               : data.devMode ? undefined : conf.url,
			display          : 'standalone',
		},
		outDir : relativePath( process.cwd(), data.outDir ),
		// srcDir : data.srcDir,
	}

	if ( conf.pwa ) res = merge( res, conf.pwa )
	console.debug( [ 'PWA [config]', res ] )

	return res

}

export const vitepressPluginPWA = async (
	opts : ConfigResponse,
): Promise<Pick<UserConfig, 'vite' | 'transformHead' | 'buildEnd'>> => {

	const {
		config, data,
	} = opts

	if ( config.pwa === false ) return {
		vite          : undefined,
		transformHead : undefined,
		buildEnd      : undefined,
	}

	let api: VitePluginPWAAPI | undefined

	/**
	 * version of https://github.com/vite-pwa/vitepress/blob/main/src/integration.ts
	 */
	return {
		vite : { plugins : [
			...VitePWA( await getPWAConfig( {
				config,
				data,
			} ) ),
			{
				name    : 'vite-plugin-pwa:vitepress',
				apply   : 'build',
				enforce : 'post',
				configResolved( resolvedViteConfig ) {

					if ( !resolvedViteConfig.build.ssr )
						api = resolvedViteConfig.plugins.find( p => p.name === 'vite-plugin-pwa' )?.api

				},
			},
			{
				name    : 'vite-plugin-pwa:pwa-assets:vitepress',
				apply   : 'serve',
				enforce : 'pre',
				configResolved( resolvedViteConfig ) {

					if ( !resolvedViteConfig.build.ssr )
						api = resolvedViteConfig.plugins.find( p => p.name === 'vite-plugin-pwa' )?.api

				},
				async handleHotUpdate( {
					file, server,
				} ) {

					const pwaAssetsGenerator = await api?.pwaAssetsGenerator()
					if ( await pwaAssetsGenerator?.checkHotUpdate( file ) )
						await server.restart()

				},
			},
		] },
		transformHead : async context => {

			const assetsGenerator = await api?.pwaAssetsGenerator()
			if ( assetsGenerator ) {

				const htmlAssets = assetsGenerator.resolveHtmlAssets()
				if ( htmlAssets.themeColor )
					context.head.push( [
						'meta',
						{
							name    : 'theme-color',
							content : htmlAssets.themeColor.content,
						},
					] )
				for ( const link of htmlAssets.links )
					context.head.push( [ 'link', { ...link } ] )

			}
			const webManifestData = api?.webManifestData()
			if ( webManifestData ) {

				const href = webManifestData.href
				if ( webManifestData.useCredentials )
					context.head.push( [
						'link',
						{
							rel         : 'manifest',
							href,
							crossorigin : 'use-credentials',
						},
					] )
				else
					context.head.push( [
						'link',
						{
							rel : 'manifest',
							href,
						},
					] )

			}
			const registerSWData = api?.registerSWData()
			if ( registerSWData && registerSWData.shouldRegisterSW ) {

				if ( registerSWData.mode === 'inline' ) {

					context.head.push( [
						'script',
						{ id: 'vite-plugin-pwa:inline-sw' },
						`if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('${registerSWData.inlinePath}', { scope: '${registerSWData.scope}' })})}`,
					] )

				}
				else {

					if ( registerSWData.mode === 'script-defer' ) {

						context.head.push( [
							'script',
							{
								id    : 'vite-plugin-pwa:register-sw',
								defer : 'defer',
								src   : registerSWData.registerPath,
							},
						] )

					}
					else {

						context.head.push( [
							'script',
							{
								id  : 'vite-plugin-pwa:register-sw',
								src : registerSWData.registerPath,
							},
						] )

					}

				}

			}

			return context.head

		},
		buildEnd : async _s => {

		},
	}

}
