import {
	execModulePathWithOutput,
	fetchContentToString,
	getStringType,
	html2md,
	md2html,
	readFile,
	writeFileContent,
} from '@dovenv/utils'
import jsdoc2md from 'jsdoc-to-markdown'

import type {
	ObjectValues,
	Prettify,
} from '@dovenv/utils'

type ConvertPropsSuper = {
	in   : string | string[]
	out? : string
}

export const methods = {
	ts2md      : 'ts2md',
	jsdoc2md   : 'jsdoc2md',
	html2md    : 'html2md',
	md2html    : 'md2html',
	openapi2md : 'openapi2md',
} as const

export type ConvertConfig =  Prettify<{
	[methods.openapi2md] : Prettify<ConvertPropsSuper & { sort?: boolean }>
	[methods.jsdoc2md]   :  Prettify<ConvertPropsSuper & {
		in    : string | string[]
		opts? : jsdoc2md.RenderOptions | jsdoc2md.JsdocOptions
	}>
	[methods.html2md] : Prettify<ConvertPropsSuper>
	[methods.md2html] : Prettify<ConvertPropsSuper>
	[methods.ts2md]   : void
}>

type ConvertInterface = {
	[ key in ObjectValues<typeof methods>] : ( params: ConvertConfig[key] ) => Promise<string>
}

export class Convert implements ConvertInterface {

	async #getInput( input: string ): Promise<string> {

		try {

			const type    = getStringType( input )
			const content = type === 'path'
				? await readFile( input, 'utf-8' )
				: type === 'url'
					? await fetchContentToString( input )
					: input
			return content

		}
		catch ( error ) {

			// @ts-ignore
			throw new Error( 'error reading input', error?.message )

		}

	}

	async openapi2md( opts: ConvertConfig[typeof methods.openapi2md] ) {

		const oldArgv = process.argv

		process.argv  = [
			...process.argv.slice( 0, 2 ),
			opts.in,
			...( opts.out ? [ opts.out ] : [] ),
			...( opts.sort ? [ '--sort' ] : [] ),
		]
		const execute = async ()  => await execModulePathWithOutput( {
			currentPath : import.meta.url,
			moduleEntry : 'openapi-to-md',
			modulePath  : [ 'dist', 'index.js' ],
			args        : [
				opts.in,
				...( opts.out ? [ opts.out ] : [] ),
				...( opts.sort ? [ '--sort' ] : [] ),
			],
		} )

		await import( 'openapi-to-md' )
		process.argv = oldArgv
		return ''

	}

	async html2md( params: ConvertConfig[typeof methods.html2md] ) {

		const input   = await this.#getInput( params.in )
		const content = await html2md( input )

		if ( params.out ) await writeFileContent( params.out, content )

		return content

	}

	async md2html( params: ConvertConfig[typeof methods.md2html] ) {

		const input   = await this.#getInput( params.in )
		const content = await md2html( input )

		if ( params.out ) await writeFileContent( params.out, content )

		return content

	}

	async jsdoc2md( params: ConvertConfig[typeof methods.jsdoc2md] ) {

		const input = typeof params.in === 'string'
			? await this.#getInput( params.in )
			: params.in

		const data = await jsdoc2md.getTemplateData( { files: input } )
		console.debug( { data } )
		const content = await jsdoc2md.render( {
			data,

			...( params?.opts ? params.opts : {} ),
		} )
		console.debug( { content } )
		if ( params.out ) await writeFileContent( params.out, content )

		return content

	}

	async ts2md( params: ConvertConfig[typeof methods.ts2md] ) {

		console.log( params )
		return ''

	}

}
