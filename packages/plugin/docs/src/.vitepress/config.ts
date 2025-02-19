
/**
 * Vitepress config.
 * @description Vitepress config.
 * @see https://vitepress.dev/reference/site-config
 * @see https://vitepress.dev/reference/default-theme-config
 */

import {
	joinUrl,
	joinPath,
	getCurrentDir,
} from '@dovenv/core/utils'
import { withPwa }     from '@vite-pwa/vitepress'
import { mergeConfig } from 'vitepress'

import { markdown } from './md'
import { setNav }   from './nav/main'
import { vite }     from './vite'
import { Config }   from '../config/main'

const donateSVG = '<svg class="svg-donate" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>'

export const VITEPRESS_DIR = joinPath( getCurrentDir( import.meta.url ), '..' ) // MUST BE PARENT OF .vitepress folder

export default async () => {

	const configInstance = new Config()
	const {
		data,
		config: conf,
	} = await configInstance.updateGlobals()

	const config = await withPwa( {
		title         : conf.shortDesc ? `${conf.name} - ${conf.shortDesc}` : conf.name,
		titleTemplate : `:title - Documentation`,
		description   : conf.desc,
		lang          : conf.lang,
		markdown      : markdown( {
			data,
			config : conf,
		} ),
		vite : vite( {
			data,
			config : conf,
		} ),
		cacheDir  : data.cacheDir, // Default: ./.vitepress/cache
		outDir    : data.outDir,   // Default: ./.vitepress/dist. The build output location for the site, relative to project root.
		srcDir    : data.srcDir,   // Default: . .The directory where your markdown pages are stored, relative to project root. Also see Root and Source Directory.
		cleanUrls : true,
		pwa       : conf.pwa ? conf.pwa : undefined,
		// ignoreDeadLinks : true,
		head      : [
			[
				'style',
				{
					type : 'text/css',
					id   : conf.name + '-user-css',
				},
				conf.css || '',
			],
			[
				'style',
				{
					type : 'text/css',
					id   : conf.name + 'theme-css',
				},
				`
:root {
    --pp-brand-1: ${conf.styles.color.primary};
    --pp-brand-2: ${conf.styles.color.secondary};
	--pp-brand-3: ${conf.styles.color.terciary};
    --pp-brand-4: ${conf.styles.color.fourth};
    --vp-c-text-1: ${conf.styles.color.light.text};
    --vp-c-text-2: ${conf.styles.color.light.text2};
    --vp-c-text-3:${conf.styles.color.light.text3};
	--vp-c-bg: ${conf.styles.color.light.bg};
	--vp-c-bg-alt: ${conf.styles.color.light.bgAlt};
	--vp-c-bg-elv: ${conf.styles.color.light.bgSoft};
	--vp-c-bg-soft: ${conf.styles.color.light.bgSoft};
	--vp-c-bg-opacity: ${conf.styles.color.light.bgOpacity};
	--vp-c-divider: ${conf.styles.color.light.divider};
	--pp-brand-shadow: ${conf.styles.color.light.shadow};
	--pp-radius: ${conf.styles.radius};
    --vp-c-brand-1: var(--pp-brand-2);
    --vp-c-brand-2: var(--pp-brand-1);
    --vp-c-brand-3: var(--pp-brand-3);
	--vp-sidebar-bg-color: var(--vp-c-bg);
    --vp-home-hero-name-color: transparent;
    --vp-home-hero-name-background: -webkit-linear-gradient(150deg, var(--pp-brand-2), var(--pp-brand-4), var(--pp-brand-3), var(--pp-brand-1) );
    --vp-home-hero-image-background-image: linear-gradient(150deg, var(--pp-brand-2), var(--pp-brand-4), var(--pp-brand-3), var(--pp-brand-1));
    --vp-home-hero-image-filter: blur(56px);
}
.dark {
    --vp-c-text-1: ${conf.styles.color.dark.text};
    --vp-c-text-2: ${conf.styles.color.dark.text2};
    --vp-c-text-3:${conf.styles.color.dark.text3};
	--vp-c-bg: ${conf.styles.color.dark.bg};
	--vp-c-bg-alt: ${conf.styles.color.dark.bgAlt};
	--vp-c-bg-elv: ${conf.styles.color.dark.bgSoft};
	--vp-c-bg-soft: ${conf.styles.color.dark.bgSoft};
	--vp-c-bg-opacity: ${conf.styles.color.dark.bgOpacity};
	--vp-c-divider: ${conf.styles.color.dark.divider};
	--pp-brand-shadow: ${conf.styles.color.dark.shadow};
}
		`,
			],
			[
				'link',
				{
					rel  : 'icon',
					href : conf.favicon, // use first "/" for child routes
				},
			],
			[
				'meta',
				{
					property : 'og:type',
					content  : 'website',
				},
			],
			[
				'meta',
				{
					property : 'og:title',
					content  : conf.og?.title || conf.name,
				},
			],
			[
				'meta',
				{
					property : 'og:image',
					content  : conf.og?.image || '',
				},
			],
			[
				'meta',
				{
					property : 'og:url',
					content  : conf.og?.url || '',
				},
			],
			[
				'meta',
				{
					property : 'og:description',
					content  : conf.og?.description || conf.desc,
				},
			],
			[
				'meta',
				{
					property : 'og:site_name',
					content  : conf.og?.siteName || conf.name,
				},
			],
			[
				'meta',
				{
					name    : 'twitter:card',
					content : 'summary_large_image',
				},
			],
			[
				'meta',
				{
					name    : 'twitter:site',
					content : conf.og?.twitterAccount || '',
				},
			],
		],
		themeConfig : {
			logo        : conf.logo,
			siteTitle   : conf.name.toUpperCase(),
			search      : { provider: 'local' },
			editLink    : conf.repoURL ? { pattern: joinUrl( conf.repoURL, 'edit', 'main', conf.docsPath, '/:path' )  } : undefined,
			outline     : 'deep',
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
	} )

	return conf.vitepress
		// @ts-ignore
		? mergeConfig( config, conf.vitepress )
		: config

}

