/* eslint-disable camelcase */
import { joinUrl } from '@dovenv/utils'

import { mergeConfig } from './_utils'

import type {
	DocsConfig,
	RequiredDocsConfig,
} from './types'

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
			baseUrl     : url,
			copyright   : `Copyright (c) ${new Date().getFullYear()}-present, ${name}`,
			ignoreHome  : true,
		}
		: undefined,
	pwa : {
		registerType : 'autoUpdate',
		devOptions   : { enabled: true },
		manifest     : {
			description : desc,
			name        : name,
			short_name  : name,
			icons       : [
				{
					src   : 'favicon-192x192.png',
					sizes : '192x192',
					type  : 'image/png',
				},
				{
					src   : 'favicon-96x96.png',
					sizes : '96x96',
					type  : 'image/png',
				},
				{
					src   : 'favicon-32x32.png',
					sizes : '32x32',
					type  : 'image/png',
				},
			],
			theme_color : styles?.color?.primary,
		},
	},
} )

export const fixedDefConf: Omit<RequiredDocsConfig, 'styles'> = {
	in       : './docs',
	out      : './build',
	logo     : '/logo.png',
	favicon  : '/favicon.png',
	name     : 'DOVENV',
	desc     : 'Workspace documentation',
	license  : { type: 'MIT' },
	docsPath : 'docs',
	lang     : 'en',
}

type DefParams = {
	lang?    : DocsConfig['lang']
	name?    : DocsConfig['name']
	url?     : DocsConfig['url']
	repoURL? : DocsConfig['repoURL']
	desc?    : DocsConfig['desc']
	styles?  : DocsConfig['styles']
}

export const getDefaultConf = ( {
	desc,
	lang,
	name,
	url,
	repoURL,
	styles,
}: DefParams = {} ): RequiredDocsConfig => {

	return  mergeConfig(
		getRepoConf( repoURL ),
		getUrlConf( url, name, lang, desc, styles ),
		{
			name   : name,
			desc   : desc,
			styles : styles,
			lang,
		},
	) as RequiredDocsConfig

}
