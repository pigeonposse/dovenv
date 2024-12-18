/* eslint-disable @stylistic/object-curly-newline */

import type { replacePlaceholders } from '@dovenv/core/utils'

type ReplaceOpts = Parameters<typeof replacePlaceholders>[0]
type Params = ReplaceOpts['params']
type Data = {
	content : string
	const   : Params
}
type SharedHooks = {
	/**
	 * Before create template
	 * @example
	 *
	 * import { geMDTocString }   from '@dovenv/core/utils'
	 * const before = async (data) => {
	 *   data.const.toc = await geMDTocString( {
	 *     input           : data.content,
	 *     title           : 'Table of contents',
	 *     removeH1        : true,
	 *     maxHeadingLevel : 4,
	 *   } )
	 *   return data
	 * }
	 */
	before? : ( data: Data ) => Promise<Data>
	/**
	 * After create template
	 * @example
	 * const after = (data) => {
	 *    data.content += '\n\n<!-- end of content -->\n\n'
	 *    return data
	 * }
	 */
	after?  : ( data: Data ) => Promise<Data>
}

type ConfigValue =  {
	/** input of template (path or string) */
	input      : string
	/** constants for templates. */
	const?     : Params
	transform? : ReplaceOpts['transform']
	/** Custom options */
	opts?      : ReplaceOpts['opts']
	hook?      : SharedHooks & {
		/**
		 * After create partials
		 * Before add consts
		 */
		afterPartials? : ( data: Data ) => Promise<Data>
	}
	/**
	 * Template partials.
	 *
	 * Are like constants, but the value can contain other constants and partials.
	 * The order of partials is important for overrides.
	 */
	partial? : { [key in string]: {
		/** input of template (path or string) */
		input : string
		hook? : SharedHooks
	} }
	/** output file for write content */
	output? : string
}

export type Config = { [key in string]: ConfigValue }
