
import { joinUrl } from '@dovenv/core/utils'

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

export const getUrlConf = ( url?: string, name?: string, lang?: string, desc?: string, _styles?: DocsConfig['styles'] ): DocsConfig => ( {
	url,
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
} )

export const fixedDefConf: Omit<RequiredDocsConfig, 'styles'> = {
	input         : './docs',
	output        : './build',
	logo          : '/logo.png',
	favicon       : '/favicon.png',
	name          : 'DOVENV',
	desc          : 'Workspace documentation',
	license       : { type: 'MIT' },
	docsPath      : 'docs',
	lang          : 'en',
	titleTemplate : ( {
		title, name,
	} ) => `${title} | ${name}`,
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

	return mergeConfig(
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
