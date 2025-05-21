
/**
 * Vitepress config.
 *
 * @description Vitepress config.
 * @see https://vitepress.dev/reference/site-config
 * @see https://vitepress.dev/reference/default-theme-config
 */

import {
	joinUrl,
	joinPath,
	getCurrentDir,
} from '@dovenv/core/utils'
import { mergeConfig } from 'vitepress'
import { UserConfig }  from 'vitepress'

import { setHeadCss }          from './css'
import { markdown }            from './md'
import { vitepressMetaPlugin } from './meta'
import { setNav }              from './nav/main'
import { vite }                from './vite'
import { Config }              from '../config'
import { vitepressPluginPWA }  from './pwa'

const donateSVG = '<svg class="svg-donate" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>'

export const VITEPRESS_DIR = joinPath( getCurrentDir( import.meta.url ), '..' ) // MUST BE PARENT OF .vitepress folder

export default async () => {

	const configInstance = new Config()
	const configParans   = await configInstance.updateGlobals()

	const meta     = await vitepressMetaPlugin( configParans )
	const pwa      = await vitepressPluginPWA( configParans )
	const viteConf = await vite( configParans )

	const {
		data,
		config: conf,
	} = configParans

	let config: UserConfig = mergeConfig( {
		title         : conf.shortDesc ? `${conf.name} - ${conf.shortDesc}` : '',
		titleTemplate : conf.titleTemplate( {
			title : ':title',
			name  : conf.name,
		} ),
		description : conf.desc,
		lang        : conf.lang,
		markdown    : markdown( {
			data,
			config : conf,
		} ),
		cacheDir  : data.cacheDir, // Default: ./.vitepress/cache
		outDir    : data.outDir, // Default: ./.vitepress/dist. The build output location for the site, relative to project root.
		srcDir    : data.srcDir, // Default: . .The directory where your markdown pages are stored, relative to project root. Also see Root and Source Directory.
		cleanUrls : true,
		// ignoreDeadLinks : true,
		head      : [
			...setHeadCss( conf ),
			[
				'link',
				{
					rel  : 'icon',
					href : conf.favicon, // use first "/" for child routes
				},
			],
		],
		themeConfig : {
			logo        : conf.logo,
			siteTitle   : conf.name.toUpperCase(),
			search      : { provider: 'local' },
			editLink    : conf.repoURL ? { pattern: joinUrl( conf.repoURL, 'edit', 'main', conf.docsPath, '/:path' ) } : undefined,
			outline     : [ 2, 3 ],
			nav         : setNav( { conf } ),
			sidebar     : conf.sidebar,
			// @ts-ignore: for empty socialLinks
			socialLinks : [
				...( conf.navLinks ? conf.navLinks : [] ),
				...( conf.npmURL
					? [
						{
							icon : 'npm',
							link : conf.npmURL,
						},
					]
					: [] ),
				...( conf.repoURL
					? [
						{
							icon : 'github',
							link : conf.repoURL,
						},
					]
					: [] ),
				...( conf.fundingURL
					? [
						{
							icon : { svg: donateSVG },
							link : conf.fundingURL,
						},
					]
					: [] ),
			],
			// @ts-ignore
			collectiveLinks : conf.footer?.links,
			customFooter    : {
				license : conf.license,
				copy    : conf.footer?.copy,
			},
			contributors : conf.contributors,
			links        : conf.links,
		},
	}, viteConf )
	config                 = mergeConfig( config, meta )
	config                 = mergeConfig( config, pwa )

	if ( conf.vitepress ) config = mergeConfig( config, conf.vitepress )

	console.debug( { vitepressConfig: config } )

	return config

}

