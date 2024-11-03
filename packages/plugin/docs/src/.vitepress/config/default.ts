/* eslint-disable camelcase */
import { joinUrl } from '@dovenv/utils'

import {
	description,
	extra,
	repository,
	license,
	author,
	funding,
	bugs,
} from '../../../package.json'

import type { DocsConfig } from './types'

const name    = extra.productName
const docsUrl = extra.docsUrl
const lang    = 'en'

const styles = {
	color : {
		primary   : '#e8243d',
		secondary : '#ee683a',
		terciary  : '#f49133',
		fourth    : '#461411',
		dark      : {
			text      : '#f7ede5db',
			text2     : '#f5e8e299',
			text3     : 'rgba(235, 235, 245, 0.38)',
			bg        : '#0c0d0f',
			bgAlt     : '#41414133',
			bgSoft    : '#121216',
			bgOpacity : '#0c0d0f82',
			shadow    : '#f3b31d0d',
			divider   : '#1a1a1c',
		},
		light : {
			text      : 'rgb(67 60 60)',
			text2     : 'rgba(60, 60, 67, 0.78)',
			text3     : 'rgba(60, 60, 67, 0.56)',
			bg        : '#ffffff',
			bgAlt     : '#f6f6f7',
			bgSoft    : '#fdf7f4',
			bgOpacity : '#0c0d0f82',
			shadow    : '#f3b31d0d',
			divider   : '#fff3e3',
		},
	},
	radius : '20px',
}

export const defaultConf: DocsConfig = {
	in              : './docs',
	out             : './build',
	logo            : '/logo.png',
	favicon         : '/favicon.png',
	name            : name,
	desc            : description,
	shortDesc       : extra.shortDesc,
	version         : '',
	oldVersions     : [],
	contributingUrl : '',
	changelogUrl    : '',
	license         : {
		type : license,
		url  : joinUrl( repository.url, 'blob/main/LICENSE' ),
	},
	url        : docsUrl,
	repoUrl    : repository.url,
	fundingUrl : funding.url,
	bugsUrl    : bugs.url,
	moreUrl    : extra.collective.web,
	docsPath   : 'docs',
	npmUrl     : '',
	styles     : styles,
	lang,
	og         : {
		description,
		image          : joinUrl( docsUrl, 'banner.png' ),
		title          : name,
		url            : docsUrl,
		siteName       : extra.id,
		twitterAccount : '@' + extra.collective.socialUser.twitter,
	},
	rss : {
		title       : name,
		baseUrl     : docsUrl,
		copyright   : `Copyright (c) ${new Date().getFullYear()}-present, ${name}`,
		description : description,
		language    : lang,
		ignoreHome  : true,
		author,
	},
	pwa : {
		registerType : 'autoUpdate',
		devOptions   : { enabled: true },
		manifest     : {
			name        : name,
			short_name  : name,
			description : description,
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
			theme_color : styles.color.primary,
		},
	},
	footer : {
		links : {
			...extra.collective.social,
			web   : extra.collective.web,
			email : extra.collective.email,
		},
		copy : {
			name : extra.collective.name,
			url  : extra.collective.url,
		},
	},
	nav     : [],
	sidebar : {},
	css     : '',
	server  : {
		hotReloadFiles : [],
		restartFiles   : [],
	},
	download : {
		groups : undefined,
		items  : undefined,
	},
	links        : [],
	contributors : [],
	vitepress    : {},
}

