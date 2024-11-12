/* eslint-disable @stylistic/object-curly-newline */
import {
	ensureDir,
	getStringsFrom,
	html2md,
	joinPath,
	md2html,
	readFile,
	writeFileContent,
	getTempDir,
	removeDirIfExist,
} from '@dovenv/utils'
import jsdoc2md            from 'jsdoc-to-markdown'
import { convertMarkdown } from 'openapi-to-md'

import type {
	ObjectValues,
} from '@dovenv/utils'

type ConvertPropsSuper =  {
	/**
	 * Input patterns.
	 *
	 * Accepts glob patterns, urls, and strings.
	 * @example [
	 *   'https://pigeonposse.com',
	 *   './docs/*.md',
	 *   'Just a simple string'
	 * ]
	 * @example './my/file'
	 * @example 'https://pigeonposse.com'
	 * @example 'my content string data'
	 */
	input   : string[] | string
	/**
	 * Output path
	 */
	output? : string
}

export const methods = {
	ts2md      : 'ts2md',
	jsdoc2md   : 'jsdoc2md',
	html2md    : 'html2md',
	md2html    : 'md2html',
	openapi2md : 'openapi2md',
} as const

export type ConvertConfig = {
	[methods.openapi2md] : ConvertPropsSuper & {
		/**
		 * Sort titles by atoz
		 */
		sort? : boolean
	}
	[methods.jsdoc2md] : ConvertPropsSuper & {
		/**
		 * Jsdoc options
		 */
		opts? : jsdoc2md.RenderOptions | jsdoc2md.JsdocOptions
	}
	[methods.html2md] : ConvertPropsSuper
	[methods.md2html] : ConvertPropsSuper
	[methods.ts2md]   : ConvertPropsSuper
}

type ConvertInterface = {
	[ key in ObjectValues<typeof methods>] : ( params: ConvertConfig[key] ) => Promise<( {
		id      : string
		content : string
	} )[]>
}

export type ConfigValue = {
	[K in keyof ConvertConfig]: {
		/**
		 * Type of conversion
		 */
		type : K
	} & ConvertConfig[K]
}[keyof ConvertConfig]

export class Convert implements ConvertInterface {

	async #getContent( input: string[] | string ) {

		return await getStringsFrom(
			typeof input === 'string'
				? [ input ]
				: input,
		)

	}

	async #writeOutput( out: string, id: string, content: string ) {

		await ensureDir( out )
		await writeFileContent(
			joinPath( out, id ),
			content,
		)

	}

	async openapi2md( params: ConvertConfig[typeof methods.openapi2md] ) {

		const input = await this.#getContent( params.input )
		const res   = []
		const dir   = params.output ? params.output : getTempDir()
		for ( const i of input ) {

			const path = joinPath( dir, i.id )
			await convertMarkdown( i.content, path, params.sort )
			res.push( {
				id      : i.id,
				content : await readFile( path, 'utf-8' ),
			} )

		}

		if ( !params.output ) await removeDirIfExist( dir )

		return res

	}

	async html2md( params: ConvertConfig[typeof methods.html2md] ) {

		const input = await this.#getContent( params.input )
		const res   = []
		for ( const i of input ) {

			const content = await html2md( i.content )
			res.push( {
				id : i.id,
				content,
			} )
			if ( params.output ) await this.#writeOutput( params.output, i.id, content )

		}

		return res

	}

	async md2html( params: ConvertConfig[typeof methods.md2html] ) {

		const input = await this.#getContent( params.input )
		const res   = []
		for ( const i of input ) {

			const content = await md2html( i.content )
			res.push( {
				id : i.id,
				content,
			} )
			if ( params.output ) await this.#writeOutput( params.output, i.id, content )

		}

		return res

	}

	async jsdoc2md( params: ConvertConfig[typeof methods.jsdoc2md] ) {

		const input = await this.#getContent( params.input )

		const res = []
		for ( const i of input ) {

			const data    = await jsdoc2md.getTemplateData( { files: i.content } )
			const content = await jsdoc2md.render( {
				data,

				...( params?.opts ? params.opts : {} ),
			} )
			if ( params.output ) await this.#writeOutput( params.output, i.id, content )

			res.push( {
				id : i.id,
				content,
			} )

		}

		return res

	}

	async ts2md( params: ConvertConfig[typeof methods.ts2md] ) {

		console.log( params )
		return ''

	}

}
