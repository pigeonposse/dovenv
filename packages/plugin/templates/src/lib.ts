/* eslint-disable jsdoc/require-param-type */
/* eslint-disable jsdoc/require-returns-type */

import { PluginCore } from '@dovenv/core'
import {
	ensureDir,
	getDirName,
	getStringFrom,
	replacePlaceholders,
	writeFile,
} from '@dovenv/core/utils'

import { homepage } from '../package.json'

import type { Config } from './types'

type Data = Parameters<NonNullable<NonNullable<Config[number]['hook']>['before']>>[0]
type ReplaceContent = Pick<Config[number], 'transform' | 'hook' | 'opts'>

export 	class Templates extends PluginCore<Config> {

	title = 'templates'
	helpURL = homepage

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
	 * @param data - Configuration object containing input details, constants, and optional output path.
	 * @returns A promise that resolves to the processed content as a string.
	 */
	async get( data: Config[number] ) {

		let res: Data = {
			content : await getStringFrom( data.input ),
			const   : {
				...( this.config?.const || {} ),
				...data.const,
			},
		}

		const parts = await this.#getPartials( res, data )

		res = await this.#getContent( parts.res, data, parts.partials )

		if ( data.output ) {

			await ensureDir( getDirName( data.output ) )
			await writeFile( data.output, res.content )

		}

		return res.content

	}

	async #fn( pattern?: string[] ) {

		if ( !( await this.ensureOpts() ) || !this.opts ) return

		const keys = this.getKeys( { pattern } )
		if ( !keys ) return

		const res: Record<string, string> = {}
		for ( const key of keys ) {

			const opt = this.opts[key]
			console.log( this.style.info.h( `${this.style.badge( key )} template` ) )
			res[key] = await this.get( opt )
			console.log( '\n', this.style.success.msg( ` ✨ Successful!` ) )

		}
		return res

	}

	/**
	 * Process templates from the configuration object.
	 * @param pattern - An array of template names to process. If not provided, all templates will be processed.
	 * @returns A promise that resolves to an object containing the content of each processed template.
	 */
	async run( pattern?: string[] ) {

		return await this.catchFn( this.#fn( pattern ) )

	}

}
