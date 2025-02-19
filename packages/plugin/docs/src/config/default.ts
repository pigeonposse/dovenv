/* eslint-disable camelcase */
import { joinUrl } from '@dovenv/core/utils'

import { mergeConfig } from './_utils'

import type {
	DocsConfig,
	RequiredDocsConfig,
} from './types'
import type { PwaOptions } from '@vite-pwa/vitepress'

/**
 * Configuration for auto PWA assets generation.
 *
 * **Requires**: `@vite-pwa/assets-generator`
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
}

export const getRepoConf = ( repoURL?: string ): DocsConfig => {

	const res = repoURL
		? {
			repoURL,
			contributingURL : joinUrl( repoURL, 'blob/main/CONTRIBUTING.md' ),
			changelogURL    : joinUrl( repoURL, 'blob/main/CHANGELOG.md' ),
			license         : { url: joinUrl( repoURL, 'blob/main/LICENSE' ) },
		}
		: {}
	return res

}

export const getUrlConf = ( url?: string, name?: string, lang?: string, desc?: string, styles?: DocsConfig['styles'] ): DocsConfig => ( {
	url,
	og : {
		image       : url ? joinUrl( url, 'banner.png' ) : '',
		title       : name,
		url         : url,
		siteName    : name,
		description : desc,
	},

	rss : url
		? {
			title       : name || '',
			language    : lang,
			description : desc,
			baseUrl     : url.endsWith( '/' ) ? url.slice( 0, -1 ) : url,
			copyright   : `Copyright (c) ${new Date().getFullYear()}-present, ${name}`,
			ignoreHome  : true,
		}
		: undefined,
	pwa : {
		mode           : 'development',
		injectRegister : 'script-defer',
		registerType   : 'autoUpdate',
		workbox        : { globPatterns: [ '**/*.{css,js,html,svg,png,ico,txt,woff2}' ] },
		experimental   : { includeAllowlist: true },
		devOptions     : {
			enabled          : true,
			suppressWarnings : true,
			navigateFallback : '/',
		},
		manifest : {
			description : desc,
			name        : name,
			short_name  : name,
			start_url   : '/?source=pwa',
			theme_color : styles?.color?.primary,
		},
	},
} )

export const fixedDefConf: Omit<RequiredDocsConfig, 'styles'> = {
	input    : './docs',
	output   : './build',
	logo     : '/logo.png',
	favicon  : '/favicon.png',
	name     : 'DOVENV',
	desc     : 'Workspace documentation',
	license  : { type: 'MIT' },
	docsPath : 'docs',
	lang     : 'en',
}

export const getDefaultConf = ( {
	desc,
	lang,
	name,
	url,
	repoURL,
	styles,
}: {
	lang?    : DocsConfig['lang']
	name?    : DocsConfig['name']
	url?     : DocsConfig['url']
	repoURL? : DocsConfig['repoURL']
	desc?    : DocsConfig['desc']
	styles?  : DocsConfig['styles']
} = {} ): RequiredDocsConfig => {

	return  mergeConfig(
		getRepoConf( repoURL || undefined ),
		getUrlConf( url, name, lang, desc, styles ),
		{
			name   : name,
			desc   : desc,
			styles : styles,
			lang,
		},
	) as RequiredDocsConfig

}
