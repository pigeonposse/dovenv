import {
	camel2Snake,
	deepmerge,
	existsFile,
	image2DataUri,
	joinPath,
	joinUrl,
	performance,
} from '@dovenv/core/utils'

import { createOGImage } from './og-image'
import {
	errorMark,
	okMark,
} from '../../_shared/utils'

import type { ConfigResponse } from '../../config/types'
import type { UserConfig }     from 'vitepress'

const bannerName = 'banner.png'
const ogName     = 'og.png'

type Conf = ConfigResponse['config']
type Meta = NonNullable<Conf['meta']>

const getHead = ( conf: Conf, imagepath?:string ): NonNullable<UserConfig['head']> => {

	try {

		const shared: Meta['shared'] = {
			image       : conf.meta?.shared?.image || ( conf.url ? joinUrl( conf.url, imagepath || bannerName ) : undefined ),
			title       : conf.meta?.shared?.title || conf.name,
			description : conf.meta?.shared?.description || conf.desc,
			url         : conf.meta?.shared?.url || conf.url,
		}

		const og: Meta['og']           = typeof conf.meta?.og === 'boolean'
			? false
			: {
				image       : conf.meta?.og?.image || shared.image,
				title       : conf.meta?.og?.title || shared.title,
				url         : conf.meta?.og?.url || shared.url,
				description : conf.meta?.og?.description || shared.description,
				type        : conf.meta?.og?.type || 'website',
				siteName    : conf.meta?.og?.siteName || conf.name,
			}
		const twitter: Meta['twitter'] = typeof conf.meta?.twitter === 'boolean'
			? false
			: {
				image       : conf.meta?.twitter?.image || shared.image,
				title       : conf.meta?.twitter?.title || shared.title,
				url         : conf.meta?.twitter?.url || shared.url,
				description : conf.meta?.twitter?.description || shared.description,
				card        : conf.meta?.twitter?.card || 'summary_large_image',
				domain      : conf.meta?.twitter?.domain || ( conf.url ? new URL( conf.url ).hostname : undefined ),
				site        : conf.meta?.twitter?.site || undefined,
				creator     : conf.meta?.twitter?.creator || undefined,
			}

		const custom = conf.meta?.custom ? conf.meta.custom : undefined

		return [
			...( !og
				? []
				: Object.entries( og )
					.map( ( [ key, value ] ) => ( value
						? [
							'meta',
							{
								property : `og:${camel2Snake( key )}`,
								content  : String( value ),
							},
						]
						: undefined ),
					)
					.filter( Boolean ) as NonNullable<UserConfig['head']>
			),
			...( !twitter
				? []
				: Object.entries( twitter )
					.map( ( [ key, value ] ) => ( !value
						? undefined
						: [
							'meta',
							{
								name    : `twitter:${camel2Snake( key )}`,
								content : String( value ),
							},
						] ),
					)
					.filter( Boolean ) as NonNullable<UserConfig['head']>
			),
			...( custom
				? custom.map( d => [ 'meta', d ] satisfies NonNullable<UserConfig['head']>[number] )
				: []
			),
		]

	}
	catch ( e ) {

		console.error( `${errorMark} Error getting meta:`, e instanceof Error ? e.message : e || 'Unknown error' )
		return []

	}

}
type MetaRes = Required<Pick<UserConfig, 'transformHead' | 'buildEnd' | 'head'>>
export const vitepressMetaPlugin = async (
	opts :ConfigResponse,
): Promise<MetaRes> => {

	const {
		config: conf,
		data,
	} = opts

	const existsBanner = async () => await existsFile( joinPath( data.srcDir, 'public', bannerName ) )
	const autoImage    = conf.meta?.autoImage === false ? false : ( conf.meta?.autoImage || !( await existsBanner() ) )
	const res: MetaRes = {
		head          : getHead( conf, autoImage ? ogName : undefined ),
		transformHead : async context => {

			try {

				const result = conf.meta?.onPage
					? await conf.meta.onPage( {
						context,
						config : conf,
					} )
					: undefined
				return result

			}
			catch ( e ) {

				console.error( `${errorMark} Error transforming meta:`, e instanceof Error ? e.message : e || 'Unknown error' )

			}

		},
		buildEnd : async s => {

			try {

				if ( !autoImage ) return
				const time = performance()
				console.log()
				console.log( `${okMark} Creating og image...` )
				const output    = joinPath( s.outDir, ogName )
				const logoInput = joinPath( s.outDir, conf.logo || conf.favicon )
				const exists    = await existsFile( logoInput )
				if ( !exists ) throw new Error( `Logo input not found: ${logoInput}` )
				const image = await image2DataUri( { input: logoInput } )
				await createOGImage( deepmerge( {
					output,
					title : conf.name,
					desc  : conf.desc,
					// text  : conf.shortDesc,
					image,
					color : {
						...conf.styles.color,
						...conf.styles.color.dark,
					},
					radius : conf.styles.radius,
				}, autoImage === true ? {} : autoImage ) )

				console.log( `${okMark} Created og image:\n  - input: ${output}\n  - time: ${time.prettyStop()}` )
				console.log()

			}
			catch ( e ) {

				console.error( `${errorMark} Error creating og image:`, e instanceof Error ? e.message : e || 'Unknown error' )
				console.log()

			}

		},

	}
	// console.dir( res, { depth: null } )
	return res

}
