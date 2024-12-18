/* eslint-disable @stylistic/object-curly-newline */

import { PluginCore } from '@dovenv/core'
import {
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
import { Typescript2Html,
	Typescript2Markdown } from './typedoc/main'

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
		props : {
			/**
			 * Function to run your conversion.
			 */
			fn : ( data: {
				config : DovenvConfig
				run    : Prettify<Omit<ConvertInterface, 'custom'>>
			} ) => Promise<void>
		}
		run : (  ) => Promise<void>
	}
}

type ConvertInterface = {
	[ key in ObjectValues<typeof methods>] : ( params: ConvertConfig[key]['props'] ) => ReturnType<ConvertConfig[key]['run'] >
}

type ConfigValue = {
	[key in keyof ConvertConfig]: {
		/**
		 * Type of conversion
		 */
		type : key
	} & ConvertConfig[key]['props']
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
 * Convertion class
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
export 	class MultipleConvert extends PluginCore<Config> {

	convert = new Convert( )
	title = 'convert'
	protected helpURL = homepage

	async #fn( pattern?: string[] ) {

		if ( !( await this.ensureOpts() ) ) return
		const opts = this.opts || {} // for fix type

		const keys = this.getKeys( { pattern } )
		if ( !keys ) return

		const res: { [k in string]: Awaited<ReturnType<ObjectValues<ConvertInterface>>> } = {}

		for ( const key of keys ) {

			const props = opts[key]
			const {
				type,
				...restProps
			} = props

			console.log(
				this.style.info.h( `Convert ${this.style.badge( key )} key` ),
				this.style.info.p( '(' + type + ')' ),
				'\n',
			)

			console.debug( { props } )
			// @ts-ignore
			res[key] = await this.convert[type]( restProps )

			console.log( this.style.success.msg( `✨ Successful conversion` ), '\n' )

		}
		return res

	}

	async run( pattern?: string[] ) {

		this.convert.config = this.config || {}

		return this.catchFn( this.#fn( pattern ) )

	}

}
