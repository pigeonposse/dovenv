
import { CommandUtils } from '@dovenv/core'
import {
	Any,
	type ObjectValues,
	type Prettify,
} from '@dovenv/core/utils'

import { homepage } from '../package.json'
import {
	Html2Markdown,
	Markdown2Html,
} from './html/main'
import { Jsdoc2Markdown }   from './jsdoc/main'
import { Openapi2Markdown } from './openapi/main'
import {
	Typescript2Html,
	Typescript2Markdown,
} from './typedoc/main'

import type { methods }                from './_shared/const'
import type { Config as DovenvConfig } from '@dovenv/core'

type ConvertConfig = {
	[methods.openapi2md] : Openapi2Markdown
	[methods.jsdoc2md]   : Jsdoc2Markdown
	[methods.html2md]    : Html2Markdown
	[methods.md2html]    : Markdown2Html
	[methods.ts2md]      : Typescript2Markdown
	[methods.ts2html]    : Typescript2Html
	[methods.custom]     : {
		// eslint-disable-next-line @stylistic/object-curly-newline
		props : {
			/**
			 * Function to run your conversion.
			 */
			fn : ( data: {
				config : DovenvConfig
				run    : Prettify<Omit<ConvertInterface, 'custom'>>
			} ) => Promise<void> }
		run : ( ) => Promise<void>
	}
}

type ConvertInterface = {
	[ key in ObjectValues<typeof methods>] : ( params: ConvertConfig[key]['props'] ) => ReturnType<ConvertConfig[key]['run']>
}

type ConfigValue = {
	// eslint-disable-next-line @stylistic/object-curly-newline
	[key in keyof ConvertConfig]: {
		/**
		 * Type of conversion.
		 */
		type : key } & ConvertConfig[key]['props']
}[keyof ConvertConfig]

export type Config = { [key in string]: ConfigValue }

export {
	Openapi2Markdown,
	Jsdoc2Markdown,
	Html2Markdown,
	Markdown2Html,
	Typescript2Markdown,
}

/**
 * Convertion class.
 *
 * @example
 * // convert ts files to markdown
 * const convert = new Convert()
 * await convert.ts2md({input: 'src/main.ts', output: 'README.md' })
 */
export class Convert implements ConvertInterface {

	config : DovenvConfig = {}

	async openapi2md( params: ConvertConfig[typeof methods.openapi2md]['props'] ) {

		const instance = new Openapi2Markdown( params )

		return await instance.run()

	}

	async ts2md( params: ConvertConfig[typeof methods.ts2md]['props'] ) {

		const instance = new Typescript2Markdown( params )
		return await instance.run()

	}

	async ts2html( params: ConvertConfig[typeof methods.ts2html]['props'] ) {

		const instance = new Typescript2Html( params )
		return await instance.run()

	}

	async html2md( params: ConvertConfig[typeof methods.html2md]['props'] ) {

		const instance = new Html2Markdown( params )
		return await instance.run()

	}

	async md2html( params: ConvertConfig[typeof methods.md2html]['props'] ) {

		const instance = new Markdown2Html( params )
		return await instance.run()

	}

	async jsdoc2md( params: ConvertConfig[typeof methods.jsdoc2md]['props'] ) {

		const instance = new Jsdoc2Markdown( params )
		return await instance.run()

	}

	async custom( params: ConvertConfig[typeof methods.custom]['props'] ) {

		if ( !params.fn ) throw new Error( 'No function provided' )

		const c = new Convert()
		return await params.fn( {
			config : this.config,
			run    : {
				openapi2md : c.openapi2md,
				jsdoc2md   : c.jsdoc2md,
				html2md    : c.html2md,
				md2html    : c.md2html,
				ts2md      : c.ts2md,
				ts2html    : c.ts2html,
			},
		} )

	}

}

export class MultipleConvert {

	convert = new Convert( )

	utils : CommandUtils
	opts  : Config | undefined

	constructor( {
		opts, utils,
	}:{
		opts? : Config
		utils : CommandUtils
	} ) {

		this.opts          = opts
		this.utils         = utils
		this.utils.helpURL = homepage
		this.utils.title   = 'convert'

	}

	async #fn( pattern?: string[] ) {

		type Res = { [k in string]: Awaited<ReturnType<ObjectValues<ConvertInterface>>> }
		const res: Res = await this.utils.mapOpts( {
			input : this.opts,
			pattern,
			cb    : async ( {
				value, log,
			} ) => {

				const {
					type,
					...restProps
				} = value

				console.debug( { props: value } )

				const res = await this.convert[type]( restProps as Any )
				if ( 'output' in restProps && restProps.output )
					log.success( `Output written to: ${this.utils.style.a( this.utils.getWsPath( restProps.output ) )}` )
				return res

			},
		} )

		return res

	}

	async run( pattern?: string[] ) {

		this.convert.config = this.utils.config || {}

		return this.utils.catchFn( this.#fn( pattern ) )

	}

}
