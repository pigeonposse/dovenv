/* eslint-disable @stylistic/object-curly-newline */

import { Html2Markdown,
	Markdown2Html } from './html/main'
import { Jsdoc2Markdown }      from './jsdoc/main'
import { Openapi2Markdown }    from './openapi/main'
import { Typescript2Markdown } from './typedoc/main'

import type { methods } from './_shared/const'
import type {
	ObjectValues,
	Prettify,
} from '@dovenv/utils'

export type ConvertConfig = {
	[methods.openapi2md] : Openapi2Markdown
	[methods.jsdoc2md]   : Jsdoc2Markdown
	[methods.html2md]    : Html2Markdown
	[methods.md2html]    : Markdown2Html
	[methods.ts2md]      : Typescript2Markdown
	[methods.custom]     : {
		props : {
			/**
			 * Function to run your conversion.
			 */
			fn : ( functions: Prettify<Omit<ConvertInterface, 'custom'>> ) => Promise<void>
		}
		run : (  ) => Promise<void>
	}
}

type ConvertInterface = {
	[ key in ObjectValues<typeof methods>] : ( params: ConvertConfig[key]['props'] ) => ReturnType<ConvertConfig[key]['run'] >
}

export type ConfigValue = {
	[key in keyof ConvertConfig]: {
		/**
		 * Type of conversion
		 */
		type : key
	} & ConvertConfig[key]['props']
}[keyof ConvertConfig]

export class Convert implements ConvertInterface {

	async openapi2md( params: ConvertConfig[typeof methods.openapi2md]['props'] ) {

		const instance = new Openapi2Markdown( params )

		return await instance.run()

	}

	async ts2md( params: ConvertConfig[typeof methods.ts2md]['props'] ) {

		const instance = new Typescript2Markdown( params )
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
		await params.fn( {
			openapi2md : c.openapi2md,
			jsdoc2md   : c.jsdoc2md,
			html2md    : c.html2md,
			md2html    : c.md2html,
			ts2md      : c.ts2md,
		} )

	}

}
