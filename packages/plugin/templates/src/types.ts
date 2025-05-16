/* eslint-disable @stylistic/object-curly-newline */

import type { CommandUtils }        from '@dovenv/core'
import type { replacePlaceholders } from '@dovenv/core/utils'

type ReplaceOpts = Parameters<typeof replacePlaceholders>[0]
type Params = ReplaceOpts['params']

type Data = {
	/** Input content */
	content : string
	/** Template constants */
	const   : Params
	/** Template output */
	output  : string | undefined
	/** Dovenv configurtion */
	utils   : CommandUtils
}
type Opts = ReplaceOpts['opts'] & {
	/**
	 * Overwrite output if exists.
	 *
	 *  @default true
	 */
	overwrite? : boolean | 'ask'
}
type Response<V> = Promise<V> | V

type SharedHooks = {
	/**
	 * Before create template.
	 *
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
	before? : ( data: Data ) => Response<Data>
	/**
	 * After create template.
	 *
	 * @example
	 * const after = (data) => {
	 *    data.content += '\n\n<!-- end of content -->\n\n'
	 *    return data
	 * }
	 */
	after?  : ( data: Data ) => Response<Data>
}

type ConfigValue = {
	/** Template title */
	title?     : string
	/** Input of template (path or string) */
	input      : string
	/** Constants for templates. */
	const?     : Params
	/** Custom transform function */
	transform? : ReplaceOpts['transform']
	/** Custom options */
	opts?      : Opts
	/**
	 * Shared hooks
	 */
	hook?      : SharedHooks & {
		/**
		 * After create partials
		 * Before add consts.
		 */
		afterPartials? : ( data: Data ) => Response<Data>
	}
	/**
	 * Template partials.
	 *
	 * Are like constants, but the value can contain other constants and partials.
	 * The order of partials is important for overrides.
	 */
	partial? : { [key in string]: {
		/** Input of template (path or string) */
		input : string
		hook? : SharedHooks
	} }
	/** Output file for write content */
	output? : string
}

export type Config = { [key in string]: ConfigValue }
