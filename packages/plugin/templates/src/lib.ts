/* eslint-disable jsdoc/require-param-type */
/* eslint-disable jsdoc/require-returns-type */

import {
	ensureDir,
	existsFile,
	getDirName,
	getStringFrom,
	replacePlaceholders,
	writeFile,
} from '@dovenv/core/utils'

import { homepage } from '../package.json'

import type { Config }       from './types'
import type { CommandUtils } from '@dovenv/core'

type Data = Parameters<NonNullable<NonNullable<Config[number]['hook']>['before']>>[0]
type ReplaceContent = Pick<Config[number], 'transform' | 'hook' | 'opts'>

export class Templates {

	protected utils : CommandUtils
	opts

	constructor( {
		opts, utils,
	}:{
		opts? : Config
		utils : CommandUtils
	} ) {

		this.opts          = opts
		this.utils         = utils
		this.utils.helpURL = homepage
		this.utils.title   = 'templates'

	}

	async #replaceContent( content: string, params: Parameters<typeof replacePlaceholders>[0]['params'], data?: ReplaceContent ) {

		return await replacePlaceholders( {
			content,
			transform : data?.transform,
			opts      : data?.opts,
			params    : params,
		} )

	}

	async #getContent( res: Data, data?: ReplaceContent, partial?: Record<string, string> ) {

		res = ( await data?.hook?.before?.( res ) ) || res

		// first partials
		res.content = await this.#replaceContent( res.content, { partial }, data )
		res         = ( await data?.hook?.afterPartials?.( res ) ) || res

		// second consts
		res.content = await this.#replaceContent( res.content, { const: res.const }, data )

		res = ( await data?.hook?.after?.( res ) ) || res
		return res

	}

	async #getPartials( res: Data, data: Config[number] ) {

		const partials = data.partial
		if ( !partials ) return { res }

		const parts : Record<string, string> = {}

		// get partials Without consts
		for ( const key in partials ) {

			const partial = partials[key]

			let keyRes: Data = {
				content : await getStringFrom( partial.input ),
				const   : res.const,
				output  : res.output,
				utils   : this.utils,
			}

			keyRes     = ( await partial.hook?.before?.( keyRes ) ) || keyRes
			res.const  = keyRes.const
			parts[key] = keyRes.content

		}

		// add partials to partials
		for ( const key in partials ) {

			let keyRes: Data = {
				content : parts[key],
				const   : res.const,
				utils   : this.utils,
				output  : res.output,
			}

			keyRes.content = await this.#replaceContent( keyRes.content, { partial: parts } )
			keyRes         = ( await partials[key].hook?.after?.( keyRes ) ) || keyRes
			res.const      = keyRes.const
			parts[key]     = keyRes.content

		}

		return {
			partials : parts,
			res,
		}

	}

	/**
	 * Get a custom template.
	 *
	 * Perfect method to be used outside an `Dovenv` environment.
	 *
	 * @param data - Configuration object containing input details, constants, and optional output path.
	 * @returns    A promise that resolves to the processed content as a string.
	 */
	async get( data: Config[number] ) {

		const rawConst = this.utils.config?.const ?? {}
		const log      = this.utils.logGroup( data.title )

		const generalConst: Record<string, unknown> = Object.fromEntries(
			await Promise.all(
				Object.entries( rawConst ).map( async ( [ key, value ] ) => {

					if ( typeof value === 'function' ) {

						const result = await value()
						return [ key, result ]

					}
					return [ key, value ]

				} ),
			),
		)

		let res: Data = {
			content : await getStringFrom( data.input ),
			const   : {
				...generalConst,
				...data.const,
			},
			utils  : this.utils,
			output : data.output,
		}

		const isOverrite = ( data.opts?.overwrite === undefined ) ? true : data.opts?.overwrite

		const parts = await this.#getPartials( res, data )

		res = await this.#getContent( parts.res, data, parts.partials )

		if ( !data.output ) return res.content
		const out    = this.utils.getWsPath( data.output )
		const exists = await existsFile( out )

		if ( isOverrite || ( exists && !isOverrite ) ) {

			let over: boolean = true
			if ( isOverrite === 'ask' && exists ) {

				console.log()
				const res         = await this.utils.prompt.confirm( {
					message      : `Output [${data.output}] exists. Do you want to overwrite the content?`,
					initialValue : true,
				} )
				const isCancelled = this.utils.prompt.isCancel( res )
				if ( isCancelled ) await this.utils.onCancel()

				over = res as boolean

			}

			if ( over ) {

				await ensureDir( getDirName( out ) )
				await writeFile( out, res.content )
				log.success( 'Overwrite content to', out )

			}
			else log.info( 'output not overwritten' )

		}

		return res.content

	}

	async #fn( pattern?: string[] ) {

		return await this.utils.mapOpts( {
			input : this.opts,
			pattern,
			cb    : async ( {
				value, key,
			} ) => await this.get( {
				title : key,
				...value,
			} ),
		} )

	}

	async list( pattern?: string[] ) {

		const keys = await this.utils.getOptsKeys( {
			input : this.opts,
			pattern,
		} )
		console.info( this.utils.style.info.msg( 'List of keys', keys?.join( ', ' ) || 'NONE' ) )

	}

	/**
	 * Process templates from the configuration object.
	 *
	 * @param pattern - An array of template names to process. If not provided, all templates will be processed.
	 * @returns       A promise that resolves to an object containing the content of each processed template.
	 */
	async run( pattern?: string[] ) {

		return await this.utils.catchFn( this.#fn( pattern ) )

	}

}
