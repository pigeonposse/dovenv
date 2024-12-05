import {
	deepmergeCustom,
	existsPath,
	joinPath,
	chroma,
	getPalette,
} from '@dovenv/core/utils'

import type {
	DocsConfig,
	RequiredDocsConfig,
} from './types'

type Styles = RequiredDocsConfig['styles']
type Colors = Styles['color']
type DynamicColors = Omit<Colors, 'dark' | 'light'>

const stylesDefault = {
	color : {
		primary   : '#e8243d',
		secondary : '#ee683a',
		terciary  : '#f49133',
		fourth    : '#461411',
		// dark      : {
		// 	text      : '#f7ede5db',
		// 	text2     : '#f5e8e299',
		// 	text3     : 'rgba(235, 235, 245, 0.38)',
		// 	bg        : '#0c0d0f',
		// 	bgAlt     : '#41414133',
		// 	bgSoft    : '#121216',
		// 	bgOpacity : '#0c0d0f82',
		// 	shadow    : '#f3b31d0d',
		// 	divider   : '#1a1a1c',
		// },
		// light : {
		// 	text      : 'rgb(67 60 60)',
		// 	text2     : 'rgba(60, 60, 67, 0.78)',
		// 	text3     : 'rgba(60, 60, 67, 0.56)',
		// 	bg        : '#ffffff',
		// 	bgAlt     : '#f6f6f7',
		// 	bgSoft    : '#fdf7f4',
		// 	bgOpacity : '#0c0d0f82',
		// 	shadow    : '#f3b31d0d',
		// 	divider   : '#fff3e3',
		// },
	},
	radius : '20px',
}
export const getStylesConfig = async ( config: DocsConfig, input: string, logoPath: string ): Promise<DocsConfig> => {

	const docsPublic = joinPath( input, 'public' )
	const logo       = joinPath( docsPublic, logoPath )
	const existLogo  = await existsPath( logo )

	if ( !config.styles ) config.styles = {}
	if ( !config.styles.color ) config.styles.color = {}

	let colors: DynamicColors

	if ( existLogo && !config.styles.color.primary ) {

		const palette = await getPalette( logo )

		colors = {
			primary   : palette?.Vibrant?.hex as string,
			secondary : palette?.LightVibrant?.hex as string,
			terciary  : palette?.DarkVibrant?.hex as string,
			fourth    : palette?.Muted?.hex as string,
		}

	}
	else if ( config.styles.color.primary ) {

		const baseColor = config.styles.color.primary

		colors = {
			primary   : chroma( baseColor ).hex(),
			secondary : chroma( baseColor ).darken( 2 ).hex(),
			terciary  : chroma( baseColor ).brighten( 2 ).hex(),
			fourth    : chroma( baseColor ).saturate( -2 ).hex(),
		}

	}
	else colors = {
		primary   : stylesDefault.color.primary,
		secondary : stylesDefault.color.secondary,
		terciary  : stylesDefault.color.terciary,
		fourth    : stylesDefault.color.fourth,
	}

	const themeColors: Colors = {
		...colors,
		dark : {
			text      : chroma( colors.primary ).brighten( 4 ).hex(),
			text2     : chroma( colors.primary ).brighten( 4 ).alpha( 0.8 ).hex(),
			text3     : chroma( colors.secondary ).brighten( 2 ).alpha( 0.8 ).hex(),
			bg        : chroma( colors.primary ).darken( 8 ).hex(),
			bgAlt     : chroma( colors.primary ).darken( 6 ).alpha( 0.8 ).hex(),
			bgSoft    : chroma( colors.secondary ).darken( 6 ).hex(),
			bgOpacity : chroma( colors.terciary ).darken( 6 ).alpha( 0.5 ).hex(),
			shadow    : chroma( colors.secondary ).brighten( 4 ).alpha( 0.05 ).hex(),
			divider   : chroma( colors.secondary ).brighten( 4 ).alpha( 0.1 ).hex(),
		},
		light : {
			text      : chroma( colors.primary ).darken( 4 ).hex(),
			text2     : chroma( colors.primary ).darken( 4 ).alpha( 0.8 ).hex(),
			text3     : chroma( colors.secondary ).darken( 2 ).alpha( 0.8 ).hex(),
			bg        : chroma( colors.primary ).brighten( 8 ).hex(),
			bgAlt     : chroma( colors.primary ).brighten( 6 ).alpha( 0.8 ).hex(),
			bgSoft    : chroma( colors.secondary ).brighten( 6 ).hex(),
			bgOpacity : chroma( colors.terciary ).brighten( 6 ).alpha( 0.5 ).hex(),
			shadow    : chroma( colors.secondary ).darken( 4 ).alpha( 0.05 ).hex(),
			divider   : chroma( colors.secondary ).darken( 4 ).alpha( 0.1 ).hex(),
		},
	}

	// override colors

	const res = deepmergeCustom<Styles>( {} )( {
		color  : themeColors,
		radius : stylesDefault.radius,
		// @ts-ignore
	}, config?.styles || {} )
	// @ts-ignore
	config.styles = res
	return config

}
